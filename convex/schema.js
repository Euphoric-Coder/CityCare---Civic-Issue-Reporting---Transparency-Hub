import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    fullName: v.string(),
    email: v.string(),
    password: v.string(),

    role: v.union(
      v.literal("citizen"),
      v.literal("unit_officer"),
      v.literal("field_worker"),
      v.literal("admin"),
    ),

    createdAt: v.string(),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  citizens: defineTable({
    userId: v.id("users"),

    fullName: v.string(),
    email: v.string(),

    city: v.string(),
    state: v.string(),
    region: v.string(),

    postal: v.string(),
    fullAddress: v.string(),

    latitude: v.string(),
    longitude: v.string(),

    points: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_city", ["city"]),

  unitOfficers: defineTable({
    userId: v.id("users"),

    fullName: v.string(),
    email: v.string(),
    phone: v.string(),

    state: v.string(),
    city: v.string(),
    district: v.string(),

    department: v.string(),

    totalVerifiedIssues: v.number(),
    totalRejectedIssues: v.number(),

    avgResolutionTime: v.number(),

    rating: v.number(),
    efficiencyScore: v.number(),

    lastLogin: v.optional(v.string()),

    assignedFieldOfficers: v.array(v.id("fieldOfficers")),

    activeIssueIds: v.array(v.id("issues")),
    resolvedIssueIds: v.array(v.id("issues")),
  })
    .index("by_user", ["userId"])
    .index("by_department", ["department"])
    .index("by_city", ["city"]),

  fieldOfficers: defineTable({
    userId: v.id("users"),

    fullName: v.string(),
    email: v.string(),
    phone: v.string(),

    state: v.string(),
    city: v.string(),
    district: v.string(),

    department: v.string(),

    specialisations: v.array(v.string()),

    reportingUnitOfficerId: v.optional(v.id("unitOfficers")),

    currentActiveIssues: v.number(),
    maxIssueCapacity: v.number(),

    assignedIssueIds: v.array(v.id("issues")),
    completedIssueIds: v.array(v.id("issues")),

    totalResolvedIssues: v.number(),

    avgResolutionTime: v.number(),
    onTimeCompletionRate: v.number(),

    rating: v.number(),
    efficiencyScore: v.number(),

    lastLogin: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_department", ["department"])
    .index("by_unit_officer", ["reportingUnitOfficerId"]),
});
