import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    fullName: v.string(),
    email: v.string(),
    password: v.string(),
    role: v.union(
      v.literal("citizen"),
      v.literal("ward_officer"),
      v.literal("field_worker"),
      v.literal("admin")
    ),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    region: v.optional(v.string()),
    postal: v.optional(v.string()),
    fullAddress: v.optional(v.string()),
    wardNo: v.optional(v.string()),
    latitude: v.optional(v.string()),
    longitude: v.optional(v.string()),
    notificationEnabled: v.boolean(),
    points: v.number(),
    languagePreference: v.string(),
    createdAt: v.string(),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"])
    .index("by_ward_zone", ["wardNo"]),

  issues: defineTable({
    ticket: v.string(),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    status: v.optional(v.string()),
    severity: v.optional(v.string()),
    priorityScore: v.optional(v.number()),
    upvotes: v.optional(v.number()),
    aiCategory: v.optional(v.string()),
    aiConfidence: v.optional(v.number()),
    photoUrl: v.optional(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    address: v.optional(v.string()),
    reportedBy: v.optional(v.id("users")),
    assignedTo: v.optional(v.id("users")),
    isAnonymous: v.boolean(),
    anonymousContact: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_status", ["status"])
    .index("by_category", ["category"]),

  issue_updates: defineTable({
    issue_id: v.id("issues"),
    status: v.string(),
    comment: v.optional(v.string()),
    updated_by: v.id("users"),
    createdAt: v.number(),
  }),

  comments: defineTable({
    issue_id: v.id("issues"),
    user_id: v.optional(v.id("users")),
    comment: v.string(),
    sentiment_score: v.optional(v.number()),
    isAnonymous: v.boolean(),
    createdAt: v.number(),
  }),

  reactions: defineTable({
    issue_id: v.id("issues"),
    user_id: v.id("users"),
    reaction_type: v.string(),
    createdAt: v.number(),
  }),

  notifications: defineTable({
    user_id: v.id("users"),
    issue_id: v.optional(v.id("issues")),
    message: v.string(),
    read: v.boolean(),
    createdAt: v.number(),
  }),

  badges: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    points_required: v.number(),
    createdAt: v.number(),
  }),

  user_badges: defineTable({
    user_id: v.id("users"),
    badge_id: v.id("badges"),
    earned_at: v.number(),
  }),

  messages: defineTable({
    from_user_id: v.id("users"),
    to_user_id: v.id("users"),
    message: v.string(),
    createdAt: v.number(),
    read: v.boolean(),
    issue_ids: v.optional(v.array(v.id("issues"))),
  })
    .index("by_sender", ["from_user_id"])
    .index("by_receiver", ["to_user_id"])
    .index("by_issue", ["issue_ids"]),
});
