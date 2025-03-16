import CommentsModal from "@/components/comments-modal";
import Loader from "@/components/loader";
import Post from "@/components/post";
import StoryList from "@/components/story-list";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { usePostStore } from "@/store/post-store";
import { styles } from "@/styles/feed.styles";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "convex/react";
import { Fragment } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const { signOut } = useAuth();
  const { postId } = usePostStore();
  const posts = useQuery(api.posts.getFeedPosts);

  if (posts === undefined) return <Loader />;
  if (posts.length === 0) return <NoPostsFound />;

  return (
    <Fragment>
      <View style={styles.container}>
        {/* header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Spotlight</Text>
          <TouchableOpacity onPress={() => signOut()}>
            <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <FlashList
          data={posts}
          renderItem={({ item }) => <Post post={item} />}
          estimatedItemSize={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.postsContentContainer}
          ListHeaderComponent={<StoryList />}
        />
      </View>

      {postId && <CommentsModal />}
    </Fragment>
  );
}

const NoPostsFound = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
      }}
    >
      <Text style={{ color: COLORS.primary, fontSize: 20, fontWeight: "500" }}>
        No posts found
      </Text>
    </View>
  );
};
