import Loader from "@/components/loader";
import { NotDocumentsFound } from "@/components/not-documents-found";
import NotificationItem from "@/components/notification-item";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/feed.styles";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "convex/react";
import React from "react";
import { Text, View } from "react-native";

const NotificationScreen = () => {
  const notifications = useQuery(api.notifications.getNotifications);

  if (notifications === undefined) return <Loader />;
  if (notifications.length === 0)
    return (
      <NotDocumentsFound
        text="No notifications found"
        icon="notifications-outline"
      />
    );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      <FlashList
        data={notifications}
        renderItem={({ item }) => <NotificationItem notification={item} />}
        estimatedItemSize={80}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </View>
  );
};

export default NotificationScreen;
