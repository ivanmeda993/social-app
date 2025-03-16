import { COLORS } from "@/constants/theme";
import { Doc } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ProfileHeaderProps = {
  user: Doc<"users">;
  isOtherUser?: boolean;
  isFollowing?: boolean;
  action: () => void;
};

const ProfileHeader = ({
  user,
  isOtherUser = false,
  action,
  isFollowing,
}: ProfileHeaderProps) => {
  console.log("isFollowing:", isFollowing); // Dodajemo log za debugging

  return (
    <View>
      <View style={styles.profileInfo}>
        <View style={styles.avatarAndStats}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: user.image }}
              style={styles.avatar}
              contentFit="cover"
              transition={100}
            />
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.posts}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>

        <Text style={styles.name}>{user.fullName}</Text>
        {user.bio && <Text style={styles.bio}>{user.bio}</Text>}

        <View style={styles.actionButtons}>
          {isOtherUser ? (
            <TouchableOpacity
              style={[
                styles.actionButton,
                isFollowing ? styles.followingButton : styles.followButton,
              ]}
              onPress={action}
            >
              <Text
                style={
                  isFollowing
                    ? styles.followingButtonText
                    : styles.followButtonText
                }
              >
                {isFollowing ? "Following" : "Follow"}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.actionButton} onPress={action}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileInfo: {
    padding: 16,
  },
  avatarAndStats: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  statsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.white,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.grey,
    marginTop: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    color: COLORS.white,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: "row",
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 4,
    paddingVertical: 8,
    alignItems: "center",
    marginRight: 8,
  },
  editButtonText: {
    color: COLORS.white,
    fontWeight: "500",
  },
  shareButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  followButton: {
    backgroundColor: COLORS.primary,
  },
  followingButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  followButtonText: {
    color: COLORS.background,
    fontWeight: "500",
  },
  followingButtonText: {
    color: COLORS.white,
    fontWeight: "500",
  },
});

export default ProfileHeader;
