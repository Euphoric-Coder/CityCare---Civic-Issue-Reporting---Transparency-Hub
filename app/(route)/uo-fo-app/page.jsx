"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Download,
  Smartphone,
  Shield,
  Briefcase,
  Wrench,
  MapPin,
  Camera,
  Clock,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  FileText,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info,
  ChevronRight,
  Lock,
  Layers,
  Activity,
  ArrowDownToLine,
  Check,
  Copy,
  Key
} from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";

const APK_DOWNLOAD_URL =
  "https://github.com/Euphoric-Coder/City-Care-Staff-App/releases/download/v1.0.0/citycare-v1.0.0.apk";
const GITHUB_REPO_URL =
  "https://github.com/Euphoric-Coder/CityCare---Staff-App-for-Unit-Officer---Field-Officer";

export default function UoFoAppPage() {
  const router = useRouter();
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const copyDownloadLink = () => {
    navigator.clipboard.writeText(APK_DOWNLOAD_URL);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-600 p-0.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="CityCare Logo"
                  width={34}
                  height={34}
                  className="object-contain"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 dark:from-teal-400 dark:via-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  CityCare
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Staff App
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Unit Officer & Field Officer Hub
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2.5 sm:gap-4">
            <ModeToggle />
            <Link
              href="/demo"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all"
            >
              <Key className="w-4 h-4 text-emerald-500" />
              Demo Credentials
            </Link>
            <Link
              href="/public-dashboard"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all"
            >
              <MapPin className="w-4 h-4 text-teal-500" />
              Public Dashboard
            </Link>
            <a
              href={APK_DOWNLOAD_URL}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 transform hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              <Download className="w-4 h-4 animate-bounce" />
              <span>Download APK</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28">
        {/* Glow and Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl -z-10 pointer-events-none" />
        <div className="absolute -top-24 right-10 w-80 h-80 bg-teal-400/10 dark:bg-teal-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-48 left-10 w-80 h-80 bg-cyan-400/10 dark:bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Version & Platform Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-bold mb-6 shadow-sm">
              <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>CityCare Staff Mobile Application • v1.0.0 APK</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] mb-6">
              Field Operations & Verification{" "}
              <span className="block mt-1 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 dark:from-teal-300 dark:via-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
                for Municipal Officers
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8 sm:mb-10">
              The operational mobile counterpart of the <strong>CityCare Platform</strong>.
              Designed specifically for <strong>Unit Officers (UO)</strong> to triage,
              verify, and supervise municipal complaints, and <strong>Field Officers (FO)</strong> to
              navigate to sites, capture before-and-after photo evidence, and resolve civic issues with
              live GPS location verification.
            </p>

            {/* Call To Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6">
              <a
                href={APK_DOWNLOAD_URL}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-base sm:text-lg text-white bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 hover:from-teal-500 hover:via-emerald-500 hover:to-green-500 shadow-xl shadow-emerald-600/25 hover:shadow-2xl hover:shadow-emerald-600/35 transform hover:-translate-y-1 active:translate-y-0 transition-all duration-200"
              >
                <Download className="w-6 h-6 shrink-0" />
                <span>Download Staff APK (v1.0.0)</span>
              </a>

              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl font-bold text-sm sm:text-base text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <ExternalLink className="w-4 h-4 text-slate-500" />
                <span>View GitHub Repository</span>
              </a>

              <button
                onClick={copyDownloadLink}
                aria-label="Copy APK direct download link"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-4 rounded-2xl font-semibold text-xs sm:text-sm text-slate-600 dark:text-slate-400 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Link Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Direct Link</span>
                  </>
                )}
              </button>
            </div>

            {/* Micro Specs Banner */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Android 8.0+
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Universal Architecture (ARM64 / x86_64)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Live Convex Sync
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Haversine Location Verified
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience / Dual Roles Section */}
      <section className="py-16 bg-white dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3">
              Built for Two Mission-Critical Municipal Roles
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              CityCare seamlessly unifies supervisory administration with physical field resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {/* Unit Officer Card */}
            <div className="relative group bg-gradient-to-b from-teal-500/5 via-slate-50 to-white dark:from-teal-950/20 dark:via-slate-900 dark:to-slate-900/90 rounded-3xl p-6 sm:p-8 border border-teal-200/80 dark:border-teal-800/50 shadow-xl shadow-teal-500/5 hover:border-teal-400 dark:hover:border-teal-600 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-teal-500/10 dark:bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
                  <Briefcase className="w-7 h-7" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 border border-teal-300 dark:border-teal-700">
                  Supervisory Role
                </span>
              </div>

              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
                Unit Officer (UO)
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                Responsible for managing department-specific municipal issues across their assigned city or ward.
                Unit Officers act as the administrative gatekeepers who audit incoming complaints and inspect completed repairs.
              </p>

              <div className="space-y-3.5 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>Complaint Verification:</strong> Triage citizen reports, verify jurisdiction, or reject invalid tickets with stated reasons.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>Officer Dispatch & Reassignment:</strong> Assign issues to qualified Field Officers based on specialization and availability.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>SLA Monitoring & Deadlines:</strong> Monitor SLA countdowns (On Track, Due Soon, Overdue) and trigger critical escalations.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>Evidence & Haversine Proximity Audit:</strong> Inspect before/after photographs and verify that the Field Officer was physically within site coordinates.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>Rework & Approval:</strong> Request rework when repairs fail standards, or give final approval to mark issues resolved.
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Supported Departments: Road, Water, Electricity, Sanitation, Drainage, etc.</span>
              </div>
            </div>

            {/* Field Officer Card */}
            <div className="relative group bg-gradient-to-b from-emerald-500/5 via-slate-50 to-white dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900/90 rounded-3xl p-6 sm:p-8 border border-emerald-200/80 dark:border-emerald-800/50 shadow-xl shadow-emerald-500/5 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Wrench className="w-7 h-7" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  On-Ground Operations
                </span>
              </div>

              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
                Field Officer (FO)
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                The frontline municipal personnel who physically travel to the reported civic locations,
                execute repairs, capture photographic evidence, and submit proofs for supervisory approval.
              </p>

              <div className="space-y-3.5 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>Assigned Work Queue:</strong> View real-time assigned issues ordered by SLA priority, severity, and proximity.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>Site Navigation:</strong> Turn-by-turn routing to the exact GPS coordinates tagged in the citizen complaint.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>Before & After Photographic Evidence:</strong> Native camera integration to capture mandatory pre-repair and post-repair proof.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>Live Location Geostamping:</strong> Automatic capture of device coordinates upon submission for mathematical verification.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>Rework Management:</strong> Receive instant in-app alerts if a Unit Officer requests rework, with notes on required adjustments.
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Hardware Integration: Device Camera, Photo Library & GPS Location</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Lifecycle Workflow */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              End-to-End Operational Lifecycle
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-4 mb-4">
              How the Staff App Powers Civic Resolutions
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              From the initial citizen complaint to verified physical resolution and closure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-6 relative">
            {/* Step 1 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black flex items-center justify-center mb-4">
                1
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Citizen Reports
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Issue is logged on the web portal with photos, description, category, and GPS coordinates.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-teal-200 dark:border-teal-800/60 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 font-black flex items-center justify-center mb-4">
                2
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                UO Triage & Assign
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Unit Officer reviews complaint on mobile, confirms validity, and assigns a Field Officer.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black flex items-center justify-center mb-4">
                3
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                FO On-Site Repair
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Field Officer navigates to site, takes before/after pictures, records GPS, and logs notes.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-cyan-200 dark:border-cyan-800/60 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-black flex items-center justify-center mb-4">
                4
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Audit & Verification
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Unit Officer validates photographic proof and verifies officer presence via Haversine distance.
              </p>
            </div>

            {/* Step 5 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-green-200 dark:border-green-800/60 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 font-black flex items-center justify-center mb-4">
                5
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Closure & Sync
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Issue marked Resolved, citizen receives completion alert, and public dashboard updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Technical Highlights */}
      <section className="py-16 bg-white dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1: Haversine Verification */}
            <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Haversine Proximity Verification
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                The mobile app calculates geographical distance between citizen reported coordinates and the officer&apos;s
                live GPS location upon submission. This prevents false or remote resolution reporting.
              </p>
            </div>

            {/* Feature 2: Realtime SLA Clock */}
            <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Real-Time Dynamic SLA Engine
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Tracks remaining SLA time with three distinct operational states: <em>On Track</em>, <em>Due Soon</em> (within 24-48 hours),
                and <em>Overdue</em>. Ensures high citizen satisfaction and prevents department bottlenecks.
              </p>
            </div>

            {/* Feature 3: Convex Reactive Sync */}
            <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Convex Realtime Database
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                All assignments, status shifts, photographic evidence, and message threads synchronize instantaneously between
                field officers, unit officers, and city administrators without manual refreshing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* APK Installation Guide */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-cyan-500/10 rounded-3xl p-6 sm:p-10 border border-emerald-500/20 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  How to Install the APK on Android
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Quick 5-step sideloading walkthrough
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3.5 bg-white dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <span className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-xs flex items-center justify-center shrink-0">
                  1
                </span>
                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <strong>Download the APK file:</strong> Tap the &quot;Download Staff APK&quot; button to download{" "}
                  <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-emerald-600 dark:text-emerald-400">
                    citycare-v1.0.0.apk
                  </code>.
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-white dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <span className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <strong>Open Downloaded File:</strong> Tap on the download complete notification, or find the file in your device&apos;s{" "}
                  <strong>Files / Downloads</strong> app.
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-white dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <span className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-xs flex items-center justify-center shrink-0">
                  3
                </span>
                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <strong>Allow Unknown Sources (if prompted):</strong> If Android security warns against unknown installs, open{" "}
                  <strong>Settings</strong> from the dialog and toggle on <em>&quot;Allow from this source&quot;</em>.
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-white dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <span className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-xs flex items-center justify-center shrink-0">
                  4
                </span>
                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <strong>Complete Installation:</strong> Tap <strong>Install</strong>. Once completed, tap <strong>Open</strong> to start CityCare Staff.
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-white dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <span className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-xs flex items-center justify-center shrink-0">
                  5
                </span>
                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <strong>Grant Permissions & Sign In:</strong> Allow Camera and Precise Location (GPS) permissions. Sign in using your municipal email or grab a test account from the{" "}
                  <Link href="/demo" className="text-emerald-600 dark:text-emerald-400 font-bold underline">
                    Demo Credentials
                  </Link>{" "}
                  page.
                </div>
              </div>
            </div>

            {/* Bottom Download Banner */}
            <div className="text-center">
              <a
                href={APK_DOWNLOAD_URL}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 shadow-lg shadow-emerald-500/25 transition-all"
              >
                <Download className="w-5 h-5" />
                <span>Download citycare-v1.0.0.apk (Direct Release)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">CityCare Platform</span>
            <span>•</span>
            <span>Civic Issue Reporting &amp; Transparency Hub</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Home
            </Link>
            <Link href="/public-dashboard" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Public Dashboard
            </Link>
            <Link href="/demo" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Demo Credentials
            </Link>
            <Link href="/staff/sign-in" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Web Staff Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
