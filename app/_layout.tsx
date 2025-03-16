import { COLORS } from "@/constants/theme";
import ClerkConvexProvider from "@/providers/clerk-convex";
import { useFonts } from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import { SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect } from "react";
import { Platform } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AuthLayout from "../components/auth-layout";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync(COLORS.background);
      NavigationBar.setButtonStyleAsync("light");
    }
  }, []);

  return (
    <ClerkConvexProvider>
      <SafeAreaProvider>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: COLORS.background }}
          onLayout={onLayoutRootView}
        >
          <AuthLayout />
        </SafeAreaView>
      </SafeAreaProvider>
      <StatusBar style="light" />
    </ClerkConvexProvider>
  );
}
