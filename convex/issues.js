import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createIssue = mutation({
  args: {
    ticket: v.string(),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    severity: v.optional(v.string()),
    priorityScore: v.number(),
    upvotes: v.number(),
    photoUrl: v.optional(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    address: v.optional(v.string()),
    reportedBy: v.id("users"),
    assignedTo: v.optional(v.id("users")),
    isAnonymous: v.boolean(),
    anonymousContact: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const issue = {
      ...args,
      status: "pending",
      aiCategory: null,
      ai_confidence: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const issueId = await ctx.db.insert("issues", issue);
    return issueId;
  },
});
