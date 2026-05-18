import { View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import React from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Loader } from '@/components/Loader'
import { Image } from 'expo-image'
import { Link } from 'expo-router'

import { COLORS } from '@/constants/theme'
import { styles } from '@/styles/notifications.styles'

const Notification = () => {


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notification</Text>
      </View>

      {/* Show Notifications */}

    </View>
  );
}



export default Notification



function NotNotificationYet() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
      }}
    >
      <Text style={{ color: COLORS.primary, fontSize: 22 }}>No  Any Notificatuin yet</Text>
    </View>
  );
}