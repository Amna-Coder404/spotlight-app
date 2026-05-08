import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { startTransition } from 'react'
import { styles } from '@/styles/feed.styles'



type Story = {
    id: string,
    username: string,
    avatar: string,
    hasStory: boolean
}


export default function Story({ story }: { story: any }) {
    return (
        <TouchableOpacity style={styles.storyWrapper}>
            <View style={[styles.storyRing, !story.hasStory && styles.noStory]}>
                <Image source={{ uri: story.avatar }} style={styles.storyAvatar}/>
            </View>

            <Text style={styles.storyAvatar}>{story.avatar}</Text>
        </TouchableOpacity>
    )
}