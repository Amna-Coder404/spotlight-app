import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { useAuth } from '@clerk/clerk-expo'
import { styles } from '@/styles/feed.styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '@/constants/theme';
import Story from '@/components/Story';
import { STORIES } from '@/constants/mock-data';



export default function Home() {
  const { signOut } = useAuth();

  return (
    <View style={styles.container}>
      {/* HEADER SEACTION */}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Spotlight </Text>
        <TouchableOpacity onPress={() => signOut()}>
          <Ionicons name='log-out-outline' size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsVerticalScrollIndicator={false} style={styles.storiesContainer} >
        {
          STORIES.map((story) => (
            <Story key={story.id} story={story} />
          ))
        }
      </ScrollView>
    </View>

  )
}