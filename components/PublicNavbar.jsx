import { LogIn } from "lucide-react";

export function PublicNavbar() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md shadow-md">
        <div className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-800 bg-clip-text text-transparent">
          CityCare
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all">
          <LogIn size={18} />
          <span className="font-medium">Sign In</span>
        </button>
      </nav>

      {/* Simple placeholder for the dashboard section */}
      <div className="flex flex-col items-center justify-center h-[80vh] text-center px-6">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 to-emerald-800 bg-clip-text text-transparent mb-4">
          Welcome to CityCare
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl">
          Track and view civic issues in your city. Sign in to report and manage
          issues.
        </p>
      </div>
    </div>
  );
}
