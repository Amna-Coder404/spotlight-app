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
import * as ImagePicker from "expo-image-picker";
import FullImageModal from '@/components/FullImageModel';



const Profile = () => {
  const [showProfileImage, setShowProfileImage] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const updateProfileImage = useMutation(api.user.updateProfileImage);

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


  const changeProfileImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8
      })

      if (result.canceled) return;

      setIsUploading(true);

      const imageUri = result.assets[0].uri;

      // 1. get upload url
      const uploadUrl = await generateUploadUrl();

      // 2. upload image
      const uploadResult = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": "image/jpeg",
        },
        body: await (await fetch(imageUri)).blob(),
      });

      const { storageId } = await uploadResult.json();

      // 3. update profile in DB
      await updateProfileImage({ storageId });

    } catch (error) {
      console.log("Profile image update error:", error);
    } finally {
      setIsUploading(false);
    }
  };
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
            <TouchableOpacity onPress={() => setShowProfileImage(true)}>
              <Image
                source={{ uri: currentUser?.image }}
                style={styles.avatar}
                contentFit="cover"
              />
            </TouchableOpacity>

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

              {/* HEADER FIRST */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Profile</Text>

                <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                  <Ionicons name="close" size={24} color={COLORS.white} />
                </TouchableOpacity>
              </View>

              {/* PROFILE IMAGE */}
              <View style={styles.profileImageEditContainer}>
                <TouchableOpacity onPress={changeProfileImage}>
                  <Image
                    source={{ uri: currentUser?.image }}
                    style={styles.profileEditAvatar}
                    contentFit="cover"
                  />

                  <View style={styles.cameraIconOverlay}>
                    <Ionicons name="camera" size={18} color="white" />
                  </View>
                </TouchableOpacity>

                <Text style={styles.profileImageHint}>
                  Tap to change profile photo
                </Text>
              </View>

              {/* NAME */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={editedProfile.fullname}
                  onChangeText={(text) =>
                    setEditedProfile((prev) => ({ ...prev, fullname: text }))
                  }
                />
              </View>

              {/* BIO */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Bio</Text>
                <TextInput
                  style={[styles.input, styles.bioInput]}
                  value={editedProfile.bio}
                  onChangeText={(text) =>
                    setEditedProfile((prev) => ({ ...prev, bio: text }))
                  }
                />
              </View>

              {/* SAVE */}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>

            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>




      {/* SELECTED IMAGE MODAL */}
      <FullImageModal
        visible={!!selectPost}
        imageUrl={selectPost?.imageUrl || null}
        setVisible={(v) => {
          if (!v) setSelectPost(null);
        }}
      />

      <FullImageModal
        visible={showProfileImage}
        imageUrl={currentUser?.image || null}
        setVisible={(v) => setShowProfileImage(v)}
      />
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