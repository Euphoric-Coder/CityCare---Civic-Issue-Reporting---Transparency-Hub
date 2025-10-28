import { getMockUser } from '@/lib/mockData';
import { X, Calendar, MapPin, Tag, Clock, User, MessageSquare, Save, XCircle, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  in_progress: 'bg-blue-100 text-blue-800 border-blue-300',
  resolved: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  rejected: 'bg-red-100 text-red-800 border-red-300',
};

const statusLabels = {
  pending: 'Pending',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  rejected: 'Rejected',
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

export function AdminIssueModal({ issue, onClose, onUpdated, fromAssignmentView, onReassign, onRevoke }) {
  const [action, setAction] = useState('status');
  const [newStatus, setNewStatus] = useState('pending');
  const [assignTo, setAssignTo] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [comment, setComment] = useState('');
  const [success, setSuccess] = useState('');
  const [reassignReason, setReassignReason] = useState('');
  const [revokeReason, setRevokeReason] = useState('');

  const wardOfficers = getMockUser().filter(u => u.role === 'ward_officer');
  const fieldOfficers = getMockUser().filter(u => u.role === 'field_officer');

  useEffect(() => {
    if (issue) {
      setNewStatus(issue.status);
      setAssignTo(issue.assigned_to || '');
    }
  }, [issue]);

  function handleUpdate() {
    if (!issue) return;

    setSuccess('');

    if (action === 'reassign') {
      if (!assignTo || assignTo === issue.assigned_to) {
        alert('Please select a different officer to reassign to');
        return;
      }
      if (!reassignReason.trim()) {
        alert('Please provide a reason for reassignment');
        return;
      }
      if (onReassign) {
        onReassign(issue.id, assignTo, reassignReason);
      }
      return;
    } else if (action === 'revoke') {
      if (!revokeReason.trim()) {
        alert('Please provide a reason for revoking assignment');
        return;
      }
      if (onRevoke) {
        onRevoke(issue.id, revokeReason);
      }
      return;
    } else if (action === 'reject') {
      if (!rejectReason.trim()) {
        alert('Please provide a reason for rejection');
        return;
      }
      onUpdated(issue.id, {
        status: 'rejected',
        rejection_reason: rejectReason,
        updated_at: new Date().toISOString()
      });
      setSuccess('Issue rejected successfully!');
    } else if (action === 'assign') {
      if (!assignTo) {
        alert('Please select an officer to assign');
        return;
      }
      onUpdated(issue.id, {
        assigned_to: assignTo,
        status: 'in_progress',
        updated_at: new Date().toISOString()
      });
      setSuccess('Issue assigned successfully!');
    } else {
      onUpdated(issue.id, {
        status: newStatus,
        updated_at: new Date().toISOString()
      });
      setSuccess('Status updated successfully!');
    }

    setTimeout(() => {
      onClose();
    }, 1000);
  }

  if (!issue) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
          <div className={`${fromAssignmentView ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'} border rounded-lg p-5`}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {fromAssignmentView ? 'Assignment Management' : 'Admin Actions'}
            </h3>

            {fromAssignmentView ? (
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setAction('reassign')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    action === 'reassign'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <UserPlus size={18} className="inline mr-2" />
                  Reassign Officer
                </button>
                <button
                  onClick={() => setAction('revoke')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    action === 'revoke'
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <XCircle size={18} className="inline mr-2" />
                  Revoke Assignment
                </button>
              </div>
            ) : (
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setAction('status')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    action === 'status'
                      ? 'bg-teal-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Save size={18} className="inline mr-2" />
                  Update Status
                </button>
                <button
                  onClick={() => setAction('assign')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    action === 'assign'
                      ? 'bg-teal-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <UserPlus size={18} className="inline mr-2" />
                  Assign Officer
                </button>
                <button
                  onClick={() => setAction('reject')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    action === 'reject'
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <XCircle size={18} className="inline mr-2" />
                  Reject Issue
                </button>
              </div>
            )}

            <div className="space-y-4">
              {action === 'status' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comment (Optional)
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 h-24"
                      placeholder="Add a comment about this update..."
                    />
                  </div>
                </div>
              )}

              {action === 'assign' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign To
                  </label>
                  <select
                    value={assignTo}
                    onChange={(e) => setAssignTo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select an officer...</option>
                    <optgroup label="Ward Officers">
                      {wardOfficers.map(officer => (
                        <option key={officer.id} value={officer.id}>
                          {officer.full_name} ({officer.email})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Field Officers">
                      {fieldOfficers.map(officer => (
                        <option key={officer.id} value={officer.id}>
                          {officer.full_name} ({officer.email})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  <p className="mt-2 text-sm text-gray-600">
                    This will assign the issue and automatically change status to "In Progress"
                  </p>
                </div>
              )}

              {action === 'reject' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 h-32"
                    placeholder="Provide a clear reason why this issue is being rejected..."
                    required
                  />
                  <p className="mt-2 text-sm text-gray-600">
                    The reporter will be notified with this reason. Rejected issues will only be visible to the reporter.
                  </p>
                </div>
              )}

              {action === 'reassign' && (
                <div className="space-y-4">
                  <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Currently assigned to:</strong>{' '}
                      {wardOfficers.concat(fieldOfficers).find(o => o.id === issue.assigned_to)?.full_name || 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reassign To <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={assignTo}
                      onChange={(e) => setAssignTo(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={issue.assigned_to}>Select a different officer...</option>
                      <optgroup label="Ward Officers">
                        {wardOfficers.filter(o => o.id !== issue.assigned_to).map(officer => (
                          <option key={officer.id} value={officer.id}>
                            {officer.full_name} ({officer.email})
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Field Officers">
                        {fieldOfficers.filter(o => o.id !== issue.assigned_to).map(officer => (
                          <option key={officer.id} value={officer.id}>
                            {officer.full_name} ({officer.email})
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Reassignment <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={reassignReason}
                      onChange={(e) => setReassignReason(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                      placeholder="e.g., Workload balancing, Area expertise, Officer availability..."
                      required
                    />
                    <p className="mt-2 text-sm text-gray-600">
                      Both the current and new officer will be notified. This action will be recorded in the issue history.
                    </p>
                  </div>
                </div>
              )}

              {action === 'revoke' && (
                <div>
                  <div className="bg-amber-100 border border-amber-300 rounded-lg p-4 mb-4">
                    <p className="text-sm text-amber-800">
                      <strong>⚠️ Warning:</strong> This will unassign the issue from{' '}
                      {wardOfficers.concat(fieldOfficers).find(o => o.id === issue.assigned_to)?.full_name || 'the current officer'}.
                      The issue will return to unassigned status.
                    </p>
                  </div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Revoking Assignment <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={revokeReason}
                    onChange={(e) => setRevokeReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 h-32"
                    placeholder="Provide a clear reason for revoking this assignment..."
                    required
                  />
                  <p className="mt-2 text-sm text-gray-600">
                    The officer will be notified and this action will be recorded in the issue history.
                  </p>
                </div>
              )}

              {success && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-md text-sm">
                  {success}
                </div>
              )}

              <button
                onClick={handleUpdate}
                className={`w-full flex items-center justify-center px-4 py-3 rounded-md text-white font-medium transition-colors ${
                  action === 'reject' || action === 'revoke'
                    ? 'bg-red-600 hover:bg-red-700'
                    : action === 'reassign'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-teal-600 hover:bg-teal-700'
                }`}
              >
                {action === 'status' && <><Save size={20} className="mr-2" />Update Status</>}
                {action === 'assign' && <><UserPlus size={20} className="mr-2" />Assign Officer</>}
                {action === 'reject' && <><XCircle size={20} className="mr-2" />Reject Issue</>}
                {action === 'reassign' && <><UserPlus size={20} className="mr-2" />Confirm Reassignment</>}
                {action === 'revoke' && <><XCircle size={20} className="mr-2" />Revoke Assignment</>}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${
                statusColors[issue.status] || statusColors.pending
              }`}
            >
              {statusLabels[issue.status] || issue.status}
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
                className="w-full rounded-lg max-h-96 object-cover"
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

          {issue.reporter && (
            <div className="flex items-center text-sm text-gray-600">
              <User size={16} className="mr-2" />
              <span>Reported by: {issue.reporter.full_name} ({issue.reporter.email})</span>
            </div>
          )}

          {issue.assigned_to && issue.assignee && (
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <div className="flex items-center text-sm text-teal-800">
                <UserPlus size={16} className="mr-2" />
                <span className="font-medium">
                  Assigned to: {issue.assignee.full_name} ({issue.assignee.role.replace('_', ' ')})
                </span>
              </div>
            </div>
          )}

          {issue.rejection_reason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-red-800 mb-2">Rejection Reason:</h3>
              <p className="text-sm text-red-700">{issue.rejection_reason}</p>
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
