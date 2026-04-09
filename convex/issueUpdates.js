import { query } from "./_generated/server";
import { v } from "convex/values";

export const getByIssueId = query({
  args: {
    issueId: v.id("issues"),
  },
  handler: async (ctx, args) => {
    const updates = await ctx.db
      .query("issueUpdates")
      .withIndex("by_issue", (q) => q.eq("issueId", args.issueId))
      .order("asc")
      .collect();

    // attach user info + media urls
    const enriched = await Promise.all(
      updates.map(async (u) => {
        const user = await ctx.db.get(u.updatedBy);

        const attachmentUrls = await Promise.all(
          (u.attachments || []).map((fileId) => ctx.storage.getUrl(fileId)),
        );

        return {
          ...u,
          updater: user,
          attachmentUrls,
        };
      }),
    );

    return enriched;
  },
});
