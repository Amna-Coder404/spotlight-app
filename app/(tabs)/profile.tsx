import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useAuth } from '@clerk/clerk-expo'
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import { styles } from '@/styles/profile.styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '@/constants/theme';
import { Image } from 'expo-image';

const Profile = () => {
  const { signOut, userId } = useAuth();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const currentUser = useQuery(api.user.getUserByClerkId, userId ? { clerkId: userId } : "skip");

  const [editedProfile, setEditedProfile] = useState({
    fullname: currentUser?.fullname || "",
    bio: currentUser?.bio || "",
  });
  const [selectPost, setSelectPost] = useState<Doc<"posts"> | null>(null);
    // const posts = useQuery(api.posts.getPostsByUser, {});
  const updateProfile = useMutation(api.user.updateProfile);

  const handleSaveProfile = async () => {
    await updateProfile(editedProfile);
    setIsEditModalVisible(false);
  };

  // if (!currentUser || posts === undefined) return <Loader />;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.username}>{currentUser?.username}</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => signOut}>
            <Ionicons name='log-out-outline' size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>


      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileInfo}>
          {/* AVATAR & STATS */}
          <View style={styles.avatarAndStats}>
            <View style={styles.avatarContainer}>
              <Image source={currentUser?.image} style={styles.avatar} contentFit='cover' transition={200} />
            </View>


            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{currentUser?.posts}</Text>
                <Text style={styles.statLabel}>Post</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{currentUser?.follower}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{currentUser?.following}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>



          </View>
          <Text style={styles.name}>{currentUser?.fullname}</Text>
          {currentUser?.bio && <Text style={styles.bio}>{currentUser.bio}</Text>}

           <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditModalVisible(true)}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Ionicons name="share-outline" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>



      </ScrollView>
    </View>
  )
}

export default Profile