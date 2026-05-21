
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import React from 'react';
import { COLORS } from '../../constants/theme';
import { useAuth } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { styles } from '@/styles/feed.styles'
import { Image } from 'expo-image';
const TabsLayout = () => {
    const { userId } = useAuth();
    const currentUser = useQuery(api.user.getUserByClerkId, userId ? { clerkId: userId } : "skip");
    return (
        <Tabs screenOptions={{
            tabBarShowLabel: false,
            headerShown: false,
            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: COLORS.grey,
            tabBarStyle: {
                backgroundColor: "black",
                borderTopWidth: 0,
                height: 40,
                position: "absolute",
                elevation: 0,
                paddingBottom: 0
            }
        }}
        >
            <Tabs.Screen name='index'
                options={{
                    tabBarIcon: ({ size, color }) => <Ionicons name="home" size={size} color={color} />
                }}
            />
            <Tabs.Screen name='bookmark'
                options={{
                    tabBarIcon: ({ size, color }) => <Ionicons name="bookmark" size={size} color={color} />
                }} />


            <Tabs.Screen name='create'
                options={{
                    tabBarIcon: ({ size }) => <Ionicons name="add-circle" size={size} color={COLORS.primary} />
                }}
            />

            <Tabs.Screen name='notification'
                options={{
                    tabBarIcon: ({ size, color }) => <Ionicons name="heart-sharp" size={size} color={color} />
                }} />

            <Tabs.Screen name='profile'
                options={{
                    // tabBarIcon: ({ size, color }) => <Ionicons name="person-circle-sharp" size={size} color={color} />
                    tabBarIcon: ({ size }) => (
                        <Image
                            source={{ uri: currentUser?.image }}
                            style={[
                                
                                {
                                    width: size,
                                    height: size,
                                    borderRadius: size / 2,
                                },
                            ]}
                            contentFit="cover"
                            transition={200}
                            cachePolicy="memory-disk"
                        />
                    )
                }}
            />
        </Tabs>
    )
}

export default TabsLayout