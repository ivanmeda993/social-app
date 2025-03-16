import { Id } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/feed.styles";
import { formatDistanceToNow } from "date-fns";
import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";
type CommentItemProps = {
  comment: {
    user: {
      _id: Id<"users"> | undefined;
      username: string | undefined;
      fullName: string | undefined;
      image: string | undefined;
    };
    _id: Id<"comments">;
    _creationTime: number;
    userId: Id<"users">;
    postId: Id<"posts">;
    content: string;
  };
};

const CommentItem = ({ comment }: CommentItemProps) => {
  return (
    <View style={styles.commentContainer}>
      <Image
        source={{ uri: comment.user.image }}
        style={styles.commentAvatar}
      />
      <View style={styles.commentContent}>
        <Text style={styles.commentUsername}>{comment.user.fullName}</Text>
        <Text style={styles.commentText}>{comment.content}</Text>
        <Text style={styles.commentTime}>
          {formatDistanceToNow(comment._creationTime, {
            addSuffix: true,
          })}
        </Text>
      </View>
    </View>
  );
};

export default CommentItem;
