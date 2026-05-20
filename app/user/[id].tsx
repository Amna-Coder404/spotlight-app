import { View, Text, TouchableOpacity, ScrollView, Pressable, FlatList } from 'react-native'
import React from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useLocalSearchParams } from 'expo-router'
import { Id } from '@/convex/_generated/dataModel'
import { Loader } from '@/components/Loader'
import { styles } from '@/styles/profile.styles'
import Ionicons from '@expo/vector-icons/Ionicons'
import { COLORS } from '@/constants/theme'
import { Image } from 'expo-image'

export default function UserProfileSection() {
    const { id } = useLocalSearchParams();

    const profile = useQuery(api.user.getUserProfile, { id: id as Id<"users"> });
    const posts = useQuery(api.posts.getPostByUser, { userId: id as Id<"users"> });
    const isFollowing = useQuery(api.user.isFollowing, { followingId: id as Id<"users"> });

    const toggleFollow = useMutation(api.user.toggleFollow);

    const handleback = () => { };

    if (profile === undefined || posts === undefined || isFollowing === undefined) return <Loader />

    return (
        <View style={styles.container}>
            {/* User profile Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleback}>
                    <Ionicons name="close" size={24} color={COLORS.white} />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>{profile.username}</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* all  */}
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.profileInfo}>
                    <View style={styles.avatarAndStats}>
                        {/* AVATOR */}
                        <Image source={profile.image}
                            style={styles.avatar}
                            contentFit="cover"
                            cachePolicy="memory-disk"
                        />

                        {/* STATS */}
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{profile.posts}</Text>
                                <Text style={styles.statLabel}>Posts</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{profile.follower}</Text>
                                <Text style={styles.statLabel}>Followers</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{profile.following}</Text>
                                <Text style={styles.statLabel}>Following</Text>
                            </View>
                        </View>
                    </View>

                    <Text style={styles.name} >{profile.fullname}</Text>
                    <Text style={styles.bio} >{profile.bio}</Text>
                    {/* Toggle Follow Button  */}
                    <Pressable style={[styles.followButton, isFollowing && styles.followingButton]}
                        onPress={() => toggleFollow({ followingId: id as Id<"users"> })}>
                        <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
                            {isFollowing ? "UnFollow" : "Follow"}
                        </Text>
                    </Pressable>
                </View>

                <View style={styles.postsGrid}>
                    {posts.length === 0 ? (
                        <View style={styles.noPostsContainer}>
                            <Ionicons name="images-outline" size={48} color={COLORS.grey} />
                            <Text style={styles.noPostsText}>No posts yet</Text>
                        </View>
                    )
                        : (
                            <FlatList
                                data={posts}
                                numColumns={3}
                                scrollEnabled={false}
                                renderItem={({ item }) => (
                                    <TouchableOpacity style={styles.gridItem}>
                                        <Image
                                            source={item.imageUrl}
                                            style={styles.gridImage}
                                            contentFit="cover"
                                            transition={200}
                                            cachePolicy="memory-disk"
                                        />
                                    </TouchableOpacity>
                                )}
                                keyExtractor={(item) => item._id}
                            />
                        )}
                </View>

            </ScrollView>

        </View>
    )
}