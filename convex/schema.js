import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(), // from NextAuth (e.g., session.user.id)
    fullName: v.string(),
    role: v.union(
      v.literal("citizen"),
      v.literal("admin"),
      v.literal("ward_officer"),
      v.literal("field_worker")
    ),
    email: v.string(),
    notificationEnabled: v.boolean(),
    wardZone: v.optional(v.string()),
    points: v.number(),
    languagePreference: v.string(),
    createdAt: v.string(),
  })
    .index("by_userId", ["userId"])
    .index("by_email", ["email"])
    .index("by_role", ["role"])
    .index("by_ward_zone", ["wardZone"]),
});
