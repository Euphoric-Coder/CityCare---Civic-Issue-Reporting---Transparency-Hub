"use client";

import React, { useEffect, useState } from "react";
import { User, Mail, Lock, MapPin, ChevronDown, Check, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { signUp } from "@/lib/auth";
import RedirectPage from "./RedirectPage";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "./ThemeButton";

const LoginPage = () => {
  const router = useRouter();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "citizen",
    city: "",
    state: "",
    region: "",
    wardNo: "",
    latitude: "",
    longitude: "",
  });
  const [error, setError] = useState("");

  // Auto-detect location using browser geolocation + OpenStreetMap
  const fetchLocation = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await res.json();
      const city = data.address.city || data.address.town || data.address.village || "";
      const state = data.address.state || "";
      const region = data.address.suburb || data.address.neighbourhood || "";

      setFormData((prev) => ({
        ...prev,
        city,
        state,
        region,
        latitude: lat.toString(),
        longitude: lon.toString(),
      }));

      toast.success(`📍 Location detected: ${city}, ${state}`);
    } catch (err) {
      toast.error("Unable to fetch location details.");
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by your browser.");
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setLoadingLocation(false);
        await fetchLocation(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        setLoadingLocation(false);
        toast.error("Location access denied or unavailable.");
        console.error(err);
      }
    );
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle sign up
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await signUp({
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      city: formData.city,
      state: formData.state,
      region: formData.region,
      wardNo: formData.wardNo,
      latitude: formData.latitude,
      longitude: formData.longitude,
    });

    if (!res.success) {
      toast.error(res.error || "Sign up failed, please try again.");
      setError(res.error);
      return;
    }

    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (result?.error) {
      toast.error("Login failed, please try again.");
      setError("Login failed, please try again.");
    } else {
      router.push(`/${formData.role}/dashboard`);
    }
  };

  return (
    <RedirectPage>
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
                Join CityCare 🏙️
              </h1>
              <p className="text-16-regular text-slate-600 dark:text-dark-700">
                Report and track civic issues in your area.
              </p>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="shad-input-label block mb-2 text-slate-800 dark:text-white">
                  Full name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-slate-400 dark:text-dark-600" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Sagnik Dey"
                    className="shad-input pl-10 w-full text-slate-900 dark:text-white bg-white dark:bg-dark-400 border border-slate-300 dark:border-dark-500 rounded-lg"
                    required
                  />
                </div>
              </div>

              {/* Role */}
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
                    <span className="capitalize">
                      {formData.role}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-500 dark:text-dark-600 transition-transform ${
                        showRoleDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showRoleDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-dark-400 border border-slate-300 dark:border-dark-500 rounded-lg shadow-lg z-10">
                      <div className="p-3 border-b border-slate-200 dark:border-dark-500">
                        <span className="text-14-medium text-slate-600 dark:text-dark-700">
                          Select Role
                        </span>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {["citizen", "ward_officer", "field_worker", "admin"].map((role) => (
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
                    placeholder="sagnik@citycare.in"
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
                    placeholder="Enter password"
                    className="shad-input pl-10 w-full text-slate-900 dark:text-white bg-white dark:bg-dark-400 border border-slate-300 dark:border-dark-500 rounded-lg"
                    required
                  />
                </div>
              </div>

              {/* Ward No */}
              <div>
                <label className="shad-input-label block mb-2 text-slate-800 dark:text-white">
                  Ward Number
                </label>
                <div className="relative">
                  <Home className="absolute left-3 top-3 w-5 h-5 text-slate-400 dark:text-dark-600" />
                  <input
                    type="text"
                    name="wardNo"
                    value={formData.wardNo}
                    onChange={handleInputChange}
                    placeholder="Enter Ward Number (e.g., 35)"
                    className="shad-input pl-10 w-full text-slate-900 dark:text-white bg-white dark:bg-dark-400 border border-slate-300 dark:border-dark-500 rounded-lg"
                  />
                </div>
              </div>

              {/* Location Detector */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  className="flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-lg w-full transition-colors"
                  disabled={loadingLocation}
                >
                  <MapPin className="mr-2 w-5 h-5" />
                  {loadingLocation ? "Detecting..." : "Detect My Location"}
                </button>
              </div>

              {/* Display location fields (read-only) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  placeholder="City"
                  readOnly
                  className="shad-input w-full text-slate-900 dark:text-white bg-slate-100 dark:bg-dark-500 rounded-lg"
                />
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  placeholder="State"
                  readOnly
                  className="shad-input w-full text-slate-900 dark:text-white bg-slate-100 dark:bg-dark-500 rounded-lg"
                />
              </div>
              <input
                type="text"
                name="region"
                value={formData.region}
                placeholder="Region / Area"
                readOnly
                className="shad-input w-full text-slate-900 dark:text-white bg-slate-100 dark:bg-dark-500 rounded-lg"
              />

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg text-16-semibold transition-colors mt-8"
              >
                Get Started
              </button>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <span className="text-14-regular text-slate-600 dark:text-dark-600">
                Already have an account?{" "}
              </span>
              <button
                onClick={() => router.push("/sign-in")}
                className="text-14-regular text-emerald-600 dark:text-emerald-500 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
              >
                Sign in
              </button>
            </div>

            {/* Back Link */}
            <button
              onClick={() => router.push("/")}
              className="mt-4 text-14-regular text-slate-600 dark:text-dark-600 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>

        {/* Right Side Image */}
        <div className="hidden md:flex flex-1 relative overflow-hidden">
          <img
            src="https://images.pexels.com/photos/7722560/pexels-photo-7722560.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="City civic workers"
            className="side-img w-full max-h-screen object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/40 dark:to-dark-300/20"></div>
        </div>
      </div>
    </RedirectPage>
  );
};

export default LoginPage;
