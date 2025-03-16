import Story from "@/components/story";
import { STORIES } from "@/constants/mock-data";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { ScrollView } from "react-native";

const StoryList = () => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: 5,
      }}
    >
      <FlashList
        data={STORIES}
        renderItem={({ item }) => <Story story={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        estimatedItemSize={100}
      />
    </ScrollView>
  );
};

export default StoryList;
