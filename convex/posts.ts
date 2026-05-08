import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./user";

// This will generate Upload url
export const generateUploadUrl = mutation(async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    return await ctx.storage.generateUploadUrl();
})

// Create Post 
export const createPost = mutation({
    args: {
        storageId: v.id("_storage"),
        caption: v.optional(v.string()),

    },

    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx);

        const imageUrl = await ctx.storage.getUrl(args.storageId)
        if (!imageUrl) throw new Error("Image Not found");


        // Create a Post in DB (data base)
        const postId = await ctx.db.insert("posts", {
            userId: currentUser._id,
            imageUrl,
            storageId: args.storageId,
            caption: args.caption,
            likes: 0,
            comments: 0
        })

        await ctx.db.patch(currentUser._id, {
            posts: currentUser.posts + 1,
        })

        return postId;
    }
})

// This will create a Feeds

export const getFeedPost = query({
    handler: async (ctx) => {
        const currentUser = await getAuthenticatedUser(ctx);


        // get all posts
        const posts = await ctx.db.query("posts").order("desc").collect();

        if (posts.length === 0) return [];


        // inhance post with user data
        const postsWithInfo = await Promise.all(
            posts.map(async (post) => {
                const postAuthor = await ctx.db.get(post.userId);

                const like = await ctx.db.query("likes")
                    .withIndex("by_user_and_post",
                        (q) => q.eq("userId", currentUser._id)
                            .eq("postId", post._id)).first()

                const bookmark = await ctx.db.query("bookmarks")
                    .withIndex("by_user_and_post",
                        (q) => q.eq("userId", currentUser._id)
                            .eq("postId", post._id)).first()


                return {
                    ...posts,
                    auther: {
                        _id: postAuthor?._id,
                        username: postAuthor?.username,
                        image: postAuthor?.image
                    },
                    isLiked: !!like,
                    isBookmarked: !!bookmark

                }


            })
        )
        return postsWithInfo;
    }
})
