import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { usePostStore } from "@/store/post-store";
import { styles } from "@/styles/feed.styles";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
type PostProps = {
  post: {
    _id: Id<"posts">;
    _creationTime: number;
    caption?: string | undefined;
    userId: Id<"users">;
    imageUrl: string;
    storageId: string;
    likes: number;
    comments: number;
    isLiked: boolean;
    isBookmarked: boolean;
    author: {
      _id: Id<"users">;
      username: string;
      fullName: string;
      image: string;
    };
  };
};
const Post = ({ post }: PostProps) => {
  const { user } = useUser();
  const router = useRouter();
  const toggleLikeMutation = useMutation(api.posts.toggleLike);
  const toggleBookmarkMutation = useMutation(api.bookmarks.toggleBookmark);
  const deletePostMutation = useMutation(api.posts.deletePost);
  const currentUser = useQuery(
    api.users.getUserByClerkId,
    user?.id
      ? {
          clerkId: user?.id,
        }
      : "skip",
  );

  const { setPostId } = usePostStore();

  const handleLike = async () => {
    try {
      await toggleLikeMutation({ postId: post._id });
    } catch (error) {
      console.error(error);
    }
  };

  const handleBookmark = async () => {
    try {
      await toggleBookmarkMutation({ postId: post._id });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePostMutation({ postId: post._id });
    } catch (error) {
      console.error(error);
    }
  };

  const navigateToProfile = () => {
    if (currentUser?._id === post.userId) {
      router.push("/(tabs)/profile");
    } else {
      router.push(`/(tabs)/(home)/profile/${post.author._id}`);
    }
  };
  return (
    <View style={styles.post}>
      {/* header */}
      <View style={styles.postHeader}>
        <TouchableOpacity
          style={styles.postHeaderLeft}
          onPress={navigateToProfile}
        >
          <Image
            source={post.author?.image}
            style={styles.postAvatar}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
          />
          <Text style={styles.postUsername}>{post.author?.username}</Text>
        </TouchableOpacity>

        {/* if the current user is the author of the post, show the delete button  otherwise show the ellipsis */}
        {currentUser?._id === post.userId ? (
          <TouchableOpacity onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color={COLORS.white} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity>
            <Ionicons
              name="ellipsis-horizontal"
              size={20}
              color={COLORS.white}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* image */}
      <Image
        source={post.imageUrl}
        style={styles.postImage}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />

      {/* actions */}
      <View style={styles.postActions}>
        <View style={styles.postActionsLeft}>
          <TouchableOpacity onPress={handleLike}>
            <Ionicons
              name={post.isLiked ? "heart" : "heart-outline"}
              size={24}
              color={post.isLiked ? COLORS.primary : COLORS.white}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons
              name="chatbubble-outline"
              size={22}
              color={COLORS.white}
              onPress={() => setPostId(post._id)}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleBookmark}>
          <Ionicons
            name={post.isBookmarked ? "bookmark" : "bookmark-outline"}
            size={22}
            color={post.isBookmarked ? COLORS.primary : COLORS.white}
          />
        </TouchableOpacity>
      </View>

      {/* post info */}
      <View style={styles.postInfo}>
        <Text style={styles.likesText}>
          {post.likes === 0
            ? "Be the first to like this post"
            : `${post.likes} likes`}
        </Text>
        {post.caption && (
          <View style={styles.captionContainer}>
            <Text style={styles.captionUsername}>{post.author?.username}</Text>
            <Text style={styles.captionText}>{post.caption}</Text>
          </View>
        )}

        {post.comments > 0 && (
          <TouchableOpacity onPress={() => setPostId(post._id)}>
            <Text style={styles.commentText}>
              View all {post.comments} comments
            </Text>
          </TouchableOpacity>
        )}

        <Text style={styles.timeAgo}>
          {formatDistanceToNow(post._creationTime, {
            addSuffix: true,
          })}
        </Text>
      </View>
    </View>
  );
};

export default Post;
