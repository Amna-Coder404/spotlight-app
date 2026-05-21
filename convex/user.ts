import { Id } from "./_generated/dataModel";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server"
import { v } from "convex/values"

export const createUser = mutation({
    args: {
        username: v.string(),
        fullname: v.string(),
        email: v.string(),
        bio: v.optional(v.string()),
        image: v.string(),
        follower: v.number(),
        following: v.number(),
        posts: v.number(),
        clerkId: v.string()
    },


    handler: async (ctx, args) => {
        const exitingUser = await ctx.db.query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();
        if (exitingUser) return;


        // Create a User in DB (data base)
        await ctx.db.insert("users", {
            username: args.username,
            fullname: args.fullname,
            email: args.email,
            bio: args.bio,
            image: args.image,
            clerkId: args.clerkId,
            follower: 0,
            following: 0,
            posts: 0,
        })


    }
})


export const getUserByClerkId = query({
    args: { clerkId: v.string() },

    handler: async (ctx, args) => {
        const user = ctx.db.query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .unique();


        return user;
    }
})

// This will check Current user (here or not)
export async function getAuthenticatedUser(ctx: QueryCtx | MutationCtx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const currentUser = await ctx.db.query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
        .first();

    if (!currentUser) throw new Error("User not Found");

    return currentUser;
}

export const updateProfile = mutation({
    args: {
        fullname: v.string(),
        bio: v.string(),
    },

    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx);

        await ctx.db.patch(currentUser._id, {
            fullname: args.fullname,
            bio: args.bio,
        });
    },
});


export const getCurrentUser = query({
    handler: async (ctx) => {
        return await getAuthenticatedUser(ctx);
    },
});


export const getUserProfile = query({
    args: { id: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.id);
        if (!user) throw new Error("User not Found!");

        return user;
    }
});

export const isFollowing = query({
    args: { followingId: v.id("users") },
    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx);

        const follow = await ctx.db.query("follows")
            .withIndex("by_both", (q) =>
                q.eq("followerId", currentUser._id).
                    eq("followingId", args.followingId))
            .first();

        return !!follow;
    },
});


export const toggleFollow = mutation({
    args: { followingId: v.id("users") },
    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx);

        const exiting = await ctx.db.query("follows")
            .withIndex("by_both", (q) => q.eq("followerId", currentUser._id)
                .eq("followingId", args.followingId))
            .first();

        if (exiting) {
            // unfollow
            await ctx.db.delete(exiting._id);
            await updateFollowCounts(ctx, currentUser._id, args.followingId, false);
        }
        else {
            // follow
            await ctx.db.insert("follows", {
                followerId: currentUser._id,
                followingId: args.followingId
            });

            await updateFollowCounts(ctx, currentUser._id, args.followingId, true);

            // Create a notification
            await ctx.db.insert("notification", {
                receiverId: args.followingId,
                senderId: currentUser._id,
                type: "follow"
            });
        }
    },
});

async function updateFollowCounts(
    ctx: MutationCtx,
    followerId: Id<"users">,
    followingId: Id<"users">,
    isFollowing: boolean
) {
    const follower = await ctx.db.get(followerId);
    const following = await ctx.db.get(followingId);
    if (!follower || !following) return;

    const followerFollowingCount = follower.following ?? 0;
    const followingFollowerCount = following.follower ?? 0;

    if (follower && following) {

        await ctx.db.patch(followerId, {
            following: Math.max(
                0,
                followerFollowingCount + (isFollowing ? 1 : -1)
            ),
        });
        await ctx.db.patch(followingId, {
            follower: Math.max(
                0,
                followingFollowerCount + (isFollowing ? 1 : -1)
            ),
        });
    }
}