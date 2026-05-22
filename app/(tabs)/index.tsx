import { Loader } from '@/components/Loader';
import Post from '@/components/Post';
import { COLORS } from '@/constants/theme';
import { api } from '@/convex/_generated/api';
import { styles } from '@/styles/feed.styles';
import { useAuth } from '@clerk/clerk-expo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery } from 'convex/react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import StoriesSection from '@/components/Stories';
import { Link } from 'expo-router';
import { Image } from 'react-native';

export default function Home() {
  const { signOut } = useAuth();
  const posts = useQuery(api.posts.getFeedPosts);

  if (posts === undefined) return <Loader />

  return (
    <View style={styles.container}>
      {/* HEADER SEACTION */}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Spotlight </Text>
        <TouchableOpacity onPress={() => signOut()}>
          <Ionicons name='log-out-outline' size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Show my all Post  */}
     {posts.length === 0 ? (
      <NoPostFound />
     ) : (
       <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <Post post={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        ListHeaderComponent={<StoriesSection />} />
     )}
    </View>

  )
}


const NoPostFound = () => (
  <View style={styles.noPostContainer}>
    <Image source={require("../../assets/images/not_post_yet.png")} style={styles.noPostImage} />
    <Text style={styles.noPostSubtitle}> Start sharing your thoughts, photos, and moments with others.</Text>
      <Link href="/(tabs)/create" asChild>
      <TouchableOpacity>
        <Text style={styles.noPostSubtitleLink}>
          Create Post
        </Text>
      </TouchableOpacity>
    </Link>
  </View>
)


