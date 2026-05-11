import { COLORS } from "@/constants/theme";

import { ActivityIndicator, View } from "react-native";

export const Loader = () => (
    <View style={{
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: "center",
        alignItems: "center"
    }}>
        <ActivityIndicator size={"large"} color={COLORS.white} />
    </View>
)