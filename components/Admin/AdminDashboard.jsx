import { useEffect, useState } from "react";
import {
  Search,
  Shield,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  MessageSquare,
  Target,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  User,
  MapPin,
  Calendar,
  BarChart3,
  TrendingUp,
  Activity,
  Award,
  LogOut,
  Bell,
  RefreshCw,
  Mail,
  Zap,
  AlertCircle,
  UserCheck,
  Eye,
} from "lucide-react";
import { getIssues, mockUsers } from "@/lib/mockData";
import { AdminIssueModal } from "./AdminIssueModal";
import { AdminMessageModal } from "./AdminMessageModal";
import { AdminReassignModal } from "./AdminReassignModal";
import { MessagesCenter } from "../MessageCenter";
// import SLAMonitoringDashboard from './SLAMonitoringDashboard';
// import SLAAnalyticsDashboard from './SLAAnalyticsDashboard';
// import ComprehensiveAuditLog from './ComprehensiveAuditLog';

export function AdminDashboard() {
  const user = { id: "2" };
  const profile = { full_name: "Sagnik Dey", role: "Administrator" };
  const [activeTab, setActiveTab] = useState("officers");
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [messageOfficer, setMessageOfficer] = useState(null);
  const [messageIssues, setMessageIssues] = useState([]);
  const [reassignIssue, setReassignIssue] = useState(null);

  const [officerFilter, setOfficerFilter] = useState("all");
  const [workloadFilter, setWorkloadFilter] = useState("all");
  const [officerSearchTerm, setOfficerSearchTerm] = useState("");
  const [expandedOfficers, setExpandedOfficers] = useState(new Set());

  const [assignmentOfficerFilter, setAssignmentOfficerFilter] = useState("all");
  const [assignmentSearchTerm, setAssignmentSearchTerm] = useState("");
  const [expandedAssignmentOfficers, setExpandedAssignmentOfficers] = useState(
    new Set(),
  );
  const [officerIssueSearchTerms, setOfficerIssueSearchTerms] = useState({});
  const [officerIssueFilters, setOfficerIssueFilters] = useState({});

  useEffect(() => {
    loadIssues();
  }, []);

  useEffect(() => {
    filterIssues();
  }, [issues, searchTerm, statusFilter, categoryFilter]);

  async function loadIssues() {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const data = getIssues().sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
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
          issue.ticket_id.toLowerCase().includes(searchTerm.toLowerCase()),
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

  function handleIssueUpdated(issueId, updates) {
    setIssues(
      issues.map((issue) =>
        issue.id === issueId ? { ...issue, ...updates } : issue,
      ),
    );
    setSelectedIssue(null);
  }

  function handleSendMessage(officerId, message, issueIds) {
    if (!user) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      from_user_id: user.id,
      to_user_id: officerId,
      message,
      createdAt: new Date().toISOString(),
      read: false,
      issue_ids: issueIds,
    };

    const stored = localStorage.getItem("messages");
    const messages = stored ? JSON.parse(stored) : [];
    messages.push(newMessage);
    localStorage.setItem("messages", JSON.stringify(messages));

    alert(
      `Message sent successfully!\n\nThe officer will be notified and can reply from their Messages Center.`,
    );
    setMessageOfficer(null);
    setMessageIssues([]);
  }

  function handleReassign(issueId, newOfficerId, reason) {
    const issue = issues.find((i) => i.id === issueId);
    const oldOfficer = officers.find((o) => o.id === issue?.assignedTo);
    const newOfficer = officers.find((o) => o.id === newOfficerId);

    if (oldOfficer && newOfficer && oldOfficer.role !== newOfficer.role) {
      alert(
        `Invalid reassignment!\n\n${oldOfficer.role === "unit_officer" ? "Unit Officers" : "Field Officers"} can only be reassigned to other ${oldOfficer.role === "unit_officer" ? "Unit Officers" : "Field Officers"}.`,
      );
      return;
    }

    setIssues(
      issues.map((i) =>
        i.id === issueId
          ? {
              ...i,
              assignedTo: newOfficerId,
              updated_at: new Date().toISOString(),
            }
          : i,
      ),
    );

    console.log("Reassignment recorded:", {
      issueId,
      from: oldOfficer?.full_name,
      to: newOfficer?.full_name,
      reason,
      timestamp: new Date().toISOString(),
      roleMatch: oldOfficer?.role === newOfficer?.role,
    });

    alert(
      `Issue reassigned successfully!\n\nFrom: ${oldOfficer?.full_name || "Unassigned"} (${oldOfficer?.role === "unit_officer" ? "Unit Officer" : "Field Officer"})\nTo: ${newOfficer?.full_name} (${newOfficer?.role === "unit_officer" ? "Unit Officer" : "Field Officer"})\nReason: ${reason}\n\nBoth officers have been notified.`,
    );
    setReassignIssue(null);
    setSelectedIssue(null);
  }

  function openMessageModal(officer, officerIssues) {
    setMessageOfficer(officer);
    setMessageIssues(officerIssues);
  }

  function handleRevoke(issueId, reason) {
    const issue = issues.find((i) => i.id === issueId);
    const officer = officers.find((o) => o.id === issue?.assignedTo);

    setIssues(
      issues.map((i) =>
        i.id === issueId
          ? {
              ...i,
              assignedTo: null,
              status: "pending",
              updated_at: new Date().toISOString(),
            }
          : i,
      ),
    );

    console.log("Assignment revoked:", {
      issueId,
      from: officer?.full_name,
      reason,
      timestamp: new Date().toISOString(),
    });

    alert(
      `Assignment revoked successfully!\n\nFrom: ${officer?.full_name}\nReason: ${reason}\n\nThe officer has been notified and the issue is now unassigned.`,
    );
    setSelectedIssue(null);
  }

  const stats = {
    total: issues.length,
    pending: issues.filter((i) => i.status === "pending").length,
    in_progress: issues.filter((i) => i.status === "in_progress").length,
    resolved: issues.filter((i) => i.status === "resolved").length,
    escalated: issues.filter((i) => i.internal_status === "escalated_to_admin")
      .length,
  };

  const officers = mockUsers.filter(
    (u) => u.role === "unit_officer" || u.role === "field_officer",
  );

  const officerWorkload = officers.map((officer) => {
    const assignedIssues = issues.filter((i) => i.assignedTo === officer.id);
    const pending = assignedIssues.filter((i) => i.status === "pending").length;
    const inProgress = assignedIssues.filter(
      (i) => i.status === "in_progress",
    ).length;
    const resolved = assignedIssues.filter(
      (i) => i.status === "resolved",
    ).length;
    const total = assignedIssues.length;
    const avgResolutionTime =
      total > 0 ? Math.floor(Math.random() * 48) + 24 : 0;
    const efficiencyScore =
      total > 0 ? Math.round((resolved / total) * 100) : 0;

    let workloadStatus = "balanced";
    if (total > 15) workloadStatus = "overloaded";
    else if (total < 5) workloadStatus = "underutilized";

    return {
      officer,
      total,
      pending,
      inProgress,
      resolved,
      issues: assignedIssues,
      completionRate: efficiencyScore,
      avgResolutionTime,
      workloadStatus,
      rating: (Math.random() * 2 + 3).toFixed(1),
    };
  });

  const filteredOfficers = officerWorkload.filter((ow) => {
    if (officerFilter !== "all" && ow.officer.role !== officerFilter)
      return false;
    if (workloadFilter !== "all" && ow.workloadStatus !== workloadFilter)
      return false;
    if (
      officerSearchTerm &&
      !ow.officer.full_name
        .toLowerCase()
        .includes(officerSearchTerm.toLowerCase())
    )
      return false;
    return true;
  });

  const toggleOfficerExpand = (officerId) => {
    const newExpanded = new Set(expandedOfficers);
    if (newExpanded.has(officerId)) {
      newExpanded.delete(officerId);
    } else {
      newExpanded.add(officerId);
    }
    setExpandedOfficers(newExpanded);
  };

  const toggleAssignmentOfficerExpand = (officerId) => {
    const newExpanded = new Set(expandedAssignmentOfficers);
    if (newExpanded.has(officerId)) {
      newExpanded.delete(officerId);
    } else {
      newExpanded.add(officerId);
    }
    setExpandedAssignmentOfficers(newExpanded);
  };

  const getFilteredOfficerIssues = (officerId, issues) => {
    const searchTerm = officerIssueSearchTerms[officerId] || "";
    const filters = officerIssueFilters[officerId];

    let filtered = [...issues];

    if (searchTerm) {
      filtered = filtered.filter(
        (issue) =>
          issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.ticket_id.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filters?.status && filters.status !== "all") {
      filtered = filtered.filter((issue) => issue.status === filters.status);
    }

    if (filters?.severity && filters.severity !== "all") {
      filtered = filtered.filter(
        (issue) => issue.severity === filters.severity,
      );
    }

    return filtered;
  };

  const assignedIssues = issues.filter((i) => i.assignedTo);
  const overdueIssues = assignedIssues.filter((i) => {
    const daysSince = Math.floor(
      (Date.now() - new Date(i.createdAt).getTime()) / (1000 * 60 * 60 * 24),
    );
    return daysSince > 7 && i.status !== "resolved";
  });

  const filteredAssignmentOfficers = officerWorkload.filter((ow) => {
    if (
      assignmentOfficerFilter !== "all" &&
      ow.officer.role !== assignmentOfficerFilter
    )
      return false;
    if (
      assignmentSearchTerm &&
      !ow.officer.full_name
        .toLowerCase()
        .includes(assignmentSearchTerm.toLowerCase())
    )
      return false;
    return true;
  });

  async function handleSignOut() {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <nav className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 rounded-xl shadow-lg">
                    <Shield className="text-white" size={20} />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent tracking-tight">
                    CityCare Admin
                  </h1>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    System Control Panel
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadIssues}
                className="group flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                <RefreshCw
                  size={16}
                  className="group-hover:rotate-180 transition-transform duration-500"
                />
                <span className="hidden sm:inline font-semibold text-sm">
                  Refresh
                </span>
              </button>

              <div className="relative">
                <button className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                  <Bell size={18} />
                </button>
                {stats.escalated > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {stats.escalated}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 pl-3 border-l border-slate-300 dark:border-slate-700">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {profile?.full_name || "Admin"}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 capitalize">
                    {profile?.role || "Administrator"}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  {(profile?.full_name || "A").charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-850 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-400/20 to-transparent rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <BarChart3
                    size={20}
                    className="text-slate-600 dark:text-slate-300"
                  />
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold mb-1">
                Total Issues
              </p>
              <p className="text-4xl font-black text-slate-900 dark:text-white">
                {stats.total}
              </p>
              <div className="mt-4 h-1.5 bg-gradient-to-r from-slate-400 to-slate-200 dark:from-slate-600 dark:to-slate-700 rounded-full"></div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-amber-200 dark:border-amber-800 hover:border-amber-300 dark:hover:border-amber-700 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-400/20 to-transparent rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-800/40 rounded-lg">
                  <Clock
                    size={20}
                    className="text-amber-600 dark:text-amber-400"
                  />
                </div>
              </div>
              <p className="text-amber-800 dark:text-amber-300 text-sm font-semibold mb-1">
                Pending
              </p>
              <p className="text-4xl font-black text-amber-900 dark:text-amber-100">
                {stats.pending}
              </p>
              <div className="mt-4 h-1.5 bg-gradient-to-r from-amber-400 to-amber-200 dark:from-amber-600 dark:to-amber-800 rounded-full"></div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-800/40 rounded-lg">
                  <Activity
                    size={20}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>
              </div>
              <p className="text-blue-800 dark:text-blue-300 text-sm font-semibold mb-1">
                In Progress
              </p>
              <p className="text-4xl font-black text-blue-900 dark:text-blue-100">
                {stats.in_progress}
              </p>
              <div className="mt-4 h-1.5 bg-gradient-to-r from-blue-400 to-blue-200 dark:from-blue-600 dark:to-blue-800 rounded-full"></div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-emerald-200 dark:border-emerald-800 hover:border-emerald-300 dark:hover:border-emerald-700 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-800/40 rounded-lg">
                  <CheckCircle
                    size={20}
                    className="text-emerald-600 dark:text-emerald-400"
                  />
                </div>
              </div>
              <p className="text-emerald-800 dark:text-emerald-300 text-sm font-semibold mb-1">
                Resolved
              </p>
              <p className="text-4xl font-black text-emerald-900 dark:text-emerald-100">
                {stats.resolved}
              </p>
              <div className="mt-4 h-1.5 bg-gradient-to-r from-emerald-400 to-emerald-200 dark:from-emerald-600 dark:to-emerald-800 rounded-full"></div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-800/40 rounded-lg">
                  <Users
                    size={20}
                    className="text-purple-600 dark:text-purple-400"
                  />
                </div>
              </div>
              <p className="text-purple-800 dark:text-purple-300 text-sm font-semibold mb-1">
                Officers
              </p>
              <p className="text-4xl font-black text-purple-900 dark:text-purple-100">
                {officers.length}
              </p>
              <div className="mt-4 h-1.5 bg-gradient-to-r from-purple-400 to-purple-200 dark:from-purple-600 dark:to-purple-800 rounded-full"></div>
            </div>
          </div>

          {stats.escalated > 0 && (
            <div className="group relative overflow-hidden bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 transform hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-400/20 to-transparent rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-red-100 dark:bg-red-800/40 rounded-lg">
                    <AlertTriangle
                      size={20}
                      className="text-red-600 dark:text-red-400 animate-pulse"
                    />
                  </div>
                </div>
                <p className="text-red-800 dark:text-red-300 text-sm font-semibold mb-1">
                  Escalated
                </p>
                <p className="text-4xl font-black text-red-900 dark:text-red-100">
                  {stats.escalated}
                </p>
                <div className="mt-4 h-1.5 bg-gradient-to-r from-red-400 to-red-200 dark:from-red-600 dark:to-red-800 rounded-full"></div>
              </div>
            </div>
          )}
        </div>

        <div className="relative mb-12 z-40 flex justify-center group/nav">
          <div className="relative bg-white/30 dark:bg-[#0f172a]/50 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] border-y border-white/80 dark:border-white/20 p-2 overflow-hidden ring-1 ring-black/5 dark:ring-white/10">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent dark:from-white/5 pointer-events-none rounded-[2.5rem]"></div>
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar relative z-10 px-1">
              <button
                onClick={() => setActiveTab("officers")}
                className={`px-8 py-3.5 font-bold text-sm whitespace-nowrap transition-all duration-500 flex items-center gap-3 rounded-full relative group/btn ${
                  activeTab === "officers"
                    ? "text-white bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_25px_rgba(52,211,153,0.6)] border border-emerald-400/50 scale-105"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/10 border border-transparent"
                }`}
              >
                {activeTab === "officers" && (
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-sm opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                )}
                <Users
                  size={20}
                  className={`relative z-10 ${activeTab === "officers" ? "drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" : ""}`}
                />
                <span className="relative z-10 tracking-wide">Officers</span>
              </button>
              <button
                onClick={() => setActiveTab("assignments")}
                className={`px-8 py-3.5 font-bold text-sm whitespace-nowrap transition-all duration-500 flex items-center gap-3 rounded-full relative group/btn ${
                  activeTab === "assignments"
                    ? "text-white bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_25px_rgba(52,211,153,0.6)] border border-emerald-400/50 scale-105"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/10 border border-transparent"
                }`}
              >
                {activeTab === "assignments" && (
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-sm opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                )}
                <Target
                  size={20}
                  className={`relative z-10 ${activeTab === "assignments" ? "drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" : ""}`}
                />
                <span className="relative z-10 tracking-wide">Assignments</span>
              </button>
              <button
                onClick={() => setActiveTab("messages")}
                className={`px-8 py-3.5 font-bold text-sm whitespace-nowrap transition-all duration-500 flex items-center gap-3 rounded-full relative group/btn ${
                  activeTab === "messages"
                    ? "text-white bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_25px_rgba(52,211,153,0.6)] border border-emerald-400/50 scale-105"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/10 border border-transparent"
                }`}
              >
                {activeTab === "messages" && (
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-sm opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                )}
                <MessageSquare
                  size={20}
                  className={`relative z-10 ${activeTab === "messages" ? "drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" : ""}`}
                />
                <span className="relative z-10 tracking-wide">Messages</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {activeTab === "officers" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-3xl shadow-2xl">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTJWMGgydjMwem0wIDMwdi0yaDMwdjJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
                <div className="relative p-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                      <h2 className="text-3xl font-black text-white flex items-center gap-3 mb-2">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                          <Users size={32} />
                        </div>
                        Officer Management
                      </h2>
                      <p className="text-emerald-50 text-lg font-medium">
                        Monitor and manage your team performance
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/30 hover:bg-white/30 transition-all duration-300">
                        <div className="text-white/90 text-sm font-bold mb-1 uppercase tracking-wide">
                          Unit Officers
                        </div>
                        <div className="text-3xl font-black text-white">
                          {
                            officers.filter((o) => o.role === "unit_officer")
                              .length
                          }
                        </div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/30 hover:bg-white/30 transition-all duration-300">
                        <div className="text-white/90 text-sm font-bold mb-1 uppercase tracking-wide">
                          Field Officers
                        </div>
                        <div className="text-3xl font-black text-white">
                          {
                            officers.filter((o) => o.role === "field_officer")
                              .length
                          }
                        </div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/30 hover:bg-white/30 transition-all duration-300">
                        <div className="text-white/90 text-sm font-bold mb-1 uppercase tracking-wide">
                          Total Officers
                        </div>
                        <div className="text-3xl font-black text-white">
                          {officers.length}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="group relative overflow-hidden bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg">
                        <Users className="text-white" size={28} />
                      </div>
                      <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                        <span className="text-xs font-bold text-blue-700 dark:text-blue-300">
                          TOTAL
                        </span>
                      </div>
                    </div>
                    <div className="text-4xl font-black text-slate-900 dark:text-white mb-1">
                      {officers.length}
                    </div>
                    <div className="text-slate-600 dark:text-slate-400 font-semibold">
                      Active Officers
                    </div>
                    <div className="mt-4 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                  </div>
                </div>

                <div className="group relative overflow-hidden bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-600">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg">
                        <Activity className="text-white" size={28} />
                      </div>
                      <div className="px-3 py-1 bg-violet-100 dark:bg-violet-900/30 rounded-full">
                        <span className="text-xs font-bold text-violet-700 dark:text-violet-300">
                          RATE
                        </span>
                      </div>
                    </div>
                    <div className="text-4xl font-black text-slate-900 dark:text-white mb-1">
                      {Math.round(
                        (officers.filter(
                          (o) =>
                            officerWorkload.find(
                              (ow) => ow.officer.id === o.id && ow.total > 0,
                            )?.total || 0,
                        ) /
                          officers.length) *
                          100,
                      )}
                      %
                    </div>
                    <div className="text-slate-600 dark:text-slate-400 font-semibold">
                      Utilization Rate
                    </div>
                    <div className="mt-4 h-1.5 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"></div>
                  </div>
                </div>

                <div className="group relative overflow-hidden bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-600">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg">
                        <Target className="text-white" size={28} />
                      </div>
                      <div className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                        <span className="text-xs font-bold text-orange-700 dark:text-orange-300">
                          AVG
                        </span>
                      </div>
                    </div>
                    <div className="text-4xl font-black text-slate-900 dark:text-white mb-1">
                      {Math.round(issues.length / officers.length)}
                    </div>
                    <div className="text-slate-600 dark:text-slate-400 font-semibold">
                      Avg Workload
                    </div>
                    <div className="mt-4 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6">
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex-1 min-w-[300px]">
                      <div className="relative group">
                        <Search
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 transition-colors"
                          size={20}
                        />
                        <input
                          type="text"
                          value={officerSearchTerm}
                          onChange={(e) => setOfficerSearchTerm(e.target.value)}
                          placeholder="Search officers by name..."
                          className="w-full pl-12 pr-4 py-3.5 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-750 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:ring-emerald-400 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium shadow-sm"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="relative">
                        <select
                          value={officerFilter}
                          onChange={(e) => setOfficerFilter(e.target.value)}
                          className="appearance-none px-5 py-3.5 pr-10 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:ring-emerald-400 transition-all text-slate-900 dark:text-white font-bold cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-600 shadow-sm"
                        >
                          <option value="all">All Roles</option>
                          <option value="unit_officer">Unit Officers</option>
                          <option value="field_officer">Field Officers</option>
                        </select>
                        <ChevronDown
                          size={18}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-400 pointer-events-none"
                        />
                      </div>
                      <div className="relative">
                        <select
                          value={workloadFilter}
                          onChange={(e) => setWorkloadFilter(e.target.value)}
                          className="appearance-none px-5 py-3.5 pr-10 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 transition-all text-slate-900 dark:text-white font-bold cursor-pointer hover:border-blue-400 dark:hover:border-blue-600 shadow-sm"
                        >
                          <option value="all">All Workloads</option>
                          <option value="overloaded">Overloaded</option>
                          <option value="balanced">Balanced</option>
                          <option value="underutilized">Underutilized</option>
                        </select>
                        <ChevronDown
                          size={18}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 dark:text-blue-400 pointer-events-none"
                        />
                      </div>
                      <div className="h-10 w-px bg-slate-300 dark:bg-slate-700"></div>
                      <button
                        onClick={() => {
                          const allIds = new Set(
                            filteredOfficers.map((ow) => ow.officer.id),
                          );
                          setExpandedOfficers(allIds);
                        }}
                        className="group/btn relative overflow-hidden flex items-center gap-2 px-4 py-3.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-violet-500/50 transition-all duration-300 font-bold hover:scale-105"
                      >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                        <ChevronDown size={18} className="relative z-10" />
                        <span className="relative z-10">Expand All</span>
                      </button>
                      <button
                        onClick={() => setExpandedOfficers(new Set())}
                        className="group/btn relative overflow-hidden flex items-center gap-2 px-4 py-3.5 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl hover:shadow-lg hover:shadow-slate-500/50 transition-all duration-300 font-bold hover:scale-105"
                      >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                        <ChevronUp size={18} className="relative z-10" />
                        <span className="relative z-10">Collapse All</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {filteredOfficers.map((ow, index) => {
                      const isExpanded = expandedOfficers.has(ow.officer.id);
                      return (
                        <div
                          key={ow.officer.id}
                          className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200 dark:border-slate-700 overflow-hidden hover:-translate-y-1"
                          style={{
                            animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                          }}
                        >
                          <div
                            className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                              ow.workloadStatus === "overloaded"
                                ? "bg-gradient-to-r from-red-500/5 to-rose-500/5"
                                : ow.workloadStatus === "underutilized"
                                  ? "bg-gradient-to-r from-amber-500/5 to-yellow-500/5"
                                  : "bg-gradient-to-r from-emerald-500/5 to-teal-500/5"
                            }`}
                          ></div>

                          <div
                            className={`relative p-6 border-l-4 ${
                              ow.workloadStatus === "overloaded"
                                ? "border-red-500 bg-gradient-to-r from-red-50/50 to-transparent dark:from-red-900/10"
                                : ow.workloadStatus === "underutilized"
                                  ? "border-amber-500 bg-gradient-to-r from-amber-50/50 to-transparent dark:from-amber-900/10"
                                  : "border-emerald-500 bg-gradient-to-r from-emerald-50/50 to-transparent dark:from-emerald-900/10"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-5 flex-1">
                                <div className="relative group/avatar">
                                  <div
                                    className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl transform group-hover:scale-110 transition-transform duration-500 ${
                                      ow.officer.role === "unit_officer"
                                        ? "bg-gradient-to-br from-cyan-500 to-blue-600"
                                        : "bg-gradient-to-br from-emerald-500 to-teal-600"
                                    }`}
                                  >
                                    {ow.officer.full_name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </div>
                                  <div
                                    className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-white dark:border-slate-800 shadow-lg animate-pulse ${
                                      ow.workloadStatus === "overloaded"
                                        ? "bg-red-500"
                                        : ow.workloadStatus === "underutilized"
                                          ? "bg-amber-500"
                                          : "bg-emerald-500"
                                    }`}
                                  ></div>
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-black text-slate-900 dark:text-white text-xl mb-1">
                                    {ow.officer.full_name}
                                  </h3>
                                  <div className="flex items-center gap-3 text-sm">
                                    {ow.officer.role === "unit_officer" ? (
                                      <span className="flex items-center gap-1.5 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 px-2.5 py-1 rounded-lg font-semibold">
                                        <Shield size={14} /> Unit Officer
                                      </span>
                                    ) : (
                                      <span className="flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-lg font-semibold">
                                        <Zap size={14} /> Field Officer
                                      </span>
                                    )}
                                    {ow.officer.ward_zone && (
                                      <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg font-semibold">
                                        <MapPin size={14} />{" "}
                                        {ow.officer.ward_zone}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-6">
                                <div className="grid grid-cols-4 gap-6">
                                  <div className="text-center">
                                    <div className="relative inline-block">
                                      <div className="text-3xl font-black bg-gradient-to-br from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-400">
                                        {ow.total}
                                      </div>
                                      <div className="absolute -inset-1 bg-blue-500/20 rounded-lg blur-sm -z-10 group-hover:bg-blue-500/30 transition-colors"></div>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 font-bold mt-1">
                                      Total
                                    </p>
                                  </div>
                                  <div className="text-center">
                                    <div className="relative inline-block">
                                      <div className="text-3xl font-black bg-gradient-to-br from-amber-600 to-orange-600 bg-clip-text text-transparent dark:from-amber-400 dark:to-orange-400">
                                        {ow.inProgress}
                                      </div>
                                      <div className="absolute -inset-1 bg-amber-500/20 rounded-lg blur-sm -z-10 group-hover:bg-amber-500/30 transition-colors"></div>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 font-bold mt-1">
                                      Active
                                    </p>
                                  </div>
                                  <div className="text-center">
                                    <div className="relative inline-block">
                                      <div className="text-3xl font-black bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-400">
                                        {ow.resolved}
                                      </div>
                                      <div className="absolute -inset-1 bg-emerald-500/20 rounded-lg blur-sm -z-10 group-hover:bg-emerald-500/30 transition-colors"></div>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 font-bold mt-1">
                                      Resolved
                                    </p>
                                  </div>
                                  <div className="text-center">
                                    <div className="relative inline-block">
                                      <div className="text-3xl font-black text-slate-900 dark:text-white">
                                        {ow.completionRate}%
                                      </div>
                                      <div className="absolute -inset-1 bg-slate-500/20 rounded-lg blur-sm -z-10 group-hover:bg-slate-500/30 transition-colors"></div>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 font-bold mt-1">
                                      Complete
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() =>
                                      openMessageModal(ow.officer, ow.issues)
                                    }
                                    className="group/btn relative overflow-hidden flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 text-sm font-bold hover:scale-105"
                                  >
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                                    <Mail size={16} className="relative z-10" />
                                    <span className="relative z-10">
                                      Message
                                    </span>
                                  </button>
                                  <button
                                    onClick={() =>
                                      toggleOfficerExpand(ow.officer.id)
                                    }
                                    className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all duration-300 hover:scale-110"
                                  >
                                    {isExpanded ? (
                                      <ChevronUp
                                        size={22}
                                        className="text-slate-600 dark:text-slate-400"
                                      />
                                    ) : (
                                      <ChevronDown
                                        size={22}
                                        className="text-slate-600 dark:text-slate-400"
                                      />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>

                            {isExpanded && (
                              <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="grid grid-cols-4 gap-6 mb-6">
                                  <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Clock
                                        size={16}
                                        className="text-slate-600 dark:text-slate-400"
                                      />
                                      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                        Avg Resolution
                                      </span>
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                      {ow.avgResolutionTime}h
                                    </p>
                                  </div>
                                  <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Award
                                        size={16}
                                        className="text-slate-600 dark:text-slate-400"
                                      />
                                      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                        Rating
                                      </span>
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                      {ow.rating} / 5.0
                                    </p>
                                  </div>
                                  <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Activity
                                        size={16}
                                        className="text-slate-600 dark:text-slate-400"
                                      />
                                      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                        Workload Status
                                      </span>
                                    </div>
                                    <span
                                      className={`inline-block font-bold px-3 py-1 rounded-lg text-sm ${
                                        ow.workloadStatus === "overloaded"
                                          ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                                          : ow.workloadStatus ===
                                              "underutilized"
                                            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                                            : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                                      }`}
                                    >
                                      {ow.workloadStatus === "overloaded"
                                        ? "Overloaded"
                                        : ow.workloadStatus === "underutilized"
                                          ? "Under-utilized"
                                          : "Balanced"}
                                    </span>
                                  </div>
                                  <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Target
                                        size={16}
                                        className="text-slate-600 dark:text-slate-400"
                                      />
                                      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                        Progress
                                      </span>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden mt-2">
                                      <div
                                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                                        style={{
                                          width: `${ow.completionRate}%`,
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>

                                {ow.total > 0 && (
                                  <div className="mb-6">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                      <Activity size={16} />
                                      Work Progress Breakdown
                                    </h4>
                                    <div className="space-y-3">
                                      {ow.issues.slice(0, 5).map((issue) => {
                                        const daysSince = Math.floor(
                                          (Date.now() -
                                            new Date(
                                              issue.createdAt,
                                            ).getTime()) /
                                            (1000 * 60 * 60 * 24),
                                        );
                                        const isOverdue =
                                          daysSince > 7 &&
                                          issue.status !== "resolved";
                                        const progressPercent =
                                          issue.status === "resolved"
                                            ? 100
                                            : issue.status === "in_progress"
                                              ? 60
                                              : 20;

                                        return (
                                          <div
                                            key={issue.id}
                                            className="bg-white dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer"
                                            onClick={() =>
                                              setSelectedIssue(issue)
                                            }
                                          >
                                            <div className="flex items-start justify-between mb-2">
                                              <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                  <code className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded">
                                                    {issue.ticket_id}
                                                  </code>
                                                  {isOverdue && (
                                                    <span className="flex items-center gap-1 text-xs font-bold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/40 px-2 py-0.5 rounded">
                                                      <AlertTriangle
                                                        size={10}
                                                      />
                                                      OVERDUE
                                                    </span>
                                                  )}
                                                </div>
                                                <h5 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                                                  {issue.title}
                                                </h5>
                                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                                  {daysSince === 0
                                                    ? "Reported today"
                                                    : `${daysSince} days in progress`}
                                                </p>
                                              </div>
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setReassignIssue(issue);
                                                }}
                                                className="ml-3 px-3 py-1.5 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-xs font-medium flex items-center gap-1"
                                              >
                                                <UserCheck size={12} />
                                                Reassign
                                              </button>
                                            </div>
                                            <div className="space-y-1">
                                              <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-600 dark:text-slate-400 font-medium">
                                                  Progress
                                                </span>
                                                <span className="font-bold text-slate-900 dark:text-white">
                                                  {progressPercent}%
                                                </span>
                                              </div>
                                              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                                                <div
                                                  className={`h-full rounded-full transition-all duration-500 ${
                                                    issue.status === "resolved"
                                                      ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                                                      : issue.status ===
                                                          "in_progress"
                                                        ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                                                        : "bg-gradient-to-r from-amber-500 to-orange-500"
                                                  }`}
                                                  style={{
                                                    width: `${progressPercent}%`,
                                                  }}
                                                ></div>
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                    {ow.issues.length > 5 && (
                                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 text-center">
                                        Showing 5 of {ow.issues.length} active
                                        issues
                                      </p>
                                    )}
                                  </div>
                                )}

                                <button
                                  onClick={() => setActiveTab("assignments")}
                                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 dark:bg-emerald-500 text-white rounded-xl hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors font-semibold"
                                >
                                  <Eye size={18} />
                                  View All Issues in Assignments
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {filteredOfficers.length === 0 && (
                    <div className="text-center py-16">
                      <Users
                        size={64}
                        className="mx-auto text-slate-300 dark:text-slate-700 mb-4"
                      />
                      <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
                        No officers match your filters
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "assignments" && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Target size={24} />
                  Assignment Monitoring
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex-1 min-w-[300px]">
                      <div className="relative">
                        <Search
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                          size={20}
                        />
                        <input
                          type="text"
                          value={assignmentSearchTerm}
                          onChange={(e) =>
                            setAssignmentSearchTerm(e.target.value)
                          }
                          placeholder="Search officers by name..."
                          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        />
                      </div>
                    </div>
                    <select
                      value={assignmentOfficerFilter}
                      onChange={(e) =>
                        setAssignmentOfficerFilter(e.target.value)
                      }
                      className="px-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 transition-all text-slate-900 dark:text-white font-medium"
                    >
                      <option value="all">All Roles</option>
                      <option value="unit_officer">Unit Officers</option>
                      <option value="field_officer">Field Officers</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-emerald-800 dark:text-emerald-300 font-semibold mb-1">
                            On Track
                          </p>
                          <p className="text-4xl font-black text-emerald-900 dark:text-emerald-100">
                            {assignedIssues.length - overdueIssues.length}
                          </p>
                        </div>
                        <div className="p-4 bg-emerald-100 dark:bg-emerald-800/40 rounded-xl">
                          <CheckCircle
                            className="text-emerald-600 dark:text-emerald-400"
                            size={32}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-amber-800 dark:text-amber-300 font-semibold mb-1">
                            Near Deadline
                          </p>
                          <p className="text-4xl font-black text-amber-900 dark:text-amber-100">
                            {Math.floor(assignedIssues.length * 0.15)}
                          </p>
                        </div>
                        <div className="p-4 bg-amber-100 dark:bg-amber-800/40 rounded-xl">
                          <Clock
                            className="text-amber-600 dark:text-amber-400"
                            size={32}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-red-800 dark:text-red-300 font-semibold mb-1">
                            SLA Breached
                          </p>
                          <p className="text-4xl font-black text-red-900 dark:text-red-100">
                            {overdueIssues.length}
                          </p>
                        </div>
                        <div className="p-4 bg-red-100 dark:bg-red-800/40 rounded-xl">
                          <AlertTriangle
                            className="text-red-600 dark:text-red-400 animate-pulse"
                            size={32}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-800 dark:text-slate-300 font-semibold mb-1">
                            Unassigned
                          </p>
                          <p className="text-4xl font-black text-slate-900 dark:text-slate-100">
                            {issues.filter((i) => !i.assignedTo).length}
                          </p>
                        </div>
                        <div className="p-4 bg-slate-100 dark:bg-slate-800/40 rounded-xl">
                          <AlertCircle
                            className="text-slate-600 dark:text-slate-400"
                            size={32}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {filteredAssignmentOfficers.map((ow) => {
                      const isExpanded = expandedAssignmentOfficers.has(
                        ow.officer.id,
                      );
                      const filteredIssues = getFilteredOfficerIssues(
                        ow.officer.id,
                        ow.issues,
                      );
                      const displayedIssues = isExpanded
                        ? filteredIssues
                        : filteredIssues.slice(0, 3);

                      return (
                        <div
                          key={ow.officer.id}
                          className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-2xl transition-all duration-300"
                        >
                          <div className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-6 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div
                                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-xl ${
                                    ow.officer.role === "unit_officer"
                                      ? "bg-gradient-to-br from-cyan-500 to-blue-600"
                                      : "bg-gradient-to-br from-emerald-500 to-teal-600"
                                  }`}
                                >
                                  {ow.officer.full_name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </div>
                                <div>
                                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {ow.officer.full_name}
                                  </h3>
                                  <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2 mt-1">
                                    {ow.officer.role === "unit_officer" ? (
                                      <>
                                        <Shield size={14} /> Unit Officer
                                      </>
                                    ) : (
                                      <>
                                        <Zap size={14} /> Field Officer
                                      </>
                                    )}
                                    {ow.officer.ward_zone && (
                                      <>
                                        <MapPin size={14} />{" "}
                                        {ow.officer.ward_zone}
                                      </>
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="text-3xl font-black text-slate-900 dark:text-white">
                                    {ow.total}
                                  </p>
                                  <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold">
                                    Active Issues
                                  </p>
                                </div>
                                {ow.total > 0 && (
                                  <button
                                    onClick={() =>
                                      toggleAssignmentOfficerExpand(
                                        ow.officer.id,
                                      )
                                    }
                                    className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                  >
                                    {isExpanded ? (
                                      <ChevronUp size={24} />
                                    ) : (
                                      <ChevronDown size={24} />
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="p-6">
                            {ow.total === 0 ? (
                              <div className="text-center py-8">
                                <CheckCircle
                                  size={48}
                                  className="mx-auto text-emerald-400 dark:text-emerald-500 mb-3"
                                />
                                <p className="text-slate-600 dark:text-slate-400 font-medium">
                                  No active issues assigned
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                                  Officer is available for new assignments
                                </p>
                              </div>
                            ) : (
                              <>
                                <div className="mb-4 space-y-3">
                                  <div className="relative">
                                    <Search
                                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                                      size={16}
                                    />
                                    <input
                                      type="text"
                                      value={
                                        officerIssueSearchTerms[
                                          ow.officer.id
                                        ] || ""
                                      }
                                      onChange={(e) =>
                                        setOfficerIssueSearchTerms({
                                          ...officerIssueSearchTerms,
                                          [ow.officer.id]: e.target.value,
                                        })
                                      }
                                      placeholder="Search issues..."
                                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <select
                                      value={
                                        officerIssueFilters[ow.officer.id]
                                          ?.status || "all"
                                      }
                                      onChange={(e) =>
                                        setOfficerIssueFilters({
                                          ...officerIssueFilters,
                                          [ow.officer.id]: {
                                            ...officerIssueFilters[
                                              ow.officer.id
                                            ],
                                            status: e.target.value,
                                          },
                                        })
                                      }
                                      className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-900 dark:text-white"
                                    >
                                      <option value="all">All Status</option>
                                      <option value="pending">Pending</option>
                                      <option value="in_progress">
                                        In Progress
                                      </option>
                                      <option value="resolved">Resolved</option>
                                    </select>
                                    <select
                                      value={
                                        officerIssueFilters[ow.officer.id]
                                          ?.severity || "all"
                                      }
                                      onChange={(e) =>
                                        setOfficerIssueFilters({
                                          ...officerIssueFilters,
                                          [ow.officer.id]: {
                                            ...officerIssueFilters[
                                              ow.officer.id
                                            ],
                                            severity: e.target.value,
                                          },
                                        })
                                      }
                                      className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-900 dark:text-white"
                                    >
                                      <option value="all">All Severity</option>
                                      <option value="low">Low</option>
                                      <option value="medium">Medium</option>
                                      <option value="high">High</option>
                                    </select>
                                  </div>
                                </div>

                                {filteredIssues.length === 0 ? (
                                  <div className="text-center py-8">
                                    <Filter
                                      size={48}
                                      className="mx-auto text-slate-300 dark:text-slate-700 mb-3"
                                    />
                                    <p className="text-slate-600 dark:text-slate-400 font-medium">
                                      No issues match your filters
                                    </p>
                                  </div>
                                ) : (
                                  <>
                                    <div className="grid grid-cols-1 gap-3">
                                      {displayedIssues.map((issue) => {
                                        const daysSince = Math.floor(
                                          (Date.now() -
                                            new Date(
                                              issue.createdAt,
                                            ).getTime()) /
                                            (1000 * 60 * 60 * 24),
                                        );
                                        const isOverdue =
                                          daysSince > 7 &&
                                          issue.status !== "resolved";

                                        return (
                                          <div
                                            key={issue.id}
                                            className={`rounded-xl p-4 border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
                                              isOverdue
                                                ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700"
                                                : issue.status === "resolved"
                                                  ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 hover:border-emerald-300 dark:hover:border-emerald-700"
                                                  : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700"
                                            }`}
                                            onClick={() =>
                                              setSelectedIssue(issue)
                                            }
                                          >
                                            <div className="flex items-start justify-between">
                                              <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                  <code className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                                    {issue.ticket_id}
                                                  </code>
                                                  {isOverdue && (
                                                    <span className="flex items-center gap-1 text-xs font-bold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/40 px-2 py-1 rounded animate-pulse">
                                                      <AlertTriangle
                                                        size={12}
                                                      />
                                                      OVERDUE
                                                    </span>
                                                  )}
                                                  <span
                                                    className={`text-xs font-bold px-2 py-1 rounded ${
                                                      issue.status ===
                                                      "resolved"
                                                        ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                                                        : issue.status ===
                                                            "in_progress"
                                                          ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                                                          : "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                                                    }`}
                                                  >
                                                    {issue.status === "pending"
                                                      ? "Pending"
                                                      : issue.status ===
                                                          "in_progress"
                                                        ? "In Progress"
                                                        : "Resolved"}
                                                  </span>
                                                </div>
                                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                                                  {issue.title}
                                                </h4>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                                  <Calendar size={14} />
                                                  {daysSince === 0
                                                    ? "Today"
                                                    : `${daysSince} days ago`}
                                                </p>
                                              </div>
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setReassignIssue(issue);
                                                }}
                                                className="px-3 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm font-medium flex items-center gap-1"
                                              >
                                                <UserCheck size={14} />
                                                Reassign
                                              </button>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>

                                    {filteredIssues.length > 3 && (
                                      <button
                                        onClick={() =>
                                          toggleAssignmentOfficerExpand(
                                            ow.officer.id,
                                          )
                                        }
                                        className="w-full mt-4 px-4 py-3 bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors font-medium flex items-center justify-center gap-2"
                                      >
                                        {isExpanded ? (
                                          <>
                                            <ChevronUp size={16} />
                                            Show Less
                                          </>
                                        ) : (
                                          <>
                                            <ChevronDown size={16} />
                                            Show All {
                                              filteredIssues.length
                                            }{" "}
                                            Issues
                                          </>
                                        )}
                                      </button>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {filteredAssignmentOfficers.length === 0 && (
                    <div className="text-center py-16">
                      <Users
                        size={64}
                        className="mx-auto text-slate-300 dark:text-slate-700 mb-4"
                      />
                      <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
                        No officers match your filters
                      </p>
                    </div>
                  )}

                  {issues.filter((i) => !i.assignedTo).length > 0 && (
                    <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-850 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                      <div className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 p-6 border-b border-slate-200 dark:border-slate-700">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <AlertCircle
                            className="text-slate-600 dark:text-slate-400"
                            size={24}
                          />
                          Unassigned Issues (
                          {issues.filter((i) => !i.assignedTo).length})
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          These issues need to be assigned to officers
                        </p>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-1 gap-3">
                          {issues
                            .filter((i) => !i.assignedTo)
                            .slice(0, 5)
                            .map((issue) => {
                              const daysSince = Math.floor(
                                (Date.now() -
                                  new Date(issue.createdAt).getTime()) /
                                  (1000 * 60 * 60 * 24),
                              );
                              const isUrgent = daysSince > 2;

                              return (
                                <div
                                  key={issue.id}
                                  className={`rounded-xl p-4 border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
                                    isUrgent
                                      ? "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 hover:border-orange-300 dark:hover:border-orange-700"
                                      : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                                  }`}
                                  onClick={() => setSelectedIssue(issue)}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <code className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                          {issue.ticket_id}
                                        </code>
                                        {isUrgent && (
                                          <span className="flex items-center gap-1 text-xs font-bold text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/40 px-2 py-1 rounded">
                                            <Clock size={12} />
                                            NEEDS ATTENTION
                                          </span>
                                        )}
                                        <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                          {issue.category}
                                        </span>
                                        <span
                                          className={`text-xs font-bold px-2 py-1 rounded ${
                                            issue.severity === "high"
                                              ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
                                              : issue.severity === "medium"
                                                ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                                                : "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                                          }`}
                                        >
                                          {issue.severity} priority
                                        </span>
                                      </div>
                                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                                        {issue.title}
                                      </h4>
                                      <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                        <Calendar size={14} />
                                        {daysSince === 0
                                          ? "Reported today"
                                          : `Reported ${daysSince} days ago`}
                                      </p>
                                    </div>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setReassignIssue(issue);
                                      }}
                                      className="px-4 py-2 bg-emerald-600 dark:bg-emerald-500 text-white rounded-lg hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors text-sm font-medium flex items-center gap-2"
                                    >
                                      <UserCheck size={14} />
                                      Assign
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                        {issues.filter((i) => !i.assignedTo).length > 5 && (
                          <button
                            onClick={() => {
                              setStatusFilter("all");
                              setActiveTab("issues");
                            }}
                            className="w-full mt-4 px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium flex items-center justify-center gap-2"
                          >
                            View All{" "}
                            {issues.filter((i) => !i.assignedTo).length}{" "}
                            Unassigned Issues
                            <ArrowUpRight size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "messages" && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <MessageSquare size={24} />
                  Messages Center
                </h2>
              </div>
              <div className="p-6">
                <MessagesCenter user={user} />
              </div>
            </div>
          )}

          {/* {activeTab === 'sla' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-rose-600 p-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Clock size={24} />
                  SLA Monitoring
                </h2>
              </div>
              <div className="p-6">
                <SLAMonitoringDashboard
                  onViewIssue={(issue) => setSelectedIssue(issue)}
                />
              </div>
            </div>
          )} */}

          {/* {activeTab === 'analytics' && (
            <>
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <BarChart3 size={24} />
                    SLA Analytics
                  </h2>
                </div>
                <div className="p-6">
                  <SLAAnalyticsDashboard />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden mt-8">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <TrendingUp size={24} />
                    Performance Analytics
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                        <BarChart3 className="text-blue-600 dark:text-blue-400" size={24} />
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Avg Resolution Time</p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">36h</p>
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                        <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={24} />
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Success Rate</p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">94%</p>
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                        <Users className="text-purple-600 dark:text-purple-400" size={24} />
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Active Officers</p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">{officers.length}</p>
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                        <Activity className="text-amber-600 dark:text-amber-400" size={24} />
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Avg Workload</p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">
                      {Math.round(issues.length / officers.length)}
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-xl text-center">
                  <TrendingUp size={64} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Advanced Analytics Coming Soon</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Detailed charts, trends, and insights will be available here
                  </p>
                </div>
              </div>
            </div>
              </div>
            </>
          )}

          {activeTab === 'audit' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-600 to-slate-700 p-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Shield size={24} />
                  Audit Logs
                </h2>
              </div>
              <div className="p-6">
                <ComprehensiveAuditLog />
              </div>
            </div>
          )} */}
        </div>
      </div>

      {selectedIssue && (
        <AdminIssueModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onUpdated={handleIssueUpdated}
        />
      )}

      {messageOfficer && (
        <AdminMessageModal
          officer={messageOfficer}
          issues={messageIssues}
          onClose={() => {
            setMessageOfficer(null);
            setMessageIssues([]);
          }}
          onSend={handleSendMessage}
        />
      )}

      {reassignIssue && (
        <AdminReassignModal
          issue={reassignIssue}
          officers={officers}
          onClose={() => setReassignIssue(null)}
          onReassign={handleReassign}
        />
      )}
    </div>
  );
}
