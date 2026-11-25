"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  Check,
  Copy,
  Key,
  GitBranch,
  Workflow,
  Navigation,
  Eye,
  CornerDownRight,
  Radio,
  Wifi,
  Battery,
  Flame,
  Zap,
  CheckCheck,
  Compass,
  Split,
  ChevronDown
} from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";

const APK_DOWNLOAD_URL =
  "https://github.com/Euphoric-Coder/CityCare---Staff-App-for-Unit-Officer---Field-Officer/releases/download/v1.0.0/citycare-v1.0.0.apk";
const GITHUB_REPO_URL =
  "https://github.com/Euphoric-Coder/CityCare---Staff-App-for-Unit-Officer---Field-Officer";

export default function UoFoAppPage() {
  const router = useRouter();
  const [copiedLink, setCopiedLink] = useState(false);
  const [phoneRole, setPhoneRole] = useState("uo"); // 'uo' | 'fo'
  const [activeWorkflowFilter, setActiveWorkflowFilter] = useState("all"); // 'all' | 'primary' | 'rework' | 'escalation'

  const copyDownloadLink = () => {
    navigator.clipboard.writeText(APK_DOWNLOAD_URL);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-500/20 selection:text-emerald-800 dark:selection:text-emerald-200 relative overflow-x-hidden font-sans transition-colors duration-300">
      
      {/* Seamless Ambient Background Layer (Adaptive Light & Dark Mode) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Soft subtle blueprint grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#10b98108_1px,transparent_1px),linear-gradient(to_bottom,#10b98108_1px,transparent_1px)] bg-[size:36px_36px]" />
        
        {/* Ambient radial energy halos */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-teal-400/20 via-emerald-400/15 dark:from-teal-500/20 dark:via-emerald-500/10 to-transparent blur-[140px] rounded-full" />
        <div className="absolute top-[25%] -left-64 w-[600px] h-[600px] bg-cyan-400/15 dark:bg-cyan-600/10 blur-[130px] rounded-full" />
        <div className="absolute top-[55%] -right-64 w-[600px] h-[600px] bg-emerald-400/15 dark:bg-emerald-600/10 blur-[130px] rounded-full" />
        <div className="absolute -bottom-40 left-1/3 w-[800px] h-[500px] bg-teal-400/15 dark:bg-teal-600/15 blur-[140px] rounded-full" />
      </div>

      {/* Floating Glass Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border-b border-slate-200/80 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-500 via-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
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
                <span className="text-xl font-black bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 dark:from-teal-300 dark:via-emerald-300 dark:to-cyan-300 bg-clip-text text-transparent tracking-tight">
                  CityCare
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 dark:border-emerald-500/30 shadow-sm">
                  Staff Client
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Unit Officer &amp; Field Officer Mobile App
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2.5 sm:gap-4">
            <ModeToggle />
            <Link
              href="/demo"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-300 hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all"
            >
              <Key className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              Demo Credentials
            </Link>
            <Link
              href="/public-dashboard"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-300 hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all"
            >
              <MapPin className="w-4 h-4 text-teal-500 dark:text-teal-400" />
              Live Dashboard
            </Link>
            <a
              href={APK_DOWNLOAD_URL}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm text-white dark:text-slate-950 bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 dark:from-teal-300 dark:via-emerald-400 dark:to-green-400 hover:from-teal-500 hover:to-emerald-500 dark:hover:from-teal-200 dark:hover:to-emerald-300 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/35 transform hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Get APK v1.0.0</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section: Dynamic 2-Column with Simulated App Shell */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 text-left space-y-6 sm:space-y-8">
              {/* Release Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-bold shadow-inner">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>CityCare Staff Engine • Android APK v1.0.0 Production</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black tracking-tight leading-[1.08] text-slate-900 dark:text-white">
                Municipal Operations at{" "}
                <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 dark:from-teal-300 dark:via-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  Field Velocity.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-normal">
                The high-performance mobile command client engineered specifically for{" "}
                <strong className="text-emerald-700 dark:text-emerald-300 font-semibold">Unit Officers (UO)</strong> to triage,
                assign, and audit municipal complaints, and{" "}
                <strong className="text-teal-700 dark:text-teal-300 font-semibold">Field Officers (FO)</strong> to navigate to
                sites, capture tamper-evident visual proof, and complete civic repairs backed by live{" "}
                <span className="text-slate-900 dark:text-white font-medium">Haversine GPS geostamping</span>.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <a
                  href={APK_DOWNLOAD_URL}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-base text-white dark:text-slate-950 bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-300 hover:from-teal-500 hover:to-emerald-500 dark:hover:from-emerald-300 dark:hover:to-teal-200 shadow-xl shadow-emerald-600/25 dark:shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/35 transform hover:-translate-y-1 active:translate-y-0 transition-all duration-200"
                >
                  <Download className="w-5 h-5 shrink-0 stroke-[2.5]" />
                  <span>Download Staff APK</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20 dark:bg-slate-950/20 text-white dark:text-slate-950">
                    60 MB
                  </span>
                </a>

                <button
                  onClick={copyDownloadLink}
                  aria-label="Copy direct APK link"
                  className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl font-bold text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 shadow-sm transition-all"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-400">Direct Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      <span>Copy Download Link</span>
                    </>
                  )}
                </button>

                <a
                  href={GITHUB_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-4 rounded-2xl font-semibold text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Source Code</span>
                </a>
              </div>

              {/* Architecture Specs Strip */}
              <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Android 8.0+ Universal</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Reactive Convex State</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Haversine GPS Verification</span>
                </div>
              </div>
            </div>

            {/* Right Column: Simulated Live Smartphone Interactive Showcase */}
            <div className="lg:col-span-5 flex justify-center relative">
              {/* Outer Device Halo Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-cyan-500/15 to-teal-500/20 blur-3xl rounded-[60px] -z-10" />

              {/* Phone Frame Chassis */}
              <div className="w-full max-w-[340px] sm:max-w-[370px] bg-slate-900 rounded-[48px] p-3 sm:p-4 border-[3px] border-slate-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),0_0_35px_rgba(16,185,129,0.15)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(16,185,129,0.15)] backdrop-blur-2xl relative">
                
                {/* Physical Notch / Dynamic Island */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-950 rounded-full flex items-center justify-center gap-2 z-30">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                </div>

                {/* Inner Device Screen */}
                <div className="bg-slate-950 rounded-[38px] overflow-hidden border border-slate-800 flex flex-col min-h-[580px] text-xs">
                  
                  {/* Status Bar */}
                  <div className="pt-3 px-6 pb-2 flex items-center justify-between text-slate-400 text-[11px] font-semibold border-b border-white/5">
                    <span>09:41</span>
                    <div className="flex items-center gap-2">
                      <Wifi className="w-3.5 h-3.5" />
                      <Battery className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  </div>

                  {/* App Navigation Bar with Role Toggle */}
                  <div className="p-4 bg-gradient-to-b from-slate-900/90 to-slate-950 border-b border-white/5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                          <Image src="/logo.png" alt="Logo" width={18} height={18} />
                        </div>
                        <span className="font-bold text-white text-sm">CityCare Staff</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/20">
                        LIVE
                      </span>
                    </div>

                    {/* Interactive Mode Switcher Inside Phone */}
                    <div className="grid grid-cols-2 bg-slate-900 p-1 rounded-xl border border-white/10 text-center">
                      <button
                        onClick={() => setPhoneRole("uo")}
                        className={`py-1.5 rounded-lg font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 ${
                          phoneRole === "uo"
                            ? "bg-emerald-500 text-slate-950 shadow-sm"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <Briefcase className="w-3 h-3" />
                        <span>Unit Officer</span>
                      </button>
                      <button
                        onClick={() => setPhoneRole("fo")}
                        className={`py-1.5 rounded-lg font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 ${
                          phoneRole === "fo"
                            ? "bg-teal-400 text-slate-950 shadow-sm"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <Wrench className="w-3 h-3" />
                        <span>Field Officer</span>
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Screen Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    <AnimatePresence mode="wait">
                      {phoneRole === "uo" ? (
                        <motion.div
                          key="uo-screen"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-3"
                        >
                          {/* Active Verification Card */}
                          <div className="p-3.5 rounded-2xl bg-slate-900 border border-emerald-500/25 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold text-emerald-400">
                                #CC-8492 • Water Supply
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-bold text-[9px] border border-emerald-500/20">
                                Due in 3h 40m
                              </span>
                            </div>
                            <h4 className="font-bold text-slate-100 text-xs">
                              Main Pipeline Rupture &amp; Contamination
                            </h4>
                            <p className="text-[11px] text-slate-400">
                              Assigned: Field Officer Rajesh K. (Water Unit 02)
                            </p>

                            {/* Photo Evidence Thumbnails */}
                            <div className="grid grid-cols-2 gap-2 pt-1">
                              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center">
                                <span className="text-[9px] text-slate-400 block font-semibold mb-1">
                                  📸 Before Repair
                                </span>
                                <div className="h-14 rounded-lg bg-slate-800/80 flex items-center justify-center text-[10px] text-slate-400 font-mono">
                                  Burst Main Photo
                                </div>
                              </div>
                              <div className="p-2 rounded-xl bg-slate-950 border border-emerald-500/30 text-center">
                                <span className="text-[9px] text-emerald-400 block font-semibold mb-1">
                                  📸 After Repair
                                </span>
                                <div className="h-14 rounded-lg bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-[10px] text-emerald-300 font-mono">
                                  Repaired &amp; Sealed
                                </div>
                              </div>
                            </div>

                            {/* Haversine Proximity Check */}
                            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-[10px]">
                              <span className="text-emerald-300 font-semibold flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-emerald-400" />
                                Proximity: 18.4m
                              </span>
                              <span className="text-emerald-400 font-bold">
                                ✅ Geo-Verified
                              </span>
                            </div>
                          </div>

                          {/* Quick Decision Actions */}
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <div className="py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-center text-[11px]">
                              Request Rework
                            </div>
                            <div className="py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-center text-[11px] shadow-sm">
                              Approve Resolution
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="fo-screen"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-3"
                        >
                          {/* Active Task Card */}
                          <div className="p-3.5 rounded-2xl bg-slate-900 border border-teal-500/25 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold text-teal-400">
                                #CC-9104 • Road Repair
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 font-bold text-[9px] border border-teal-500/20">
                                Active Work Ticket
                              </span>
                            </div>
                            <h4 className="font-bold text-slate-100 text-xs">
                              Hazardous Pothole at Godowlia Chowk
                            </h4>

                            {/* Turn by turn routing pill */}
                            <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-between text-[11px]">
                              <span className="text-teal-300 font-semibold flex items-center gap-1.5">
                                <Navigation className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                                Route: 140m away
                              </span>
                              <span className="text-slate-300 font-mono text-[10px]">
                                GPS Locked
                              </span>
                            </div>

                            {/* Steps Checklist */}
                            <div className="space-y-1.5 text-[11px]">
                              <div className="flex items-center gap-2 text-emerald-400">
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                <span>Before Photo Stamped (09:12 AM)</span>
                              </div>
                              <div className="flex items-center gap-2 text-emerald-400">
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                <span>Asphalt Hot-Patch Applied</span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-400">
                                <Camera className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                                <span className="text-amber-300">Ready for After-Work Photo</span>
                              </div>
                            </div>
                          </div>

                          {/* Primary Camera Action Button */}
                          <div className="py-3 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-black text-center text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2">
                            <Camera className="w-4 h-4 text-slate-950" />
                            <span>Capture Proof &amp; Submit</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Simulated Bottom Navigation */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-around text-slate-500 text-[10px]">
                      <span className="text-emerald-400 font-bold flex flex-col items-center gap-0.5">
                        <Activity className="w-3.5 h-3.5" />
                        Queue
                      </span>
                      <span className="flex flex-col items-center gap-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                        Map
                      </span>
                      <span className="flex flex-col items-center gap-0.5">
                        <Clock className="w-3.5 h-3.5" />
                        SLA Log
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CONTINUOUS FLOW: Dual Role Command Hub */}
      <section className="relative py-20 border-t border-slate-200/80 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/25 shadow-sm">
              Role-Specific Operations
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mt-4 mb-4 tracking-tight">
              Two Specialized Operational Lenses
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              Tailored capabilities built to remove friction between desk-based municipal supervision
              and boots-on-the-ground execution.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {/* Unit Officer Lens */}
            <div className="relative group bg-white/80 dark:bg-slate-900/40 rounded-3xl p-7 sm:p-9 border border-teal-500/30 dark:border-teal-500/20 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-none hover:border-teal-500/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-300 shadow-inner">
                  <Briefcase className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-teal-500/10 text-teal-800 dark:text-teal-300 border border-teal-500/30">
                  Supervisory &amp; Audit Authority
                </span>
              </div>

              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
                Unit Officer (UO) Workspace
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                Directly manages department-specific civic tickets across their jurisdiction. Acting as the
                quality verification gate, the Unit Officer approves legitimate complaints, dispatches field personnel,
                and signs off on completed repairs.
              </p>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3 bg-slate-50 dark:bg-white/[0.02] p-3.5 rounded-2xl border border-slate-200/70 dark:border-white/5">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">Complaint Triage &amp; Assessment:</strong> Validate citizen evidence, assess urgency, or reject out-of-scope tickets with transparent justification.
                  </span>
                </div>
                <div className="flex items-start gap-3 bg-slate-50 dark:bg-white/[0.02] p-3.5 rounded-2xl border border-slate-200/70 dark:border-white/5">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">Smart Dispatch &amp; Reassignment:</strong> Assign issues to qualified Field Officers based on specialization (Road, Water, Drainage, Sanitation, Electricity).
                  </span>
                </div>
                <div className="flex items-start gap-3 bg-slate-50 dark:bg-white/[0.02] p-3.5 rounded-2xl border border-slate-200/70 dark:border-white/5">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">Haversine Distance Audit:</strong> Evaluate mathematically computed physical proximity between officer location and incident coordinates.
                  </span>
                </div>
                <div className="flex items-start gap-3 bg-slate-50 dark:bg-white/[0.02] p-3.5 rounded-2xl border border-slate-200/70 dark:border-white/5">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">Rework Loops &amp; Escalation:</strong> Reject substandard repair evidence with required revisions or escalate overdue breaches to City Admin.
                  </span>
                </div>
              </div>
            </div>

            {/* Field Officer Lens */}
            <div className="relative group bg-white/80 dark:bg-slate-900/40 rounded-3xl p-7 sm:p-9 border border-emerald-500/30 dark:border-emerald-500/20 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-none hover:border-emerald-500/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-300 shadow-inner">
                  <Wrench className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                  On-Ground Repair Execution
                </span>
              </div>

              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
                Field Officer (FO) Workspace
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                The frontline operatives executing hands-on municipal interventions. Utilizing mobile hardware
                (camera, high-accuracy GPS), field officers locate issues, log progress, and record verified resolution proof.
              </p>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3 bg-slate-50 dark:bg-white/[0.02] p-3.5 rounded-2xl border border-slate-200/70 dark:border-white/5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">Prioritized Task Queue:</strong> View assigned tickets ordered dynamically by remaining SLA time, priority, and geographical proximity.
                  </span>
                </div>
                <div className="flex items-start gap-3 bg-slate-50 dark:bg-white/[0.02] p-3.5 rounded-2xl border border-slate-200/70 dark:border-white/5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">Turn-by-Turn GPS Guidance:</strong> Direct map navigation straight to the citizen&apos;s reported coordinates to eliminate search delays.
                  </span>
                </div>
                <div className="flex items-start gap-3 bg-slate-50 dark:bg-white/[0.02] p-3.5 rounded-2xl border border-slate-200/70 dark:border-white/5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">Mandatory Dual-Photo Evidence:</strong> In-app camera integration capturing Before-Work and After-Work photographic verification.
                  </span>
                </div>
                <div className="flex items-start gap-3 bg-slate-50 dark:bg-white/[0.02] p-3.5 rounded-2xl border border-slate-200/70 dark:border-white/5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">Automated Geostamping:</strong> Background GPS coordinate capture attached to photo submissions for cryptographic and spatial integrity.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TREE-BASED DESIGN: Operational Lifecycle & Decision Tree */}
      <section className="relative py-24 border-t border-slate-200/80 dark:border-white/5 overflow-hidden transition-colors duration-300">
        
        {/* Subtle Tree Energy Conduit in Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-full bg-gradient-to-b from-teal-500/20 via-emerald-500/30 to-cyan-500/20 pointer-events-none hidden md:block" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-400 bg-cyan-500/10 px-3.5 py-1 rounded-full border border-cyan-500/25 shadow-sm flex items-center justify-center gap-1.5 w-max mx-auto">
              <GitBranch className="w-3.5 h-3.5" />
              Interactive Operational Decision Tree
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mt-4 mb-4 tracking-tight">
              End-to-End Resolution Pipeline
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              Explore how an issue transitions through branches, approval gates, rework loops, and escalations
              governed by the CityCare Staff Mobile Engine.
            </p>

            {/* Filter Pipeline View Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {[
                { id: "all", label: "Complete Pipeline Tree", icon: Workflow },
                { id: "primary", label: "Happy Path (Resolution)", icon: CheckCheck },
                { id: "rework", label: "Rework Branch", icon: RotateCcw },
                { id: "escalation", label: "SLA Escalation Branch", icon: AlertTriangle }
              ].map((btn) => {
                const Icon = btn.icon;
                const isActive = activeWorkflowFilter === btn.id;
                return (
                  <button
                    key={btn.id}
                    onClick={() => setActiveWorkflowFilter(btn.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-lg shadow-emerald-500/20 scale-105"
                        : "bg-white dark:bg-slate-900/70 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/15 shadow-sm"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{btn.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TREE DIAGRAM CONTAINER */}
          <div className="space-y-12 sm:space-y-16 relative">

            {/* ROOT NODE: Citizen Submission */}
            <div className="relative flex flex-col items-center">
              <div className="w-full max-w-xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl shadow-slate-200/50 dark:shadow-2xl relative group hover:border-emerald-500/40 transition-all text-center">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 shadow-sm">
                  Node 01 • Genesis
                </div>
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-3 shadow-inner">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                  Citizen Submits Civic Complaint
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-md mx-auto">
                  Report logged via web portal or mobile app with precise GPS coordinates, photographic proof,
                  and department classification.
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 font-semibold">Status: Pending</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 font-semibold">GPS Locked</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 font-semibold">Media Attached</span>
                </div>
              </div>

              {/* Trunk Connector 1 -> 2 */}
              <div className="w-1.5 h-12 bg-gradient-to-b from-slate-300 to-teal-500 dark:from-slate-700 dark:to-teal-500 my-1 rounded-full" />
            </div>

            {/* NODE 02: Unit Officer Triage & Branching Gate */}
            <div className="relative flex flex-col items-center">
              <div className="w-full max-w-2xl bg-white/95 dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-slate-900/60 backdrop-blur-xl border border-teal-500/30 rounded-3xl p-6 sm:p-8 shadow-xl shadow-teal-500/5 dark:shadow-2xl relative group text-center">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-teal-500/10 dark:bg-teal-500/20 text-[10px] font-black uppercase tracking-wider text-teal-800 dark:text-teal-300 border border-teal-500/30 dark:border-teal-500/40 shadow-sm">
                  Node 02 • Unit Officer Gateway
                </div>
                <div className="w-12 h-12 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-300 mx-auto mb-3 shadow-inner">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                  Unit Officer Triage &amp; Eligibility Audit
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
                  The Unit Officer inspects the incoming ticket on their mobile device. The complaint is evaluated
                  against departmental jurisdiction, feasibility, and duplicate filings.
                </p>

                {/* Sub-branching preview */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  {/* Rejection Branch Card */}
                  {(activeWorkflowFilter === "all" || activeWorkflowFilter === "escalation") && (
                    <div className="p-4 rounded-2xl bg-red-50/80 dark:bg-red-950/20 border border-red-200 dark:border-red-500/30">
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-xs mb-1">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Branch A: Reject / Invalid</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        Ticket marked <code>Rejected</code>. Mandatory justification logged and citizen notified with reason.
                      </p>
                    </div>
                  )}

                  {/* Verification & Dispatch Branch Card */}
                  {(activeWorkflowFilter === "all" || activeWorkflowFilter === "primary") && (
                    <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30">
                      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs mb-1">
                        <CheckCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Branch B: Verified &amp; Assigned</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        Ticket marked <code>Assigned</code>. Assigned to designated Field Officer. Dynamic SLA countdown starts.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Trunk Connector 2 -> 3 */}
              <div className="w-1.5 h-12 bg-gradient-to-b from-teal-500 to-emerald-500 my-1 rounded-full" />
            </div>

            {/* NODE 03: Field Officer Ground Execution & Evidence Capture */}
            <div className="relative flex flex-col items-center">
              <div className="w-full max-w-3xl bg-white/95 dark:bg-slate-900/80 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-500/5 dark:shadow-2xl relative group">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 dark:border-emerald-500/40 shadow-sm">
                  Node 03 • Field Execution Pipeline
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-300 shrink-0 shadow-inner">
                    <Wrench className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                      Field Officer On-Site Resolution &amp; Geostamping
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      Officer receives push dispatch, travels to coordinates, and submits verifiable physical repairs.
                    </p>
                  </div>
                </div>

                {/* Sub-steps in FO work */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/5 space-y-1.5">
                    <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 font-bold text-xs">
                      <Navigation className="w-4 h-4" />
                      <span>Step 3.1: GPS Travel</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Turn-by-turn routing directly to incident pin. Status becomes <code>In Progress</code>.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/5 space-y-1.5">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                      <Camera className="w-4 h-4" />
                      <span>Step 3.2: Dual Photos</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Camera capture of Before-Work and After-Work states with hardware metadata.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/5 space-y-1.5">
                    <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold text-xs">
                      <Radio className="w-4 h-4" />
                      <span>Step 3.3: Geo-Hash</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Live GPS coordinate stamped to submission for instant Haversine distance verification.
                    </p>
                  </div>
                </div>
              </div>

              {/* Trunk Connector 3 -> 4 */}
              <div className="w-1.5 h-12 bg-gradient-to-b from-emerald-500 to-cyan-500 my-1 rounded-full" />
            </div>

            {/* NODE 04: Verification Gate & Multi-Branching Resolution */}
            <div className="relative flex flex-col items-center">
              <div className="w-full max-w-4xl bg-white/95 dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-slate-900/60 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-6 sm:p-9 shadow-xl shadow-cyan-500/5 dark:shadow-2xl relative text-center">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-cyan-500/10 dark:bg-cyan-500/20 text-[10px] font-black uppercase tracking-wider text-cyan-800 dark:text-cyan-300 border border-cyan-500/30 dark:border-cyan-500/40 shadow-sm">
                  Node 04 • The Quality Verification Fork
                </div>

                <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-300 mx-auto mb-3 shadow-inner">
                  <Split className="w-7 h-7" />
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2">
                  Unit Officer Audit &amp; Tri-Branch Decision Fork
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed mb-8">
                  The Unit Officer inspects the submitted photographic evidence and checks if the officer was
                  physically within the geofenced threshold (&le; 100 meters) using the Haversine formula.
                </p>

                {/* 3 Outcome Branches */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  
                  {/* Branch 1: Rework Loop */}
                  <div className={`p-5 rounded-2xl border transition-all ${
                    activeWorkflowFilter === "rework" || activeWorkflowFilter === "all"
                      ? "bg-amber-50/90 dark:bg-amber-950/25 border-amber-300 dark:border-amber-500/40 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/20"
                      : "bg-slate-100/50 dark:bg-slate-950/40 border-slate-200 dark:border-white/5 opacity-50"
                  }`}>
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-black text-xs uppercase tracking-wider mb-2">
                      <RotateCcw className="w-4 h-4" />
                      <span>Branch A: Rework Loop</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                      Substandard Evidence
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                      If photo proof is unclear or repair is incomplete, UO attaches corrective instructions.
                    </p>
                    <div className="text-[11px] font-mono text-amber-800 dark:text-amber-300/90 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                      Ticket &rarr; Loops back to FO Queue
                    </div>
                  </div>

                  {/* Branch 2: Happy Path - Resolved */}
                  <div className={`p-5 rounded-2xl border transition-all ${
                    activeWorkflowFilter === "primary" || activeWorkflowFilter === "all"
                      ? "bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-500/50 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/30"
                      : "bg-slate-100/50 dark:bg-slate-950/40 border-slate-200 dark:border-white/5 opacity-50"
                  }`}>
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-black text-xs uppercase tracking-wider mb-2">
                      <CheckCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Branch B: Approved &amp; Closed</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                      Verified &amp; Sealed
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                      Haversine proximity and photos pass audit. Ticket is marked <code>Resolved</code>.
                    </p>
                    <div className="text-[11px] font-mono text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
                      Syncs to Public Board &amp; Citizen
                    </div>
                  </div>

                  {/* Branch 3: SLA Breach Escalation */}
                  <div className={`p-5 rounded-2xl border transition-all ${
                    activeWorkflowFilter === "escalation" || activeWorkflowFilter === "all"
                      ? "bg-rose-50/90 dark:bg-rose-950/25 border-rose-300 dark:border-rose-500/40 shadow-lg shadow-rose-500/5 ring-1 ring-rose-500/20"
                      : "bg-slate-100/50 dark:bg-slate-950/40 border-slate-200 dark:border-white/5 opacity-50"
                  }`}>
                    <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-black text-xs uppercase tracking-wider mb-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Branch C: SLA Escalation</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                      Deadline Breach
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                      If SLA expires before resolution, system marks <code>Overdue</code> with admin escalation.
                    </p>
                    <div className="text-[11px] font-mono text-rose-800 dark:text-rose-300/90 bg-rose-500/10 p-2 rounded-xl border border-rose-500/20">
                      Escalated to City Admin Drawer
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CONTINUOUS FLOW: Mathematical Engine & Haversine Proof */}
      <section className="relative py-20 border-t border-slate-200/80 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-wider text-teal-700 dark:text-teal-400 bg-teal-500/10 px-3.5 py-1 rounded-full border border-teal-500/25 shadow-sm">
              Empirical Integrity
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mt-4 mb-4 tracking-tight">
              Anti-Fraud Haversine Verification
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              How the CityCare Staff mobile app mathematically guarantees that field officers physically
              arrived at the reported civic incident before submitting completion proof.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Mathematical Formula Card */}
            <div className="lg:col-span-6 bg-white/90 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl p-7 sm:p-9 border border-teal-500/30 dark:border-teal-500/20 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal-300 flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">The Haversine Proximity Law</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Spherical Trigonometric Separation (Earth Radius R = 6,371 km)</p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-emerald-300 space-y-2 overflow-x-auto shadow-inner">
                <p className="text-slate-400 text-[11px] font-sans">1. Angular Haversine Component:</p>
                <div className="p-2 rounded bg-slate-900/70 border border-white/5">
                  a = sin²(Δφ / 2) + cos(φ₁) · cos(φ₂) · sin²(Δλ / 2)
                </div>

                <p className="text-slate-400 text-[11px] font-sans pt-2">2. Central Angular Distance:</p>
                <div className="p-2 rounded bg-slate-900/70 border border-white/5">
                  c = 2 · atan2(√a, √(1 − a))
                </div>

                <p className="text-slate-400 text-[11px] font-sans pt-2">3. Surface Arc Distance Metric:</p>
                <div className="p-2 rounded bg-slate-900/70 border border-white/5 text-teal-300 font-bold">
                  d = R · c &nbsp;&nbsp;[Target: d ≤ 100 meters]
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                When a Field Officer taps <em>&quot;Submit Resolution&quot;</em>, the mobile app captures the device&apos;s
                hardware-verified GPS fix (Latitude, Longitude) and compares it against the citizen&apos;s logged coordinates.
                If the distance d exceeds 100 meters, the submission is automatically flagged for supervisory review.
              </p>
            </div>

            {/* Dynamic SLA Threshold Engine */}
            <div className="lg:col-span-6 bg-white/90 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl p-7 sm:p-9 border border-emerald-500/30 dark:border-emerald-500/20 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Dynamic 3-Tier SLA Engine</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Continuous Municipal Accountability Matrix</p>
                </div>
              </div>

              <div className="space-y-3.5">
                {/* On Track */}
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">State 1: On Track</h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">Ample operational time remaining before resolution window closes.</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/20 px-2.5 py-1 rounded-lg">
                    &gt; 48h Remaining
                  </span>
                </div>

                {/* Due Soon */}
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-amber-500 dark:bg-amber-400 shadow-sm shadow-amber-400/50 animate-pulse" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">State 2: Due Soon</h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">Approaching threshold; highlights in yellow across officer dashboards.</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-500/20 px-2.5 py-1 rounded-lg">
                    &le; 24-48h Remaining
                  </span>
                </div>

                {/* Overdue */}
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-rose-500 dark:bg-rose-400 shadow-sm shadow-rose-400/50" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">State 3: Overdue &amp; Escalated</h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">Deadline breached. Auto-transfers ticket to City Admin Escalation Review.</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-500/20 px-2.5 py-1 rounded-lg">
                    Breached
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TREE-BASED INSTALLATION PIPELINE */}
      <section className="relative py-24 border-t border-slate-200/80 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/25 shadow-sm">
              Sideloading Pipeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-4 mb-3 tracking-tight">
              Android APK Deployment Pipeline
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Follow these simple steps to install the CityCare Staff Client on any Android handheld or tablet.
            </p>
          </div>

          {/* Stepper Pipeline */}
          <div className="relative space-y-6">
            
            {/* Connected Vertical Rail */}
            <div className="absolute top-6 bottom-6 left-6 w-1 bg-gradient-to-b from-emerald-500 via-teal-500 to-cyan-500 hidden sm:block -z-0 rounded-full" />

            {/* Step 1 */}
            <div className="relative flex flex-col sm:flex-row items-start gap-5 bg-white/90 dark:bg-slate-900/60 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-200/40 dark:shadow-none hover:border-emerald-500/40 transition-all z-10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 font-black text-base flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/25">
                01
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">Download the Release APK</h4>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400">
                    60 MB
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  Click the primary download button to save <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 font-mono text-xs">citycare-v1.0.0.apk</code> directly to your mobile device.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col sm:flex-row items-start gap-5 bg-white/90 dark:bg-slate-900/60 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-200/40 dark:shadow-none hover:border-emerald-500/40 transition-all z-10">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white dark:bg-teal-500 dark:text-slate-950 font-black text-base flex items-center justify-center shrink-0 shadow-lg shadow-teal-500/25">
                02
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Open the Downloaded Package</h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  Tap the notification banner or locate the file inside your device&apos;s <strong>Files &rarr; Downloads</strong> directory.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col sm:flex-row items-start gap-5 bg-white/90 dark:bg-slate-900/60 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-200/40 dark:shadow-none hover:border-emerald-500/40 transition-all z-10">
              <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 font-black text-base flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/25">
                03
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Authorize Unknown Sources (Standard Android Prompt)</h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  If prompted by Android security, tap <em>Settings</em> and toggle on <em>&quot;Allow installation from this source&quot;</em>.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative flex flex-col sm:flex-row items-start gap-5 bg-white/90 dark:bg-slate-900/60 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-200/40 dark:shadow-none hover:border-emerald-500/40 transition-all z-10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white dark:bg-emerald-400 dark:text-slate-950 font-black text-base flex items-center justify-center shrink-0 shadow-lg shadow-emerald-400/25">
                04
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Execute Installation &amp; Launch</h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  Tap <strong>Install</strong>. Once completed, tap <strong>Open</strong> to launch CityCare Staff.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="relative flex flex-col sm:flex-row items-start gap-5 bg-white/90 dark:bg-slate-900/60 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-200/40 dark:shadow-none hover:border-emerald-500/40 transition-all z-10">
              <div className="w-12 h-12 rounded-2xl bg-green-600 text-white dark:bg-green-400 dark:text-slate-950 font-black text-base flex items-center justify-center shrink-0 shadow-lg shadow-green-400/25">
                05
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Sign In with Officer Credentials</h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  Grant Camera and Location permissions. Sign in using your municipal account or select one from our{" "}
                  <Link href="/demo" className="text-emerald-700 dark:text-emerald-400 font-bold underline hover:text-emerald-600 dark:hover:text-emerald-300">
                    Pre-Provisioned Demo Credentials
                  </Link>.
                </p>
              </div>
            </div>

          </div>

          {/* Quick Download Banner Below Pipeline */}
          <div className="mt-12 text-center">
            <a
              href={APK_DOWNLOAD_URL}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-base text-white dark:text-slate-950 bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 dark:from-teal-300 dark:via-emerald-400 dark:to-green-400 hover:from-teal-500 hover:to-emerald-500 dark:hover:from-teal-200 dark:hover:to-emerald-300 shadow-xl shadow-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/30 transform hover:-translate-y-1 transition-all"
            >
              <Download className="w-5 h-5" />
              <span>Download citycare-v1.0.0.apk Now</span>
            </a>
          </div>
        </div>
      </section>

      {/* CONTINUOUS FLOW: Pre-Provisioned Demo Bridge */}
      <section className="relative py-16 border-t border-slate-200/80 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50/60 to-cyan-50 dark:from-emerald-950/40 dark:via-slate-900/60 dark:to-cyan-950/40 border border-emerald-300/80 dark:border-emerald-500/30 backdrop-blur-2xl shadow-xl shadow-emerald-500/5 dark:shadow-none flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-500/20">
                <Key className="w-3.5 h-3.5" />
                <span>Instant Testing Accounts</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Need Officer Logins for Evaluation?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
                Explore pre-seeded credentials for Unit Officers and Field Officers across multiple departments
                (Water, Roads, Electricity, Sanitation, Drainage) in Varanasi and Mumbai.
              </p>
            </div>

            <Link
              href="/demo"
              className="px-6 py-3.5 rounded-2xl font-extrabold text-sm text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-700 dark:border-slate-600 hover:border-emerald-500 shrink-0 shadow-md transition-all flex items-center gap-2"
            >
              <span>Explore Demo Credentials</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Continuous Unified Footer */}
      <footer className="py-12 border-t border-slate-200/80 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400 bg-white/40 dark:bg-transparent transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-300">CityCare Municipal Platform</span>
            <span>•</span>
            <span>Staff Client (Unit Officer &amp; Field Officer)</span>
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
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
