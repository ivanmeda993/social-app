import EditProfileModal from "@/components/edit-profile-modal";
import Loader from "@/components/loader";
import { NotDocumentsFound } from "@/components/not-documents-found";
import ProfileHeader from "@/components/profile-header";
import SelectedImageModal from "@/components/selected-image-modal";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/profile.styles";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "convex/react";
import { Image } from "expo-image";
import React, { useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");
const numColumns = 3;
const itemWidth = width / numColumns;

const ProfileScreen = () => {
  const { signOut, userId } = useAuth();

  const currentUser = useQuery(
    api.users.getUserByClerkId,
    userId
      ? {
          clerkId: userId,
        }
      : "skip",
  );

  const [selectedPost, setSelectedPost] = useState<Doc<"posts"> | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const posts = useQuery(api.posts.getPostByUserId, {});

  if (!currentUser || posts === undefined) return <Loader />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.username}>{currentUser.fullName}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => signOut()}>
            <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      <FlashList
        data={posts}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.gridItem, { width: itemWidth, height: itemWidth }]}
            onPress={() => setSelectedPost(item)}
          >
            <Image
              source={item.imageUrl}
              style={styles.gridImage}
              contentFit="cover"
              transition={100}
              cachePolicy="memory-disk"
            />
          </TouchableOpacity>
        )}
        ListHeaderComponent={
          <ProfileHeader
            user={currentUser}
            onEditProfile={() => setIsEditing(true)}
          />
        }
        ListEmptyComponent={
          <NotDocumentsFound text="No posts yet" icon="images-outline" />
        }
        numColumns={numColumns}
        estimatedItemSize={itemWidth}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
      />
      {isEditing && (
        <EditProfileModal
          isVisible={isEditing}
          setIsEditing={setIsEditing}
          currentUser={currentUser}
        />
      )}
      {selectedPost && (
        <SelectedImageModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </View>
  );
};

export default ProfileScreen;
