import { COLORS } from '@/constants/theme'
import { Id } from '@/convex/_generated/dataModel'
import { styles } from '@/styles/feed.styles'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Image } from 'expo-image'
import { Link } from 'expo-router'
import { View, Text, TouchableOpacity } from 'react-native'

type PostProps = {
    post: {
        _id: Id<"posts">,
        imageUrl: string,
        caption?: string,
        likes: number,
        comments: number,
        _creationTime: number,
        isLiked: boolean,
        isBookmarked: boolean,
        author: {
            _id: string,
            username: string,
            image: string
        }
    }
}


export default function Post({ post }: PostProps) {
    
    return (
        <View style={styles.post}>
            {/* POST HEADER*/}

            <View style={styles.postHeader}>
                <Link href={"/notification"} asChild>
                    <TouchableOpacity style={styles.postHeaderLeft}>
                        <Image
                            source={{ uri: post.author.image }}
                            style={styles.postAvatar}
                            contentFit='cover'
                            transition={200}
                            cachePolicy="memory-disk" />
                        <Text style={styles.postUsername}>{post.author.username}</Text>
                    </TouchableOpacity>

                </Link>
                {/* FIX IT LATER  :TODO 

                <TouchableOpacity>
                    <Ionicons name='ellipsis-horizontal' size={20} color={COLORS.white} />
                </TouchableOpacity> */}

                <TouchableOpacity>
                    <Ionicons name='trash-outline' size={20} color={COLORS.white} />
                </TouchableOpacity>
            </View>


            {/* IMAGE */}
            <Image
                source={post.imageUrl}
                style={styles.postImage}
                contentFit='cover'
                transition={200}
                cachePolicy="memory-disk" />

            {/* POST Actions */}
            <View style={styles.postActions}>
                <View style={styles.postActionsLeft}>
                    <TouchableOpacity>
                        <Ionicons name='heart-outline' size={24} color={COLORS.white} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name='chatbubble-outline' size={24} color={COLORS.white} />
                    </TouchableOpacity>
                </View>

                <View>
                    <TouchableOpacity>
                        <Ionicons name='bookmark-outline' size={24} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
            </View>


            {/* Post INFO */}
            <View style={styles.postInfo}>
                <Text style={styles.likesText}>
                    Be the first to like
                </Text>

                {post.caption && (
                    <View style={styles.captionContainer}>
                        <Text style={styles.captionUsername}>{post.author.username}</Text>
                        <Text style={styles.captionText}>{post.caption}</Text>
                    </View>
                )}

                <TouchableOpacity>
                    <Text style={styles.commentText}>View all 2 comments</Text>
                </TouchableOpacity>

                <Text style={styles.timeAgo}>
                    2 hours ago
                </Text>
            </View>
        </View>
    )
}