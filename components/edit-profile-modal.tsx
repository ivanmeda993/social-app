import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
interface EditProfileModalProps {
  isVisible: boolean;
  setIsEditing: (isEditing: boolean) => void;
  currentUser: Doc<"users">;
}

const EditProfileModal = ({
  isVisible,
  setIsEditing,
  currentUser,
}: EditProfileModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    fullName: currentUser.fullName || "",
    bio: currentUser.bio || "",
  });

  const updateProfile = useMutation(api.users.updateUser);

  const handleInputChange = (
    key: keyof typeof editedProfile,
    value: string,
  ) => {
    setEditedProfile({ ...editedProfile, [key]: value });
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        fullName: editedProfile.fullName,
        bio: editedProfile.bio,
      });
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isVisible) {
      setIsEditing(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      onRequestClose={handleClose}
      transparent={true}
      animationType="slide"
    >
      <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark">
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback
              onPress={(e) => {
                e.stopPropagation();
                Keyboard.dismiss();
              }}
            >
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.modalContainer}
              >
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Edit Profile</Text>
                    <TouchableOpacity onPress={handleClose}>
                      <Ionicons name="close" size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <TextInput
                      style={styles.input}
                      value={editedProfile.fullName}
                      onChangeText={(text) =>
                        handleInputChange("fullName", text)
                      }
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Bio</Text>
                    <TextInput
                      style={[styles.input, styles.bioInput]}
                      value={editedProfile.bio}
                      onChangeText={(text) => handleInputChange("bio", text)}
                      placeholder="Tell us about yourself"
                      placeholderTextColor={COLORS.grey}
                      multiline={true}
                      numberOfLines={4}
                    />
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.saveButton,
                      {
                        opacity: isLoading ? 0.7 : 1,
                      },
                    ]}
                    onPress={handleSaveProfile}
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <ActivityIndicator
                        size="small"
                        color={COLORS.background}
                      />
                    )}

                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </BlurView>
    </Modal>
  );
};

export default EditProfileModal;
