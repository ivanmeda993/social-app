import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { usePostStore } from "@/store/post-store";
import { styles } from "@/styles/feed.styles";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CommentItem from "./comment-item";
import Loader from "./loader";

const CommentsModal = () => {
  const { postId, onClose } = usePostStore();

  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const comments = useQuery(
    api.comments.getComments,
    postId
      ? {
          postId: postId as Id<"posts">,
        }
      : "skip",
  );
  const addComment = useMutation(api.comments.createComment);

  const handleAddComment = async () => {
    if (!postId || !newComment.trim()) return;
    try {
      setIsLoading(true);
      await addComment({ postId, content: newComment });
      setNewComment("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={!!postId}
      onRequestClose={onClose}
      animationType="slide"
      transparent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Comments</Text>
          <Text
            style={{
              width: 24,
            }}
          />
        </View>
        {comments === undefined ? (
          <Loader />
        ) : (
          <FlashList
            data={comments}
            renderItem={({ item }) => <CommentItem comment={item} />}
            estimatedItemSize={10}
          />
        )}
        <View style={styles.commentInput}>
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            placeholderTextColor={COLORS.grey}
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity
            onPress={handleAddComment}
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.5 : 1 }}
          >
            <Ionicons name="send" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CommentsModal;
