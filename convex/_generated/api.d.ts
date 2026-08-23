/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as accountProvisioning from "../accountProvisioning.js";
import type * as accountProvisioningActions from "../accountProvisioningActions.js";
import type * as admin from "../admin.js";
import type * as auditLogs from "../auditLogs.js";
import type * as auth from "../auth.js";
import type * as badges from "../badges.js";
import type * as cityAdmin from "../cityAdmin.js";
import type * as cityAdminRewards from "../cityAdminRewards.js";
import type * as crons from "../crons.js";
import type * as demoSeed from "../demoSeed.js";
import type * as demoSeedPasswords from "../demoSeedPasswords.js";
import type * as directMessages from "../directMessages.js";
import type * as duplicateIssues from "../duplicateIssues.js";
import type * as escalation from "../escalation.js";
import type * as fieldOfficers from "../fieldOfficers.js";
import type * as gamification from "../gamification.js";
import type * as gamificationAutomation from "../gamificationAutomation.js";
import type * as helpers_cityAdminAuth from "../helpers/cityAdminAuth.js";
import type * as issueAnalytics from "../issueAnalytics.js";
import type * as issueDiscussions from "../issueDiscussions.js";
import type * as issueUpdates from "../issueUpdates.js";
import type * as issues from "../issues.js";
import type * as issuesMedia from "../issuesMedia.js";
import type * as lib_auditLogger from "../lib/auditLogger.js";
import type * as lib_cityIssueAnalytics from "../lib/cityIssueAnalytics.js";
import type * as lib_officerPerformanceCalculations from "../lib/officerPerformanceCalculations.js";
import type * as messages from "../messages.js";
import type * as notifications from "../notifications.js";
import type * as officerAssign from "../officerAssign.js";
import type * as officerPerformance from "../officerPerformance.js";
import type * as officerPerformanceMaintenance from "../officerPerformanceMaintenance.js";
import type * as publicIssues from "../publicIssues.js";
import type * as signUp from "../signUp.js";
import type * as slaMonitoring from "../slaMonitoring.js";
import type * as unitOfficers from "../unitOfficers.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  accountProvisioning: typeof accountProvisioning;
  accountProvisioningActions: typeof accountProvisioningActions;
  admin: typeof admin;
  auditLogs: typeof auditLogs;
  auth: typeof auth;
  badges: typeof badges;
  cityAdmin: typeof cityAdmin;
  cityAdminRewards: typeof cityAdminRewards;
  crons: typeof crons;
  demoSeed: typeof demoSeed;
  demoSeedPasswords: typeof demoSeedPasswords;
  directMessages: typeof directMessages;
  duplicateIssues: typeof duplicateIssues;
  escalation: typeof escalation;
  fieldOfficers: typeof fieldOfficers;
  gamification: typeof gamification;
  gamificationAutomation: typeof gamificationAutomation;
  "helpers/cityAdminAuth": typeof helpers_cityAdminAuth;
  issueAnalytics: typeof issueAnalytics;
  issueDiscussions: typeof issueDiscussions;
  issueUpdates: typeof issueUpdates;
  issues: typeof issues;
  issuesMedia: typeof issuesMedia;
  "lib/auditLogger": typeof lib_auditLogger;
  "lib/cityIssueAnalytics": typeof lib_cityIssueAnalytics;
  "lib/officerPerformanceCalculations": typeof lib_officerPerformanceCalculations;
  messages: typeof messages;
  notifications: typeof notifications;
  officerAssign: typeof officerAssign;
  officerPerformance: typeof officerPerformance;
  officerPerformanceMaintenance: typeof officerPerformanceMaintenance;
  publicIssues: typeof publicIssues;
  signUp: typeof signUp;
  slaMonitoring: typeof slaMonitoring;
  unitOfficers: typeof unitOfficers;
  users: typeof users;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
