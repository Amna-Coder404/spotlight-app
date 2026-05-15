// add comment

import { ConvexError, v } from "convex/values";
import { getAuthenticatedUser } from "./user";
import { mutation, query } from "./_generated/server";

export const addComment = mutation({
    args: {
        postId: v.id("posts"),
        content: v.string(),
    },

    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx);
        const post = await ctx.db.get(args.postId);
        if (!post) throw new ConvexError("Post Not Found!");


        const commentId = await ctx.db.insert("comments", {
            postId: args.postId,
            userId: currentUser?._id,
            content: args.content
        })

        // Increment comment count by 1
        await ctx.db.patch(args.postId, { comments: post.comments + 1 });

        // Create a notifcation if it's not my post
        if (currentUser._id !== post.userId) {
            await ctx.db.insert("notification", {
                receiverId: post.userId,
                senderId: currentUser._id,
                type: "comment",
                postId: args.postId,
                commentId,
            });
        }


        return commentId;
    }
})


// getComments
export const getComment = query({
    args: { postId: v.id("posts") },

    handler: async (ctx, args) => {
        const comments = await ctx.db.query("comments")
            .withIndex("by_post", (q) => q.eq("postId", args.postId))
            .collect();

        const commentsWithInfo = await Promise.all(
            comments.map(async (comments) => {
                const user = await ctx.db.get(comments.userId);

                return {
                    ...comments,
                    user: {
                        fullname: user?.fullname,
                        image: user?.image
                    },
                };

            })
        );

        return commentsWithInfo;
    }
})


// Delete comment

export const deleteComment = mutation({
    args: {
        commentId: v.id("comments")
    },

    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx);
        if (!currentUser) throw new Error("User not Found!");

        const comment = await ctx.db.get(args.commentId);
        if (!comment) throw new Error("Comment not Found!");

        const post = await ctx.db.get(comment.postId);
        if (!post) throw new Error("Post not Found!");


        await ctx.db.delete(args.commentId);
        await ctx.db.patch(comment.postId, { comments: post.comments - 1 })
    }


})

export const getCurrentUser = query({
  handler: async (ctx) => {
    return await getAuthenticatedUser(ctx);
  },
});