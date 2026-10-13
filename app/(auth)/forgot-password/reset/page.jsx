"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";
import {
  getPasswordRecoveryState,
  clearPasswordRecoveryState,
} from "@/lib/passwordRecoveryStorage";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [state, setState] = useState(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const completeReset = useAction(
    api.passwordResetNode.completeForgottenPasswordReset,
  );

  useEffect(() => {
    const s = getPasswordRecoveryState();
    if (!s || s.stage !== "otp_verified" || !s.resetSessionToken) {
      router.replace("/forgot-password");
      return;
    }
    setState(s);
  }, [router]);

  const requirements = [
    { id: "length", label: "At least 8 characters", valid: password.length >= 8 },
    { id: "upper", label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { id: "lower", label: "One lowercase letter", valid: /[a-z]/.test(password) },
    { id: "number", label: "One number", valid: /[0-9]/.test(password) },
    { id: "special", label: "One special character", valid: /[^A-Za-z0-9]/.test(password) }
  ];
  const isValidPassword = requirements.every(r => r.valid);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidPassword) {
      setError("Please ensure your password meets all requirements.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await completeReset({
        resetSessionToken: state.resetSessionToken,
        newPassword: password,
      });

      if (result.success) {
        setSuccess(true);
        clearPasswordRecoveryState();

        // Wait briefly then redirect to appropriate login
        setTimeout(() => {
          if (state.accountRole === "citizen") {
            router.push("/sign-in?reset_success=true");
          } else {
            router.push("/staff/sign-in?reset_success=true"); // staff/admin sign in
          }
        }, 2500);
      }
    } catch (err) {
      console.error(err);
      if (err.message?.includes("PASSWORD_REUSE_NOT_ALLOWED")) {
        setError(
          "Your new password must be different from your current password.",
        );
      } else if (err.message?.includes("RESET_SESSION_EXPIRED")) {
        setError(
          "Your password-reset session has expired. Please start again.",
        );
        setTimeout(() => router.push("/forgot-password"), 2000);
      } else {
        setError(err.message || "Failed to reset password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!state) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#050505] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-400/20 dark:bg-emerald-900/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl"
      >
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 mx-auto bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 text-emerald-500">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                Password Reset!
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Your password has been successfully updated. Redirecting you to
                sign in...
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                  Create new password
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Your new password must be at least 8 characters long and
                  different from your previous password.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={20}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    
                    <AnimatePresence>
                      {password.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }} 
                          animate={{ opacity: 1, height: 'auto' }} 
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl mt-3 border border-slate-200 dark:border-slate-700">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Password Requirements</p>
                            <div className="grid grid-cols-1 gap-2.5">
                              {requirements.map((req) => (
                                <div key={req.id} className="flex items-center gap-2.5 text-sm transition-colors duration-300">
                                  {req.valid ? (
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                  ) : (
                                    <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-700 flex-shrink-0" />
                                  )}
                                  <span className={req.valid ? "text-emerald-700 dark:text-emerald-400 font-medium" : "text-slate-600 dark:text-slate-400"}>
                                    {req.label}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={20}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !isValidPassword || !confirmPassword || password !== confirmPassword}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100 shadow-lg"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
