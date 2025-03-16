import Loader from "@/components/loader";
import { NotDocumentsFound } from "@/components/not-documents-found";
import ProfileHeader from "@/components/profile-header";
import SelectedImageModal from "@/components/selected-image-modal";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");
const numColumns = 3;
const itemWidth = width / numColumns;

const UserProfileScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const userId = typeof id === "string" ? id : "";

  const [selectedPost, setSelectedPost] = useState<Doc<"posts"> | null>(null);
  const [following, setFollowing] = useState<boolean>(false);

  const user = useQuery(api.users.getUserProfile, {
    userId: userId as Id<"users">,
  });
  const posts = useQuery(api.posts.getPostByUserId, {
    userId: userId as Id<"users">,
  });

  // Proveriti da li korisnik već prati ovog korisnika
  const isUserFollowing = useQuery(api.users.isFollowing, {
    followingId: userId as Id<"users">,
  });

  // Funkcija za praćenje/otpraćivanje korisnika
  const toggleFollow = useMutation(api.users.toggleFollow);

  // Ažuriramo lokalni state kada se promeni isUserFollowing
  useEffect(() => {
    if (isUserFollowing !== undefined) {
      setFollowing(isUserFollowing);
    }
  }, [isUserFollowing]);

  if (!user || posts === undefined || isUserFollowing === undefined)
    return <Loader />;

  const handleFollow = async () => {
    try {
      // Optimistički update - odmah menjamo UI
      setFollowing(!following);

      // Pozivamo API
      await toggleFollow({ followingId: userId as Id<"users"> });
    } catch (error) {
      // Ako dođe do greške, vraćamo prethodno stanje
      setFollowing(isUserFollowing);
      console.error("Error toggling follow:", error);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { marginLeft: 16 }]}>
              {user.username || user.fullName}
            </Text>
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
              user={user}
              isOtherUser={true}
              action={handleFollow}
              isFollowing={following}
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
      </View>

      <SelectedImageModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </>
  );
};

export default UserProfileScreen;
