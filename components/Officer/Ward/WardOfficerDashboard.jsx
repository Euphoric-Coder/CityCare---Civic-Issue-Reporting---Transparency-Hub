"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  MessageSquare,
  Search,
  Filter,
  Calendar,
  MapPin,
  Eye,
  TrendingUp,
  RefreshCw,
  Menu,
  X as CloseIcon,
  ChevronLeft,
  ChevronRight,
  ArrowUpCircle,
  Maximize2,
  Minimize2,
} from "lucide-react";
import * as localStorageService from "@/lib/localStorageService";
import { WOIssueDetailPanel } from "./WOIssueDetailPanel";

export function WardOfficerWorkflow() {
  const { user } = { id: "3" };
  const [issues, setIssues] = useState([]);
  const [fieldOfficers, setFieldOfficers] = useState([]);
  const [activeView, setActiveView] = useState("overview");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("overdue");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  function loadData() {
    setIsLoading(true);
    try {
      const issuesData = localStorageService.getWardOfficerIssuesFromStorage(
        user?.id
      );
      const officersData = localStorageService.getFieldOfficersFromStorage();
      setIssues(issuesData);
      setFieldOfficers(officersData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const stats = {
    pending_verification: issues.filter(
      (i) =>
        i.internal_status === "pending_verification" && i.status !== "rejected"
    ).length,
    verified: issues.filter(
      (i) => i.internal_status === "verified" && !i.assigned_to
    ).length,
    in_progress: issues.filter(
      (i) =>
        i.status === "in_progress" &&
        i.internal_status === "assigned" &&
        i.internal_status !== "fo_marked_resolved" &&
        i.internal_status !== "reopened"
    ).length,
    fo_verified: issues.filter(
      (i) => i.internal_status === "fo_marked_resolved"
    ).length,
    reopened: issues.filter((i) => i.internal_status === "reopened").length,
    escalated: issues.filter((i) => i.internal_status === "escalated_to_admin")
      .length,
    overdue: issues.filter(
      (i) => i.is_overdue && i.status !== "resolved" && i.status !== "rejected"
    ).length,
  };

  const getFilteredIssues = () => {
    let filtered = [...issues];

    if (activeView === "pending_verification") {
      filtered = filtered.filter(
        (i) =>
          i.internal_status === "pending_verification" &&
          i.status !== "rejected"
      );
    } else if (activeView === "verified") {
      filtered = filtered.filter(
        (i) => i.internal_status === "verified" && !i.assigned_to
      );
    } else if (activeView === "in_progress") {
      filtered = filtered.filter(
        (i) =>
          i.status === "in_progress" &&
          i.assigned_to &&
          i.internal_status !== "fo_marked_resolved" &&
          i.internal_status !== "reopened"
      );
    } else if (activeView === "fo_verified") {
      filtered = filtered.filter(
        (i) => i.internal_status === "fo_marked_resolved"
      );
    } else if (activeView === "resolved") {
      filtered = filtered.filter((i) => i.status === "resolved");
    } else if (activeView === "rejected") {
      filtered = filtered.filter((i) => i.status === "rejected");
    } else if (activeView === "reopened") {
      filtered = filtered.filter((i) => i.internal_status === "reopened");
    } else if (activeView === "escalated") {
      filtered = filtered.filter(
        (i) => i.internal_status === "escalated_to_admin"
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (i) =>
          i.ticket_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          i.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((i) => i.category === categoryFilter);
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((i) => i.severity === priorityFilter);
    }

    if (sortBy === "newest") {
      filtered.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortBy === "oldest") {
      filtered.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    } else if (sortBy === "overdue") {
      filtered.sort((a, b) => {
        if (a.is_overdue && !b.is_overdue) return -1;
        if (!a.is_overdue && b.is_overdue) return 1;
        return b.priority_score - a.priority_score;
      });
    } else if (sortBy === "priority") {
      filtered.sort((a, b) => b.priority_score - a.priority_score);
    }

    return filtered;
  };

  const filteredIssues = getFilteredIssues();

  const getCategoryIcon = (category) => {
    const icons = {
      road: "🛣️",
      lighting: "💡",
      waste: "🗑️",
      water: "💧",
      other: "📋",
    };
    return icons[category] || "📋";
  };

  const getStatusBadge = (issue) => {
    if (issue.status === "rejected") {
      return (
        <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full">
          Rejected
        </span>
      );
    }
    if (issue.status === "resolved") {
      return (
        <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
          Resolved
        </span>
      );
    }
    if (issue.internal_status === "fo_marked_resolved") {
      return (
        <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
          Pending WO Verification
        </span>
      );
    }
    if (issue.internal_status === "reopened") {
      return (
        <span className="px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-700 rounded-full">
          Reopened
        </span>
      );
    }
    if (issue.internal_status === "pending_verification") {
      return (
        <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded-full">
          Pending Verification
        </span>
      );
    }
    if (issue.internal_status === "verified" && !issue.assigned_to) {
      return (
        <span className="px-2 py-1 text-xs font-semibold bg-teal-100 text-teal-700 rounded-full">
          Verified - Awaiting Assignment
        </span>
      );
    }
    if (issue.status === "in_progress") {
      return (
        <span className="px-2 py-1 text-xs font-semibold bg-cyan-100 text-cyan-700 rounded-full">
          In Progress
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded-full">
        {issue.status}
      </span>
    );
  };

  const SidebarContent = () => (
    <>
      <div
        className={`p-5 border-b border-gray-200 bg-gradient-to-br from-teal-600 to-cyan-700 ${sidebarCollapsed ? "px-3" : ""}`}
      >
        <div className="flex items-center justify-between">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-lg shadow-lg">
                WO
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Ward Officer</h2>
                <p className="text-xs text-teal-100 mt-0.5">
                  Management Portal
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center w-full">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold shadow-lg">
                WO
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden md:block text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-white/80 hover:text-white"
            >
              <CloseIcon size={24} />
            </button>
          </div>
        </div>
      </div>

      <nav
        className={`flex-1 ${sidebarCollapsed ? "p-2" : "p-4"} space-y-1.5 overflow-y-auto`}
      >
        <button
          onClick={() => {
            setActiveView("overview");
            setSidebarOpen(false);
          }}
          className={`w-full flex items-center ${sidebarCollapsed ? "justify-center px-2" : "gap-3 px-4"} py-3 text-sm font-semibold rounded-xl transition-all ${
            activeView === "overview"
              ? "bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 shadow-sm"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          title={sidebarCollapsed ? "Overview" : ""}
        >
          <LayoutDashboard size={20} className="flex-shrink-0" />
          {!sidebarCollapsed && (
            <span className="whitespace-nowrap">Overview</span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveView("pending_verification");
            setSidebarOpen(false);
          }}
          className={`w-full flex items-center justify-between ${sidebarCollapsed ? "px-2" : "px-4"} py-3 text-sm font-semibold rounded-xl transition-all ${
            activeView === "pending_verification"
              ? "bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 shadow-sm"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          title={sidebarCollapsed ? "Pending Verification" : ""}
        >
          <div
            className={`flex items-center ${sidebarCollapsed ? "justify-center w-full" : "gap-3"}`}
          >
            <Clock size={20} className="flex-shrink-0" />
            {!sidebarCollapsed && (
              <span className="whitespace-nowrap">Pending Verification</span>
            )}
          </div>
          {stats.pending_verification > 0 && !sidebarCollapsed && (
            <span className="px-2 py-0.5 text-xs font-bold bg-yellow-100 text-yellow-700 rounded-full flex-shrink-0">
              {stats.pending_verification}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveView("verified");
            setSidebarOpen(false);
          }}
          className={`w-full flex items-center justify-between ${sidebarCollapsed ? "px-2" : "px-4"} py-3 text-sm font-semibold rounded-xl transition-all ${
            activeView === "verified"
              ? "bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 shadow-sm"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          title={sidebarCollapsed ? "Verified - Assign FO" : ""}
        >
          <div
            className={`flex items-center ${sidebarCollapsed ? "justify-center w-full" : "gap-3"}`}
          >
            <CheckCircle size={20} className="flex-shrink-0" />
            {!sidebarCollapsed && (
              <span className="whitespace-nowrap">Verified - Assign FO</span>
            )}
          </div>
          {stats.verified > 0 && !sidebarCollapsed && (
            <span className="px-2 py-0.5 text-xs font-bold bg-teal-100 text-teal-700 rounded-full flex-shrink-0">
              {stats.verified}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveView("in_progress");
            setSidebarOpen(false);
          }}
          className={`w-full flex items-center justify-between ${sidebarCollapsed ? "px-2" : "px-4"} py-3 text-sm font-semibold rounded-xl transition-all ${
            activeView === "in_progress"
              ? "bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 shadow-sm"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          title={sidebarCollapsed ? "In Progress" : ""}
        >
          <div
            className={`flex items-center ${sidebarCollapsed ? "justify-center w-full" : "gap-3"}`}
          >
            <TrendingUp size={20} className="flex-shrink-0" />
            {!sidebarCollapsed && (
              <span className="whitespace-nowrap">In Progress</span>
            )}
          </div>
          {stats.in_progress > 0 && !sidebarCollapsed && (
            <span className="px-2 py-0.5 text-xs font-bold bg-cyan-100 text-cyan-700 rounded-full flex-shrink-0">
              {stats.in_progress}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveView("fo_verified");
            setSidebarOpen(false);
          }}
          className={`w-full flex items-center justify-between ${sidebarCollapsed ? "px-2" : "px-4"} py-3 text-sm font-semibold rounded-xl transition-all ${
            activeView === "fo_verified"
              ? "bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 shadow-sm"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          title={sidebarCollapsed ? "Pending WO Verification" : ""}
        >
          <div
            className={`flex items-center ${sidebarCollapsed ? "justify-center w-full" : "gap-3"}`}
          >
            <Eye size={20} className="flex-shrink-0" />
            {!sidebarCollapsed && (
              <span className="whitespace-nowrap">Pending WO Verification</span>
            )}
          </div>
          {stats.fo_verified > 0 && !sidebarCollapsed && (
            <span className="px-2 py-0.5 text-xs font-bold bg-blue-100 text-blue-700 rounded-full flex-shrink-0">
              {stats.fo_verified}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveView("resolved");
            setSidebarOpen(false);
          }}
          className={`w-full flex items-center ${sidebarCollapsed ? "justify-center px-2" : "gap-3 px-4"} py-3 text-sm font-semibold rounded-xl transition-all ${
            activeView === "resolved"
              ? "bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 shadow-sm"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          title={sidebarCollapsed ? "Resolved" : ""}
        >
          <CheckCircle size={20} className="flex-shrink-0" />
          {!sidebarCollapsed && (
            <span className="whitespace-nowrap">Resolved</span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveView("rejected");
            setSidebarOpen(false);
          }}
          className={`w-full flex items-center ${sidebarCollapsed ? "justify-center px-2" : "gap-3 px-4"} py-3 text-sm font-semibold rounded-xl transition-all ${
            activeView === "rejected"
              ? "bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 shadow-sm"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          title={sidebarCollapsed ? "Rejected" : ""}
        >
          <XCircle size={20} className="flex-shrink-0" />
          {!sidebarCollapsed && (
            <span className="whitespace-nowrap">Rejected</span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveView("reopened");
            setSidebarOpen(false);
          }}
          className={`w-full flex items-center justify-between ${sidebarCollapsed ? "px-2" : "px-4"} py-3 text-sm font-semibold rounded-xl transition-all ${
            activeView === "reopened"
              ? "bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 shadow-sm"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          title={sidebarCollapsed ? "Reopened" : ""}
        >
          <div
            className={`flex items-center ${sidebarCollapsed ? "justify-center w-full" : "gap-3"}`}
          >
            <RefreshCw size={20} className="flex-shrink-0" />
            {!sidebarCollapsed && (
              <span className="whitespace-nowrap">Reopened</span>
            )}
          </div>
          {stats.reopened > 0 && !sidebarCollapsed && (
            <span className="px-2 py-0.5 text-xs font-bold bg-orange-100 text-orange-700 rounded-full flex-shrink-0">
              {stats.reopened}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveView("escalated");
            setSidebarOpen(false);
          }}
          className={`w-full flex items-center justify-between ${sidebarCollapsed ? "px-2" : "px-4"} py-3 text-sm font-semibold rounded-xl transition-all ${
            activeView === "escalated"
              ? "bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 shadow-sm"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          title={sidebarCollapsed ? "Admin Escalation" : ""}
        >
          <div
            className={`flex items-center ${sidebarCollapsed ? "justify-center w-full" : "gap-3"}`}
          >
            <ArrowUpCircle size={20} className="flex-shrink-0" />
            {!sidebarCollapsed && (
              <span className="whitespace-nowrap">Admin Escalation</span>
            )}
          </div>
          {stats.escalated > 0 && !sidebarCollapsed && (
            <span className="px-2 py-0.5 text-xs font-bold bg-rose-100 text-rose-700 rounded-full flex-shrink-0">
              {stats.escalated}
            </span>
          )}
        </button>

        <div
          className={`h-px bg-gray-200 ${sidebarCollapsed ? "my-3" : "my-4"}`}
        ></div>

        <button
          onClick={() => {
            setActiveView("field_officers");
            setSidebarOpen(false);
          }}
          className={`w-full flex items-center ${sidebarCollapsed ? "justify-center px-2" : "gap-3 px-4"} py-3 text-sm font-semibold rounded-xl transition-all ${
            activeView === "field_officers"
              ? "bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 shadow-sm"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          title={sidebarCollapsed ? "Field Officers" : ""}
        >
          <Users size={20} className="flex-shrink-0" />
          {!sidebarCollapsed && (
            <span className="whitespace-nowrap">Field Officers</span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveView("messages");
            setSidebarOpen(false);
          }}
          className={`w-full flex items-center ${sidebarCollapsed ? "justify-center px-2" : "gap-3 px-4"} py-3 text-sm font-semibold rounded-xl transition-all ${
            activeView === "messages"
              ? "bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 shadow-sm"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          title={sidebarCollapsed ? "Messages" : ""}
        >
          <MessageSquare size={20} className="flex-shrink-0" />
          {!sidebarCollapsed && (
            <span className="whitespace-nowrap">Messages</span>
          )}
        </button>
      </nav>
    </>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar - Desktop */}
      <div
        className={`hidden md:flex ${sidebarCollapsed ? "md:w-20" : "md:w-72"} bg-white border-r border-gray-200 flex-col transition-all duration-300 ease-in-out shadow-lg`}
      >
        <SidebarContent />
      </div>

      {/* Left Sidebar - Mobile */}
      <div
        className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-200 flex flex-col z-50 transform transition-transform duration-300 md:hidden shadow-2xl ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-gradient-to-r from-teal-600 to-cyan-700 p-4 flex items-center justify-between shadow-lg">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white hover:text-teal-100"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-bold text-white">Ward Officer Portal</h1>
          <div className="w-6" />
        </div>

        {/* Top Summary Cards */}
        {activeView === "overview" && (
          <div className="p-5 md:p-8 bg-gradient-to-br from-white to-gray-50 border-b border-gray-200 shadow-sm">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                Dashboard Overview
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                Monitor and manage all civic issues efficiently
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
              <button
                onClick={() => setActiveView("pending_verification")}
                className="group bg-gradient-to-br from-yellow-50 via-white to-yellow-50/50 p-5 md:p-6 rounded-2xl border-2 border-yellow-200 hover:border-yellow-400 hover:shadow-xl transition-all text-left relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-2.5 rounded-xl shadow-md">
                      <Clock className="text-white" size={20} />
                    </div>
                    <span className="text-2xl md:text-3xl font-bold text-gray-900">
                      {stats.pending_verification}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">
                    Pending Verification
                  </p>
                </div>
              </button>

              <button
                onClick={() => setActiveView("verified")}
                className="group bg-gradient-to-br from-teal-50 via-white to-teal-50/50 p-5 md:p-6 rounded-2xl border-2 border-teal-200 hover:border-teal-400 hover:shadow-xl transition-all text-left relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-gradient-to-br from-teal-400 to-teal-500 p-2.5 rounded-xl shadow-md">
                      <CheckCircle className="text-white" size={20} />
                    </div>
                    <span className="text-2xl md:text-3xl font-bold text-gray-900">
                      {stats.verified}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">
                    Verified - Assign FO
                  </p>
                </div>
              </button>

              <button
                onClick={() => setActiveView("in_progress")}
                className="group bg-gradient-to-br from-cyan-50 via-white to-cyan-50/50 p-5 md:p-6 rounded-2xl border-2 border-cyan-200 hover:border-cyan-400 hover:shadow-xl transition-all text-left relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-gradient-to-br from-cyan-400 to-cyan-500 p-2.5 rounded-xl shadow-md">
                      <TrendingUp className="text-white" size={20} />
                    </div>
                    <span className="text-2xl md:text-3xl font-bold text-gray-900">
                      {stats.in_progress}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">
                    In Progress
                  </p>
                </div>
              </button>

              <button
                onClick={() => setActiveView("fo_verified")}
                className="group bg-gradient-to-br from-blue-50 via-white to-blue-50/50 p-5 md:p-6 rounded-2xl border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all text-left relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-gradient-to-br from-blue-400 to-blue-500 p-2.5 rounded-xl shadow-md">
                      <Eye className="text-white" size={20} />
                    </div>
                    <span className="text-2xl md:text-3xl font-bold text-gray-900">
                      {stats.fo_verified}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">
                    Pending WO Verification
                  </p>
                </div>
              </button>

              <button
                onClick={() => setActiveView("reopened")}
                className="group bg-gradient-to-br from-orange-50 via-white to-orange-50/50 p-5 md:p-6 rounded-2xl border-2 border-orange-200 hover:border-orange-400 hover:shadow-xl transition-all text-left relative overflow-hidden col-span-2 lg:col-span-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-gradient-to-br from-orange-400 to-orange-500 p-2.5 rounded-xl shadow-md">
                      <RefreshCw className="text-white" size={20} />
                    </div>
                    <span className="text-2xl md:text-3xl font-bold text-gray-900">
                      {stats.reopened}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">
                    Reopened
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Filters and Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Issue List */}
          <div
            className={`${selectedIssue ? "hidden lg:block lg:w-2/5" : "w-full"} flex flex-col border-r border-gray-200 bg-white`}
          >
            {/* Search and Filters */}
            <div className="p-4 md:p-5 border-b border-gray-200 space-y-4 bg-gradient-to-br from-gray-50 to-white">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by ID, title, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition-all shadow-sm"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm font-medium transition-all shadow-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="road">Road</option>
                  <option value="lighting">Lighting</option>
                  <option value="waste">Waste</option>
                  <option value="water">Water</option>
                  <option value="other">Other</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm font-medium transition-all shadow-sm"
                >
                  <option value="all">All Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm font-medium transition-all shadow-sm"
                >
                  <option value="overdue">Overdue First</option>
                  <option value="priority">High Priority</option>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
            </div>

            {/* Issue Cards */}
            <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4 bg-gray-50">
              {activeView === "field_officers" ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    Field Officers
                  </h3>
                  {fieldOfficers.map((officer) => (
                    <div
                      key={officer.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-white font-bold text-sm md:text-lg">
                            {officer.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm md:text-base">
                              {officer.full_name}
                            </h4>
                            <p className="text-xs md:text-sm text-gray-600">
                              {officer.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span className="font-semibold text-sm md:text-base">
                            {officer.rating}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-xs md:text-sm">
                        <div>
                          <p className="text-gray-600">Active</p>
                          <p className="font-semibold">
                            {officer.active_workload}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Resolved</p>
                          <p className="font-semibold">
                            {officer.total_resolved}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Status</p>
                          <span
                            className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${
                              officer.availability_status === "available"
                                ? "bg-green-100 text-green-700"
                                : officer.availability_status === "busy"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {officer.availability_status}
                          </span>
                        </div>
                      </div>
                      {officer.specializations &&
                        officer.specializations.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {officer.specializations.map((spec) => (
                              <span
                                key={spec}
                                className="px-2 py-1 text-xs bg-teal-50 text-teal-700 rounded-full"
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              ) : activeView === "messages" ? (
                <div className="text-center py-12">
                  <MessageSquare
                    className="mx-auto text-gray-400 mb-4"
                    size={48}
                  />
                  <p className="text-gray-600">Messages feature coming soon</p>
                </div>
              ) : filteredIssues.length === 0 ? (
                <div className="text-center py-12">
                  <Filter className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-600">
                    No issues found matching your criteria
                  </p>
                </div>
              ) : (
                filteredIssues.map((issue) => (
                  <div
                    key={issue.id}
                    onClick={() => setSelectedIssue(issue)}
                    className={`group bg-white border-2 rounded-2xl p-4 md:p-5 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-0.5 ${
                      selectedIssue?.id === issue.id
                        ? "border-teal-500 shadow-lg ring-2 ring-teal-100"
                        : "border-gray-200"
                    } ${issue.is_overdue ? "border-l-4 border-l-red-500 bg-red-50/30" : ""}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl flex items-center justify-center w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl group-hover:scale-110 transition-transform">
                          {getCategoryIcon(issue.category)}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm md:text-base">
                            {issue.ticket_id}
                          </h3>
                          <p className="text-xs text-gray-600 capitalize font-medium">
                            {issue.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        {getStatusBadge(issue)}
                        {issue.is_overdue && (
                          <span className="px-2.5 py-1 text-xs font-bold bg-gradient-to-r from-red-100 to-red-200 text-red-700 rounded-full flex items-center gap-1 shadow-sm">
                            <AlertTriangle size={12} />
                            Overdue
                          </span>
                        )}
                      </div>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-3 line-clamp-2 text-sm md:text-base">
                      {issue.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-3 bg-gray-50 px-3 py-2 rounded-lg">
                      <MapPin
                        size={14}
                        className="text-gray-400 flex-shrink-0"
                      />
                      <span className="line-clamp-1 font-medium">
                        {issue.address}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="font-medium">
                          {new Date(issue.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1.5 rounded-lg font-bold shadow-sm ${
                          issue.severity === "high"
                            ? "bg-gradient-to-r from-red-100 to-red-200 text-red-700"
                            : issue.severity === "medium"
                              ? "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700"
                              : "bg-gradient-to-r from-green-100 to-green-200 text-green-700"
                        }`}
                      >
                        {issue.severity}
                      </span>
                    </div>
                    {issue.photo_url && (
                      <div className="mt-4">
                        <img
                          src={issue.photo_url}
                          alt={issue.title}
                          className="w-full h-28 md:h-36 object-cover rounded-xl shadow-sm"
                        />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Issue Detail Modal */}
          {selectedIssue && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
              <div
                className={`bg-white rounded-lg shadow-2xl flex flex-col ${isFullScreen ? "w-full h-full" : "w-full max-w-6xl h-[90vh]"}`}
              >
                <div className="p-4 md:p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 pr-4">
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                        {selectedIssue.ticket_id}
                      </h2>
                      <p className="text-sm md:text-base text-gray-600 mt-1 line-clamp-2">
                        {selectedIssue.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setIsFullScreen(!isFullScreen)}
                        className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        title={isFullScreen ? "Minimize" : "Maximize"}
                      >
                        {isFullScreen ? (
                          <Minimize2 size={20} />
                        ) : (
                          <Maximize2 size={20} />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedIssue(null);
                          setIsFullScreen(false);
                        }}
                        className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <CloseIcon size={24} />
                      </button>
                    </div>
                  </div>
                </div>
                <WOIssueDetailPanel
                  issue={selectedIssue}
                  fieldOfficers={fieldOfficers}
                  onClose={() => {
                    setSelectedIssue(null);
                    setIsFullScreen(false);
                  }}
                  onUpdate={(updatedIssue) => {
                    setIssues(
                      issues.map((i) =>
                        i.id === updatedIssue.id ? updatedIssue : i
                      )
                    );
                    setSelectedIssue(updatedIssue);
                    loadData();
                  }}
                  hideHeader={true}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
