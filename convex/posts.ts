import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized");
  }

  return await ctx.storage.generateUploadUrl();
});

export const createPost = mutation({
  args: {
    content: v.string(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);

    const imageUrl = await ctx.storage.getUrl(args.storageId);

    if (!imageUrl) {
      throw new Error("Image not found");
    }

    // Create the post
    const postId = await ctx.db.insert("posts", {
      userId: currentUser._id,
      imageUrl,
      storageId: args.storageId,
      caption: args.content,
      likes: 0,
      comments: 0,
    });

    // Increment the user's post count
    await ctx.db.patch(currentUser._id, {
      posts: currentUser.posts + 1,
    });

    return postId;
  },
});

export const getFeedPosts = query({
  handler: async (ctx) => {
    const currentUser = await getCurrentUser(ctx);

    const posts = await ctx.db.query("posts").order("desc").collect();

    if (posts.length === 0) {
      return [];
    }

    // enrich posts with user info and interaction stats
    const postsWithInfo = await Promise.all(
      posts.map(async (post) => {
        const postAuthor = (await ctx.db.get(post.userId))!;

        const like = await ctx.db
          .query("likes")
          .withIndex("by_user_and_post", (q) =>
            q.eq("userId", currentUser._id).eq("postId", post._id),
          )
          .first();

        const bookmarked = await ctx.db
          .query("bookmarks")
          .withIndex("by_both", (q) =>
            q.eq("userId", currentUser._id).eq("postId", post._id),
          )
          .first();

        return {
          ...post,
          author: {
            _id: postAuthor?._id,
            username: postAuthor?.username,
            fullName: postAuthor?.fullName,
            image: postAuthor?.image,
          },
          isLiked: !!like,
          isBookmarked: !!bookmarked,
        };
      }),
    );

    return postsWithInfo;
  },
});

export const toggleLike = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);

    const like = await ctx.db
      .query("likes")
      .withIndex("by_user_and_post", (q) =>
        q.eq("userId", currentUser._id).eq("postId", args.postId),
      )
      .first();

    const post = await ctx.db.get(args.postId);

    if (!post) {
      throw new Error("Post not found");
    }

    if (like) {
      await ctx.db.delete(like._id);
      await ctx.db.patch(post._id, {
        likes: post.likes - 1,
      });

      return false; // unliked
    } else {
      await ctx.db.insert("likes", {
        userId: currentUser._id,
        postId: args.postId,
      });
      await ctx.db.patch(post._id, {
        likes: post.likes + 1,
      });

      // send notification to post author
      if (currentUser._id !== post.userId) {
        await ctx.db.insert("notifications", {
          receiverId: post.userId,
          senderId: currentUser._id,
          type: "like",
          postId: args.postId,
        });
      }

      return true;
    }
  },
});

export const deletePost = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);

    const post = await ctx.db.get(args.postId);

    if (!post) {
      throw new Error("Post not found");
    }

    if (post.userId !== currentUser._id) {
      throw new Error("Unauthorized");
    }

    // delete related likes
    const likes = await ctx.db
      .query("likes")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    await Promise.all(likes.map((like) => ctx.db.delete(like._id)));

    // delete related comments
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    await Promise.all(comments.map((comment) => ctx.db.delete(comment._id)));

    // delete related bookmarks
    const bookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    await Promise.all(bookmarks.map((bookmark) => ctx.db.delete(bookmark._id)));

    // delete the storage item
    await ctx.storage.delete(post.storageId);

    // delete the post
    await ctx.db.delete(args.postId);

    // delete related notifications
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    await Promise.all(
      notifications.map((notification) => ctx.db.delete(notification._id)),
    );

    // decrement the user's post count
    await ctx.db.patch(post.userId, {
      posts: Math.max(0, (currentUser.posts ?? 1) - 1),
    });

    return true;
  },
});

export const getPostByUserId = query({
  args: {
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const user = args?.userId
      ? await ctx.db.get(args.userId)
      : await getCurrentUser(ctx);

    if (!user) {
      throw new Error("User not found");
    }

    const posts = await ctx.db
      .query("posts")
      .withIndex("by_user", (q) => q.eq("userId", args?.userId || user._id))
      .collect();

    return posts;
  },
});
