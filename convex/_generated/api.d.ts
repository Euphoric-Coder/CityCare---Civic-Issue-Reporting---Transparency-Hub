/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as crons from "../crons.js";
import type * as duplicateIssues from "../duplicateIssues.js";
import type * as fieldOfficers from "../fieldOfficers.js";
import type * as issueDiscussions from "../issueDiscussions.js";
import type * as issueUpdates from "../issueUpdates.js";
import type * as issues from "../issues.js";
import type * as issuesMedia from "../issuesMedia.js";
import type * as messages from "../messages.js";
import type * as notifications from "../notifications.js";
import type * as officerAssign from "../officerAssign.js";
import type * as publicIssues from "../publicIssues.js";
import type * as signUp from "../signUp.js";
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
  auth: typeof auth;
  crons: typeof crons;
  duplicateIssues: typeof duplicateIssues;
  fieldOfficers: typeof fieldOfficers;
  issueDiscussions: typeof issueDiscussions;
  issueUpdates: typeof issueUpdates;
  issues: typeof issues;
  issuesMedia: typeof issuesMedia;
  messages: typeof messages;
  notifications: typeof notifications;
  officerAssign: typeof officerAssign;
  publicIssues: typeof publicIssues;
  signUp: typeof signUp;
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
