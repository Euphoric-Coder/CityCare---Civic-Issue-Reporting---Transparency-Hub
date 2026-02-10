import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createIssue = mutation({
  args: {
    title: v.string(),
    description: v.string(),

    category: v.string(),
    subcategory: v.optional(v.string()),

    priority: v.string(),

    tags: v.array(v.string()),

    latitude: v.string(),
    longitude: v.string(),

    address: v.string(),
    city: v.string(),
    state: v.string(),
    postal: v.string(),

    reportedBy: v.id("users"),
    isAnonymous: v.boolean(),

    photos: v.array(v.id("_storage")),
    videos: v.array(v.id("_storage")),
  },

  handler: async (ctx, args) => {
    const issueCode =
      "ISS-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    await ctx.db.insert("issues", {
      issueCode,

      title: args.title,
      description: args.description,

      category: args.category,
      subcategory: args.subcategory,

      priority: args.priority,

      tags: args.tags,

      latitude: args.latitude,
      longitude: args.longitude,

      address: args.address,
      city: args.city,
      state: args.state,
      postal: args.postal,

      reportedBy: args.reportedBy,
      isAnonymous: args.isAnonymous,

      photos: args.photos,
      videos: args.videos,

      status: "pending",

      assignedUnitOfficer: null,
      assignedFieldOfficer: null,

      possibleDuplicateIds: [],

      escalatedToAdmin: false,

      slaCategory: "standard",
      slaDeadline: null,
      slaBreached: false,

      resolvedAt: null,
      closedAt: null,

      citizenRating: null,
      citizenFeedback: null,

      reopenCount: 0,
      reopenReason: null,
      isReopened: false,

      createdAt: new Date().toISOString(),
    });

    return { success: true };
  },
});
