"use client";

import React, { useState, useEffect, useRef } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, KeyRound } from "lucide-react";
import { 
  getPasswordRecoveryState, 
  savePasswordRecoveryState, 
  clearPasswordRecoveryState 
} from "@/lib/passwordRecoveryStorage";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [state, setState] = useState(null);
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  
  const [countdown, setCountdown] = useState(0);
  const [resendCountdown, setResendCountdown] = useState(0);

  const inputRefs = useRef([]);

  const verifyOtp = useAction(api.passwordResetNode.verifyPasswordResetOtp);
  const resendOtp = useAction(api.passwordResetNode.resendPasswordResetOtp);

  // Load state and validate
  useEffect(() => {
    const s = getPasswordRecoveryState();
    if (!s || s.stage !== "otp_pending") {
      router.replace("/forgot-password");
      return;
    }
    setState(s);
  }, [router]);

  // Handle Countdowns
  useEffect(() => {
    if (!state) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      const left = Math.max(0, Math.floor((state.expiresAt - now) / 1000));
      const resendLeft = Math.max(0, Math.floor((state.resendAllowedAt - now) / 1000));
      
      setCountdown(left);
      setResendCountdown(resendLeft);

      if (left <= 0) {
        setError("This verification code has expired. Please request a new one.");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value[value.length - 1];
    setOtp(newOtp);

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (index === 5 && newOtp.every((d) => d !== "")) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (!pasted) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    
    const focusIndex = Math.min(5, pasted.length);
    inputRefs.current[focusIndex]?.focus();

    if (pasted.length === 6) {
      handleVerify(pasted);
    }
  };

  const handleVerify = async (codeToVerify) => {
    const code = codeToVerify || otp.join("");
    if (code.length !== 6 || isLoading || countdown <= 0) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await verifyOtp({
        requestId: state.requestId,
        otp: code,
      });

      if (result.success) {
        savePasswordRecoveryState({
          ...state,
          stage: "otp_verified",
          resetSessionToken: result.resetSessionToken,
          resetSessionExpiresAt: result.resetSessionExpiresAt,
        });
        router.push("/forgot-password/reset");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Invalid verification code.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (isResending || resendCountdown > 0) return;
    setIsResending(true);
    setError("");

    try {
      const result = await resendOtp({
        requestId: state.requestId,
      });

      if (result.success) {
        const newState = {
          ...state,
          requestId: result.requestId,
          expiresAt: result.expiresAt,
          resendAllowedAt: result.resendAllowedAt,
        };
        setState(newState);
        savePasswordRecoveryState(newState);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError(err.message || "Failed to resend code.");
    } finally {
      setIsResending(false);
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
        <button 
          onClick={() => {
            clearPasswordRecoveryState();
            router.replace("/forgot-password");
          }}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors mb-8 font-medium"
        >
          <ArrowLeft size={16} /> Start Again
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
            <KeyRound size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
            Verify your email
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            We sent a 6-digit code to <br/>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{state.maskedDeliveryEmail}</span>
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium text-center">
            {error}
          </div>
        )}

        <div className="flex justify-center gap-2 sm:gap-3 mb-8">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={handlePaste}
              disabled={isLoading || countdown <= 0}
              className="w-12 h-14 text-center text-2xl font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 transition-all"
            />
          ))}
        </div>

        <button
          onClick={() => handleVerify()}
          disabled={isLoading || otp.some(d => d === "") || countdown <= 0}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100 shadow-lg mb-6"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Verify Code"}
        </button>

        <div className="text-center space-y-2">
          {countdown > 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Code expires in <span className="font-bold text-slate-700 dark:text-slate-300">{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</span>
            </p>
          ) : (
            <p className="text-sm text-red-500 font-medium">Code has expired.</p>
          )}

          <button
            onClick={handleResend}
            disabled={resendCountdown > 0 || isResending}
            className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 disabled:opacity-50 disabled:hover:text-emerald-600 transition-colors"
          >
            {isResending ? (
              <span className="flex items-center justify-center gap-2"><Loader2 size={14} className="animate-spin" /> Sending...</span>
            ) : resendCountdown > 0 ? (
              `Resend code in ${Math.floor(resendCountdown / 60)}:${(resendCountdown % 60).toString().padStart(2, '0')}`
            ) : (
              "Didn't receive a code? Resend"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
