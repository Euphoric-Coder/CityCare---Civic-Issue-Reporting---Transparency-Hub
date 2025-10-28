import { X, UserCheck, AlertCircle, History } from 'lucide-react';
import { useState } from 'react';

export function AdminReassignModal({ issue, officers, onClose, onReassign }) {
  const [selectedOfficer, setSelectedOfficer] = useState('');
  const [reason, setReason] = useState('');
  const [reassigning, setReassigning] = useState(false);

  if (!issue) return null;

  const currentOfficer = officers.find(o => o.id === issue.assigned_to);
  const availableOfficers = officers.filter(o => o.id !== issue.assigned_to);

  function handleReassign() {
    if (!selectedOfficer || !reason.trim()) return;

    setReassigning(true);
    setTimeout(() => {
      onReassign(issue.id, selectedOfficer, reason);
      setReassigning(false);
      onClose();
    }, 500);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex justify-between items-start rounded-t-xl z-10">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              <UserCheck size={28} className="mr-3" />
              Reassign Issue
            </h2>
            <p className="text-blue-100 text-sm mt-1">Transfer issue to another officer</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-100 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={20} className="text-blue-600" />
              <h3 className="font-semibold text-gray-800">Issue Details</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-gray-600">{issue.ticket_id}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  issue.severity === 'high' ? 'bg-red-100 text-red-700' :
                  issue.severity === 'medium' ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {issue.severity.toUpperCase()}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  issue.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  issue.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {issue.status === 'pending' ? 'Pending' :
                   issue.status === 'in_progress' ? 'In Progress' :
                   'Resolved'}
                </span>
              </div>
              <p className="font-semibold text-gray-800">{issue.title}</p>
              {issue.address && (
                <p className="text-sm text-gray-600">📍 {issue.address}</p>
              )}
            </div>
          </div>

          {currentOfficer && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Currently Assigned To
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
                    currentOfficer.role === 'ward_officer' ? 'bg-gradient-to-br from-teal-600 to-emerald-700' : 'bg-gradient-to-br from-cyan-600 to-blue-700'
                  }`}>
                    {currentOfficer.full_name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{currentOfficer.full_name}</p>
                    <p className="text-sm text-gray-600">
                      {currentOfficer.role === 'ward_officer' ? '🏛️ Ward Officer' : '🔧 Field Officer'}
                      {currentOfficer.ward_zone && ` - ${currentOfficer.ward_zone}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <span className="text-red-500">*</span> Reassign To
            </label>
            <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {availableOfficers.map(officer => (
                <label
                  key={officer.id}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                    selectedOfficer === officer.id
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <input
                    type="radio"
                    name="officer"
                    value={officer.id}
                    checked={selectedOfficer === officer.id}
                    onChange={(e) => setSelectedOfficer(e.target.value)}
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
                    officer.role === 'ward_officer' ? 'bg-gradient-to-br from-teal-600 to-emerald-700' : 'bg-gradient-to-br from-cyan-600 to-blue-700'
                  }`}>
                    {officer.full_name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-800">{officer.full_name}</p>
                    <p className="text-sm text-gray-600">
                      {officer.role === 'ward_officer' ? '🏛️ Ward Officer' : '🔧 Field Officer'}
                      {officer.ward_zone && ` - ${officer.ward_zone}`}
                    </p>
                  </div>
                </label>
              ))}
            </div>
            {availableOfficers.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">No other officers available</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <span className="text-red-500">*</span> Reason for Reassignment
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide a reason for reassignment... e.g., Workload balancing, Skill match, Area expertise, etc."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
            />
            <div className="flex items-start gap-2 mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <History size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                This reassignment will be recorded in the issue history and both officers will be notified
              </p>
            </div>
          </div>

          {!selectedOfficer && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">
                Please select an officer to reassign this issue to
              </p>
            </div>
          )}

          {!reason.trim() && selectedOfficer && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">
                Please provide a reason for this reassignment
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleReassign}
              disabled={!selectedOfficer || !reason.trim() || reassigning}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all"
            >
              <UserCheck size={20} className="mr-2" />
              {reassigning ? 'Reassigning...' : 'Confirm Reassignment'}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
