import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
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
        <ScrollView horizontal showsVerticalScrollIndicator={false} style={styles.storiesContainer}>
          {
            STORIES.map((story) => (
              <Story key={story.id} story={story} />
            ))
          }
        </ScrollView>

        {/* Show my all Post  */}
        {
          posts.map((post) => (
            <Post key={post._id} post={post} />
          ))
        }
      </ScrollView>
    </View>

  )
}

const NoPostFound = () => (
  <View style={{
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center"
  }}>

    <Text style={{ fontSize: 20, color: COLORS.primary }}> No Post yet !!</Text>
  </View>
)