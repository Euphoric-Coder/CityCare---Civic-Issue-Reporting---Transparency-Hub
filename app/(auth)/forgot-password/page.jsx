"use client";

import React, { useState, Suspense } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, ArrowRight, ShieldCheck, User, ArrowLeft, Loader2, KeyRound } from "lucide-react";
import { savePasswordRecoveryState } from "@/lib/passwordRecoveryStorage";

const ROLES = [
  { id: "citizen", label: "Citizen", icon: User },
  { id: "city_admin", label: "City Admin", icon: ShieldCheck },
  { id: "admin", label: "System Admin", icon: KeyRound },
];

function ForgotPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialRole = searchParams.get("role");
  const initialEmail = searchParams.get("email") || "";
  
  const [email, setEmail] = useState(initialEmail);
  const [role, setRole] = useState(initialRole || "citizen");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // If a role was provided in the URL, we hide the role selector
  const isRoleFixed = !!initialRole;

  const requestOtp = useAction(api.passwordResetNode.requestPasswordResetOtp);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !role) {
      setError("Please select a role and enter your email.");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const result = await requestOtp({ email: normalizedEmail, role });
      
      if (!result.success) {
        if (result.code === "OTP_REQUEST_NOT_FOUND") {
          setError(`No matching ${role === "citizen" ? "citizen" : "admin/staff"} account was found for this email.`);
        } else if (result.code === "PASSWORD_CHANGE_COOLDOWN_ACTIVE") {
          const date = new Date(result.nextPasswordChangeAllowedAt);
          const timeString = date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });
          setError(`You cannot change your password again so soon. Please try again after ${timeString} IST.`);
        } else {
          setError("Failed to request verification code. Please try again.");
        }
        return;
      }

      savePasswordRecoveryState({
        stage: "otp_pending",
        requestId: result.requestId,
        maskedDeliveryEmail: result.maskedDeliveryEmail,
        accountRole: role,
        expiresAt: result.expiresAt,
        resendAllowedAt: result.resendAllowedAt,
      });

      router.push("/forgot-password/verify");
    } catch (err) {
      console.error(err);
      if (err.message && err.message.includes('Could not find public function')) {
        setError('Unable to send the verification code. Please try again.');
      } else {
        setError(err.message || 'An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleLabel = () => {
    return ROLES.find(r => r.id === role)?.label || "CityCare";
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#050505] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-400/20 dark:bg-emerald-900/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl"
      >
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors mb-8 font-medium"
        >
          <ArrowLeft size={16} /> Back to Sign In
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            Reset your password
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {isRoleFixed 
              ? `Enter the email address associated with your ${getRoleLabel()} account.`
              : "Select your account type and enter your email to receive a verification code."
            }
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isRoleFixed && (
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Account Type
              </label>
              <div className="grid grid-cols-1 gap-2">
                {ROLES.map((r) => {
                  const Icon = r.icon;
                  const isSelected = role === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`flex items-center gap-3 w-full p-4 rounded-xl border text-left transition-all ${
                        isSelected 
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 shadow-sm" 
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 bg-transparent"
                      }`}
                    >
                      <Icon size={20} className={isSelected ? "text-emerald-500" : "text-slate-400"} />
                      <span className="font-semibold">{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100 shadow-lg"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Send Verification Code"}
            {!isLoading && <ArrowRight size={20} />}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8fafc] dark:bg-[#050505] flex items-center justify-center p-4"><Loader2 className="animate-spin text-emerald-500" size={40} /></div>}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
