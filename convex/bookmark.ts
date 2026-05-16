import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./user";


export const toggleBookmark = mutation({
    args: { postId: v.id("posts") },
    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx);
    

        const exiting = await ctx.db.query("bookmarks")
            .withIndex("by_user_and_post", (q) => q.eq("userId", currentUser._id).eq("postId", args.postId))
            .first();


        if (exiting) {
            // remove bookmark
            await ctx.db.delete(exiting._id);
            return false;
        } 
        else {
            // Add bookmark
            await ctx.db.insert("bookmarks", {
                userId: currentUser._id,
                postId: args.postId
            })

            return true;
        }


    }
})


export const getBookmarks = query({
    handler: async (ctx) => {
        const currentUser = await getAuthenticatedUser(ctx);


        // Get all Bookmarked post
        const bookmark = await ctx.db.query("bookmarks")
            .withIndex("by_user", (q) => q.eq("userId", currentUser._id))
            .order("desc")
            .collect()

        const bookmarksWithInfo = await Promise.all(
            bookmark.map(async (bookmarks) => {
                const post = await ctx.db.get(bookmarks.postId);
                return post;
            })
        );

        return bookmarksWithInfo;
    }
})