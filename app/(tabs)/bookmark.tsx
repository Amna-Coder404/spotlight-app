import { Loader } from '@/components/Loader'
import NotFound from '@/components/NotFound'
import { api } from '@/convex/_generated/api'
import { styles } from '@/styles/feed.styles'
import { useQuery } from 'convex/react'
import { Image } from 'expo-image'
import React from 'react'
import { ScrollView, Text, View } from 'react-native'

const Bookmark = () => {
  const bookmarkedPosts = useQuery(api.bookmark.getBookmarks);

  if (bookmarkedPosts === undefined) return <Loader />
  if (bookmarkedPosts.length === 0) return <NotFound title='No bookmarked posts yet' image={require("../../assets/images/not_bookmark_yet.png")}   />


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


