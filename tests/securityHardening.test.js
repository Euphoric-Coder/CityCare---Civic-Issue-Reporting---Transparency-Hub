import { toggleAccountApproval } from "../convex/accountProvisioning";
import { startWork, submitFieldOfficerWork } from "../convex/fieldOfficers";
import { verifyIssue, rejectIssue, assignIssueToFieldOfficer } from "../convex/unitOfficers";
import { withdrawIssue, reopenIssue, submitIssueFeedback } from "../convex/issues";
import { generateUploadUrl, deleteMedia, registerPendingUpload, getFileMeta } from "../convex/issuesMedia";
import { logout } from "../convex/authInternal";
import {
  hashSessionToken,
  generateSessionToken,
  resolveAuthenticatedUser,
  validateStoredMedia,
} from "../convex/lib/authorization";

describe("CITYCARE — Comprehensive Security Hardening & Authorization Suite", () => {
  const secret = "citycare-session-token-secret-v1";
  process.env.SESSION_SECRET = secret;

  const validToken = "citycare_sec_0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
  let validTokenHash;

  beforeAll(async () => {
    validTokenHash = await hashSessionToken(validToken);
  });

  // Helper to create mock context
  function createMockCtx(options = {}) {
    const {
      session = null,
      user = null,
      profile = null,
      issue = null,
      attachment = null,
      storedMeta = null,
    } = options;

    return {
      storage: {
        generateUploadUrl: jest.fn().mockResolvedValue("https://upload.convex.cloud/upload_123"),
        getUrl: jest.fn().mockImplementation(async (id) => `https://storage.convex.cloud/${id}`),
        delete: jest.fn().mockResolvedValue(undefined),
      },
      db: {
        get: jest.fn().mockImplementation(async (id) => {
          if (user && (id === user._id || id === user.id)) return user;
          if (issue && (id === issue._id || id === issue.id)) return issue;
          return null;
        }),
        patch: jest.fn().mockResolvedValue(undefined),
        insert: jest.fn().mockResolvedValue("inserted_id_123"),
        query: jest.fn().mockImplementation((tableName) => {
          return {
            withIndex: jest.fn().mockImplementation((indexName, filterFn) => {
              return {
                first: jest.fn().mockImplementation(async () => {
                  if (tableName === "sessions") return session;
                  if (tableName === "citizens" || tableName === "unitOfficers" || tableName === "fieldOfficers" || tableName === "cityAdmins") {
                    return profile;
                  }
                  if (tableName === "mediaAttachments") return attachment;
                  return null;
                }),
                unique: jest.fn().mockImplementation(async () => {
                  if (tableName === "unitOfficers" || tableName === "fieldOfficers") return profile;
                  return null;
                }),
                collect: jest.fn().mockResolvedValue(session ? [session] : []),
              };
            }),
            filter: jest.fn().mockReturnValue({
              take: jest.fn().mockResolvedValue([]),
              collect: jest.fn().mockResolvedValue([]),
            }),
          };
        }),
        system: {
          get: jest.fn().mockImplementation(async (id) => storedMeta),
        },
      },
    };
  }

  /* -------------------------------------------------------------------------
   * 1. UNAUTHENTICATED & SPOOFED ACCESS REJECTION
   * ------------------------------------------------------------------------- */
  test("Scenario 1: Unauthenticated caller invoking a protected mutation is rejected", async () => {
    const mockCtx = createMockCtx();
    await expect(
      toggleAccountApproval._handler(mockCtx, {
        userId: "fo_target",
        role: "field_officer",
        approved: true,
        adminUserId: "admin_123",
      })
    ).rejects.toThrow(/UNAUTHENTICATED/);
  });

  test("Scenario 2: Citizen supplying another citizen user ID is rejected (Discrepancy)", async () => {
    const citizenUser = { _id: "citizen_a", role: "citizen", fullName: "Citizen A" };
    const citizenProfile = { _id: "prof_a", userId: "citizen_a" };
    const session = {
      _id: "sess_1",
      userId: "citizen_a",
      role: "citizen",
      tokenHash: validTokenHash,
      createdAt: Date.now(),
      expiresAt: Date.now() + 100000,
    };

    const mockCtx = createMockCtx({ user: citizenUser, profile: citizenProfile, session });

    await expect(
      withdrawIssue._handler(mockCtx, {
        issueId: "issue_1",
        userId: "citizen_b", // Impersonation attempt!
        withdrawalReason: "No longer needed",
        withdrawalCategory: "resolved_by_myself",
        sessionToken: validToken,
      })
    ).rejects.toThrow(/FORBIDDEN: User ID discrepancy/);
  });

  test("Scenario 3: Field officer supplying a different officer ID is rejected", async () => {
    const foUser = { _id: "fo_a", role: "field_officer", fullName: "Field Officer A" };
    const foProfile = { _id: "prof_fo_a", userId: "fo_a", accountApproved: true, city: "Kolkata" };
    const session = {
      _id: "sess_fo",
      userId: "fo_a",
      role: "field_officer",
      tokenHash: validTokenHash,
      createdAt: Date.now(),
      expiresAt: Date.now() + 100000,
    };

    const mockCtx = createMockCtx({ user: foUser, profile: foProfile, session });

    await expect(
      startWork._handler(mockCtx, {
        issueId: "issue_1",
        userId: "fo_b", // Impersonation attempt!
        sessionToken: validToken,
      })
    ).rejects.toThrow(/FORBIDDEN: User ID discrepancy/);
  });

  test("Scenario 4: Unapproved officer accessing privileged functions is rejected", async () => {
    const foUser = { _id: "fo_unapproved", role: "field_officer", fullName: "Unapproved Officer" };
    const foProfile = { _id: "prof_unapproved", userId: "fo_unapproved", accountApproved: false, city: "Kolkata" };
    const session = {
      _id: "sess_unapp",
      userId: "fo_unapproved",
      role: "field_officer",
      tokenHash: validTokenHash,
      createdAt: Date.now(),
      expiresAt: Date.now() + 100000,
    };

    const mockCtx = createMockCtx({ user: foUser, profile: foProfile, session });

    await expect(
      startWork._handler(mockCtx, {
        issueId: "issue_1",
        userId: "fo_unapproved",
        sessionToken: validToken,
      })
    ).rejects.toThrow(/ACCOUNT_NOT_APPROVED/);
  });

  test("Scenario 5: Field officer modifying an unassigned issue is rejected", async () => {
    const foUser = { _id: "fo_assigned_1", role: "field_officer", fullName: "Assigned Officer" };
    const foProfile = { _id: "prof_fo_1", userId: "fo_assigned_1", accountApproved: true, city: "Kolkata" };
    const session = {
      _id: "sess_fo",
      userId: "fo_assigned_1",
      role: "field_officer",
      tokenHash: validTokenHash,
      createdAt: Date.now(),
      expiresAt: Date.now() + 100000,
    };
    const issue = {
      _id: "issue_1",
      issueCode: "ISS-001",
      title: "Pothole on Main Road",
      assignedFieldOfficer: "fo_other_officer", // Not assigned to fo_assigned_1!
      city: "Kolkata",
    };

    const mockCtx = createMockCtx({ user: foUser, profile: foProfile, session, issue });

    await expect(
      startWork._handler(mockCtx, {
        issueId: "issue_1",
        userId: "fo_assigned_1",
        sessionToken: validToken,
      })
    ).rejects.toThrow(/You are not assigned to work on this issue/);
  });

  test("Scenario 6: Unit officer accessing an unauthorized city is rejected", async () => {
    const uoUser = { _id: "uo_kolkata", role: "unit_officer", fullName: "Kolkata UO" };
    const uoProfile = { _id: "prof_uo_kol", userId: "uo_kolkata", accountApproved: true, city: "Kolkata" };
    const session = {
      _id: "sess_uo",
      userId: "uo_kolkata",
      role: "unit_officer",
      tokenHash: validTokenHash,
      createdAt: Date.now(),
      expiresAt: Date.now() + 100000,
    };
    const issueInVaranasi = {
      _id: "issue_varanasi",
      issueCode: "ISS-VAR-001",
      title: "Broken pipe",
      city: "Varanasi",
    };

    const mockCtx = createMockCtx({ user: uoUser, profile: uoProfile, session, issue: issueInVaranasi });

    await expect(
      verifyIssue._handler(mockCtx, {
        issueId: "issue_varanasi",
        issueCode: "ISS-VAR-001",
        verificationChecklist: { locationValid: true, isWithinJurisdiction: true, hasSufficientEvidence: true, notDuplicate: true },
        slaDeadline: Date.now() + 86400000,
        UOName: "Kolkata UO",
        status: "submitted",
        verifiedBy: "uo_kolkata",
        issueName: "Broken pipe",
        reporterId: "citizen_1",
        sessionToken: validToken,
      })
    ).rejects.toThrow(/FORBIDDEN_JURISDICTION/);
  });

  test("Scenario 7: City administrator modifying another city officer is rejected", async () => {
    const cityAdminUser = { _id: "admin_kolkata", role: "city_admin", fullName: "Kolkata Admin" };
    const cityAdminProfile = { _id: "prof_ca_kol", userId: "admin_kolkata", city: "Kolkata" };
    const session = {
      _id: "sess_ca",
      userId: "admin_kolkata",
      role: "city_admin",
      tokenHash: validTokenHash,
      createdAt: Date.now(),
      expiresAt: Date.now() + 100000,
    };

    // Officer profile in Varanasi
    const varanasiOfficerProfile = { _id: "prof_uo_var", userId: "uo_varanasi", city: "Varanasi" };

    const mockCtx = createMockCtx({
      user: cityAdminUser,
      profile: cityAdminProfile,
      session,
    });

    // Mock query for unitOfficers table to return Varanasi profile
    mockCtx.db.query = jest.fn().mockImplementation((tableName) => {
      return {
        withIndex: jest.fn().mockReturnValue({
          first: jest.fn().mockImplementation(async () => {
            if (tableName === "sessions") return session;
            if (tableName === "cityAdmins") return cityAdminProfile;
            if (tableName === "unitOfficers") return varanasiOfficerProfile;
            return null;
          }),
        }),
      };
    });

    await expect(
      toggleAccountApproval._handler(mockCtx, {
        userId: "uo_varanasi",
        role: "unit_officer",
        approved: true,
        adminUserId: "admin_kolkata",
        sessionToken: validToken,
      })
    ).rejects.toThrow(/FORBIDDEN_JURISDICTION/);
  });

  test("Scenario 8: Citizen attempting administrator operations is rejected", async () => {
    const citizenUser = { _id: "citizen_1", role: "citizen", fullName: "Citizen 1" };
    const citizenProfile = { _id: "prof_c_1", userId: "citizen_1" };
    const session = {
      _id: "sess_c",
      userId: "citizen_1",
      role: "citizen",
      tokenHash: validTokenHash,
      createdAt: Date.now(),
      expiresAt: Date.now() + 100000,
    };

    const mockCtx = createMockCtx({ user: citizenUser, profile: citizenProfile, session });

    await expect(
      toggleAccountApproval._handler(mockCtx, {
        userId: "uo_target",
        role: "unit_officer",
        approved: true,
        sessionToken: validToken,
      })
    ).rejects.toThrow(/Administrator privileges required/);
  });

  test("Scenario 9: Missing administrative credentials rejected even with valid admin ID argument", async () => {
    const mockCtx = createMockCtx();
    await expect(
      toggleAccountApproval._handler(mockCtx, {
        userId: "uo_target",
        role: "unit_officer",
        approved: true,
        adminUserId: "admin_valid_id", // Valid admin ID but NO session token!
      })
    ).rejects.toThrow(/UNAUTHENTICATED/);
  });

  /* -------------------------------------------------------------------------
   * 2. SESSION LIFECYCLE (EXPIRED, REVOKED, INVALID)
   * ------------------------------------------------------------------------- */
  test("Scenario 10: Expired session token is rejected", async () => {
    const expiredSession = {
      _id: "sess_exp",
      userId: "user_1",
      tokenHash: validTokenHash,
      createdAt: Date.now() - 200000,
      expiresAt: Date.now() - 5000, // Expired!
    };
    const mockCtx = createMockCtx({ session: expiredSession });

    await expect(resolveAuthenticatedUser(mockCtx, validToken)).rejects.toThrow(/EXPIRED_SESSION/);
  });

  test("Scenario 11: Revoked session token is rejected", async () => {
    const revokedSession = {
      _id: "sess_rev",
      userId: "user_1",
      tokenHash: validTokenHash,
      createdAt: Date.now() - 10000,
      expiresAt: Date.now() + 100000,
      revokedAt: Date.now() - 1000, // Logged out / revoked!
    };
    const mockCtx = createMockCtx({ session: revokedSession });

    await expect(resolveAuthenticatedUser(mockCtx, validToken)).rejects.toThrow(/REVOKED_SESSION/);
  });

  test("Scenario 12: Invalid or forged authentication token is rejected", async () => {
    const mockCtx = createMockCtx({ session: null }); // No session matches token in DB
    await expect(
      resolveAuthenticatedUser(mockCtx, "citycare_sec_forged_token_value_random")
    ).rejects.toThrow(/INVALID_SESSION/);
  });

  /* -------------------------------------------------------------------------
   * 3. MEDIA UPLOAD AND EVIDENCE INTEGRITY
   * ------------------------------------------------------------------------- */
  test("Scenario 13: Unauthorized media upload without session is rejected", async () => {
    const mockCtx = createMockCtx();
    await expect(generateUploadUrl._handler(mockCtx, {})).rejects.toThrow(/UNAUTHENTICATED/);
  });

  test("Scenario 14: Unauthorized media deletion of another user file is rejected", async () => {
    const citizenUser = { _id: "citizen_attacker", role: "citizen", fullName: "Attacker" };
    const citizenProfile = { _id: "prof_att", userId: "citizen_attacker" };
    const session = {
      _id: "sess_att",
      userId: "citizen_attacker",
      role: "citizen",
      tokenHash: validTokenHash,
      createdAt: Date.now(),
      expiresAt: Date.now() + 100000,
    };
    const victimAttachment = {
      _id: "att_1",
      storageId: "storage_victim_file",
      uploadedBy: "citizen_victim", // Owned by victim!
      status: "attached",
    };

    const mockCtx = createMockCtx({
      user: citizenUser,
      profile: citizenProfile,
      session,
      attachment: victimAttachment,
    });

    await expect(
      deleteMedia._handler(mockCtx, {
        storageId: "storage_victim_file",
        sessionToken: validToken,
      })
    ).rejects.toThrow(/You do not own this media file/);
  });

  test("Scenario 15: Invalid file metadata is rejected (bad MIME or excessive size)", async () => {
    const mockCtx = createMockCtx({
      storedMeta: { contentType: "application/x-msdownload", size: 1024 }, // Executable
    });

    await expect(
      validateStoredMedia(mockCtx, "storage_exe_file", { allowDelete: true })
    ).rejects.toThrow(/INVALID_FILE_TYPE/);

    const oversizedCtx = createMockCtx({
      storedMeta: { contentType: "image/jpeg", size: 25 * 1024 * 1024 }, // 25MB exceeds 15MB limit
    });

    await expect(
      validateStoredMedia(oversizedCtx, "storage_large_file", { allowDelete: true })
    ).rejects.toThrow(/FILE_TOO_LARGE/);
  });

  test("Scenario 16: Convex queries perform no storage deletion (Read-Only)", async () => {
    const mockCtx = createMockCtx({
      storedMeta: { contentType: "image/jpeg", size: 1024 },
    });

    const meta = await getFileMeta._handler(mockCtx, { storageId: "storage_valid_pic" });
    expect(meta.contentType).toBe("image/jpeg");
    expect(mockCtx.storage.delete).not.toHaveBeenCalled();
  });

  /* -------------------------------------------------------------------------
   * 4. AUTHORIZED ROLE WORKFLOWS & SUCCESS PATHS
   * ------------------------------------------------------------------------- */
  test("Scenario 17: Valid administrator approving officer account succeeds", async () => {
    const adminUser = { _id: "admin_super", role: "admin", fullName: "Super Admin" };
    const session = {
      _id: "sess_admin",
      userId: "admin_super",
      role: "admin",
      tokenHash: validTokenHash,
      createdAt: Date.now(),
      expiresAt: Date.now() + 100000,
    };
    const targetOfficer = { _id: "uo_target_id", userId: "officer_1", city: "Kolkata", accountApproved: false };

    const mockCtx = createMockCtx({ user: adminUser, session });
    mockCtx.db.query = jest.fn().mockImplementation((tableName) => {
      return {
        withIndex: jest.fn().mockReturnValue({
          first: jest.fn().mockImplementation(async () => {
            if (tableName === "sessions") return session;
            if (tableName === "unitOfficers") return targetOfficer;
            return null;
          }),
        }),
      };
    });

    const result = await toggleAccountApproval._handler(mockCtx, {
      userId: "officer_1",
      role: "unit_officer",
      approved: true,
      adminUserId: "admin_super",
      sessionToken: validToken,
    });

    expect(result.success).toBe(true);
    expect(mockCtx.db.patch).toHaveBeenCalledWith("uo_target_id", { accountApproved: true });
  });

  test("Scenario 18: Authorized field officer starts work successfully", async () => {
    const foUser = { _id: "fo_authorized", role: "field_officer", fullName: "Field Officer Valid" };
    const foProfile = { _id: "prof_fo", userId: "fo_authorized", accountApproved: true, city: "Kolkata" };
    const session = {
      _id: "sess_fo",
      userId: "fo_authorized",
      role: "field_officer",
      tokenHash: validTokenHash,
      createdAt: Date.now(),
      expiresAt: Date.now() + 100000,
    };
    const issue = {
      _id: "issue_assigned_1",
      issueCode: "ISS-001",
      title: "Broken streetlight",
      assignedFieldOfficer: "fo_authorized",
      city: "Kolkata",
    };

    const mockCtx = createMockCtx({ user: foUser, profile: foProfile, session, issue });

    const result = await startWork._handler(mockCtx, {
      issueId: "issue_assigned_1",
      userId: "fo_authorized",
      sessionToken: validToken,
    });

    expect(result.success).toBe(true);
    expect(mockCtx.db.patch).toHaveBeenCalledWith("issue_assigned_1", { status: "in_progress" });
  });

  test("Scenario 19: Web and mobile logout revokes session token", async () => {
    const session = {
      _id: "sess_to_logout",
      userId: "user_logout",
      tokenHash: validTokenHash,
      createdAt: Date.now(),
      expiresAt: Date.now() + 100000,
    };
    const mockCtx = createMockCtx({ session });

    const logoutResult = await logout._handler(mockCtx, { sessionToken: validToken });
    expect(logoutResult.success).toBe(true);
    expect(mockCtx.db.patch).toHaveBeenCalledWith("sess_to_logout", expect.objectContaining({
      revokedAt: expect.any(Number),
    }));
  });

  test("Scenario 20: Self-approval attempt by an administrator is strictly prohibited", async () => {
    const adminUser = { _id: "admin_self", role: "admin", fullName: "Admin Self" };
    const session = {
      _id: "sess_self",
      userId: "admin_self",
      role: "admin",
      tokenHash: validTokenHash,
      createdAt: Date.now(),
      expiresAt: Date.now() + 100000,
    };

    const mockCtx = createMockCtx({ user: adminUser, session });

    await expect(
      toggleAccountApproval._handler(mockCtx, {
        userId: "admin_self",
        role: "unit_officer",
        approved: true,
        adminUserId: "admin_self",
        sessionToken: validToken,
      })
    ).rejects.toThrow(/Self-approval is strictly prohibited/);
  });
});
