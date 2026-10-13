export async function createAuditLog(
  ctx,
  {
    performedByUserId,
    performerRole,

    action,
    actionCategory,

    affectedEntityType = "issue",
    affectedEntityId,

    issueId,
    issueCode,

    city,
    department,

    oldValue,
    newValue,

    reason,
    description,

    source = "mobile",

    timestamp = Date.now(),
  },
) {
  try {
    return await ctx.db.insert("auditLogs", {
      performedByUserId,
      performerRole,

      action,
      actionCategory,

      affectedEntityType,

      affectedEntityId: affectedEntityId ? String(affectedEntityId) : undefined,

      issueId,
      issueCode,

      city,
      department,

      oldValue,
      newValue,

      reason,
      description,

      source,
      timestamp,
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
    return null;
  }
}

export async function auditIssueActionMobile(
  ctx,
  {
    issue,
    performedByUserId,
    performerRole,

    action,
    actionCategory,

    oldValue,
    newValue,

    reason,
    description,
  },
) {
  if (!issue) return null;

  return createAuditLog(ctx, {
    performedByUserId,
    performerRole,

    action,
    actionCategory,

    affectedEntityType: "issue",
    affectedEntityId: issue._id,

    issueId: issue._id,
    issueCode: issue.issueCode,

    city: issue.city,
    department: issue.department ?? issue.category,

    oldValue,
    newValue,

    reason,
    description,

    source: "mobile",
  });
}
