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
