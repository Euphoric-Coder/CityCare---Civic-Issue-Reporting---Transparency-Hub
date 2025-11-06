import { useState, useEffect } from "react";
import {
  Search,
  PlusCircle,
  Bell,
  User,
  LogOut,
  AlertCircle,
  Calendar,
  TrendingUp,
  CheckCircle,
  Grid,
  List,
} from "lucide-react";
import { getIssues } from "@/lib/mockData";
import { IssueDetailModal } from "@/components/IssueDetailModal";
import { IssueCard } from "@/components/IssueCard";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function CitizenDashboard({
  onReportIssue,
  onNotificationsClick,
  unreadCount,
}) {
  const user = { id: "1" };
  const profile = { full_name: "Josh Hazlewood" };
  const router = useRouter();
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(
    () => {
      if (user) {
        loadIssues();
      }
    },
    [
      // user
    ]
  );

  useEffect(() => {
    filterIssues();
  }, [issues, searchTerm, statusFilter, categoryFilter]);

  async function loadIssues() {
    if (!user) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const data = getIssues()
        .filter((issue) => issue.reportedBy === user.id)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      setIssues(data);
    } catch (error) {
      console.error("Error loading issues:", error);
    } finally {
      setLoading(false);
    }
  }

  function filterIssues() {
    let filtered = [...issues];

    if (searchTerm) {
      filtered = filtered.filter(
        (issue) =>
          issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.ticket.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((issue) => issue.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((issue) => issue.category === categoryFilter);
    }

    setFilteredIssues(filtered);
  }

  async function handleSignOut() {
    try {
      //   await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  const stats = {
    total: issues.length,
    pending: issues.filter((i) => i.status === "pending").length,
    in_progress: issues.filter((i) => i.status === "in_progress").length,
    resolved: issues.filter((i) => i.status === "resolved").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-40 border-b border-gray-100 p-4">
        <div className="max-w-8xl mx-auto flex justify-between items-center">
          {/* Logo + Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <Image src="/logo.png" alt="CityCare Logo" width={36} height={36} />
            <span className="text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
              CityCare
            </span>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/citizen/report")}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-lg font-medium hover:shadow-md hover:scale-105 transition-all"
            >
              <PlusCircle size={18} />
              <span className="hidden sm:inline">Report Issue</span>
            </button>
            <button
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="text-emerald-700" size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all"
              >
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-2 rounded-full">
                  <User size={16} className="text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden md:block">
                  {profile.full_name}
                </span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      {profile.full_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {profile.email}
                    </p>
                  </div>
                  <button
                    onClick={() => console.log("Sign Out")}
                    className="w-full flex items-center px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} className="mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <section className="max-w-8xl mx-auto px-6 py-12">
          {/* Greeting + Description */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent tracking-tight">
              Hello, {profile.full_name.split(" ")[0]}! 👋
            </h1>
            <p className="text-2xl font-semibold text-gray-800 mt-3">
              Welcome back to your CityCare Dashboard
            </p>
            <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto leading-relaxed">
              Track your reported civic issues, monitor progress, and stay
              informed about resolutions — all in one place designed to keep
              your city thriving.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Total Issues */}
            <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-2xl shadow-md border border-emerald-200 hover:shadow-lg hover:-translate-y-4 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-base font-medium">
                    Total Issues
                  </p>
                  <p className="text-4xl font-extrabold text-emerald-700 mt-1">
                    {stats.total}
                  </p>
                </div>
                <div className="bg-emerald-100 p-3 rounded-xl">
                  <TrendingUp className="text-emerald-600" size={28} />
                </div>
              </div>
            </div>

            {/* Pending */}
            <div className="bg-gradient-to-br from-yellow-50 to-white p-8 rounded-2xl shadow-md border border-yellow-200 hover:shadow-lg hover:-translate-y-4 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-base font-medium">Pending</p>
                  <p className="text-4xl font-extrabold text-yellow-600 mt-1">
                    {stats.pending}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-xl">
                  <Calendar className="text-yellow-600" size={28} />
                </div>
              </div>
            </div>

            {/* In Progress */}
            <div className="bg-gradient-to-br from-teal-50 to-white p-8 rounded-2xl shadow-md border border-teal-200 hover:shadow-lg hover:-translate-y-4 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-base font-medium">
                    In Progress
                  </p>
                  <p className="text-4xl font-extrabold text-teal-600 mt-1">
                    {stats.in_progress}
                  </p>
                </div>
                <div className="bg-teal-100 p-3 rounded-xl">
                  <AlertCircle className="text-teal-600" size={28} />
                </div>
              </div>
            </div>

            {/* Resolved */}
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-md border border-green-200 hover:shadow-lg hover:-translate-y-4 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-base font-medium">
                    Resolved
                  </p>
                  <p className="text-4xl font-extrabold text-green-600 mt-1">
                    {stats.resolved}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-xl">
                  <CheckCircle className="text-green-600" size={28} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-4/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search your issues by title, description, or ticket ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="road">Road & Infrastructure</option>
              <option value="lighting">Street Lighting</option>
              <option value="waste">Waste Management</option>
              <option value="water">Water Supply</option>
              <option value="other">Other</option>
            </select>

            <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 transition-all ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                aria-label="Grid view"
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 transition-all ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                aria-label="List view"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredIssues.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-lg">
              <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 text-lg font-medium mb-2">
                {issues.length === 0
                  ? "No issues reported yet"
                  : "No issues found matching your criteria"}
              </p>
              {issues.length === 0 && (
                <button
                  onClick={onReportIssue}
                  className="mt-4 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all font-medium"
                >
                  Report Your First Issue
                </button>
              )}
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {filteredIssues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onClick={() => setSelectedIssue(issue)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
        />
      )}
    </div>
  );
}
