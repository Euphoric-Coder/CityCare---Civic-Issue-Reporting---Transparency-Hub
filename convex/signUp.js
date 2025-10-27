import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { hash } from "bcryptjs";

export const signUp = mutation({
  args: {
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
    fullAddress: v.optional(v.string()),
    wardNo: v.optional(v.string()),
    latitude: v.optional(v.string()),
    longitude: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existing) return { success: false, error: "User already exists" };

    const hashed = await hash(args.password, 10);

    await ctx.db.insert("users", {
      fullName: args.fullName,
      email: args.email,
      password: hashed,
      role: args.role,
      city: args.city,
      state: args.state,
      region: args.region,
      fullAddress: args.fullAddress,
      wardNo: args.wardNo,
      latitude: args.latitude,
      longitude: args.longitude,
      notificationEnabled: true,
      points: 0,
      languagePreference: "en",
      createdAt: new Date().toISOString(),
    });

    return { success: true };
  },
});
