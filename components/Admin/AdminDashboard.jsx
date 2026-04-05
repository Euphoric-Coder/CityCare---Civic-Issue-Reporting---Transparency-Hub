import { useEffect, useState, useMemo } from "react";
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
import { AdminMessageModal } from "./AdminMessageModal";
import { AdminReassignModal } from "./AdminReassignModal";
// import SLAMonitoringDashboard from './SLAMonitoringDashboard';
// import SLAAnalyticsDashboard from './SLAAnalyticsDashboard';
// import ComprehensiveAuditLog from './ComprehensiveAuditLog';
import { AdminIssueModal } from "./AdminIssueModal";
import { MessagesCenter } from "../MessageCenter";
import { ModeToggle } from "../ModeToggle";

export function AdminDashboard() {
  const user = { id: "2" };
  const profile = { full_name: "Sagnik Dey", role: "Administrator" };
  const [activeTab, setActiveTab] = useState("overview");
  const [issues, setIssues] = useState([]);

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
  const [isAssignedExpanded, setIsAssignedExpanded] = useState(true);
  const [isUnassignedExpanded, setIsUnassignedExpanded] = useState(true);
  const [officerIssueSearchTerms, setOfficerIssueSearchTerms] = useState({});
  const [officerIssueFilters, setOfficerIssueFilters] = useState({});

  useEffect(() => {
    loadIssues();
  }, []);



  async function loadIssues() {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const data = getIssues().sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      console.log("Loaded issues:", data);
      setIssues(data);
    } catch (error) {
      console.error("Error loading issues:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredIssues = useMemo(() => {
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

    return filtered;
  }, [issues, searchTerm, statusFilter, categoryFilter]);

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

  const stats = useMemo(() => ({
    total: issues.length,
    pending: issues.filter((i) => i.status === "pending").length,
    in_progress: issues.filter((i) => i.status === "in_progress").length,
    resolved: issues.filter((i) => i.status === "resolved").length,
    escalated: issues.filter((i) => i.internal_status === "escalated_to_admin")
      .length,
  }), [issues]);

  const officers = useMemo(() => mockUsers.filter(
    (u) => u.role === "unit_officer" || u.role === "field_officer",
  ), []);

  const officerWorkload = useMemo(() => officers.map((officer) => {
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
  }), [officers, issues]);

  const filteredOfficers = useMemo(() => officerWorkload.filter((ow) => {
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
  }), [officerWorkload, officerFilter, workloadFilter, officerSearchTerm]);

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

  const assignedIssues = useMemo(() => issues.filter((i) => i.assignedTo), [issues]);
  const overdueIssues = useMemo(() => assignedIssues.filter((i) => {
    const daysSince = Math.floor(
      (Date.now() - new Date(i.createdAt).getTime()) / (1000 * 60 * 60 * 24),
    );
    return daysSince > 7 && i.status !== "resolved";
  }), [assignedIssues]);

  const filteredAssignmentOfficers = useMemo(() => officerWorkload.filter((ow) => {
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
  }), [officerWorkload, assignmentOfficerFilter, assignmentSearchTerm]);

  async function handleSignOut() {
    try {
      // await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-[#0B1121] relative text-slate-900 dark:text-slate-100 font-sans"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at top left, rgba(16, 185, 129, 0.05), transparent 50%), radial-gradient(ellipse at top right, rgba(14, 165, 233, 0.05), transparent 50%), radial-gradient(ellipse at bottom center, rgba(139, 92, 246, 0.05), transparent 50%)",
      }}
    >
      <nav className="bg-white/70 dark:bg-[#0f172a]/70 backdrop-blur-2xl shadow-lg sticky top-0 z-50 border-b border-white/50 dark:border-slate-800/50">
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

              <ModeToggle />

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
          <div className="group relative overflow-hidden bg-white/40 dark:bg-[#0f172a]/60 backdrop-blur-3xl rounded-3xl shadow-lg dark:shadow-2xl hover:shadow-[0_20px_40px_rgba(148,163,184,0.15)] dark:hover:shadow-[0_20px_40px_rgba(148,163,184,0.1)] transition-all duration-500 p-6 border-y border-white/80 dark:border-white/10 hover:border-slate-300/50 dark:hover:border-slate-500/50 hover:bg-white/80 dark:hover:bg-[#1e293b]/80 transform hover:-translate-y-2">
            <div className="absolute -inset-1 bg-gradient-to-r from-slate-500 to-slate-400 opacity-0 group-hover:opacity-10 blur-xl transition-all duration-700"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-400/20 to-transparent rounded-full blur-3xl group-hover:blur-2xl transition-all duration-500 transform group-hover:scale-150"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-xl shadow-inner border border-white/50 dark:border-slate-700/50 group-hover:scale-110 transition-transform duration-500">
                  <BarChart3
                    size={22}
                    className="text-slate-600 dark:text-slate-300 drop-shadow-sm"
                  />
                </div>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">
                Total Issues
              </p>
              <p className="text-5xl font-black bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent transform group-hover:scale-105 origin-left transition-transform duration-500">
                {stats.total}
              </p>
              <div className="mt-4 h-1.5 w-full bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-slate-400 to-slate-300 dark:from-slate-500 dark:to-slate-400 rounded-full w-full opacity-70 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/40 dark:bg-[#0f172a]/60 backdrop-blur-3xl rounded-3xl shadow-lg dark:shadow-2xl hover:shadow-[0_20px_40px_rgba(245,158,11,0.15)] dark:hover:shadow-[0_20px_40px_rgba(245,158,11,0.1)] transition-all duration-500 p-6 border-y border-white/80 dark:border-white/10 hover:border-amber-300/50 dark:hover:border-amber-500/50 hover:bg-white/80 dark:hover:bg-[#1e293b]/80 transform hover:-translate-y-2">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-400 opacity-0 group-hover:opacity-10 blur-xl transition-all duration-700"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-transparent rounded-full blur-3xl group-hover:blur-2xl transition-all duration-500 transform group-hover:scale-150"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/40 dark:to-orange-900/40 rounded-xl shadow-inner border border-white/50 dark:border-amber-700/30 group-hover:scale-110 transition-transform duration-500">
                  <Clock
                    size={22}
                    className="text-amber-600 dark:text-amber-400 drop-shadow-sm"
                  />
                </div>
              </div>
              <p className="text-amber-700/80 dark:text-amber-400/80 text-sm font-bold uppercase tracking-wider mb-1">
                Pending
              </p>
              <p className="text-5xl font-black bg-gradient-to-br from-amber-700 to-orange-600 dark:from-amber-300 dark:to-orange-200 bg-clip-text text-transparent transform group-hover:scale-105 origin-left transition-transform duration-500">
                {stats.pending}
              </p>
              <div className="mt-4 h-1.5 w-full bg-amber-100 dark:bg-amber-900/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-400 to-orange-400 dark:from-amber-500 dark:to-orange-500 rounded-full w-full opacity-70 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/40 dark:bg-[#0f172a]/60 backdrop-blur-3xl rounded-3xl shadow-lg dark:shadow-2xl hover:shadow-[0_20px_40px_rgba(59,130,246,0.15)] dark:hover:shadow-[0_20px_40px_rgba(59,130,246,0.1)] transition-all duration-500 p-6 border-y border-white/80 dark:border-white/10 hover:border-blue-300/50 dark:hover:border-blue-500/50 hover:bg-white/80 dark:hover:bg-[#1e293b]/80 transform hover:-translate-y-2">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-10 blur-xl transition-all duration-700"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-3xl group-hover:blur-2xl transition-all duration-500 transform group-hover:scale-150"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/40 dark:to-cyan-900/40 rounded-xl shadow-inner border border-white/50 dark:border-blue-700/30 group-hover:scale-110 transition-transform duration-500">
                  <Activity
                    size={22}
                    className="text-blue-600 dark:text-blue-400 drop-shadow-sm"
                  />
                </div>
              </div>
              <p className="text-blue-700/80 dark:text-blue-400/80 text-sm font-bold uppercase tracking-wider mb-1">
                In Progress
              </p>
              <p className="text-5xl font-black bg-gradient-to-br from-blue-700 to-cyan-600 dark:from-blue-300 dark:to-cyan-200 bg-clip-text text-transparent transform group-hover:scale-105 origin-left transition-transform duration-500">
                {stats.in_progress}
              </p>
              <div className="mt-4 h-1.5 w-full bg-blue-100 dark:bg-blue-900/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 dark:from-blue-500 dark:to-cyan-500 rounded-full w-full opacity-70 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/40 dark:bg-[#0f172a]/60 backdrop-blur-3xl rounded-3xl shadow-lg dark:shadow-2xl hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)] dark:hover:shadow-[0_20px_40px_rgba(16,185,129,0.1)] transition-all duration-500 p-6 border-y border-white/80 dark:border-white/10 hover:border-emerald-300/50 dark:hover:border-emerald-500/50 hover:bg-white/80 dark:hover:bg-[#1e293b]/80 transform hover:-translate-y-2">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-0 group-hover:opacity-10 blur-xl transition-all duration-700"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full blur-3xl group-hover:blur-2xl transition-all duration-500 transform group-hover:scale-150"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/40 dark:to-teal-900/40 rounded-xl shadow-inner border border-white/50 dark:border-emerald-700/30 group-hover:scale-110 transition-transform duration-500">
                  <CheckCircle
                    size={22}
                    className="text-emerald-600 dark:text-emerald-400 drop-shadow-sm"
                  />
                </div>
              </div>
              <p className="text-emerald-700/80 dark:text-emerald-400/80 text-sm font-bold uppercase tracking-wider mb-1">
                Resolved
              </p>
              <p className="text-5xl font-black bg-gradient-to-br from-emerald-700 to-teal-600 dark:from-emerald-300 dark:to-teal-200 bg-clip-text text-transparent transform group-hover:scale-105 origin-left transition-transform duration-500">
                {stats.resolved}
              </p>
              <div className="mt-4 h-1.5 w-full bg-emerald-100 dark:bg-emerald-900/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 dark:from-emerald-500 dark:to-teal-500 rounded-full w-full opacity-70 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/40 dark:bg-[#0f172a]/60 backdrop-blur-3xl rounded-3xl shadow-lg dark:shadow-2xl hover:shadow-[0_20px_40px_rgba(168,85,247,0.15)] dark:hover:shadow-[0_20px_40px_rgba(168,85,247,0.1)] transition-all duration-500 p-6 border-y border-white/80 dark:border-white/10 hover:border-purple-300/50 dark:hover:border-purple-500/50 hover:bg-white/80 dark:hover:bg-[#1e293b]/80 transform hover:-translate-y-2">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-violet-400 opacity-0 group-hover:opacity-10 blur-xl transition-all duration-700"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full blur-3xl group-hover:blur-2xl transition-all duration-500 transform group-hover:scale-150"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/40 dark:to-violet-900/40 rounded-xl shadow-inner border border-white/50 dark:border-purple-700/30 group-hover:scale-110 transition-transform duration-500">
                  <Users
                    size={22}
                    className="text-purple-600 dark:text-purple-400 drop-shadow-sm"
                  />
                </div>
              </div>
              <p className="text-purple-700/80 dark:text-purple-400/80 text-sm font-bold uppercase tracking-wider mb-1">
                Officers
              </p>
              <p className="text-5xl font-black bg-gradient-to-br from-purple-700 to-violet-600 dark:from-purple-300 dark:to-violet-200 bg-clip-text text-transparent transform group-hover:scale-105 origin-left transition-transform duration-500">
                {officers.length}
              </p>
              <div className="mt-4 h-1.5 w-full bg-purple-100 dark:bg-purple-900/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-400 to-violet-400 dark:from-purple-500 dark:to-violet-500 rounded-full w-full opacity-70 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
          </div>

          {stats.escalated > 0 && (
            <div className="group relative overflow-hidden bg-white/40 dark:bg-[#0f172a]/60 backdrop-blur-3xl rounded-3xl shadow-lg dark:shadow-2xl hover:shadow-[0_20px_40px_rgba(239,68,68,0.15)] dark:hover:shadow-[0_20px_40px_rgba(239,68,68,0.1)] transition-all duration-500 p-6 border-y border-white/80 dark:border-white/10 hover:border-red-300/50 dark:hover:border-red-500/50 hover:bg-white/80 dark:hover:bg-[#1e293b]/80 transform hover:-translate-y-2">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-rose-400 opacity-0 group-hover:opacity-10 blur-xl transition-all duration-700"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-400/20 to-transparent rounded-full blur-3xl group-hover:blur-2xl transition-all duration-500 transform group-hover:scale-150"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/40 dark:to-rose-900/40 rounded-xl shadow-inner border border-white/50 dark:border-red-700/30 group-hover:scale-110 transition-transform duration-500">
                    <AlertTriangle
                      size={22}
                      className="text-red-600 dark:text-red-400 drop-shadow-sm animate-pulse"
                    />
                  </div>
                </div>
                <p className="text-red-700/80 dark:text-red-400/80 text-sm font-bold uppercase tracking-wider mb-1">
                  Escalated
                </p>
                <p className="text-5xl font-black bg-gradient-to-br from-red-700 to-rose-600 dark:from-red-300 dark:to-rose-200 bg-clip-text text-transparent transform group-hover:scale-105 origin-left transition-transform duration-500">
                  {stats.escalated}
                </p>
                <div className="mt-4 h-1.5 w-full bg-red-100 dark:bg-red-900/30 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-400 to-rose-400 dark:from-red-500 dark:to-rose-500 rounded-full w-full opacity-70 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative mb-12 z-40 flex justify-center group/nav">
          <div className="relative bg-white/30 dark:bg-[#0f172a]/50 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] border-y border-white/80 dark:border-white/20 p-2 overflow-hidden ring-1 ring-black/5 dark:ring-white/10">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent dark:from-white/5 pointer-events-none rounded-[2.5rem]"></div>
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar relative z-10 px-1">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-8 py-3.5 font-bold text-sm whitespace-nowrap transition-all duration-500 flex items-center gap-3 rounded-full relative group/btn ${
                  activeTab === "overview"
                    ? "text-white bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_25px_rgba(52,211,153,0.6)] border border-emerald-400/50 scale-105"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/10 border border-transparent"
                }`}
              >
                {activeTab === "overview" && <div className="absolute inset-0 bg-white/20 rounded-full blur-sm opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>}
                <BarChart3 size={20} className={`relative z-10 ${activeTab === 'overview' ? 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]' : ''}`} />
                <span className="relative z-10 tracking-wide">Overview</span>
              </button>
              <button
                onClick={() => setActiveTab("officers")}
                className={`px-8 py-3.5 font-bold text-sm whitespace-nowrap transition-all duration-500 flex items-center gap-3 rounded-full relative group/btn ${
                  activeTab === "officers"
                    ? "text-white bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_25px_rgba(52,211,153,0.6)] border border-emerald-400/50 scale-105"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/10 border border-transparent"
                }`}
              >
                {activeTab === "officers" && <div className="absolute inset-0 bg-white/20 rounded-full blur-sm opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>}
                <Users size={20} className={`relative z-10 ${activeTab === 'officers' ? 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]' : ''}`} />
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
                {activeTab === "assignments" && <div className="absolute inset-0 bg-white/20 rounded-full blur-sm opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>}
                <Target size={20} className={`relative z-10 ${activeTab === 'assignments' ? 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]' : ''}`} />
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
                {activeTab === "messages" && <div className="absolute inset-0 bg-white/20 rounded-full blur-sm opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>}
                <MessageSquare size={20} className={`relative z-10 ${activeTab === 'messages' ? 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]' : ''}`} />
                <span className="relative z-10 tracking-wide">Messages</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {activeTab === "overview" && (
            <div className="group/main relative overflow-hidden bg-white/40 dark:bg-[#0f172a]/40 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border-y border-white/80 dark:border-white/10 hover:border-indigo-300/50 dark:hover:border-indigo-500/50 transition-all duration-700">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-400/20 via-transparent to-transparent opacity-0 group-hover/main:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
              
              <div className="relative z-10 px-10 py-8 border-b border-white/50 dark:border-slate-700/50 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="relative group/icon">
                    <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-2xl blur-lg opacity-40 group-hover/icon:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                    <div className="relative p-3.5 bg-gradient-to-br from-indigo-100 to-cyan-100 dark:from-indigo-900/80 dark:to-cyan-900/80 rounded-2xl shadow-inner border border-white/50 dark:border-indigo-500/30 group-hover/icon:scale-110 transition-transform duration-500">
                      <BarChart3 className="text-indigo-600 dark:text-indigo-400 drop-shadow-sm" size={26} />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-black bg-gradient-to-r from-indigo-900 to-cyan-700 dark:from-white dark:to-indigo-300 bg-clip-text text-transparent tracking-tight">
                      System Overview
                    </h2>
                    <p className="text-sm font-bold text-indigo-700/60 dark:text-indigo-300/60 uppercase tracking-widest mt-1">
                      Live Dashboard Analytics
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative z-10 p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <div className="group/card relative overflow-hidden bg-white/40 dark:bg-[#0f172a]/60 backdrop-blur-3xl rounded-3xl shadow-lg dark:shadow-2xl hover:shadow-[0_20px_40px_rgba(59,130,246,0.15)] dark:hover:shadow-[0_20px_40px_rgba(59,130,246,0.1)] transition-all duration-500 p-6 border-y border-white/80 dark:border-white/10 hover:border-blue-300/50 dark:hover:border-blue-500/50 transform hover:-translate-y-2">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover/card:opacity-10 blur-xl transition-all duration-700"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-3xl group-hover/card:blur-2xl transition-all duration-500 transform group-hover/card:scale-150 pointer-events-none"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 rounded-xl shadow-inner border border-white/50 dark:border-blue-700/30 group-hover/card:scale-110 transition-transform duration-500">
                          <Users
                            size={24}
                            className="text-blue-600 dark:text-blue-400 drop-shadow-sm"
                          />
                        </div>
                      </div>
                      <p className="text-blue-700/80 dark:text-blue-400/80 text-sm font-bold uppercase tracking-wider mb-1">
                        Officers
                      </p>
                      <p className="text-5xl font-black bg-gradient-to-br from-blue-700 to-cyan-600 dark:from-blue-300 dark:to-cyan-200 bg-clip-text text-transparent transform group-hover/card:scale-105 origin-left transition-transform duration-500">
                        {officers.length}
                      </p>
                    </div>
                  </div>

                  <div className="group/card relative overflow-hidden bg-white/40 dark:bg-[#0f172a]/60 backdrop-blur-3xl rounded-3xl shadow-lg dark:shadow-2xl hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)] dark:hover:shadow-[0_20px_40px_rgba(16,185,129,0.1)] transition-all duration-500 p-6 border-y border-white/80 dark:border-white/10 hover:border-emerald-300/50 dark:hover:border-emerald-500/50 transform hover:-translate-y-2">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-0 group-hover/card:opacity-10 blur-xl transition-all duration-700"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full blur-3xl group-hover/card:blur-2xl transition-all duration-500 transform group-hover/card:scale-150 pointer-events-none"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 rounded-xl shadow-inner border border-white/50 dark:border-emerald-700/30 group-hover/card:scale-110 transition-transform duration-500">
                          <Activity
                            size={24}
                            className="text-emerald-600 dark:text-emerald-400 drop-shadow-sm"
                          />
                        </div>
                      </div>
                      <p className="text-emerald-700/80 dark:text-emerald-400/80 text-sm font-bold uppercase tracking-wider mb-1">
                        Performance
                      </p>
                      <p className="text-5xl font-black bg-gradient-to-br from-emerald-700 to-teal-600 dark:from-emerald-300 dark:to-teal-200 bg-clip-text text-transparent transform group-hover/card:scale-105 origin-left transition-transform duration-500">
                        94%
                      </p>
                    </div>
                  </div>

                  <div className="group/card relative overflow-hidden bg-white/40 dark:bg-[#0f172a]/60 backdrop-blur-3xl rounded-3xl shadow-lg dark:shadow-2xl hover:shadow-[0_20px_40px_rgba(245,158,11,0.15)] dark:hover:shadow-[0_20px_40px_rgba(245,158,11,0.1)] transition-all duration-500 p-6 border-y border-white/80 dark:border-white/10 hover:border-amber-300/50 dark:hover:border-amber-500/50 transform hover:-translate-y-2">
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-400 opacity-0 group-hover/card:opacity-10 blur-xl transition-all duration-700"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-transparent rounded-full blur-3xl group-hover/card:blur-2xl transition-all duration-500 transform group-hover/card:scale-150 pointer-events-none"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 rounded-xl shadow-inner border border-white/50 dark:border-amber-700/30 group-hover/card:scale-110 transition-transform duration-500">
                          <Clock
                            size={24}
                            className="text-amber-600 dark:text-amber-400 drop-shadow-sm"
                          />
                        </div>
                      </div>
                      <p className="text-amber-700/80 dark:text-amber-400/80 text-sm font-bold uppercase tracking-wider mb-1">
                        Avg Time
                      </p>
                      <p className="text-5xl font-black bg-gradient-to-br from-amber-700 to-orange-600 dark:from-amber-300 dark:to-orange-200 bg-clip-text text-transparent transform group-hover/card:scale-105 origin-left transition-transform duration-500">
                        36h
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="group/qs relative overflow-hidden bg-white/40 dark:bg-[#0f172a]/60 backdrop-blur-3xl rounded-3xl p-6 border-y border-white/80 dark:border-white/10 hover:border-blue-300/50 dark:hover:border-blue-500/50 shadow-lg dark:shadow-2xl hover:shadow-[0_20px_40px_rgba(59,130,246,0.15)] dark:hover:shadow-[0_20px_40px_rgba(59,130,246,0.1)] transition-all duration-500 transform hover:-translate-y-2">
                    <div className="absolute -inset-1 bg-gradient-to-tr from-blue-500 to-indigo-400 opacity-0 group-hover/qs:opacity-10 blur-2xl transition-all duration-700"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-full blur-3xl group-hover/qs:blur-2xl transition-all duration-500 transform group-hover/qs:scale-150 pointer-events-none"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/50 dark:border-slate-700/50">
                        <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/60 dark:to-indigo-900/60 rounded-xl shadow-inner border border-white/50 dark:border-blue-700/30 group-hover/qs:scale-110 transition-transform duration-500">
                          <Target size={20} className="text-blue-600 dark:text-blue-400 drop-shadow-sm" />
                        </div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-900 to-indigo-700 dark:from-white dark:to-blue-200 bg-clip-text text-transparent tracking-tight">
                          Quick Stats
                        </h3>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="group/item flex items-center justify-between p-3 rounded-2xl hover:bg-white/60 dark:hover:bg-slate-800/60 border border-transparent hover:border-white/50 dark:hover:border-slate-700/50 transition-all duration-300">
                          <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                            <span className="font-bold text-slate-700 dark:text-slate-300 group-hover/item:text-cyan-600 dark:group-hover/item:text-cyan-400 transition-colors uppercase tracking-wider text-xs">
                              Unit Officers
                            </span>
                          </div>
                          <span className="font-black text-2xl text-slate-900 dark:text-white drop-shadow-sm group-hover/item:scale-110 transition-transform origin-right">
                            {officers.filter((o) => o.role === "unit_officer").length}
                          </span>
                        </div>
                        <div className="group/item flex items-center justify-between p-3 rounded-2xl hover:bg-white/60 dark:hover:bg-slate-800/60 border border-transparent hover:border-white/50 dark:hover:border-slate-700/50 transition-all duration-300">
                          <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                            <span className="font-bold text-slate-700 dark:text-slate-300 group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-400 transition-colors uppercase tracking-wider text-xs">
                              Field Officers
                            </span>
                          </div>
                          <span className="font-black text-2xl text-slate-900 dark:text-white drop-shadow-sm group-hover/item:scale-110 transition-transform origin-right">
                            {officers.filter((o) => o.role === "field_officer").length}
                          </span>
                        </div>
                        <div className="group/item flex items-center justify-between p-3 rounded-2xl hover:bg-white/60 dark:hover:bg-slate-800/60 border border-transparent hover:border-white/50 dark:hover:border-slate-700/50 transition-all duration-300">
                          <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
                            <span className="font-bold text-slate-700 dark:text-slate-300 group-hover/item:text-purple-600 dark:group-hover/item:text-purple-400 transition-colors uppercase tracking-wider text-xs">
                              Avg Workload / Officer
                            </span>
                          </div>
                          <span className="font-black text-2xl text-slate-900 dark:text-white drop-shadow-sm group-hover/item:scale-110 transition-transform origin-right">
                            {Math.round(issues.length / officers.length)}
                          </span>
                        </div>
                        <div className="group/item flex items-center justify-between p-3 rounded-2xl hover:bg-red-50/50 dark:hover:bg-red-900/30 border border-transparent hover:border-red-200/50 dark:hover:border-red-800/50 transition-all duration-300 mt-1">
                          <div className="flex items-center gap-4">
                            <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,1)] animate-ping relative">
                              <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            </div>
                            <span className="font-bold text-red-600 dark:text-red-400 uppercase tracking-wider text-xs">
                              Unassigned Issues
                            </span>
                          </div>
                          <span className="font-black text-3xl text-red-600 dark:text-red-400 drop-shadow-sm group-hover/item:scale-110 transition-transform origin-right">
                            {issues.filter((i) => !i.assignedTo).length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="group/sh relative overflow-hidden bg-white/40 dark:bg-[#0f172a]/60 backdrop-blur-3xl rounded-3xl p-6 border-y border-white/80 dark:border-white/10 hover:border-emerald-300/50 dark:hover:border-emerald-500/50 shadow-lg dark:shadow-2xl hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)] dark:hover:shadow-[0_20px_40px_rgba(16,185,129,0.1)] transition-all duration-500 transform hover:-translate-y-2">
                    <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-500 to-teal-400 opacity-0 group-hover/sh:opacity-10 blur-2xl transition-all duration-700"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/20 to-transparent rounded-full blur-3xl group-hover/sh:blur-2xl transition-all duration-500 transform group-hover/sh:scale-150 pointer-events-none"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/50 dark:border-slate-700/50">
                        <div className="p-2 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/60 dark:to-teal-900/60 rounded-xl shadow-inner border border-white/50 dark:border-emerald-700/30 group-hover/sh:scale-110 transition-transform duration-500">
                          <TrendingUp size={20} className="text-emerald-600 dark:text-emerald-400 drop-shadow-sm" />
                        </div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-900 to-teal-700 dark:from-white dark:to-emerald-200 bg-clip-text text-transparent tracking-tight">
                          System Health
                        </h3>
                      </div>
                      <div className="space-y-8">
                        <div className="group/bar relative">
                          <div className="flex items-end justify-between mb-3">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-700 dark:text-slate-300 group-hover/bar:text-emerald-600 dark:group-hover/bar:text-emerald-400 transition-colors uppercase tracking-wider text-xs mb-1">
                                Officer Utilization
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-500 font-medium">Capacity analysis</span>
                            </div>
                            <span className="font-black text-3xl text-slate-900 dark:text-white group-hover/bar:scale-110 transition-transform origin-right">
                              {Math.round(
                                (officers.filter(
                                  (o) =>
                                    officerWorkload.find(
                                      (ow) =>
                                        ow.officer.id === o.id && ow.total > 0,
                                    )?.total || 0,
                                ) /
                                  officers.length) *
                                  100,
                              )}%
                            </span>
                          </div>
                          <div className="w-full bg-black/5 dark:bg-black/20 rounded-full h-3 overflow-hidden border border-white/50 dark:border-white/5 relative shadow-inner">
                            <div
                              className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-[0_0_15px_rgba(56,189,248,0.8)] transition-all duration-1000 ease-out group-hover/bar:opacity-100 opacity-80"
                              style={{
                                width: `${Math.round((officers.filter((o) => officerWorkload.find((ow) => ow.officer.id === o.id && ow.total > 0)?.total || 0) / officers.length) * 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="group/bar relative">
                          <div className="flex items-end justify-between mb-3">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-700 dark:text-slate-300 group-hover/bar:text-emerald-600 dark:group-hover/bar:text-emerald-400 transition-colors uppercase tracking-wider text-xs mb-1">
                                Issue Resolution Rate
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-500 font-medium">Platform efficiency</span>
                            </div>
                            <span className="font-black text-3xl text-slate-900 dark:text-white group-hover/bar:scale-110 transition-transform origin-right">
                              {Math.round((stats.resolved / stats.total) * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-black/5 dark:bg-black/20 rounded-full h-3 overflow-hidden border border-white/50 dark:border-white/5 relative shadow-inner">
                            <div
                              className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.8)] transition-all duration-1000 ease-out group-hover/bar:opacity-100 opacity-80"
                              style={{
                                width: `${Math.round((stats.resolved / stats.total) * 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "officers" && (
            <div className="group/main relative overflow-hidden bg-white/40 dark:bg-[#0f172a]/40 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border-y border-white/80 dark:border-white/10 hover:border-emerald-300/50 dark:hover:border-teal-500/50 transition-all duration-700">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-400/20 via-transparent to-transparent opacity-0 group-hover/main:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>

              <div className="relative z-10 px-10 py-8 border-b border-white/50 dark:border-slate-700/50 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="relative group/icon">
                    <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-2xl blur-lg opacity-40 group-hover/icon:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                    <div className="relative p-3.5 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/80 dark:to-teal-900/80 rounded-2xl shadow-inner border border-white/50 dark:border-emerald-500/30 group-hover/icon:scale-110 transition-transform duration-500">
                      <Users className="text-emerald-600 dark:text-emerald-400 drop-shadow-sm" size={26} />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-black bg-gradient-to-r from-emerald-900 to-teal-700 dark:from-white dark:to-emerald-300 bg-clip-text text-transparent tracking-tight">
                      Officers Management
                    </h2>
                    <p className="text-sm font-bold text-emerald-700/60 dark:text-emerald-300/60 uppercase tracking-widest mt-1">
                      Personnel Tracking & Workload
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative z-10 p-10">
                <div className="relative z-[60] space-y-8">
                  <div className="relative z-[60] flex flex-wrap gap-5 items-center justify-between bg-slate-100/60 dark:bg-[#0b1121]/80 backdrop-blur-2xl p-5 rounded-3xl border-2 border-slate-200/90 dark:border-slate-700/80 shadow-[inset_0_2px_20px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_20px_rgba(0,0,0,0.4)]">
                    <div className="flex-1 min-w-[300px]">
                      <div className="relative group/search">
                        <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-2xl blur opacity-0 group-focus-within/search:opacity-40 transition-opacity duration-500"></div>
                        <Search
                          className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within/search:text-emerald-500 transition-colors z-10"
                          size={22}
                        />
                        <input
                          type="text"
                          value={officerSearchTerm}
                          onChange={(e) => setOfficerSearchTerm(e.target.value)}
                          placeholder="Search for an officer by name..."
                          className="relative w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-teal-500 rounded-2xl outline-none shadow-sm focus:shadow-md transition-all duration-300 text-slate-900 dark:text-white placeholder:text-slate-400 font-bold text-lg"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <button
                        onClick={() => {
                          if (filteredOfficers.length === 0) return;
                          if (expandedOfficers.size === filteredOfficers.length) {
                            setExpandedOfficers(new Set());
                          } else {
                            setExpandedOfficers(new Set(filteredOfficers.map(ow => ow.officer.id)));
                          }
                        }}
                        className="px-5 py-3.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-teal-500 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 min-w-[140px] justify-center group"
                      >
                         {expandedOfficers.size === filteredOfficers.length && filteredOfficers.length > 0 ? (
                           <><ChevronUp className="group-hover:-translate-y-0.5 transition-transform" size={18} /> Collapse All</>
                         ) : (
                           <><ChevronDown className="group-hover:translate-y-0.5 transition-transform" size={18} /> Expand All</>
                         )}
                      </button>
                    <div className="flex gap-4">
                      {/* Custom Dropdown: Officer Role */}
                      <div className="relative group/sel z-50">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl blur opacity-0 group-hover/sel:opacity-30 transition-opacity duration-500"></div>
                        <div className="relative px-5 py-3.5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-2 border-transparent group-hover/sel:border-emerald-400/50 dark:group-hover/sel:border-teal-500/50 rounded-xl shadow-inner transition-all duration-300 text-slate-900 dark:text-white font-bold cursor-pointer flex items-center justify-between min-w-[170px]">
                          <span>
                            {officerFilter === "all" ? "All Roles" : officerFilter === "unit_officer" ? "Unit Officers" : "Field Officers"}
                          </span>
                          <ChevronDown className="text-slate-400 group-hover/sel:text-emerald-500 transition-all duration-500 group-hover/sel:-rotate-180" size={18} />
                        </div>
                        <div className="absolute top-full left-0 mt-3 w-[200px] bg-white/90 dark:bg-slate-800/90 backdrop-blur-3xl rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] border border-white/60 dark:border-white/10 opacity-0 invisible group-hover/sel:opacity-100 group-hover/sel:visible transition-all duration-500 transform translate-y-4 group-hover/sel:translate-y-0 p-2 z-[60] origin-top">
                          {[
                            { val: 'all', label: 'All Roles' },
                            { val: 'unit_officer', label: 'Unit Officers' },
                            { val: 'field_officer', label: 'Field Officers' }
                          ].map(item => (
                            <div key={item.val} onClick={() => setOfficerFilter(item.val)} className={`px-4 py-3 rounded-xl cursor-pointer font-bold text-sm transition-all mb-1 last:mb-0 ${officerFilter === item.val ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-inner' : 'hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:pl-5'}`}>
                              {item.label}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Custom Dropdown: Workload */}
                      <div className="relative group/sel z-50">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl blur opacity-0 group-hover/sel:opacity-30 transition-opacity duration-500"></div>
                        <div className="relative px-5 py-3.5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-2 border-transparent group-hover/sel:border-emerald-400/50 dark:group-hover/sel:border-teal-500/50 rounded-xl shadow-inner transition-all duration-300 text-slate-900 dark:text-white font-bold cursor-pointer flex items-center justify-between min-w-[200px]">
                          <span>
                            {workloadFilter === "all" ? "All Workloads" : workloadFilter === "overloaded" ? "Overloaded" : workloadFilter === "balanced" ? "Balanced" : "Underutilized"}
                          </span>
                          <ChevronDown className="text-slate-400 group-hover/sel:text-emerald-500 transition-all duration-500 group-hover/sel:-rotate-180" size={18} />
                        </div>
                        <div className="absolute top-full right-0 mt-3 w-[220px] bg-white/90 dark:bg-slate-800/90 backdrop-blur-3xl rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] border border-white/60 dark:border-white/10 opacity-0 invisible group-hover/sel:opacity-100 group-hover/sel:visible transition-all duration-500 transform translate-y-4 group-hover/sel:translate-y-0 p-2 z-[60] origin-top">
                          {[
                            { val: 'all', label: 'All Workloads' },
                            { val: 'overloaded', label: 'Overloaded' },
                            { val: 'balanced', label: 'Balanced' },
                            { val: 'underutilized', label: 'Underutilized' }
                          ].map(item => (
                            <div key={item.val} onClick={() => setWorkloadFilter(item.val)} className={`px-4 py-3 rounded-xl cursor-pointer font-bold text-sm transition-all mb-1 last:mb-0 ${workloadFilter === item.val ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-inner' : 'hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:pl-5'}`}>
                               {item.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                  <div className="space-y-5">
                    {filteredOfficers.map((ow) => {
                      const isExpanded = expandedOfficers.has(ow.officer.id);
                      return (
                        <div
                          key={ow.officer.id}
                          className={`group/ro bg-white/40 dark:bg-[#0f172a]/40 backdrop-blur-3xl rounded-3xl shadow-lg dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-500 border-y hover:border-slate-300/50 dark:hover:border-slate-500/50 transform overflow-hidden relative ${isExpanded ? 'border-emerald-300/50 dark:border-emerald-500/50 ring-2 ring-emerald-500/20' : 'border-white/80 dark:border-white/10 hover:-translate-y-1'}`}
                        >
                          <div className={`absolute top-0 right-0 w-96 h-96 blur-3xl opacity-20 dark:opacity-10 group-hover/ro:scale-125 transition-transform duration-700 pointer-events-none rounded-full ${ow.workloadStatus === 'overloaded' ? 'bg-red-500' : ow.workloadStatus === 'underutilized' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                          <div
                            className={`relative p-6 z-10 ${
                              isExpanded 
                                ? "bg-white/40 dark:bg-slate-800/40" 
                                : ow.workloadStatus === "overloaded"
                                  ? "bg-gradient-to-r from-red-50/80 to-rose-50/40 dark:from-red-900/40 dark:to-rose-900/10"
                                  : ow.workloadStatus === "underutilized"
                                    ? "bg-gradient-to-r from-amber-50/80 to-yellow-50/40 dark:from-amber-900/40 dark:to-yellow-900/10"
                                    : "bg-gradient-to-r from-emerald-50/80 to-teal-50/40 dark:from-emerald-900/40 dark:to-teal-900/10"
                            } transition-colors duration-500`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-5 flex-1">
                                <div className="relative group/avatar">
                                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-2xl blur opacity-0 group-hover/avatar:opacity-50 transition-opacity duration-500"></div>
                                  <div
                                    className={`relative w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl border border-white/20 transition-transform duration-500 group-hover/avatar:scale-105 ${
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
                                    className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-[3px] border-white dark:border-slate-800 shadow-[0_0_10px_rgba(0,0,0,0.5)] ${
                                      ow.workloadStatus === "overloaded"
                                        ? "bg-red-500 shadow-red-500"
                                        : ow.workloadStatus === "underutilized"
                                          ? "bg-amber-500 shadow-amber-500"
                                          : "bg-emerald-500 shadow-emerald-500"
                                    }`}
                                  ></div>
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-black text-slate-900 dark:text-white text-xl tracking-tight">
                                    {ow.officer.full_name}
                                  </h3>
                                  <div className="flex items-center gap-3 mt-1.5">
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-inner ${ow.officer.role === "unit_officer" ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300" : "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"}`}>
                                      {ow.officer.role === "unit_officer" ? <Shield size={12} /> : <Zap size={12} />}
                                      {ow.officer.role === "unit_officer" ? "Unit Officer" : "Field Officer"}
                                    </span>
                                    {ow.officer.ward_zone && (
                                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-slate-200/50 dark:border-slate-700/50">
                                        <MapPin size={12} />
                                        {ow.officer.ward_zone}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-6">
                                <div className="flex items-center gap-8 mr-6">
                                  <div className="text-center group/stat">
                                    <p className="text-3xl font-black text-slate-900 dark:text-white transition-transform group-hover/stat:scale-110 drop-shadow-sm">
                                      {ow.total}
                                    </p>
                                    <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold mt-1">
                                      Total
                                    </p>
                                  </div>
                                  <div className="text-center group/stat">
                                    <p className="text-3xl font-black text-amber-500 dark:text-amber-400 transition-transform group-hover/stat:scale-110 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
                                      {ow.inProgress}
                                    </p>
                                    <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold mt-1">
                                      Active
                                    </p>
                                  </div>
                                  <div className="text-center group/stat">
                                    <p className="text-3xl font-black text-emerald-500 dark:text-emerald-400 transition-transform group-hover/stat:scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                                      {ow.resolved}
                                    </p>
                                    <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold mt-1">
                                      Resolved
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => openMessageModal(ow.officer, ow.issues)}
                                    className="relative group/msg flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-[0_5px_15px_rgba(59,130,246,0.4)] transition-all duration-300 transform hover:-translate-y-0.5 font-bold text-sm"
                                  >
                                    <div className="absolute inset-0 bg-white/20 rounded-xl blur opacity-0 group-hover/msg:opacity-100 transition-opacity"></div>
                                    <Mail size={16} className="relative z-10 drop-shadow-sm" />
                                    <span className="relative z-10">Message</span>
                                  </button>
                                  <button
                                    onClick={() => toggleOfficerExpand(ow.officer.id)}
                                    className={`p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center ${isExpanded ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 shadow-inner' : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-md border border-slate-200/50 dark:border-slate-700/50'}`}
                                  >
                                    <ChevronDown size={20} className={`transform transition-transform duration-500 ${isExpanded ? '-rotate-180' : ''}`} />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {isExpanded && (
                              <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="grid grid-cols-4 gap-6 mb-6">
                                  <div className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-sm rounded-xl p-4 border border-white/40 dark:border-slate-700/40 shadow-sm">
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
                                  <div className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-sm rounded-xl p-4 border border-white/40 dark:border-slate-700/40 shadow-sm">
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
                                  <div className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-sm rounded-xl p-4 border border-white/40 dark:border-slate-700/40 shadow-sm">
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
                                  <div className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-sm rounded-xl p-4 border border-white/40 dark:border-slate-700/40 shadow-sm">
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
                                            className={`group/issue relative bg-white/95 dark:bg-slate-800 border-y border-r border-slate-200 dark:border-slate-700 border-l-4 rounded-xl p-5 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 ${
                                              issue.status === "resolved" ? "border-l-emerald-500 hover:border-r-emerald-400" :
                                              issue.status === "in_progress" ? "border-l-blue-500 hover:border-r-blue-400" :
                                              "border-l-amber-500 hover:border-r-amber-400"
                                            }`}
                                            onClick={() =>
                                              setSelectedIssue(issue)
                                            }
                                          >
                                            <div className="flex items-start justify-between mb-3">
                                              <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                  <code className={`text-xs font-black px-2.5 py-1 rounded-md shadow-inner ${
                                                    issue.status === "resolved" ? "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400" :
                                                    issue.status === "in_progress" ? "bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400" :
                                                    "bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400"
                                                  }`}>
                                                    {issue.ticket_id}
                                                  </code>
                                                  {isOverdue && (
                                                    <span className="flex items-center gap-1 text-[10px] uppercase font-black text-white bg-gradient-to-r from-red-600 to-rose-500 px-2 py-1 rounded-md shadow-sm">
                                                      <AlertTriangle
                                                        size={12}
                                                      />
                                                      Overdue
                                                    </span>
                                                  )}
                                                </div>
                                                <h5 className="font-bold text-base text-slate-900 dark:text-white mb-1 group-hover/issue:text-emerald-600 dark:group-hover/issue:text-teal-400 transition-colors">
                                                  {issue.title}
                                                </h5>
                                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                                  <Clock size={12} />
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
                                                className="ml-3 px-3 py-2 bg-slate-100 hover:bg-blue-600 dark:bg-slate-700 dark:hover:bg-blue-500 text-slate-600 hover:text-white dark:text-slate-300 rounded-lg transition-all text-xs font-bold flex items-center gap-1.5 opacity-0 group-hover/issue:opacity-100 shadow-sm"
                                              >
                                                <UserCheck size={14} />
                                                Reassign
                                              </button>
                                            </div>
                                            <div className="space-y-1.5 mt-2">
                                              <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                                                  Progress
                                                </span>
                                                <span className="font-black text-slate-900 dark:text-white text-sm">
                                                  {progressPercent}%
                                                </span>
                                              </div>
                                              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden shadow-inner">
                                                <div
                                                  className={`h-full rounded-full transition-all duration-1000 relative ${
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
                                                >
                                                  <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/30 animate-pulse"></div>
                                                </div>
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
            <div className="bg-white/60 dark:bg-[#111827]/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 dark:border-slate-700/50 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500/90 to-cyan-600/90 backdrop-blur-md p-5 border-b border-white/10">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Target size={24} />
                  Assignment Monitoring
                </h2>
              </div>
              <div className="p-6">
                <div className="relative z-[60] space-y-6">
                  <div className="relative z-[60] flex flex-wrap gap-5 items-center justify-between bg-slate-100/60 dark:bg-[#0b1121]/80 backdrop-blur-2xl p-5 rounded-3xl border-2 border-slate-200/90 dark:border-slate-700/80 shadow-[inset_0_2px_20px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_20px_rgba(0,0,0,0.4)]">
                    <div className="flex-1 min-w-[300px]">
                      <div className="relative group/search">
                        <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl blur opacity-0 group-focus-within/search:opacity-40 transition-opacity duration-500"></div>
                        <Search
                          className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within/search:text-blue-500 transition-colors z-10"
                          size={22}
                        />
                        <input
                          type="text"
                          value={assignmentSearchTerm}
                          onChange={(e) => setAssignmentSearchTerm(e.target.value)}
                          placeholder="Search for an assigned officer..."
                          className="relative w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-cyan-500 rounded-2xl outline-none shadow-sm focus:shadow-md transition-all duration-300 text-slate-900 dark:text-white placeholder:text-slate-400 font-bold text-lg"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <button
                        onClick={() => {
                          if (filteredAssignmentOfficers.length === 0) return;
                          if (expandedAssignmentOfficers.size === filteredAssignmentOfficers.length) {
                            setExpandedAssignmentOfficers(new Set());
                          } else {
                            setExpandedAssignmentOfficers(new Set(filteredAssignmentOfficers.map(ow => ow.officer.id)));
                          }
                        }}
                        className="px-5 py-3.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-cyan-500 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 min-w-[140px] justify-center group"
                      >
                         {expandedAssignmentOfficers.size === filteredAssignmentOfficers.length && filteredAssignmentOfficers.length > 0 ? (
                           <><ChevronUp className="group-hover:-translate-y-0.5 transition-transform" size={18} /> Collapse All</>
                         ) : (
                           <><ChevronDown className="group-hover:translate-y-0.5 transition-transform" size={18} /> Expand All</>
                         )}
                      </button>
                      <div className="relative group/sel z-50">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl blur opacity-0 group-hover/sel:opacity-30 transition-opacity duration-500"></div>
                        <div className="relative px-5 py-3.5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-2 border-transparent group-hover/sel:border-blue-400/50 dark:group-hover/sel:border-cyan-500/50 rounded-xl shadow-inner transition-all duration-300 text-slate-900 dark:text-white font-bold cursor-pointer flex items-center justify-between min-w-[170px]">
                          <span>
                            {assignmentOfficerFilter === "all" ? "All Roles" : assignmentOfficerFilter === "unit_officer" ? "Unit Officers" : "Field Officers"}
                          </span>
                          <ChevronDown className="text-slate-400 group-hover/sel:text-blue-500 transition-all duration-500 group-hover/sel:-rotate-180" size={18} />
                        </div>
                        <div className="absolute top-full right-0 mt-3 w-[200px] bg-white/90 dark:bg-slate-800/90 backdrop-blur-3xl rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] border border-white/60 dark:border-white/10 opacity-0 invisible group-hover/sel:opacity-100 group-hover/sel:visible transition-all duration-500 transform translate-y-4 group-hover/sel:translate-y-0 p-2 z-[60] origin-top">
                          {[
                            { val: 'all', label: 'All Roles' },
                            { val: 'unit_officer', label: 'Unit Officers' },
                            { val: 'field_officer', label: 'Field Officers' }
                          ].map(item => (
                            <div key={item.val} onClick={() => setAssignmentOfficerFilter(item.val)} className={`px-4 py-3 rounded-xl cursor-pointer font-bold text-sm transition-all mb-1 last:mb-0 ${assignmentOfficerFilter === item.val ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 shadow-inner' : 'hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:pl-5'}`}>
                              {item.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="group relative overflow-hidden bg-white/40 dark:bg-emerald-900/20 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/60 dark:border-emerald-700/30 hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)] transition-all duration-300 transform hover:-translate-y-1">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                      <div className="relative flex items-center justify-between">
                        <div>
                          <p className="text-sm text-emerald-700/80 dark:text-emerald-300/80 font-bold uppercase tracking-wider mb-1">
                            On Track
                          </p>
                          <p className="text-4xl font-black bg-gradient-to-r from-emerald-900 to-teal-700 dark:from-emerald-100 dark:to-teal-300 bg-clip-text text-transparent transform group-hover:scale-105 origin-left transition-transform duration-500">
                            {assignedIssues.length - overdueIssues.length}
                          </p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-800/60 dark:to-teal-800/60 rounded-xl shadow-inner border border-white/50 dark:border-emerald-600/30 group-hover:scale-110 transition-transform duration-500">
                          <CheckCircle
                            className="text-emerald-600 dark:text-emerald-400 drop-shadow-sm"
                            size={32}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="group relative overflow-hidden bg-white/40 dark:bg-amber-900/20 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/60 dark:border-amber-700/30 hover:shadow-[0_8px_30px_rgba(245,158,11,0.15)] transition-all duration-300 transform hover:-translate-y-1">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-400/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                      <div className="relative flex items-center justify-between">
                        <div>
                          <p className="text-sm text-amber-700/80 dark:text-amber-300/80 font-bold uppercase tracking-wider mb-1">
                            Near Deadline
                          </p>
                          <p className="text-4xl font-black bg-gradient-to-r from-amber-900 to-orange-700 dark:from-amber-100 dark:to-orange-300 bg-clip-text text-transparent transform group-hover:scale-105 origin-left transition-transform duration-500">
                            {Math.floor(assignedIssues.length * 0.15)}
                          </p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-800/60 dark:to-orange-800/60 rounded-xl shadow-inner border border-white/50 dark:border-amber-600/30 group-hover:scale-110 transition-transform duration-500">
                          <Clock
                            className="text-amber-600 dark:text-amber-400 drop-shadow-sm"
                            size={32}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="group relative overflow-hidden bg-white/40 dark:bg-red-900/20 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/60 dark:border-red-700/30 hover:shadow-[0_8px_30px_rgba(239,68,68,0.15)] transition-all duration-300 transform hover:-translate-y-1">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-400/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                      <div className="relative flex items-center justify-between">
                        <div>
                          <p className="text-sm text-red-700/80 dark:text-red-300/80 font-bold uppercase tracking-wider mb-1">
                            SLA Breached
                          </p>
                          <p className="text-4xl font-black bg-gradient-to-r from-red-900 to-rose-700 dark:from-red-100 dark:to-rose-300 bg-clip-text text-transparent transform group-hover:scale-105 origin-left transition-transform duration-500">
                            {overdueIssues.length}
                          </p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-800/60 dark:to-rose-800/60 rounded-xl shadow-inner border border-white/50 dark:border-red-600/30 group-hover:scale-110 transition-transform duration-500">
                          <AlertTriangle
                            className="text-red-600 dark:text-red-400 drop-shadow-sm animate-pulse"
                            size={32}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="group relative overflow-hidden bg-white/40 dark:bg-slate-900/20 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/60 dark:border-slate-700/30 hover:shadow-[0_8px_30px_rgba(148,163,184,0.15)] transition-all duration-300 transform hover:-translate-y-1">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-400/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                      <div className="relative flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-700/80 dark:text-slate-300/80 font-bold uppercase tracking-wider mb-1">
                            Unassigned
                          </p>
                          <p className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent transform group-hover:scale-105 origin-left transition-transform duration-500">
                            {issues.filter((i) => !i.assignedTo).length}
                          </p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800/60 dark:to-slate-700/60 rounded-xl shadow-inner border border-white/50 dark:border-slate-600/30 group-hover:scale-110 transition-transform duration-500">
                          <AlertCircle
                            className="text-slate-600 dark:text-slate-400 drop-shadow-sm"
                            size={32}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={() => setIsAssignedExpanded(!isAssignedExpanded)}
                      className="w-full flex items-center justify-between p-5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg text-blue-600 dark:text-blue-400">
                          <Users size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Assigned Target Queue</h3>
                        <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-md text-sm font-bold">
                          {filteredAssignmentOfficers.length} Officers
                        </span>
                      </div>
                      <ChevronDown size={24} className={`text-slate-400 group-hover:text-blue-500 transition-transform duration-300 ${isAssignedExpanded ? '-rotate-180' : ''}`} />
                    </button>

                    {isAssignedExpanded && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
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
                          className="group/assign bg-white/40 dark:bg-[#0f172a]/40 backdrop-blur-3xl rounded-3xl shadow-lg dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-500 border-y border-white/80 dark:border-white/10 hover:border-slate-300/50 dark:hover:border-slate-500/50 transform hover:-translate-y-1 overflow-hidden relative"
                        >
                          <div className="absolute top-0 right-0 w-96 h-96 blur-3xl opacity-20 dark:opacity-10 group-hover/assign:scale-125 transition-transform duration-700 pointer-events-none rounded-full bg-blue-500"></div>
                          <div className="relative z-10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm p-6 border-b border-white/40 dark:border-slate-700/50">
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
                                      className="w-full pl-9 pr-3 py-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner focus:border-blue-500 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
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
                                      className="flex-1 px-3 py-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner text-sm text-slate-900 dark:text-white"
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
                                      className="flex-1 px-3 py-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner text-sm text-slate-900 dark:text-white"
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
                  )}
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
                    <div className="bg-white/60 dark:bg-[#1e293b]/50 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 dark:border-slate-700/50 overflow-hidden">
                      <button
                        onClick={() => setIsUnassignedExpanded(!isUnassignedExpanded)}
                        className="w-full flex items-center justify-between p-6 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border-b border-white/40 dark:border-slate-700/50 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors group"
                      >
                        <div className="text-left">
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
                        <ChevronDown size={24} className={`text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-transform duration-300 ${isUnassignedExpanded ? '-rotate-180' : ''}`} />
                      </button>
                      
                      {isUnassignedExpanded && (
                      <div className="p-6 animate-in fade-in slide-in-from-top-4 duration-500">
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
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "messages" && (
            <div className="group/main relative overflow-hidden bg-white/40 dark:bg-[#0f172a]/40 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border-y border-white/80 dark:border-white/10 hover:border-blue-300/50 dark:hover:border-indigo-500/50 transition-all duration-700">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent opacity-0 group-hover/main:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>

              <div className="relative z-10 px-10 py-8 border-b border-white/50 dark:border-slate-700/50 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="relative group/icon">
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl blur opacity-40 group-hover/icon:opacity-75 transition duration-500"></div>
                    <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transform group-hover/icon:scale-110 group-hover/icon:rotate-3 transition-all duration-500">
                      <MessageSquare size={28} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">Messages Center</h2>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-blue-500"></span> Communication Hub
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative z-10 p-2 md:p-8">
                <MessagesCenter user={user} />
              </div>
            </div>
          )}

          {/* {activeTab === 'sla' && (
            <div className="bg-white/60 dark:bg-[#111827]/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 dark:border-slate-700/50 overflow-hidden">
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
              <div className="bg-white/60 dark:bg-[#111827]/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 dark:border-slate-700/50 overflow-hidden">
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
                <div className="bg-gradient-to-r from-emerald-500/90 to-teal-600/90 backdrop-blur-md p-5 border-b border-white/10">
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
          )} */}

          {/* {activeTab === 'audit' && (
            <div className="bg-white/60 dark:bg-[#111827]/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 dark:border-slate-700/50 overflow-hidden">
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
