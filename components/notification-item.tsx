import { COLORS } from "@/constants/theme";
import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type NotificationItemProps = {
  notification: {
    _id: Id<"notifications">;
    _creationTime: number;
    type: string;
    senderId: Id<"users">;
    receiverId: Id<"users">;
    postId?: Id<"posts">;
    commentId?: Id<"comments">;
    sender: {
      _id: Id<"users">;
      username: string;
      image: string;
    };
    post: {
      _id: Id<"posts">;
      imageUrl: string;
    } | null;
    comment?: string;
  };
};

const NotificationItem = ({ notification }: NotificationItemProps) => {
  // Funkcija za određivanje teksta obaveštenja
  const getNotificationText = () => {
    switch (notification.type) {
      case "like":
        return "liked your post";
      case "comment":
        return `commented: "${notification.comment}"`;
      case "follow":
        return "started following you";
      default:
        return "interacted with your content";
    }
  };

  // Funkcija za određivanje ikone obaveštenja
  const getNotificationIcon = () => {
    switch (notification.type) {
      case "like":
        return "heart";
      case "comment":
        return "chatbubble";
      case "follow":
        return "person-add";
      default:
        return "notifications";
    }
  };

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.content}>
        <Image
          source={notification.sender.image}
          style={styles.avatar}
          contentFit="cover"
        />

        <View style={styles.textContainer}>
          <Text style={styles.username}>{notification.sender.username}</Text>
          <Text style={styles.message}>{getNotificationText()}</Text>
          <Text style={styles.time}>
            {formatDistanceToNow(notification._creationTime, {
              addSuffix: true,
            })}
          </Text>
        </View>

        <View style={styles.rightContainer}>
          <Ionicons
            name={getNotificationIcon()}
            size={20}
            color={notification.type === "like" ? COLORS.primary : COLORS.white}
          />

          {notification.post && (
            <Image
              source={notification.post.imageUrl}
              style={styles.postImage}
              contentFit="cover"
              transition={100}
              cachePolicy="memory-disk"
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.surface,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  username: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
  },
  message: {
    color: COLORS.white,
    fontSize: 14,
    marginTop: 2,
  },
  time: {
    color: COLORS.grey,
    fontSize: 12,
    marginTop: 4,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  postImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
});

export default NotificationItem;
