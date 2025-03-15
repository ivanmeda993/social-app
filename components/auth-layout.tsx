import { useAuth } from "@clerk/clerk-expo";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

const AuthLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();

  const segments = useSegments();
  const router = useRouter();

  const isAuthRoute = segments[0] === "(auth)";

  useEffect(() => {
    if (!isLoaded) return;
    if (!isAuthRoute && !isSignedIn) router.replace("/(auth)/login");
    else if (isAuthRoute && isSignedIn) router.replace("/(tabs)");
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
};

export default AuthLayout;
