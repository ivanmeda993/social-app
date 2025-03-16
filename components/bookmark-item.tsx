import { Id } from "@/convex/_generated/dataModel";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

type BookmarkItemProps = {
  post: {
    _id: Id<"posts">;
    _creationTime: number;
    caption?: string | undefined;
    comments: number;
    userId: Id<"users">;
    imageUrl: string;
    storageId: string;
    likes: number;
  };
  _id: Id<"bookmarks">;
  _creationTime: number;
  userId: Id<"users">;
  postId: Id<"posts">;
  itemWidth: number;
};

const BookmarkItem = ({ post, itemWidth }: BookmarkItemProps) => {
  return (
    <View
      style={[
        gridStyles.wrapper,
        {
          width: itemWidth,
          height: itemWidth,
        },
      ]}
    >
      <View style={gridStyles.container}>
        <Image
          source={post.imageUrl}
          style={{
            width: "100%",
            aspectRatio: 1,
          }}
          contentFit="cover"
          transition={100}
          cachePolicy="memory-disk"
        />
      </View>
    </View>
  );
};

const gridStyles = StyleSheet.create({
  wrapper: {
    padding: 2,
    aspectRatio: 1,
  },
  container: {
    flex: 1,
    borderRadius: 6,
    overflow: "hidden",
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

export default BookmarkItem;
