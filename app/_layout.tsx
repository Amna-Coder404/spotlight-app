
import { StatusBar } from "expo-status-bar";
import Initiallayout from "@/components/Initiallayout";
import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";
import { SafeAreaView } from "react-native-safe-area-context";


export default function RootLayout() {
  return(
   <ClerkAndConvexProvider>
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <StatusBar style={"light"} />
      <Initiallayout />
      
    </SafeAreaView>
  </ClerkAndConvexProvider>
  )
}


