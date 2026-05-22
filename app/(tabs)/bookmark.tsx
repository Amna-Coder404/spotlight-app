import { View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import React from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Loader } from '@/components/Loader'
import { Image } from 'expo-image'
import { Link } from 'expo-router'
import { styles } from '@/styles/feed.styles'
import { COLORS } from '@/constants/theme'
import NotFound from '@/components/NotFound'

const Bookmark = () => {
  const bookmarkedPosts = useQuery(api.bookmark.getBookmarks);

  if (bookmarkedPosts === undefined) return <Loader />
  if (bookmarkedPosts.length === 0) return <NotFound title='No bookmarked posts yet' image={require("../../assets/images/not_bookmark _yet.png")}   />


 return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookmarks</Text>
      </View>

      {/* POSTS */}
      <ScrollView
        contentContainerStyle={{
          padding: 8,
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {bookmarkedPosts.map((post) => {
          if (!post) return null;
          return (
            <View key={post._id} style={{ width: "33.33%", padding: 1 }}>
              <Image
                source={post.imageUrl}
                style={{ width: "100%", aspectRatio: 1 }}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}



export default Bookmark


