import { View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import React from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Loader } from '@/components/Loader'
import { Image } from 'expo-image'
import { Link } from 'expo-router'

import { COLORS } from '@/constants/theme'
import { styles } from '@/styles/notifications.styles'
import Ionicons from '@expo/vector-icons/Ionicons'
import NotificationItems from '@/components/NotificationItems'


const Notification = () => {
  const notifications = useQuery(api.notifications.getNotifications);

  if (notifications === undefined) return <Loader />
  if (notifications.length === 0) return <NotNotificationYet />

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notification</Text>
      </View>

      {/* Show Notifications */}
      <FlatList
        data={notifications}
        renderItem={({ item }) => <NotificationItems notification={item} />}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}



export default Notification


function NotNotificationYet() {
  return (
    <View style={[styles.container, styles.centered]}>
      <Ionicons name='notifications-outline' size={48} color={COLORS.primary} />
      <Text style={{ fontSize: 20, color: COLORS.white }}>No Notifitions yet</Text>
    </View>
  );
}