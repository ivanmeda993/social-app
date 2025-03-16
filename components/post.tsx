import { COLORS } from "@/constants/theme";
import { Id } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/feed.styles";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link } from "expo-router";
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
  return (
    <View style={styles.post}>
      {/* header */}
      <View style={styles.postHeader}>
        <Link href={`/(tabs)/notifications`}>
          <TouchableOpacity style={styles.postHeaderLeft}>
            <Image
              source={post.author?.image}
              style={styles.postAvatar}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
            <Text style={styles.postUsername}>{post.author?.username}</Text>
          </TouchableOpacity>
        </Link>

        {/* delete button */}
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.white} />
        </TouchableOpacity>
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
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={22}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={22} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* post info */}
      <View style={styles.postInfo}>
        <Text style={styles.likesText}>Be the first to like this post</Text>
        {post.caption && (
          <View style={styles.captionContainer}>
            <Text style={styles.captionUsername}>{post.author?.username}</Text>
            <Text style={styles.captionText}>{post.caption}</Text>
          </View>
        )}

        <TouchableOpacity>
          <Text style={styles.commentText}>View all comments</Text>
        </TouchableOpacity>

        <Text style={styles.timeAgo}>2 hours ago</Text>
      </View>
    </View>
  );
};

export default Post;
