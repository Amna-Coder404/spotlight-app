import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import { useAuth } from '@clerk/clerk-expo'
import { styles } from '@/styles/feed.styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '@/constants/theme';
import Story from '@/components/Story';
import { STORIES } from '@/constants/mock-data';
import { api } from '@/convex/_generated/api';
import { Loader } from '@/components/Loader';
import Post from '@/components/Post';
import { useQuery } from 'convex/react';

import { Image } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
  const { signOut } = useAuth();
  const posts = useQuery(api.posts.getFeedPosts);

  if (posts === undefined) return <Loader />

  if (posts.length === 0) return <NoPostFound />




  return (
    <View style={styles.container}>
      {/* HEADER SEACTION */}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Spotlight </Text>
        <TouchableOpacity onPress={() => signOut()}>
          <Ionicons name='log-out-outline' size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}>


      </ScrollView>
      {/* Show my all Post  */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <Post post={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        ListHeaderComponent={<StoriesSection />} />
    </View>

  )
}

const StoriesSection = () => (
  <ScrollView horizontal showsVerticalScrollIndicator={false} style={styles.storiesContainer}>
    {
      STORIES.map((story) => (
        <Story key={story.id} story={story} />
      ))
    }
  </ScrollView>
)
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


