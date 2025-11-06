"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  AlertCircle,
  MapPin,
  Calendar,
  User,
  CheckCircle,
  Mail,
} from "lucide-react";
import { getIssues } from "@/lib/mockData";
import { OfficerIssueModal } from "../OfficerIssueModal";
import { IssueCard } from "@/components/IssueCard";
import { MessagesCenter } from "@/components/MessageCenter";

export function WardOfficerDashboard() {
  const user = { id: "3" };
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [activeView, setActiveView] = useState("issues");

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
      const data = getIssues()
        .filter(
          (issue) => issue.assignedTo === user?.id || issue.status === "pending"
        )
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
          issue.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((issue) => issue.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((issue) => issue.category === categoryFilter);
    }

    filtered.sort((a, b) => b.priorityScore - a.priorityScore);
    setFilteredIssues(filtered);
  }

  async function handleStatusUpdate(issueId, newStatus, comment) {
    setIssues(
      issues.map((issue) =>
        issue.id === issueId
          ? {
              ...issue,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            }
          : issue
      )
    );
    setSelectedIssue(null);
  }

  const stats = {
    total: issues.length,
    pending: issues.filter((i) => i.status === "pending").length,
    inProgress: issues.filter(
      (i) => i.status === "in_progress" && i.assignedTo === user?.id
    ).length,
    resolved: issues.filter(
      (i) => i.status === "resolved" && i.assignedTo === user?.id
    ).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-800 bg-clip-text text-transparent mb-2">
          Ward Officer Dashboard
        </h1>
        <p className="text-gray-600">
          Manage and resolve civic issues in your ward
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">
                Total Assigned
              </p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {stats.total}
              </p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <AlertCircle className="text-gray-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-white p-6 rounded-xl shadow-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">
                Pending Review
              </p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">
                {stats.pending}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Filter className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-white p-6 rounded-xl shadow-lg border border-teal-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">In Progress</p>
              <p className="text-3xl font-bold text-teal-600 mt-1">
                {stats.inProgress}
              </p>
            </div>
            <div className="bg-teal-100 p-3 rounded-lg">
              <MapPin className="text-teal-600" size={24} />
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

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveView("issues")}
            className={`flex-1 py-4 px-6 font-semibold transition-colors ${
              activeView === "issues"
                ? "bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-700 border-b-2 border-teal-500"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            My Issues
          </button>
          <button
            onClick={() => setActiveView("messages")}
            className={`flex-1 py-4 px-6 font-semibold transition-colors ${
              activeView === "messages"
                ? "bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-700 border-b-2 border-teal-500"
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
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search issues by title, description, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600 text-lg">
                  No issues found matching your criteria
                </p>
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
        </>
      ) : (
        <MessagesCenter />
      )}

      {selectedIssue && (
        <OfficerIssueModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onStatusUpdate={handleStatusUpdate}
          officerRole="ward_officer"
        />
      )}
    </div>
  );
}
