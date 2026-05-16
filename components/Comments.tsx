import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { styles } from '@/styles/feed.styles';
import { formatDistanceToNow } from "date-fns"
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '@/constants/theme';
import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { Id } from '@/convex/_generated/dataModel';
import { getAuthenticatedUser } from '@/convex/user';
interface Comment {
    _id: Id<"comments">,
    userId: Id<"users">,
    content: string;
    _creationTime: number,

    user: {
        fullname?: string,
        image?: string
    };
}


export default function Comments({ comment }: { comment: Comment }) {
  const currentUser = useQuery(api.user.getCurrentUser);
 const deleteComment = useMutation(api.comments.deleteComment);

   const handleDelete = async (commentId: Id<"comments">) => {
    console.log("Deleting:", commentId);

    await deleteComment({ commentId });
};

    return (
        <View style={styles.commentContainer}>
            <Image source={{ uri: comment.user.image }} style={styles.commentAvatar} />

            <View style={styles.commentContent}>
              <View>
                  <Text style={styles.commentUsername}>{comment.user.fullname}</Text>
                <Text style={styles.commentText}>{comment.content}</Text>
                <Text style={styles.commentTime}>
                    {formatDistanceToNow(comment._creationTime, { addSuffix: true })}
                </Text>
    
              </View>
              <View>
                 {currentUser?._id === comment.userId && (
                 <TouchableOpacity onPress={() => handleDelete(comment._id)}>
                    <Ionicons name='trash' size={24} color={COLORS.white} />
                </TouchableOpacity>
               )}
              </View>
            </View>
        </View>
    )
}

