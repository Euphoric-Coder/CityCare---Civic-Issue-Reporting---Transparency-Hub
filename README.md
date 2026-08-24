# CityCare – Smart Civic Issue Management Platform

CityCare is a smart civic issue reporting and management platform that enables citizens to report civic issues and allows municipal officers and administrators to verify, assign, resolve, monitor, and analyse those issues through a structured resolution workflow.

## About the Project

Urban municipal administration often suffers from fragmented communication, unverified issue reports, opaque resolution tracking, and lack of real-time operational visibility. CityCare addresses these challenges by providing a centralized digital platform that bridges the gap between citizens, field workforce, and municipal administrative tiers.

The platform provides an end-to-end civic governance lifecycle. From initial citizen submission and automated duplicate checks to Unit Officer verification, Field Officer assignment, evidence-backed resolution, and citizen feedback—every stage of issue resolution is tracked with full transparency, strict SLA monitoring, and role-based accountability.

## Key Features

* **Citizen Features:** Issue reporting, image/video evidence upload, Google Maps location selection, duplicate issue warnings, real-time issue tracking, direct officer messaging, resolution feedback, citizen ratings, gamification rewards, public issue dashboard, interactive map visualization, and issue comments and replies.
* **Unit Officer Features:** Issue verification, rejection with justification, duplicate issue linking/merging, Field Officer assignment and reassignment, SLA deadline management, admin escalation, resolution review, rework requests, issue reopening, direct messaging, and officer performance monitoring.
* **City Administrator Features:** City-level operational overview, key performance indicators (KPIs), all-issues management, multi-criteria filtering, multi-column sorting, assignment overrides, priority and category modification, SLA management, system audit logs, city department analytics, and interactive city issue maps.
* **System Administrator Features:** Officer account pre-provisioning, officer profile mappings, system-wide messaging, SLA and escalation monitoring, officer reassignment, issue modifications, badge and gamification management, and city-wide trend analysis.

## Issue Workflow

### Primary Lifecycle
`Pending` → `Verified` → `Assigned` → `In Progress` → `Pending UO Verification` → `Resolved / Closed`

### Secondary & Exception States
* `Rejected`: Issues deemed invalid, out-of-scope, or insufficient evidence during Unit Officer verification.
* `Rework Required`: Issues sent back to the assigned Field Officer when submitted work is unsatisfactory.
* `Reopened`: Resolved issues reopened by citizens due to recurring or incomplete resolution.
* `Escalated`: Issues escalated to City/System Administrators due to SLA breach or operational blockers.
* `Withdrawn`: Issues withdrawn by the reporting citizen prior to verification.

## Core Algorithms

* **Weighted Duplicate Detection:** Evaluates textual similarity (title and description) combined with category matching and spatial distance scoring to detect duplicate reports.
* **Haversine Distance Calculation:** Computes precise geographical distances between reported issue coordinates and nearby officers or existing issues.
* **Unit Officer Auto-Assignment:** Assigns newly verified issues to the appropriate Unit Officer based on jurisdiction boundaries, department specialization, and current active workload.
* **Field Officer Assignment:** Recommends and routes tasks to Field Officers based on geographic proximity, skill compatibility, and active task capacity.
* **SLA Monitoring:** Evaluates issue resolution timelines against predefined priority-based thresholds to detect approaching deadlines and automated SLA breaches.
* **Escalation Logic:** Automatically flags and escalates overdue or blocked issues to City Administrators for intervention.
* **Trend Analyzer:** Aggregates temporal and categorical issue submission data to identify spatial clusters and recurring infrastructure bottlenecks.
* **Unit Officer and Field Officer Performance Analysis:** Computes efficiency ratings, resolution rates, and compliance metrics for municipal workforce evaluation.
* **Status Transition Validation:** Enforces state machine rules ensuring issues transition strictly through valid administrative sequences.
* **Citizen Rate Limiting:** Restricts issue submission rates per user using sliding window algorithm to prevent spam and platform abuse.

## Technology Stack

| Technology | Primary Purpose |
| :--- | :--- |
| **Next.js** | React framework for web frontend rendering, routing, and API routing. |
| **React** | Component-based UI library for building interactive interface views. |
| **JavaScript / TypeScript** | Core programming languages for frontend logic and backend Convex functions. |
| **Tailwind CSS** | Utility-first CSS framework for custom responsive styling. |
| **ShadCN UI** | Accessible component primitives for UI building blocks. |
| **NextAuth** | Authentication library for session management and OAuth/credential access. |
| **Convex** | Real-time backend platform for database storage, serverless functions, and reactive queries. |
| **Google Maps Platform** | Interactive map visualization for civic issue mapping and pin selection. |
| **Google Places API** | Location autocomplete and address lookup. |
| **Google Geocoding** | Reverse geocoding of coordinates into structured postal addresses. |
| **Gemini AI** | Multimodal AI model for automated image verification and issue description analysis. |
| **Upstash Redis** | Distributed key-value cache used for server-side rate limiting. |
| **Resend API** | Transactional email delivery service for notifications and system alerts. |
| **Vercel** | Cloud platform for frontend deployment and hosting. |

## Getting Started

### Prerequisites

Ensure you have the following installed and configured before setting up the project:

* **Node.js** (v18.x or higher recommended)
* **npm** (v9.x or higher)
* **Git**
* A **Convex** account and project setup
* Google Cloud Platform project with enabled Maps JavaScript API, Places API, and Geocoding API
* API keys for configured third-party services (Gemini AI, Upstash Redis, Resend)

### Clone Repository

```bash
git clone https://github.com/sagnikdey45/CityCare---Smart-Civic-Issue-Management-Platform
cd CityCare---Smart-Civic-Issue-Management-Platform
```

### Install Dependencies

```bash
npm install
```

## Environment Variables

Create an `.env.local` file in the root directory. Actual secret keys and credentials must never be committed to source control.

```env
CONVEX_DEPLOYMENT=your_convex_deployment
NEXT_PUBLIC_CONVEX_URL=your_convex_url
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Additional Service Credentials
GEMINI_API_KEY=your_gemini_api_key
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
RESEND_API_KEY=your_resend_api_key
```

## Running the Application

Convex backend services and the Next.js development web server must run concurrently in separate terminal sessions.

**Terminal 1 (Convex Backend):**

```bash
npx convex dev
```

**Terminal 2 (Next.js Development Server):**

```bash
npm run dev
```

Once started, open your browser and navigate to:

`http://localhost:3000`

## Basic Usage

A typical end-to-end issue resolution lifecycle follows these steps:

1. **Citizen Report:** A citizen submits a civic issue with photos, description, and location pin.
2. **Duplicate Check:** The system runs weighted duplicate detection; if unique, the issue enters `Pending` state.
3. **Unit Officer Verification:** A Unit Officer reviews evidence, verifies issue legitimacy, or marks it as `Rejected`.
4. **Field Assignment:** The Unit Officer assigns the verified issue to a Field Officer based on proximity and skill.
5. **Field Resolution:** The Field Officer resolves the problem on-site, uploads photo proof, and updates status to `Pending UO Verification`.
6. **Resolution Review:** The Unit Officer inspects completed work. If approved, status transitions to `Resolved / Closed`. If unsatisfactory, it is sent back for `Rework Required`.
7. **Citizen Feedback:** The citizen receives a notification, confirms resolution, provides rating feedback, and receives gamification points.

## Deployment

The Next.js frontend can be deployed to **Vercel** by connecting your GitHub repository and configuring all environment variables in the project settings.

The production Convex backend functions and schema can be deployed using:

```bash
npx convex deploy
```

Ensure all production API keys, secrets, and environment variables are securely set in Vercel and Convex project dashboards.

## Security and Privacy

* **Role-Based Access Control (RBAC):** Strict separation of privileges across Citizens, Unit Officers, City Administrators, and System Administrators.
* **Protected Administrative Routes:** Server-side session verification for administrative dashboards and API endpoints.
* **Server-Side Validation:** Schema validation on all Convex queries and mutations to prevent unauthorized data access or mutation.
* **Rate Limiting:** Sliding-window rate limiting on public endpoints and issue creation forms to mitigate spam.
* **Audit Logging:** System-wide immutable log recording administrative actions, assignment updates, and status changes.
* **Secret Management:** Stricter separation of public and private keys via environment variable isolation.
* **PII Protection:** Anonymization options for citizen reporters on public issue maps and dashboards.

## Related Mobile Application

Field Officers primarily interact with the platform using the dedicated mobile application. Unit Officers can also manage field workflows on mobile devices.

* **Mobile App Repository:** [CityCareMobile](https://github.com/sagnikdey45/CityCare---Civic-Issue-Reporting---Transparency-Hub)

## Repository

* **Web Application Repository:** [CityCare Web Repository](https://github.com/sagnikdey45/CityCare---Smart-Civic-Issue-Management-Platform)
