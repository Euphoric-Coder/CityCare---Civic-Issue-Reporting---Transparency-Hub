import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createIssue = mutation({
  args: {
    ticket_id: v.string(),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    severity: v.optional(v.string()),
    priority_score: v.number(),
    upvotes: v.number(),
    photo_url: v.optional(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    address: v.optional(v.string()),
    reported_by: v.id("users"),
    assigned_to: v.optional(v.id("users")),
    is_anonymous: v.boolean(),
    anonymous_contact: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const issue = {
      ...args,
      status: "pending",
      ai_category: null,
      ai_confidence: null,
      created_at: Date.now(),
      updated_at: Date.now(),
    };

    const issueId = await ctx.db.insert("issues", issue);
    return issueId;
  },
});
