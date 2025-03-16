import { COLORS } from "@/constants/theme";
import { Doc } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import {
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type SelectedImageModalProps = {
  post: Doc<"posts">;
  onClose: () => void;
};

const SelectedImageModal = ({ post, onClose }: SelectedImageModalProps) => {
  return (
    <Modal
      visible={!!post}
      onRequestClose={onClose}
      transparent
      animationType="fade"
    >
      <TouchableOpacity
        style={styles.modalBackdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        {post && (
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.postDetailContainer}>
              <View style={styles.postDetailHeader}>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color={COLORS.white} />
                </TouchableOpacity>
              </View>
              <Image
                source={{ uri: post.imageUrl }}
                style={styles.postDetailImage}
                contentFit="cover"
                transition={100}
                cachePolicy="memory-disk"
              />
            </View>
          </TouchableWithoutFeedback>
        )}
      </TouchableOpacity>
    </Modal>
  );
};

export default SelectedImageModal;
