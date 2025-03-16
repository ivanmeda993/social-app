import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface NotDocumentsFoundProps {
  text?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  iconColor?: string;
}

export const NotDocumentsFound = ({
  text = "No documents found",
  icon = "documents-outline",
  iconSize = 80,
  iconColor = COLORS.primary,
}: NotDocumentsFoundProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name={icon} size={iconSize} color={iconColor} />
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  text: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: "500",
    marginTop: 16,
    textAlign: "center",
  },
});
