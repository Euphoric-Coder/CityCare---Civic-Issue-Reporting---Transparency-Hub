import { useEffect, useState } from 'react';
import { Search, Filter, RefreshCw, Shield } from 'lucide-react';
import { AdminIssueModal } from './AdminIssue';
import { getIssues } from '@/lib/mockData';
import { IssueCard } from '../IssueCard';

export function AdminDashboard() {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedIssue, setSelectedIssue] = useState(null);

  useEffect(() => {
    loadIssues();
  }, []);

  useEffect(() => {
    filterIssues();
  }, [issues, searchTerm, statusFilter, categoryFilter]);

  async function loadIssues() {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const data = getIssues()
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setIssues(data);
    } catch (error) {
      console.error('Error loading issues:', error);
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

    if (statusFilter !== 'all') {
      filtered = filtered.filter((issue) => issue.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((issue) => issue.category === categoryFilter);
    }

    setFilteredIssues(filtered);
  }

  function handleIssueUpdated() {
    setSelectedIssue(null);
    loadIssues();
  }

  const stats = {
    total: issues.length,
    pending: issues.filter((i) => i.status === 'pending').length,
    in_progress: issues.filter((i) => i.status === 'in_progress').length,
    resolved: issues.filter((i) => i.status === 'resolved').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-start flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl shadow-lg">
              <Shield className="text-white" size={28} />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600 text-lg ml-14">Manage and update civic issues across the city</p>
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
          <p className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{stats.total}</p>
          <div className="mt-3 h-1 bg-gradient-to-r from-gray-400 to-gray-200 rounded-full"></div>
        </div>
        <div className="group bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 border border-yellow-300 hover:border-yellow-400 transform hover:-translate-y-1">
          <p className="text-yellow-800 text-sm font-medium mb-2">Pending</p>
          <p className="text-4xl font-bold text-yellow-800">{stats.pending}</p>
          <div className="mt-3 h-1 bg-gradient-to-r from-yellow-400 to-yellow-200 rounded-full"></div>
        </div>
        <div className="group bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 border border-blue-300 hover:border-blue-400 transform hover:-translate-y-1">
          <p className="text-blue-800 text-sm font-medium mb-2">In Progress</p>
          <p className="text-4xl font-bold text-blue-800">{stats.in_progress}</p>
          <div className="mt-3 h-1 bg-gradient-to-r from-blue-400 to-blue-200 rounded-full"></div>
        </div>
        <div className="group bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 border border-green-300 hover:border-green-400 transform hover:-translate-y-1">
          <p className="text-green-800 text-sm font-medium mb-2">Resolved</p>
          <p className="text-4xl font-bold text-green-800">{stats.resolved}</p>
          <div className="mt-3 h-1 bg-gradient-to-r from-green-400 to-green-200 rounded-full"></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
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
          <p className="text-gray-600">No issues found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} onClick={() => setSelectedIssue(issue)} />
          ))}
        </div>
      )}

      <AdminIssueModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
        onUpdated={handleIssueUpdated}
      />
    </div>
  );
}
