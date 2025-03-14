import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View>
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Link href="/notifications">Go to notifications</Link>
      <Link href="/profile">Go to profile</Link>
    </View>
  );
}
