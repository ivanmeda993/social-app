import { COLORS } from "@/constants/theme";
import { Doc } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import React from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type SelectedImageModalProps = {
  post: Doc<"posts"> | null;
  onClose: () => void;
};

const SelectedImageModal = ({ post, onClose }: SelectedImageModalProps) => {
  const handleClose = () => {
    if (post) {
      onClose();
    }
  };

  return (
    <Modal
      visible={!!post}
      onRequestClose={handleClose}
      transparent
      animationType="fade"
    >
      <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark">
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={handleClose}
        >
          {post && (
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.postDetailContainer}>
                <View style={styles.postDetailHeader}>
                  <TouchableOpacity onPress={handleClose}>
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
      </BlurView>
    </Modal>
  );
};

export default SelectedImageModal;
