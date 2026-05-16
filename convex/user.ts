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
    args : {clerkId : v.string()},

    handler : async (ctx, args) => {
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



export const getCurrentUser = query({
  handler: async (ctx) => {
    return await getAuthenticatedUser(ctx);
  },
});