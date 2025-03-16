import { useAuth } from "@clerk/clerk-expo";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

const AuthLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const isAuthRoute = segments[0] === "(auth)";

    if (!isLoaded) return;
    if (!isAuthRoute && !isSignedIn) router.replace("/(auth)/login");
    else if (isAuthRoute && isSignedIn) router.replace("/(tabs)");
  }, [isLoaded, isSignedIn, segments]);

  if (!isLoaded) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
};

export default AuthLayout;
