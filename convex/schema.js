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
});
