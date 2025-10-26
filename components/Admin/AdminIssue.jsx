import { X, Calendar, MapPin, Tag, Clock, User, MessageSquare, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  in_progress: 'bg-blue-100 text-blue-800 border-blue-300',
  resolved: 'bg-green-100 text-green-800 border-green-300',
};

const statusLabels = {
  pending: 'Pending',
  in_progress: 'In Progress',
  resolved: 'Resolved',
};

const categoryLabels = {
  road: 'Road & Infrastructure',
  lighting: 'Street Lighting',
  waste: 'Waste Management',
  water: 'Water Supply',
  other: 'Other',
};

const categoryIcons = {
  road: '🛣️',
  lighting: '💡',
  waste: '🗑️',
  water: '💧',
  other: '📋',
};

export function AdminIssueModal({ issue, onClose, onUpdated }) {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("pending");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (issue) {
      setNewStatus(issue.status);
      loadUpdates();
    }
  }, [issue]);

  // Load updates (dummy)
  async function loadUpdates() {
    if (!issue) return;
    setLoading(true);

    try {
      // Simulate a network delay
      await new Promise((res) => setTimeout(res, 400));

      // Load dummy updates from issue prop or fallback
      const dummyUpdates = issue.updates || [
        {
          id: 1,
          status: issue.status,
          comment: "Initial report created",
          created_at: issue.created_at,
          updater: { full_name: "Citizen User", role: "user" },
        },
      ];

      setUpdates(dummyUpdates);
    } catch (error) {
      console.error("Error loading updates:", error);
    } finally {
      setLoading(false);
    }
  }

  // Handle status/comment update (dummy)
  async function handleUpdate() {
    if (!issue) return;

    setError("");
    setSuccess("");
    setUpdating(true);

    try {
      // Simulate a delay
      await new Promise((res) => setTimeout(res, 800));

      // Create a new local update
      const newUpdate = {
        id: Date.now(),
        status: newStatus,
        comment: comment || null,
        created_at: new Date().toISOString(),
        updater: { full_name: "Admin User", role: "admin" },
      };

      // Add update locally
      setUpdates((prev) => [...prev, newUpdate]);

      // Update issue status locally (non-persistent)
      issue.status = newStatus;

      setSuccess("Issue updated successfully!");
      setComment("");

      // Optionally call parent refresh
      setTimeout(() => {
        if (onUpdated) onUpdated();
      }, 800);
    } catch (err) {
      console.error("Error updating issue:", err);
      setError("Failed to update issue");
    } finally {
      setUpdating(false);
    }
  }

  if (!issue) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{issue.title}</h2>
            <p className="text-sm text-gray-500 mt-1 font-mono">
              {issue.ticket_id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Update Status
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment (Optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                  placeholder="Add a comment about this update..."
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
                  {success}
                </div>
              )}

              <button
                onClick={handleUpdate}
                disabled={updating || newStatus === issue.status}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Save size={20} className="mr-2" />
                {updating ? "Updating..." : "Update Issue"}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${
                statusColors[issue.status]
              }`}
            >
              {statusLabels[issue.status]}
            </span>
            <div className="flex items-center text-sm text-gray-600">
              <Tag size={16} className="mr-1" />
              {categoryIcons[issue.category]} {categoryLabels[issue.category]}
            </div>
          </div>

          {issue.photo_url && (
            <div>
              <img
                src={issue.photo_url}
                alt={issue.title}
                className="w-full rounded-lg"
              />
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Description
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {issue.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar size={16} className="mr-2" />
              <span>
                Reported: {new Date(issue.created_at).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock size={16} className="mr-2" />
              <span>
                Updated: {new Date(issue.updated_at).toLocaleString()}
              </span>
            </div>
          </div>

          {issue.address && (
            <div className="flex items-start text-sm text-gray-600">
              <MapPin size={16} className="mr-2 mt-1 flex-shrink-0" />
              <span>{issue.address}</span>
            </div>
          )}

          {updates.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <MessageSquare size={20} className="mr-2" />
                Timeline
              </h3>
              <div className="space-y-4">
                {updates.map((update) => (
                  <div
                    key={update.id}
                    className="border-l-4 border-blue-500 pl-4 py-2"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${
                          statusColors[update.status]
                        }`}
                      >
                        {statusLabels[update.status]}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(update.created_at).toLocaleString()}
                      </span>
                    </div>
                    {update.comment && (
                      <p className="text-sm text-gray-700 mt-2">
                        {update.comment}
                      </p>
                    )}
                    {update.updater && (
                      <div className="flex items-center text-xs text-gray-500 mt-2">
                        <User size={12} className="mr-1" />
                        <span>
                          Updated by {update.updater.full_name}
                          {update.updater.role === "admin" && " (Admin)"}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
