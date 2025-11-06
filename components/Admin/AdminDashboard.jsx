import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  RefreshCw,
  Shield,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  MessageSquare,
  UserCheck,
  Mail,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { getIssues, mockUsers } from "@/lib/mockData";
import { AdminIssueModal } from "./AdminIssue";
import { AdminMessageModal } from "./AdminMessageModal";
import { AdminReassignModal } from "./AdminReassignModal";
import { IssueCard } from "../IssueCard";
import { MessagesCenter } from "../MessageCenter";

export function AdminDashboard() {
  const { data: session } = useSession();
  console.log(session);
  const user = { id: "2" };
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [activeView, setActiveView] = useState("issues");
  const [messageOfficer, setMessageOfficer] = useState(null);
  const [messageIssues, setMessageIssues] = useState([]);
  const [reassignIssue, setReassignIssue] = useState(null);

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

  function handleIssueUpdated(issueId, updates) {
    setIssues(
      issues.map((issue) =>
        issue.id === issueId ? { ...issue, ...updates } : issue
      )
    );
    setSelectedIssue(null);
  }

  function handleSendMessage(officerId, message, issueIds) {
    if (!user) {
      console.log("User not logged in");
      return;
    }

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

    console.log(`Message sent to officer ${officerId}:`, message);
    if (issueIds && issueIds.length > 0) {
      console.log("Referenced issues:", issueIds);
    }

    alert(
      `Message sent successfully!\n\nThe officer will be notified and can reply from their Messages Center.`
    );
    setMessageOfficer(null);
    setMessageIssues([]);
  }

  function handleReassign(issueId, newOfficerId, reason) {
    const issue = issues.find((i) => i.id === issueId);
    const oldOfficer = officers.find((o) => o.id === issue?.assignedTo);
    const newOfficer = officers.find((o) => o.id === newOfficerId);

    setIssues(
      issues.map((i) =>
        i.id === issueId
          ? {
              ...i,
              assignedTo: newOfficerId,
              updatedAt: new Date().toISOString(),
            }
          : i
      )
    );

    console.log("Reassignment recorded:", {
      issueId,
      from: oldOfficer?.full_name,
      to: newOfficer?.full_name,
      reason,
      timestamp: new Date().toISOString(),
    });

    alert(
      `Issue reassigned successfully!\n\nFrom: ${oldOfficer?.full_name || "Unassigned"}\nTo: ${newOfficer?.full_name}\nReason: ${reason}\n\nBoth officers have been notified.`
    );
    setReassignIssue(null);
    setSelectedIssue(null);
  }

  function openMessageModal(officer, officerIssues) {
    console.log(officer, officerIssues);
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
              updatedAt: new Date().toISOString(),
            }
          : i
      )
    );

    console.log("Assignment revoked:", {
      issueId,
      from: officer?.full_name,
      reason,
      timestamp: new Date().toISOString(),
    });

    alert(
      `Assignment revoked successfully!\n\nFrom: ${officer?.full_name}\nReason: ${reason}\n\nThe officer has been notified and the issue is now unassigned.`
    );
    setSelectedIssue(null);
  }

  const stats = {
    total: issues.length,
    pending: issues.filter((i) => i.status === "pending").length,
    in_progress: issues.filter((i) => i.status === "in_progress").length,
    resolved: issues.filter((i) => i.status === "resolved").length,
  };

  const officers = mockUsers.filter(
    (u) => u.role === "ward_officer" || u.role === "field_officer"
  );

  const officerWorkload = officers.map((officer) => {
    const assignedIssues = issues.filter((i) => i.assignedTo === officer.id);
    const pending = assignedIssues.filter((i) => i.status === "pending").length;
    const inProgress = assignedIssues.filter(
      (i) => i.status === "in_progress"
    ).length;
    const resolved = assignedIssues.filter(
      (i) => i.status === "resolved"
    ).length;
    const total = assignedIssues.length;

    return {
      officer,
      total,
      pending,
      inProgress,
      resolved,
      issues: assignedIssues,
      completionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-start flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl shadow-lg">
              <Shield className="text-white" size={28} />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-gray-600 text-lg ml-14">
            Manage and update civic issues across the city
          </p>
        </div>
        <button
          onClick={loadIssues}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all font-medium"
        >
          <RefreshCw size={20} className="mr-2" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="group bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-200 hover:border-gray-300 transform hover:-translate-y-1">
          <p className="text-gray-600 text-sm font-medium mb-2">Total Issues</p>
          <p className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {stats.total}
          </p>
          <div className="mt-3 h-1 bg-gradient-to-r from-gray-400 to-gray-200 rounded-full"></div>
        </div>
        <div className="group bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 border border-yellow-300 hover:border-yellow-400 transform hover:-translate-y-1">
          <p className="text-yellow-800 text-sm font-medium mb-2">Pending</p>
          <p className="text-4xl font-bold text-yellow-800">{stats.pending}</p>
          <div className="mt-3 h-1 bg-gradient-to-r from-yellow-400 to-yellow-200 rounded-full"></div>
        </div>
        <div className="group bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 border border-blue-300 hover:border-blue-400 transform hover:-translate-y-1">
          <p className="text-blue-800 text-sm font-medium mb-2">In Progress</p>
          <p className="text-4xl font-bold text-blue-800">
            {stats.in_progress}
          </p>
          <div className="mt-3 h-1 bg-gradient-to-r from-blue-400 to-blue-200 rounded-full"></div>
        </div>
        <div className="group bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 border border-green-300 hover:border-green-400 transform hover:-translate-y-1">
          <p className="text-green-800 text-sm font-medium mb-2">Resolved</p>
          <p className="text-4xl font-bold text-green-800">{stats.resolved}</p>
          <div className="mt-3 h-1 bg-gradient-to-r from-green-400 to-green-200 rounded-full"></div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveView("issues")}
            className={`flex-1 py-4 px-6 font-semibold transition-colors ${
              activeView === "issues"
                ? "bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 border-b-2 border-orange-500"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            All Issues
          </button>
          <button
            onClick={() => setActiveView("assignments")}
            className={`flex-1 py-4 px-6 font-semibold transition-colors ${
              activeView === "assignments"
                ? "bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 border-b-2 border-orange-500"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Users size={18} className="inline mr-2" />
            Officer Assignments
          </button>
          <button
            onClick={() => setActiveView("messages")}
            className={`flex-1 py-4 px-6 font-semibold transition-colors ${
              activeView === "messages"
                ? "bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 border-b-2 border-orange-500"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Mail size={18} className="inline mr-2" />
            Messages
          </button>
        </div>
      </div>

      {activeView === "issues" ? (
        <>
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search issues..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter size={20} className="text-gray-600" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading issues...</p>
            </div>
          ) : filteredIssues.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-600">
                No issues found matching your filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIssues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onClick={() => setSelectedIssue(issue)}
                />
              ))}
            </div>
          )}
        </>
      ) : activeView === "assignments" ? (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
              <Users size={24} className="mr-2 text-orange-600" />
              Officer Workload Overview
            </h2>
            <p className="text-gray-600">
              Track assigned work and progress for all officers
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading assignments...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {officerWorkload.map(
                ({
                  officer,
                  total,
                  pending,
                  inProgress,
                  resolved,
                  issues,
                  completionRate,
                }) => (
                  <div
                    key={officer.id}
                    className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all"
                  >
                    <div
                      className={`p-6 ${
                        officer.role === "ward_officer"
                          ? "bg-gradient-to-r from-teal-50 to-emerald-50 border-b-2 border-teal-200"
                          : "bg-gradient-to-r from-cyan-50 to-blue-50 border-b-2 border-cyan-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg ${
                              officer.role === "ward_officer"
                                ? "bg-gradient-to-br from-teal-600 to-emerald-700"
                                : "bg-gradient-to-br from-cyan-600 to-blue-700"
                            }`}
                          >
                            {officer.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">
                              {officer.full_name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  officer.role === "ward_officer"
                                    ? "bg-teal-200 text-teal-800"
                                    : "bg-cyan-200 text-cyan-800"
                                }`}
                              >
                                {officer.role === "ward_officer"
                                  ? "🏛️ Ward Officer"
                                  : "🔧 Field Officer"}
                              </span>
                              {officer.ward_zone && (
                                <span className="text-sm text-gray-600 font-medium">
                                  {officer.ward_zone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-3xl font-bold text-gray-800">
                            {total}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">
                            Assigned Issues
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-yellow-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-yellow-700 text-sm font-medium">
                              Pending
                            </span>
                            <AlertTriangle
                              size={18}
                              className="text-yellow-600"
                            />
                          </div>
                          <div className="text-2xl font-bold text-yellow-800">
                            {pending}
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-blue-700 text-sm font-medium">
                              In Progress
                            </span>
                            <Clock size={18} className="text-blue-600" />
                          </div>
                          <div className="text-2xl font-bold text-blue-800">
                            {inProgress}
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-sm border border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-green-700 text-sm font-medium">
                              Resolved
                            </span>
                            <CheckCircle size={18} className="text-green-600" />
                          </div>
                          <div className="text-2xl font-bold text-green-800">
                            {resolved}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-700">
                            Completion Rate
                          </span>
                          <span className="text-sm font-bold text-gray-800">
                            {completionRate}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              completionRate >= 70
                                ? "bg-gradient-to-r from-green-500 to-emerald-600"
                                : completionRate >= 40
                                  ? "bg-gradient-to-r from-blue-500 to-cyan-600"
                                  : "bg-gradient-to-r from-orange-500 to-red-600"
                            }`}
                            style={{ width: `${completionRate}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="mt-6 flex gap-3">
                        <button
                          onClick={() => openMessageModal(officer, issues)}
                          className="flex-1 flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                        >
                          <MessageSquare size={18} className="mr-2" />
                          Send Message
                        </button>
                      </div>
                    </div>

                    {issues.length > 0 && (
                      <div className="p-6">
                        <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                          Assigned Issues ({issues.length})
                        </h4>
                        <div className="space-y-3">
                          {issues.slice(0, 5).map((issue) => (
                            <div
                              key={issue.id}
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg transition-all border border-gray-200 hover:border-gray-300"
                            >
                              <div
                                className="flex-1 cursor-pointer"
                                onClick={() => setSelectedIssue(issue)}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-mono text-sm text-gray-500">
                                    {issue.ticket}
                                  </span>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      issue.status === "pending"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : issue.status === "in_progress"
                                          ? "bg-blue-100 text-blue-700"
                                          : "bg-green-100 text-green-700"
                                    }`}
                                  >
                                    {issue.status === "pending"
                                      ? "Pending"
                                      : issue.status === "in_progress"
                                        ? "In Progress"
                                        : "Resolved"}
                                  </span>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      issue.severity === "high"
                                        ? "bg-red-100 text-red-700"
                                        : issue.severity === "medium"
                                          ? "bg-orange-100 text-orange-700"
                                          : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {issue.severity.toUpperCase()}
                                  </span>
                                </div>
                                <p className="font-medium text-gray-800 text-sm">
                                  {issue.title}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                  {issue.address}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <div className="text-right">
                                  <div className="text-xs text-gray-500">
                                    Updated
                                  </div>
                                  <div className="text-xs font-medium text-gray-700">
                                    {new Date(
                                      issue.updatedAt
                                    ).toLocaleDateString()}
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setReassignIssue(issue);
                                  }}
                                  className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                  title="Reassign Issue"
                                >
                                  <UserCheck size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                          {issues.length > 5 && (
                            <div className="text-center py-2">
                              <span className="text-sm text-gray-500">
                                + {issues.length - 5} more issues
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {issues.length === 0 && (
                      <div className="p-6 text-center text-gray-500">
                        <p>No issues currently assigned</p>
                      </div>
                    )}
                  </div>
                )
              )}

              {officerWorkload.every((o) => o.total === 0) && (
                <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                  <Users size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 text-lg">No assignments yet</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Assign issues to officers from the issues view
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <MessagesCenter />
      )}

      <AdminIssueModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
        onUpdated={handleIssueUpdated}
        fromAssignmentView={activeView === "assignments"}
        onReassign={handleReassign}
        onRevoke={handleRevoke}
      />

      <AdminMessageModal
        officer={messageOfficer}
        issues={messageIssues}
        onClose={() => {
          setMessageOfficer(null);
          setMessageIssues([]);
        }}
        onSend={handleSendMessage}
      />

      <AdminReassignModal
        issue={reassignIssue}
        officers={officers}
        onClose={() => setReassignIssue(null)}
        onReassign={handleReassign}
      />
    </div>
  );
}
