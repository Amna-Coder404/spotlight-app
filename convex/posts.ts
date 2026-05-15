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

        console.log("CREATE USER RUNNING")
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

export const getFeedPosts = query({
    handler: async (ctx) => {
        const currentUser = await getAuthenticatedUser(ctx);


        // get all posts
        const posts = await ctx.db.query("posts").order("desc").collect();

        if (posts.length === 0) return [];


        // inhance post with user data
        const postsWithInfo = await Promise.all(
            posts.map(async (post) => {
                const postAuthor = (await ctx.db.get(post.userId))!;

                const like = await ctx.db.query("likes")
                    .withIndex("by_user_and_post",
                        (q) => q.eq("userId", currentUser._id)
                            .eq("postId", post._id)).first()

                const bookmark = await ctx.db.query("bookmarks")
                    .withIndex("by_user_and_post",
                        (q) => q.eq("userId", currentUser._id)
                            .eq("postId", post._id)).first()

                return {
                    ...post,
                    author: {
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

export const toggleLike = mutation({
    args: { postId: v.id("posts") },
    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx);

        const exiting = await ctx.db.query("likes")
            .withIndex("by_user_and_post", (q) => q.eq("userId", currentUser._id).eq("postId", args.postId))
            .first()

        const post =await ctx.db.get(args.postId);
        if (!post) throw new Error("Post not Found!");

        if (exiting) {
            // remove like
            await ctx.db.delete(exiting._id);
            await ctx.db.patch(args.postId, { likes: post.likes - 1 });
            return false;
        }
        else {
            // Add like
            await ctx.db.insert("likes", {
                userId: currentUser._id,
                postId: args.postId
            })

            await ctx.db.patch(args.postId, { likes: post.likes + 1 });
            
            // if it's not my post create a notifaication

            if (currentUser._id !== post.userId) {
                await ctx.db.insert("notification", {
                    receiverId: post.userId,
                    senderId: currentUser._id,
                    type: "like",
                    postId: args.postId
                })
            }
            return true; 
        }
    }
}) 

