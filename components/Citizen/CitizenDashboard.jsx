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
} from "lucide-react";
import { getIssues } from "@/lib/mockData";
import { IssueDetailModal } from "../IssueDetailModal";
import { IssueCard } from "../IssueCard";
import { useRouter } from "next/navigation";

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
          issue.ticket_id.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-2">
              My Dashboard
            </h1>
            <p className="text-gray-600">Welcome back, {profile?.full_name}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/citizen/report")}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all font-medium"
            >
              <PlusCircle size={20} className="mr-2" />
              Report Issue
            </button>

            <button
              onClick={onNotificationsClick}
              className="relative p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
              aria-label="Notifications"
            >
              <Bell size={20} className="text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
              >
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-full">
                  <User size={16} className="text-white" />
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {profile?.full_name}
                </span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      {profile?.full_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {profile?.email}
                    </p>
                  </div>
                  <button
                    onClick={handleSignOut}
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Issues</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {stats.total}
              </p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <TrendingUp className="text-gray-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-white p-6 rounded-xl shadow-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">
                {stats.pending}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Calendar className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">In Progress</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">
                {stats.in_progress}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <AlertCircle className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-xl shadow-lg border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Resolved</p>
              <p className="text-3xl font-bold text-emerald-600 mt-1">
                {stats.resolved}
              </p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-lg">
              <CheckCircle className="text-emerald-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
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
                className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all font-medium"
              >
                Report Your First Issue
              </button>
            )}
          </div>
        ) : (
          filteredIssues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onClick={() => setSelectedIssue(issue)}
            />
          ))
        )}
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
