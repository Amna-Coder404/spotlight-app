
import { StatusBar } from "expo-status-bar";
import Initiallayout from "@/components/Initiallayout";
import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { SplashScreen } from "expo-router";
import { useFonts } from "expo-font"
import { useCallback, useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Fonts
  const [fontLoaded] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  })

  const onLayoutRootView = useCallback(async () => {
    if (fontLoaded) SplashScreen.hideAsync();
  }, [fontLoaded]);

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync("#000000");
      NavigationBar.setButtonStyleAsync("light");
      
    }
  }, []);
  return (
    <ClerkAndConvexProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "black" }} onLayout={onLayoutRootView}>
        {/* <StatusBar style={"light"} /> */}
        <Initiallayout />
        
        {/* <StatusBar style="dark" /> */}
      </SafeAreaView>
    </ClerkAndConvexProvider>
  )
}


