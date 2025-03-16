import BookmarkItem from "@/components/bookmark-item";
import Loader from "@/components/loader";
import { NotDocumentsFound } from "@/components/not-documents-found";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/feed.styles";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "convex/react";
import React from "react";
import { Dimensions, Text, View } from "react-native";

const { width } = Dimensions.get("window");
const numColumns = 3;
const itemWidth = width / numColumns;

const BookmarksScreen = () => {
  const bookmarks = useQuery(api.bookmarks.getBookmarks);

  if (bookmarks === undefined) return <Loader />;
  if (bookmarks.length === 0)
    return <NotDocumentsFound text="No bookmarks found" />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookmarks</Text>
      </View>
      <FlashList
        data={bookmarks}
        renderItem={({ item }) => (
          <BookmarkItem {...item} itemWidth={itemWidth} />
        )}
        numColumns={3}
        estimatedItemSize={width / 3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 2,
        }}
      />
    </View>
  );
};

export default BookmarksScreen;
