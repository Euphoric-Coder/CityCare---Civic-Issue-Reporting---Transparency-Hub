import { X, Calendar, MapPin, Tag, Clock, User, MessageSquare, TrendingUp, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { mockIssueUpdates } from '../lib/mockData';
import { IssueDiscussion } from './IssueDiscussion';

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

const severityColors = {
  high: 'bg-red-100 text-red-800 border-red-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  low: 'bg-green-100 text-green-800 border-green-300',
};

const severityLabels = {
  high: 'High Priority',
  medium: 'Medium Priority',
  low: 'Low Priority',
};

export function IssueDetailModal({ issue, onClose }) {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (issue) {
      loadUpdates();
    }
  }, [issue]);

  async function loadUpdates() {
    if (!issue) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    const issueUpdates = mockIssueUpdates[issue.id] || [];
    setUpdates(issueUpdates);
    setLoading(false);
  }

  if (!issue) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{issue.title}</h2>
            <p className="text-sm text-gray-500 mt-1 font-mono">{issue.ticket_id}</p>
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
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${
                statusColors[issue.status]
              }`}
            >
              {statusLabels[issue.status]}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${
                severityColors[issue.severity]
              }`}
            >
              <AlertCircle size={14} className="inline mr-1" />
              {severityLabels[issue.severity]}
            </span>
            <div className="flex items-center text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
              <Tag size={14} className="mr-1" />
              {categoryIcons[issue.category]} {categoryLabels[issue.category]}
            </div>
            {issue.priority_score > 0 && (
              <div className="flex items-center text-sm text-gray-600 bg-purple-50 px-3 py-1 rounded-full">
                <TrendingUp size={14} className="mr-1 text-purple-600" />
                <span className="font-semibold text-purple-700">Score: {issue.priority_score.toFixed(1)}</span>
              </div>
            )}
            {issue.upvotes > 0 && (
              <div className="flex items-center text-sm bg-orange-50 px-3 py-1 rounded-full text-orange-700 font-semibold">
                👍 {issue.upvotes}
              </div>
            )}
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
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{issue.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar size={16} className="mr-2" />
              <span>Reported: {new Date(issue.created_at).toLocaleString()}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock size={16} className="mr-2" />
              <span>Updated: {new Date(issue.updated_at).toLocaleString()}</span>
            </div>
          </div>

          {issue.address && (
            <div className="flex items-start text-sm text-gray-600">
              <MapPin size={16} className="mr-2 mt-1 flex-shrink-0" />
              <span>{issue.address}</span>
            </div>
          )}

          {issue.latitude && issue.longitude && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Location</h3>
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  Latitude: {issue.latitude}, Longitude: {issue.longitude}
                </p>
                <a
                  href={`https://www.google.com/maps?q=${issue.latitude},${issue.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block"
                >
                  View on Google Maps
                </a>
              </div>
            </div>
          )}

          {updates.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <MessageSquare size={20} className="mr-2" />
                Official Updates Timeline
              </h3>
              <div className="space-y-4">
                {updates.map((update) => (
                  <div key={update.id} className="border-l-4 border-blue-500 pl-4 py-2">
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
                      <p className="text-sm text-gray-700 mt-2">{update.comment}</p>
                    )}
                    {update.updater && (
                      <div className="flex items-center text-xs text-gray-500 mt-2">
                        <User size={12} className="mr-1" />
                        <span>
                          Updated by {update.updater.full_name}
                          {update.updater.role === 'admin' && ' (Admin)'}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <IssueDiscussion issueId={issue.id} />
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
