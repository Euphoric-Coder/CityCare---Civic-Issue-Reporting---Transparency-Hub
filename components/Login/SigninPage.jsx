"use client";

import React, { useState } from "react";
import { Mail, Lock, ChevronDown, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import RedirectPage from "./Redirect";
import { ModeToggle } from "../ModeToggle";

const SignInPage = () => {
  const router = useRouter();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "citizen",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Step 1️⃣ — Sign in with NextAuth
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      // Step 2️⃣ — Fetch user record from Convex
      const user = await fetchQuery(api.users.getUserByEmail, {
        email: formData.email,
      });

      if (!user) {
        toast.error("User not found in database.");
        await signOut({ redirect: false });
        setError("User not found in database.");
        setLoading(false);
        return;
      }

      // Step 3️⃣ — Check role match
      if (user.role !== formData.role) {
        toast.error("Role mismatch. Please select the correct role.");
        setError("Role mismatch. Please select the correct role.");
        await signOut({ redirect: false });
        setLoading(false);
        return;
      }

      // ✅ Step 4️⃣ — Success → redirect
      toast.success(`Welcome back, ${user.fullName}!`);
      router.push(`/${formData.role}/dashboard`);
    } catch (err) {
      console.error("Error during sign-in:", err);
      toast.error("Something went wrong, please try again.");
      setError("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RedirectPage redirectTo={`/${formData.role}/dashboard`}>
      <div className="min-h-screen flex bg-white dark:bg-dark-300 transition-colors">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
              <Link href={"/"}>
                <div className="flex items-center gap-2">
                  <Image src={"/logo.png"} alt="Logo" width={32} height={32} />
                  <span className="text-24-bold text-slate-900 dark:text-white">
                    CityCare
                  </span>
                </div>
              </Link>
              <ModeToggle />
            </div>

            {/* Welcome Text */}
            <div className="mb-10">
              <h1 className="text-36-bold text-slate-900 dark:text-white mb-2">
                Welcome back 👋
              </h1>
              <p className="text-16-regular text-slate-600 dark:text-dark-700">
                Sign in to manage and track your city issues.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Dropdown */}
              <div>
                <label className="shad-input-label block mb-2 text-slate-800 dark:text-white">
                  Role
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                    className="w-full bg-white dark:bg-dark-400 border border-slate-300 dark:border-dark-500 rounded-lg px-4 py-3 text-left text-slate-900 dark:text-white flex items-center justify-between hover:border-emerald-500 transition-colors"
                  >
                    <span className="capitalize">{formData.role}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-500 dark:text-dark-600 transition-transform ${
                        showRoleDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showRoleDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-dark-400 border border-slate-300 dark:border-dark-500 rounded-lg shadow-lg z-10 overflow-hidden">
                      <div className="p-3 border-b border-slate-200 dark:border-dark-500">
                        <span className="text-14-medium text-slate-600 dark:text-dark-700">
                          Select Role
                        </span>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {[
                          "citizen",
                          "ward_officer",
                          "field_worker",
                          "admin",
                        ].map((role) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, role }));
                              setShowRoleDropdown(false);
                            }}
                            className="w-full p-4 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-dark-500 transition-colors text-left"
                          >
                            <span className="text-16-medium text-slate-900 dark:text-white capitalize">
                              {role.replace("_", " ")}
                            </span>
                            {formData.role === role && (
                              <Check className="w-5 h-5 text-emerald-500" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="shad-input-label block mb-2 text-slate-800 dark:text-white">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400 dark:text-dark-600" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className="shad-input pl-10 w-full text-slate-900 dark:text-white bg-white dark:bg-dark-400 border border-slate-300 dark:border-dark-500 rounded-lg"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="shad-input-label block mb-2 text-slate-800 dark:text-white">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400 dark:text-dark-600" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="shad-input pl-10 w-full text-slate-900 dark:text-white bg-white dark:bg-dark-400 border border-slate-300 dark:border-dark-500 rounded-lg"
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg text-16-semibold transition-colors mt-8"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <span className="text-14-regular text-slate-600 dark:text-dark-600">
                Don&apos;t have an account?{" "}
              </span>
              <button
                onClick={() => router.push("/sign-up")}
                className="text-14-regular text-emerald-600 dark:text-emerald-500 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="hidden md:flex flex-1 relative overflow-hidden">
          <img
            src="https://images.pexels.com/photos/7722560/pexels-photo-7722560.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="City view"
            className="side-img max-h-screen w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/40 dark:to-dark-300/20"></div>
        </div>
      </div>
    </RedirectPage>
  );
};

export default SignInPage;
