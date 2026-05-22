import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS } from "@/constants/theme";

type Props = {
    title?: string;
    icon?: string;
    image?: string;
};

export default function NotFound({ title, icon, image }: Props) {
    return (
        <View style={styles.container}>
            {image ? (
                <Image source={image} style={styles.image} />
            ) : icon ? (
                <Ionicons name={icon as any} size={60} color={COLORS.primary} />
            ) : null}

            <Text style={styles.title}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            backgroundColor: COLORS.background,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
        },

        image: {
            width: 140,
            height: 140,
            marginBottom: 15,
            // resizeMode: "contain",
        },

        title: {
            fontSize: 18,
            color: COLORS.white,
            marginTop: 10,
            textAlign: "center",
            fontWeight: "600",
        },
    }
)