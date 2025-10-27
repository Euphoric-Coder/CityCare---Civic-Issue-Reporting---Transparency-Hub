"use client";

import { useState } from "react";
import { MapPin, Menu, X, LogIn, Shield, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export function PublicNavbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userName = session?.user?.name?.split(" ")[0] || "User";

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-40 border-b border-gray-100 dark:bg-dark-300/90 dark:border-dark-500 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo + Title */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/logo.png"
              alt="CityCare Logo"
              width={40}
              height={40}
              priority
            />
            <span className="ml-3 text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-800 bg-clip-text text-transparent">
              CityCare
            </span>
          </Link>

          {/* Desktop Buttons */}
          <div className="hidden md:flex gap-4 items-center space-x-3">
            {session ? (
              <>
                {/* User Greeting */}
                <div className="flex items-center px-4 py-2 text-gray-800 dark:text-gray-100 rounded-lg bg-gray-50 dark:bg-dark-400 border border-gray-200 dark:border-dark-500 shadow-sm">
                  <User size={18} className="mr-2 text-emerald-600" />
                  <span className="font-medium">Hi, {userName}</span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={() => signOut({ callbackUrl: "/sign-in" })}
                  className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  <LogOut size={18} className="inline-block mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Admin Dashboard */}
                <button
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all font-medium"
                  onClick={() => router.push("/admin")}
                >
                  <Shield size={20} className="mr-2" />
                  Admin Dashboard
                </button>

                {/* Sign In */}
                <button
                  className="ml-2 px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-700 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all"
                  onClick={() => signIn()}
                >
                  <LogIn size={18} className="inline-block mr-2" />
                  Sign In
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 dark:text-gray-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-dark-500">
            <div className="space-y-2">
              {session ? (
                <>
                  <div className="flex justify-center items-center gap-2 text-gray-700 dark:text-gray-200 font-medium">
                    <User size={18} className="text-emerald-600" />
                    Hi, {userName}
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex justify-center items-center px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all font-medium"
                  >
                    <LogOut size={20} className="mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push("/admin")}
                    className="w-full flex justify-center items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all font-medium"
                  >
                    <Shield size={20} className="mr-2" />
                    Admin Dashboard
                  </button>

                  <button
                    onClick={() => {
                      signIn();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex justify-center text-left px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                  >
                    <LogIn size={18} className="mr-2" />
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
