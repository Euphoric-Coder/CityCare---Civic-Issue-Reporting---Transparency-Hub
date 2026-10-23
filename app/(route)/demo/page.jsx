"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Copy, Check, Shield, MapPin, Users, Wrench, 
  Briefcase, Lock, Key, Monitor, User
} from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";
import Image from "next/image";
import { useRouter } from "next/navigation";

const COMMON_PASSWORD = "CityCare@Demo2026";

const CREDENTIALS = {
  systemAdmin: [
    { label: "System Administrator", email: "system.admin.demo@citycare.local", icon: Monitor }
  ],
  cityAdmins: [
    { city: "Varanasi", email: "cityadmin.varanasi.demo@citycare.local" },
    { city: "Mumbai", email: "cityadmin.mumbai.demo@citycare.local" }
  ],
  unitOfficers: {
    Varanasi: [
      { dept: "Road & Infrastructure", email: "uo.road.varanasi.demo@citycare.local" },
      { dept: "Electricity & Lighting", email: "uo.electricity.varanasi.demo@citycare.local" },
      { dept: "Water Supply", email: "uo.water.varanasi.demo@citycare.local" },
      { dept: "Public Sanitation", email: "uo.sanitation.varanasi.demo@citycare.local" },
      { dept: "Drainage & Sewerage", email: "uo.drainage.varanasi.demo@citycare.local" },
      { dept: "Solid Waste", email: "uo.solid_waste.varanasi.demo@citycare.local" },
      { dept: "Public Health", email: "uo.public_health.varanasi.demo@citycare.local" },
      { dept: "General Maintenance", email: "uo.other.varanasi.demo@citycare.local" }
    ],
    Mumbai: [
      { dept: "Road & Infrastructure", email: "uo.road.mumbai.demo@citycare.local" },
      { dept: "Electricity & Lighting", email: "uo.electricity.mumbai.demo@citycare.local" },
      { dept: "Water Supply", email: "uo.water.mumbai.demo@citycare.local" },
      { dept: "Public Sanitation", email: "uo.sanitation.mumbai.demo@citycare.local" },
      { dept: "Drainage & Sewerage", email: "uo.drainage.mumbai.demo@citycare.local" },
      { dept: "Solid Waste", email: "uo.solid_waste.mumbai.demo@citycare.local" },
      { dept: "Public Health", email: "uo.public_health.mumbai.demo@citycare.local" },
      { dept: "General Maintenance", email: "uo.other.mumbai.demo@citycare.local" }
    ]
  },
  fieldOfficers: {
    Varanasi: [
      { dept: "Road", emails: ["fo.road.01.varanasi.demo@citycare.local", "fo.road.02.varanasi.demo@citycare.local"] },
      { dept: "Electricity", emails: ["fo.electricity.01.varanasi.demo@citycare.local", "fo.electricity.02.varanasi.demo@citycare.local"] },
      { dept: "Water", emails: ["fo.water.01.varanasi.demo@citycare.local", "fo.water.02.varanasi.demo@citycare.local"] },
      { dept: "Sanitation", emails: ["fo.sanitation.01.varanasi.demo@citycare.local", "fo.sanitation.02.varanasi.demo@citycare.local"] },
      { dept: "Drainage", emails: ["fo.drainage.01.varanasi.demo@citycare.local", "fo.drainage.02.varanasi.demo@citycare.local"] },
      { dept: "Solid Waste", emails: ["fo.solid_waste.01.varanasi.demo@citycare.local", "fo.solid_waste.02.varanasi.demo@citycare.local"] },
      { dept: "Public Health", emails: ["fo.public_health.01.varanasi.demo@citycare.local", "fo.public_health.02.varanasi.demo@citycare.local"] },
      { dept: "Other", emails: ["fo.other.01.varanasi.demo@citycare.local", "fo.other.02.varanasi.demo@citycare.local"] }
    ],
    Mumbai: [
      { dept: "Road", emails: ["fo.road.01.mumbai.demo@citycare.local", "fo.road.02.mumbai.demo@citycare.local"] },
      { dept: "Electricity", emails: ["fo.electricity.01.mumbai.demo@citycare.local", "fo.electricity.02.mumbai.demo@citycare.local"] },
      { dept: "Water", emails: ["fo.water.01.mumbai.demo@citycare.local", "fo.water.02.mumbai.demo@citycare.local"] },
      { dept: "Sanitation", emails: ["fo.sanitation.01.mumbai.demo@citycare.local", "fo.sanitation.02.mumbai.demo@citycare.local"] },
      { dept: "Drainage", emails: ["fo.drainage.01.mumbai.demo@citycare.local", "fo.drainage.02.mumbai.demo@citycare.local"] },
      { dept: "Solid Waste", emails: ["fo.solid_waste.01.mumbai.demo@citycare.local", "fo.solid_waste.02.mumbai.demo@citycare.local"] },
      { dept: "Public Health", emails: ["fo.public_health.01.mumbai.demo@citycare.local", "fo.public_health.02.mumbai.demo@citycare.local"] },
      { dept: "Other", emails: ["fo.other.01.mumbai.demo@citycare.local", "fo.other.02.mumbai.demo@citycare.local"] }
    ]
  },
  citizens: {
    Varanasi: [
      "citizen.varanasi.01.demo@citycare.local",
      "citizen.varanasi.02.demo@citycare.local",
      "citizen.varanasi.03.demo@citycare.local"
    ],
    Mumbai: [
      "citizen.mumbai.01.demo@citycare.local",
      "citizen.mumbai.02.demo@citycare.local",
      "citizen.mumbai.03.demo@citycare.local"
    ]
  }
};

const TABS = [
  { id: "admin", label: "Administrators", icon: Shield },
  { id: "uo", label: "Unit Officers", icon: Briefcase },
  { id: "fo", label: "Field Officers", icon: Wrench },
  { id: "citizen", label: "Citizens", icon: Users }
];

export default function DemoCredentialsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("admin");
  const [copiedText, setCopiedText] = useState(null);
  const [selectedCity, setSelectedCity] = useState("Varanasi");

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const CopyButton = ({ text, className = "" }) => (
    <button
      onClick={() => copyToClipboard(text)}
      aria-label={`Copy ${text}`}
      className={`p-2 rounded-xl transition-all duration-200 shrink-0 ${
        copiedText === text 
          ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-sm" 
          : "bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm hover:scale-105"
      } ${className}`}
      title="Copy to clipboard"
    >
      {copiedText === text ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#050505] transition-colors duration-700 selection:bg-emerald-500/30 font-sans">
      {/* Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-400/20 dark:bg-emerald-900/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen transition-opacity duration-700" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-400/20 dark:bg-teal-900/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen transition-opacity duration-700" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/95 dark:bg-[#0a0a0a]/90 border-b border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-md transition-all duration-500">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex justify-between items-center gap-3">
          <div 
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
            onClick={() => router.push("/")}
          >
            <div className="relative overflow-hidden rounded-xl bg-slate-50 dark:bg-black p-1.5 shadow-sm border border-slate-200 dark:border-slate-800 group-hover:shadow-md transition-shadow">
              <Image src="/logo.png" alt="CityCare Logo" width={28} height={28} className="sm:w-8 sm:h-8 relative z-10 group-hover:scale-105 transition-transform duration-500" />
            </div>
            <span className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-700 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent tracking-tight">
              CityCare
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <ModeToggle />
            <button 
              onClick={() => router.push("/sign-in")} 
              className="px-3 sm:px-4 md:px-5 py-2 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-md shadow-emerald-500/20 hover:scale-105 transition-all duration-300 whitespace-nowrap"
            >
              Citizen <span className="hidden sm:inline">Sign In</span>
            </button>
            <button 
              onClick={() => router.push("/staff/sign-in")} 
              className="px-3 sm:px-4 md:px-5 py-2 rounded-xl font-bold text-xs sm:text-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-md hover:scale-105 transition-all duration-300 whitespace-nowrap"
            >
              Admin <span className="hidden sm:inline">Sign In</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold text-xs sm:text-sm mb-4 sm:mb-6 border border-emerald-200 dark:border-emerald-800/50 shadow-sm"
          >
            <Lock size={15} /> Official Demo Credentials
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-3 sm:mb-5"
          >
            Explore <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">CityCare</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 dark:text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2 leading-relaxed"
          >
            Use the pre-configured credentials below to sign in across different roles and experience the platform's civic workflows.
          </motion.p>
        </div>

        {/* Global Password Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-xl mx-auto mb-10 sm:mb-14 bg-white/90 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 group hover:border-emerald-500/50 transition-colors"
        >
          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg text-white shrink-0">
              <Key size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] sm:text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-0.5 sm:mb-1">
                Common Password
              </p>
              <p className="text-lg sm:text-xl md:text-2xl font-mono font-black text-slate-900 dark:text-white break-all select-all">
                {COMMON_PASSWORD}
              </p>
            </div>
          </div>
          <button 
            onClick={() => copyToClipboard(COMMON_PASSWORD)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-2xl sm:rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all duration-200 shrink-0 border border-slate-200/60 dark:border-slate-700/60"
          >
            {copiedText === COMMON_PASSWORD ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
            <span>{copiedText === COMMON_PASSWORD ? "Copied!" : "Copy Password"}</span>
          </button>
        </motion.div>

        {/* Roles Navigation Tabs */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2 sm:gap-2.5 mb-8 sm:mb-10 max-w-xl sm:max-w-none mx-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 px-3 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-2xl font-extrabold text-xs sm:text-sm md:text-base transition-all duration-300 ${
                  isActive 
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl scale-[1.02] sm:scale-105 ring-2 ring-emerald-500/20" 
                    : "bg-white dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm"
                }`}
              >
                <Icon size={17} className="shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-7 md:p-9 shadow-xl"
          >
            {/* Administrators */}
            {activeTab === "admin" && (
              <div className="space-y-8 sm:space-y-12">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2.5">
                    <Monitor className="text-emerald-500 shrink-0" size={22} /> System Admin
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                    {CREDENTIALS.systemAdmin.map((acc, idx) => (
                      <EmailCard 
                        key={idx} 
                        label={acc.label} 
                        email={acc.email} 
                        CopyBtn={CopyButton} 
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2.5">
                    <MapPin className="text-teal-500 shrink-0" size={22} /> City Admins
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                    {CREDENTIALS.cityAdmins.map((acc, idx) => (
                      <EmailCard 
                        key={idx} 
                        label={`${acc.city} City Admin`} 
                        email={acc.email} 
                        CopyBtn={CopyButton} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Unit Officers, Field Officers, Citizens */}
            {(activeTab === "uo" || activeTab === "fo" || activeTab === "citizen") && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-3 sm:gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                    {activeTab === "uo" && <Briefcase className="text-emerald-500 shrink-0" size={22} />}
                    {activeTab === "fo" && <Wrench className="text-emerald-500 shrink-0" size={22} />}
                    {activeTab === "citizen" && <User className="text-emerald-500 shrink-0" size={22} />}
                    <span>{TABS.find(t => t.id === activeTab).label}</span>
                  </h2>

                  <div className="self-start sm:self-auto flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/90 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-inner">
                    {["Varanasi", "Mumbai"].map((city) => (
                      <button
                        key={city}
                        onClick={() => setSelectedCity(city)}
                        className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl font-extrabold text-xs sm:text-sm transition-all duration-200 ${
                          selectedCity === city
                            ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>

                {activeTab === "uo" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                    {CREDENTIALS.unitOfficers[selectedCity].map((acc, idx) => (
                      <EmailCard 
                        key={idx} 
                        label={acc.dept} 
                        email={acc.email} 
                        CopyBtn={CopyButton} 
                      />
                    ))}
                  </div>
                )}

                {activeTab === "fo" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {CREDENTIALS.fieldOfficers[selectedCity].map((dept, idx) => (
                      <div 
                        key={idx} 
                        className="bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-between shadow-sm"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
                            <span className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                              {dept.dept} Department
                            </span>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              {dept.emails.length} Officers
                            </span>
                          </div>

                          <div className="space-y-2.5">
                            {dept.emails.map((email, eIdx) => (
                              <div 
                                key={eIdx} 
                                className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900/90 rounded-xl p-3 shadow-sm border border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-500/40 transition-colors group"
                              >
                                <span className="font-mono text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 break-all select-all flex-1 min-w-0 leading-relaxed">
                                  {email}
                                </span>
                                <CopyButton text={email} />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "citizen" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                    {CREDENTIALS.citizens[selectedCity].map((email, idx) => (
                      <EmailCard 
                        key={idx} 
                        label={`Citizen 0${idx + 1}`} 
                        email={email} 
                        CopyBtn={CopyButton} 
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

/**
 * Responsive Email Card that displays the entire email address without truncation
 */
const EmailCard = ({ label, email, CopyBtn }) => (
  <div className="group flex items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-slate-700/60 hover:border-emerald-500/40 hover:shadow-md transition-all duration-300">
    <div className="flex-1 min-w-0 pr-1">
      <p className="text-[11px] sm:text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="font-mono text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 break-all select-all leading-relaxed">
        {email}
      </p>
    </div>
    <CopyBtn text={email} className="shrink-0" />
  </div>
);
