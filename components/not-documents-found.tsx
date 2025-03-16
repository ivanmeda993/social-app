import { COLORS } from "@/constants/theme";
import { Text, View } from "react-native";

interface NotDocumentsFoundProps {
  text?: string;
}

export const NotDocumentsFound = ({
  text = "No documents found",
}: NotDocumentsFoundProps) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
      }}
    >
      <Text style={{ color: COLORS.primary, fontSize: 20, fontWeight: "500" }}>
        {text}
      </Text>
    </View>
  );
};
