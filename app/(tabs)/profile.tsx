import { View, Text, TouchableOpacity, ScrollView, FlatList, Modal, TextInput, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { useAuth } from '@clerk/clerk-expo'
import { useMutation, useQuery } from 'convex/react';
import { api, fullApi } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import { styles } from '@/styles/profile.styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '@/constants/theme';
import { Image } from 'expo-image';
import { Loader } from '@/components/Loader';

const Profile = () => {
  const { signOut, userId } = useAuth();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const currentUser = useQuery(api.user.getUserByClerkId, userId ? { clerkId: userId } : "skip");

  const [editedProfile, setEditedProfile] = useState({
    fullname: currentUser?.fullname || "",
    bio: currentUser?.bio || "",
  });
  const [selectPost, setSelectPost] = useState<Doc<"posts"> | null>(null);
  const posts = useQuery(api.posts.getPostByUser, {});
  const updateProfile = useMutation(api.user.updateProfile);

  const handleSaveProfile = async () => {
    await updateProfile(editedProfile);
    setIsEditModalVisible(false);
  };

  if (!currentUser || posts === undefined) return <Loader />;
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.username}>{currentUser?.username}</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => signOut()}>
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

        {posts.length === 0 && <NoPostsFound />}
        <FlatList
          data={posts}
          numColumns={3}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.gridItem} onPress={() => setSelectPost(item)}>
              <Image source={item.imageUrl} style={styles.gridImage} contentFit='cover' transition={200} />
            </TouchableOpacity>
          )}
        />

      </ScrollView>


      {/* EDIT PROFILE MODAL */}
      
        <Modal visible={isEditModalVisible} animationType='slide' transparent={true} onRequestClose={() => setIsEditModalVisible(false)}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text>Edit Post</Text>
                  <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                    <Ionicons name='close' size={24} color={COLORS.white} />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Name</Text>
                  <TextInput
                    style={styles.input}
                    value={editedProfile.fullname}
                    onChangeText={(text) => setEditedProfile((prev) => ({ ...prev, fullname: text }))}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Bio</Text>
                  <TextInput
                    style={[styles.input, styles.bioInput]}
                    value={editedProfile.bio}
                    onChangeText={(text) => setEditedProfile((prev) => ({ ...prev, bio: text }))}
                  />
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </Modal>







      {/* SELECTED IMAGE MODAL */}
      <Modal visible={!!selectPost} animationType='fade' transparent={true} onRequestClose={() => setSelectPost(null)}>
        <View style={styles.modalBackdrop}>
          {selectPost && (
            <View style={styles.postDetailContainer}>
              <View style={styles.postDetailHeader}>
                <TouchableOpacity onPress={() => setSelectPost(null)}>
                  <Ionicons name='close' size={24} color={COLORS.white} />
                </TouchableOpacity>
              </View>
              <Image source={selectPost.imageUrl} cachePolicy={"memory-disk"} style={styles.postDetailImage} />
            </View>
          )}
        </View>
      </Modal>
    </View>
  )
}

export default Profile
// Todo Later : Add Another componet for all of this no found function  
function NoPostsFound() {
  return (
    <View style={{
      height: '100%',
      backgroundColor: COLORS.background,
      justifyContent: "center",
      alignItems: "center"
    }}>
      <Ionicons name='images-outline' size={48} color={COLORS.primary} />
      <Text style={{ fontSize: 20, color: COLORS.white }}>No Post yet</Text>

    </View>
  )
}