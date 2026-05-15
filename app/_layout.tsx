
import { StatusBar } from "expo-status-bar";
import Initiallayout from "@/components/Initiallayout";
import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { SplashScreen } from "expo-router";
import { useFonts } from "expo-font"
import { useCallback } from "react";
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Fonts
  const [fontLoaded] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  })

  const onLayoutRootView = useCallback(async () => {
    if (fontLoaded) SplashScreen.hideAsync();
  }, [fontLoaded]);

  return (
    <ClerkAndConvexProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "black" }} onLayout={onLayoutRootView}>
        <StatusBar style={"light"} />
        <Initiallayout />

      </SafeAreaView>
    </ClerkAndConvexProvider>
  )
}


