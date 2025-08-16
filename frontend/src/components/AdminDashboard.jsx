import React, { useState, useEffect } from 'react';
import { 
  Users, Mail, Phone, Calendar, Download, 
  Filter, Search, Eye, CheckCircle, X, 
  BarChart, TrendingUp, Clock
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [authenticated, setAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Create basic auth header
  const createAuthHeader = () => {
    const token = btoa(`${credentials.username}:${credentials.password}`);
    return { Authorization: `Basic ${token}` };
  };

  // Test authentication
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`${API}/admin/stats`, {
        headers: createAuthHeader()
      });
      
      setAuthenticated(true);
      setStats(response.data);
      loadSubmissions();
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid credentials. Please check your username and password.');
      } else {
        setError('Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Load submissions
  const loadSubmissions = async (page = 1, search = '', status = '') => {
    if (!authenticated) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });
      
      if (search) params.append('search', search);
      if (status) params.append('status', status);

      const response = await axios.get(`${API}/admin/submissions?${params}`, {
        headers: createAuthHeader()
      });

      setSubmissions(response.data.submissions);
      setTotalPages(response.data.total_pages);
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  // Update submission status
  const updateStatus = async (submissionId, newStatus) => {
    try {
      await axios.put(
        `${API}/admin/submissions/${submissionId}/status`,
        { status: newStatus },
        { headers: createAuthHeader() }
      );
      
      // Reload submissions
      loadSubmissions(currentPage, searchTerm, statusFilter);
    } catch (err) {
      setError('Failed to update status');
    }
  };

  // Export submissions
  const exportSubmissions = async () => {
    try {
      const response = await axios.get(`${API}/admin/submissions/export`, {
        headers: createAuthHeader(),
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `niche_submissions_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    } catch (err) {
      setError('Failed to export submissions');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle search
  const handleSearch = () => {
    loadSubmissions(1, searchTerm, statusFilter);
  };

  // Handle filter change
  const handleFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    loadSubmissions(1, searchTerm, newStatus);
  };

  useEffect(() => {
    if (authenticated) {
      loadSubmissions(currentPage, searchTerm, statusFilter);
    }
  }, [authenticated]);

  // Login form
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="serif-heading text-3xl font-bold text-[#0f172a]">
              Admin Dashboard
            </h2>
            <p className="sans-body text-gray-600 mt-2">
              Sign in to access contact submissions
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="sans-body text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ECEC75] focus:border-transparent"
                placeholder="Enter username"
              />
            </div>
            
            <div>
              <label className="sans-body text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ECEC75] focus:border-transparent"
                placeholder="Enter password"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="serif-heading text-2xl font-bold text-[#0f172a]">
              NICHE Digital Marketing - Admin Dashboard
            </h1>
            <button
              onClick={() => setAuthenticated(false)}
              className="btn-secondary text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-[#ECEC75]" />
              <div className="ml-4">
                <p className="sans-body text-sm text-gray-600">Total Submissions</p>
                <p className="serif-heading text-2xl font-bold text-[#0f172a]">
                  {stats.total_submissions || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="sans-body text-sm text-gray-600">Today</p>
                <p className="serif-heading text-2xl font-bold text-[#0f172a]">
                  {stats.submissions_today || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="sans-body text-sm text-gray-600">This Week</p>
                <p className="serif-heading text-2xl font-bold text-[#0f172a]">
                  {stats.submissions_this_week || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="sans-body text-sm text-gray-600">New</p>
                <p className="serif-heading text-2xl font-bold text-[#0f172a]">
                  {stats.status_breakdown?.new || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex items-center space-x-2">
                <Search size={20} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or business..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ECEC75] focus:border-transparent"
                />
                <button onClick={handleSearch} className="btn-primary text-sm">
                  Search
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter size={20} className="text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ECEC75] focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={exportSubmissions}
              className="btn-secondary inline-flex items-center space-x-2"
            >
              <Download size={16} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-[#ECEC75] border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {submissions.map((submission) => (
                      <tr key={submission.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-[#ECEC75] flex items-center justify-center">
                                <span className="text-sm font-medium text-[#0f172a]">
                                  {submission.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {submission.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {submission.email}
                              </div>
                              {submission.business_name && (
                                <div className="text-xs text-gray-400">
                                  {submission.business_name}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {submission.service || 'Not specified'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(submission.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={submission.status}
                            onChange={(e) => updateStatus(submission.id, e.target.value)}
                            className={`text-xs px-2 py-1 rounded-full border-0 ${getStatusColor(submission.status)}`}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setSelectedSubmission(submission)}
                            className="text-[#0f172a] hover:text-[#1e293b] inline-flex items-center space-x-1"
                          >
                            <Eye size={16} />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => loadSubmissions(currentPage - 1, searchTerm, statusFilter)}
                      disabled={currentPage <= 1}
                      className="btn-secondary text-sm"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => loadSubmissions(currentPage + 1, searchTerm, statusFilter)}
                      disabled={currentPage >= totalPages}
                      className="btn-secondary text-sm"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Page <span className="font-medium">{currentPage}</span> of{' '}
                        <span className="font-medium">{totalPages}</span>
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          const page = i + 1;
                          return (
                            <button
                              key={page}
                              onClick={() => loadSubmissions(page, searchTerm, statusFilter)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === page
                                  ? 'bg-[#ECEC75] border-[#ECEC75] text-[#0f172a]'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="serif-heading text-lg font-bold text-[#0f172a]">
                Contact Submission Details
              </h3>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="text-sm text-gray-900">{selectedSubmission.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-sm text-gray-900">{selectedSubmission.email}</p>
                </div>
                {selectedSubmission.business_name && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Business</label>
                    <p className="text-sm text-gray-900">{selectedSubmission.business_name}</p>
                  </div>
                )}
                {selectedSubmission.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-sm text-gray-900">{selectedSubmission.phone}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-600">Service</label>
                  <p className="text-sm text-gray-900">{selectedSubmission.service || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedSubmission.created_at)}</p>
                </div>
              </div>
              
              {selectedSubmission.message && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Message</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg mt-1">
                    {selectedSubmission.message}
                  </p>
                </div>
              )}
              
              <div className="flex items-center space-x-4 pt-4 border-t">
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <select
                    value={selectedSubmission.status}
                    onChange={(e) => {
                      updateStatus(selectedSubmission.id, e.target.value);
                      setSelectedSubmission({...selectedSubmission, status: e.target.value});
                    }}
                    className="ml-2 text-sm px-3 py-1 border border-gray-300 rounded"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;