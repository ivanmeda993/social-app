import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/create.styles";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Image } from "expo-image";

const CreateScreen = () => {
  const router = useRouter();
  const { user } = useUser();

  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const createPost = useMutation(api.posts.createPost);

  const handleShare = async () => {
    if (!image || !content) {
      Alert.alert("Error", "Please upload an image and add a caption");
      return;
    }

    try {
      setIsUploading(true);
      const uploadUrl = await generateUploadUrl();
      const uploadResult = await FileSystem.uploadAsync(uploadUrl, image, {
        httpMethod: "POST",
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
        mimeType: "image/jpeg",
      });

      if (uploadResult.status !== 200) {
        Alert.alert("Error", "Failed to upload image");
        return;
      }

      const { storageId } = JSON.parse(uploadResult.body);

      await createPost({
        storageId,
        content,
      });

      router.push("/(tabs)");
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!image) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Post</Text>
          <View
            style={{
              width: 28,
            }}
          />
        </View>

        <TouchableOpacity
          style={styles.emptyImageContainer}
          onPress={pickImage}
        >
          <Ionicons name="image-outline" size={48} color={COLORS.white} />
          <Text style={styles.emptyImageText}>Tap to upload image</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
    >
      <View style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              setImage(null);
              setContent("");
            }}
            disabled={isUploading}
          >
            <Ionicons name="close-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Post</Text>
          <TouchableOpacity
            disabled={isUploading || !content}
            style={[
              styles.shareButton,
              isUploading && styles.shareButtonDisabled,
            ]}
            onPress={handleShare}
          >
            {isUploading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.shareText}>Share</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          keyboardShouldPersistTaps="handled"
          contentOffset={{ x: 0, y: 20 }}
        >
          <View style={[styles.content, isUploading && styles.contentDisabled]}>
            {/* Image Section */}
            <View style={styles.imageSection}>
              <Image
                source={image}
                style={styles.previewImage}
                contentFit="cover"
                transition={200}
              />

              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={pickImage}
                disabled={isUploading}
              >
                <Ionicons name="image-outline" size={20} color={COLORS.white} />
                <Text style={styles.changeImageText}>Change</Text>
              </TouchableOpacity>
            </View>

            {/* Content Section */}
            <View style={styles.inputSection}>
              <View style={styles.captionContainer}>
                <Image
                  source={user?.imageUrl}
                  style={styles.userAvatar}
                  contentFit="cover"
                  transition={200}
                />
                <TextInput
                  style={styles.captionInput}
                  placeholder="Add a caption..."
                  placeholderTextColor={COLORS.grey}
                  multiline
                  value={content}
                  onChangeText={setContent}
                  editable={!isUploading}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreateScreen;
