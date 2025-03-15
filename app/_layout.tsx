import { COLORS } from "@/constants/theme";
import ClerkConvexProvider from "@/providers/clerk-convex";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AuthLayout from "../components/auth-layout";

export default function RootLayout() {
  return (
    <ClerkConvexProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
          <AuthLayout />
        </SafeAreaView>
      </SafeAreaProvider>
    </ClerkConvexProvider>
  );
}
