import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useAuth, useUser } from '@clerk/clerk-expo'

export default function Home() {
  const { signOut } = useAuth();
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <Text>Loading...</Text>;
  }

  if (!isSignedIn || !user) {
    return <Text>No user found</Text>;
  }

  

  return (
    <View>
      <Text style={{ color: "white" }}>
        {user.fullName || "No Name"}
      </Text>

      <TouchableOpacity
        onPress={() => signOut()}
        style={{
          backgroundColor: "#ff4d4d",
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          Sign Out
        </Text>
      </TouchableOpacity>
    </View>
  )
}