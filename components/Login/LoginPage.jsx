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

  // 🌍 Detect user's current location
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setFormData((prev) => ({
          ...prev,
          latitude: lat.toString(),
          longitude: lon.toString(),
        }));
        await fetchLocationFromGoogle(lat, lon);
        setLoadingLocation(false);
      },
      (err) => {
        setLoadingLocation(false);
        toast.error("Location access denied or unavailable.");
        console.error(err);
      }
    );
  };

  // Reverse Geocode using Google Maps API
  const fetchLocationFromGoogle = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${GOOGLE_API_KEY}`
      );
      const data = await res.json();

      console.log("Location data", data);

      if (data.status !== "OK") {
        toast.error("Unable to fetch location details.");
        return;
      }

      const components = data.results[0].address_components;

      const city =
        components.find((c) => c.types.includes("locality"))?.long_name ||
        components.find((c) => c.types.includes("administrative_area_level_2"))
          ?.long_name ||
        "";
      const state =
        components.find((c) => c.types.includes("administrative_area_level_1"))
          ?.long_name || "";
      const region =
        components.find((c) => c.types.includes("sublocality_level_1"))
          ?.long_name ||
        components.find((c) => c.types.includes("neighborhood"))?.long_name ||
        "";
      const wardNo =
        components.find((c) => c.types.includes("ward"))?.long_name || "";

      setFormData((prev) => ({
        ...prev,
        city,
        state,
        region,
        wardNo: wardNo || prev.wardNo,
      }));

      toast.success(`📍 Detected: ${city}, ${state}`);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching location from Google Maps.");
    }
  };

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
                    className="shad-input pl-10 w-full"
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
                    className="shad-input pl-10 w-full"
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
                    className="shad-input pl-10 w-full"
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
                    className="shad-input pl-10 w-full"
                  />
                </div>
              </div>

              {/* Detect Location */}
              <div>
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

              {/* Display location fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  placeholder="City"
                  readOnly
                  className="shad-input w-full bg-slate-100 dark:bg-dark-500"
                />
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  placeholder="State"
                  readOnly
                  className="shad-input w-full bg-slate-100 dark:bg-dark-500"
                />
              </div>
              <input
                type="text"
                name="region"
                value={formData.region}
                placeholder="Region / Area"
                readOnly
                className="shad-input w-full bg-slate-100 dark:bg-dark-500"
              />

              {/* Location Picker Section */}
              <div className="mt-6">
                <h3 className="text-slate-800 dark:text-slate-200 mb-2 text-sm font-semibold">
                  📍 Verify or Adjust Your Location
                </h3>
                <LocationPicker
                  onDetect={(loc) =>
                    setFormData((prev) => ({
                      ...prev,
                      city: loc.city,
                      state: loc.state,
                      region: loc.region,
                      fullAddress: loc.fullAddress,
                      latitude: loc.latitude.toString(),
                      longitude: loc.longitude.toString(),
                    }))
                  }
                />
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
            src="https://images.pexels.com/photos/7722560/pexels-photo-7722560.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="City view"
            className="side-img w-full max-h-screen object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/40 dark:to-dark-300/20"></div>
        </div>
      </div>
    </RedirectPage>
  );
};

export default LoginPage;
