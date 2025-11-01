import { Home, RotateCcw } from 'lucide-react';

const Navbar = ({ onBackToDashboard, onClear }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 via-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 dark:shadow-emerald-400/20">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700 dark:from-teal-400 dark:via-emerald-400 dark:to-cyan-500 bg-clip-text text-transparent">
              StepTracker
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onBackToDashboard}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-gray-100/80 hover:bg-gray-200/80 dark:bg-gray-800/80 dark:hover:bg-gray-700/80 text-gray-700 dark:text-gray-300 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>

            <button
              onClick={onClear}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-600 hover:from-teal-600 hover:via-emerald-600 hover:to-cyan-700 text-white shadow-lg shadow-emerald-500/30 dark:shadow-emerald-400/20 backdrop-blur-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
