"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  MapPin,
  ChevronDown,
  Check,
  Home,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { signUp } from "@/lib/auth";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import RedirectPage from "./Redirect";
import { ModeToggle } from "../ModeToggle";
import LocationPicker from "./LocationPicker";

const GOOGLE_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
  process.env.GOOGLE_MAPS_API_KEY;

const LoginPage = () => {
  const router = useRouter();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "citizen",
    city: "",
    state: "",
    region: "",
    postal: "",
    wardNo: "",
    fullAddress: "",
    latitude: "",
    longitude: "",
  });
  const [error, setError] = useState("");

  // Input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Sign Up handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    console.log({
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      city: formData.city,
      state: formData.state,
      region: formData.region,
      fullAddress: formData.fullAddress,
      wardNo: formData.wardNo,
      latitude: formData.latitude,
      longitude: formData.longitude,
    });

    // const res = await signUp({
    //   fullName: formData.fullName,
    //   email: formData.email,
    //   password: formData.password,
    //   role: formData.role,
    //   city: formData.city,
    //   state: formData.state,
    //   region: formData.region,
    //   wardNo: formData.wardNo,
    //   latitude: formData.latitude,
    //   longitude: formData.longitude,
    // });

    // if (!res.success) {
    //   toast.error(res.error || "Sign up failed. Please try again.");
    //   setError(res.error);
    //   return;
    // }

    // const result = await signIn("credentials", {
    //   email: formData.email,
    //   password: formData.password,
    //   redirect: false,
    // });

    // if (result?.error) {
    //   toast.error("Login failed. Please try again.");
    //   setError("Login failed. Please try again.");
    // } else {
    //   router.push(`/${formData.role}/dashboard`);
    // }
  };

  return (
    <RedirectPage>
      <div className="min-h-screen flex bg-white dark:bg-dark-300 transition-colors">
        {/* Left Section */}
        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-md">
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

            {/* Welcome */}
            <div className="mb-10">
              <h1 className="text-36-bold text-slate-900 dark:text-white mb-2">
                Welcome to CityCare 🏙️
              </h1>
              <p className="text-16-regular text-slate-600 dark:text-dark-700">
                Empowering citizens for a cleaner, smarter city.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="shad-input-label mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Sagnik Dey"
                    className="shad-input pl-10 w-full text-slate-900 dark:text-white bg-white dark:bg-dark-400 border border-slate-300 dark:border-dark-500 rounded-2xl"
                    required
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="shad-input-label mb-2">Role</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                    className="w-full bg-white dark:bg-dark-400 border border-slate-300 dark:border-dark-500 rounded-lg px-4 py-3 text-left flex items-center justify-between"
                  >
                    <span className="capitalize">{formData.role}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-500 transition-transform ${
                        showRoleDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showRoleDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-dark-400 border border-slate-300 dark:border-dark-500 rounded-lg shadow-lg z-10">
                      {["citizen", "ward_officer", "field_worker", "admin"].map(
                        (role) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, role }));
                              setShowRoleDropdown(false);
                            }}
                            className="w-full p-4 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-dark-500 transition-colors text-left"
                          >
                            <span className="capitalize">
                              {role.replace("_", " ")}
                            </span>
                            {formData.role === role && (
                              <Check className="w-5 h-5 text-emerald-500" />
                            )}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="shad-input-label mb-2">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className="shad-input pl-10 w-full text-slate-900 dark:text-white bg-white dark:bg-dark-400 border border-slate-300 dark:border-dark-500 rounded-2xl"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="shad-input-label mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter password"
                    className="shad-input pl-10 w-full text-slate-900 dark:text-white bg-white dark:bg-dark-400 border border-slate-300 dark:border-dark-500 rounded-2xl"
                    required
                  />
                </div>
              </div>

              {/* Ward No */}
              <div>
                <label className="shad-input-label mb-2">Ward Number</label>
                <div className="relative">
                  <Home className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="wardNo"
                    value={formData.wardNo}
                    onChange={handleInputChange}
                    placeholder="Enter Ward Number (if known)"
                    className="shad-input pl-10 w-full text-slate-900 dark:text-white bg-white dark:bg-dark-400 border border-slate-300 dark:border-dark-500 rounded-2xl"
                  />
                </div>
              </div>

              {/* Location Detection Section */}
              <div className="mt-6">
                <LocationPicker
                  onDetect={(loc) => {
                    setFormData((prev) => ({
                      ...prev,
                      city: loc.city,
                      state: loc.state,
                      region: loc.region,
                      latitude: loc.latitude.toString(),
                      longitude: loc.longitude.toString(),
                      fullAddress: loc.detectedAddress,
                      postal: loc.postal,
                    }));
                  }}
                />
              </div>

              {/* OR Divider */}
              <div className="relative flex items-center justify-center my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-300 dark:border-dark-500"></span>
                </div>
                <div className="relative px-4 bg-white dark:bg-dark-300">
                  <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    OR
                  </span>
                </div>
              </div>

              {/* Display location fields */}
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="shad-input-label mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="shad-input p-3 w-full text-slate-900 dark:text-white bg-white dark:bg-dark-400 border border-slate-300 dark:border-dark-500 rounded-2xl"
                    />
                  </div>
                  <div>
                    <label className="shad-input-label mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="State"
                      className="shad-input p-3 w-full text-slate-900 dark:text-white bg-white dark:bg-dark-400 border border-slate-300 dark:border-dark-500 rounded-2xl"
                    />
                  </div>
                </div>
                <div>
                  <label className="shad-input-label mb-2">Region</label>
                  <input
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    placeholder="Region / Area"
                    className="shad-input p-3 w-full text-slate-900 dark:text-white bg-white dark:bg-dark-400 border border-slate-300 dark:border-dark-500 rounded-2xl"
                  />
                </div>
                <div>
                  <label className="shad-input-label mb-2">Postal Code</label>
                  <input
                    type="text"
                    name="postal"
                    value={formData.postal}
                    onChange={handleInputChange}
                    placeholder="Postal Code"
                    className="shad-input p-3 w-full text-slate-900 dark:text-white bg-white dark:bg-dark-400 border border-slate-300 dark:border-dark-500 rounded-2xl"
                  />
                </div>
                <div>
                  <label className="shad-input-label mb-2">Full Address</label>
                  <textarea
                    type="text"
                    name="fullAddress"
                    value={formData.fullAddress}
                    onChange={handleInputChange}
                    placeholder="Full Address"
                    className="p-3 w-full text-slate-900 dark:text-white bg-white dark:bg-dark-400 border border-slate-300 dark:border-dark-500 rounded-2xl"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg text-16-semibold transition-colors mt-8"
              >
                Get Started
              </button>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>

            {/* Footer Links */}
            <div className="mt-6 text-center">
              <span className="text-14-regular text-slate-600 dark:text-dark-600">
                Already have an account?{" "}
              </span>
              <button
                onClick={() => router.push("/sign-in")}
                className="text-14-regular text-emerald-600 hover:text-emerald-500 transition-colors"
              >
                Sign in
              </button>
            </div>

            <button
              onClick={() => router.push("/")}
              className="mt-4 text-14-regular text-slate-600 hover:text-slate-900 transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="hidden md:flex flex-1 relative overflow-hidden">
          <img
            src="/signup.jpeg"
            alt="City view"
            className="side-img dark:hidden"
          />
          <img
            src="/signup-dark.jpg"
            alt="City view"
            className="side-img dark:block hidden"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/40 dark:to-dark-300/20"></div>
        </div>
      </div>
    </RedirectPage>
  );
};

export default LoginPage;
