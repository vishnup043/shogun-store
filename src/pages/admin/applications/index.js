import { useEffect, useState } from 'react';
import ApplicationService from '@services/applicationService';
import { useRouter } from 'next/router';

const ApplicationsAdmin = () => {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('');

  const fetchApplications = async (page = 1, status = '') => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        ...(status && { status })
      };
      
      const response = await ApplicationService.getAllApplications(params);
      
      if (response.success) {
        setApplications(response.applications);
        setTotalPages(response.totalPages);
        setCurrentPage(response.currentPage);
      } else {
        setError('Failed to fetch applications');
      }
    } catch (err) {
      setError(err.message || 'Error fetching applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications(currentPage, selectedStatus);
  }, [currentPage, selectedStatus]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const response = await ApplicationService.updateApplicationStatus(applicationId, newStatus);
      if (response.success) {
        fetchApplications(currentPage, selectedStatus);
      }
    } catch (err) {
      setError(err.message || 'Error updating application status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Applications Management</h1>
      
      {/* Filter */}
      <div className="mb-6">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Cancer Type</th>
                  <th className="px-6 py-3 text-left">Cancer Stage</th>
                  <th className="px-6 py-3 text-left">Applied Date</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr 
                    key={application._id} 
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/admin/applications/${application._id}`)}
                  >
                    <td className="px-6 py-4">{`${application.firstName} ${application.lastName}`}</td>
                    <td className="px-6 py-4">{application.email}</td>
                    <td className="px-6 py-4">{application.cancerType}</td>
                    <td className="px-6 py-4">{application.cancerStage}</td>
                    <td className="px-6 py-4">{formatDate(application.appliedDate)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        application.status === 'approved' ? 'bg-green-100 text-green-800' :
                        application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={application.status}
                        onChange={(e) => handleStatusChange(application._id, e.target.value)}
                        className="p-1 border rounded"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approve</option>
                        <option value="rejected">Reject</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6 gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ApplicationsAdmin;
