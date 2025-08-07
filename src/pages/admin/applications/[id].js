import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ApplicationService from '@services/applicationService';
import Link from 'next/link';

const ApplicationDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchApplicationDetails();
    }
  }, [id]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      const response = await ApplicationService.getApplicationById(id);
      if (response.success) {
        setApplication(response.application);
      } else {
        setError('Failed to fetch application details');
      }
    } catch (err) {
      setError(err.message || 'Error fetching application details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await ApplicationService.updateApplicationStatus(id, newStatus);
      if (response.success) {
        fetchApplicationDetails();
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

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-red-600">{error}</div>;
  if (!application) return <div className="container mx-auto px-4 py-8">Application not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/admin/applications" className="text-blue-600 hover:underline">
          ← Back to Applications
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Application Details</h1>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm ${
              application.status === 'approved' ? 'bg-green-100 text-green-800' :
              application.status === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </span>
            <select
              value={application.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approve</option>
              <option value="rejected">Reject</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <p><span className="font-semibold">Name:</span> {application.firstName} {application.lastName}</p>
            <p><span className="font-semibold">Email:</span> {application.email}</p>
            <p><span className="font-semibold">Date of Birth:</span> {formatDate(application.dob)}</p>
            <p><span className="font-semibold">Sex:</span> {application.sex}</p>
            <p><span className="font-semibold">Personal Info:</span> {application.personalInfo}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Medical Information</h2>
            <p><span className="font-semibold">Cancer Type:</span> {application.cancerType}</p>
            <p><span className="font-semibold">Cancer Stage:</span> {application.cancerStage}</p>
            <p><span className="font-semibold">Other Treatments:</span> {application.otherTreatments || 'None'}</p>
            <p><span className="font-semibold">Other Medications:</span> {application.otherMedications || 'None'}</p>
            <p><span className="font-semibold">Healthcare Practitioner:</span> {application.practitioner}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Address Information</h2>
            <p><span className="font-semibold">Address:</span> {application.address}</p>
            <p><span className="font-semibold">City:</span> {application.city}</p>
            <p><span className="font-semibold">Province/State:</span> {application.province}</p>
            <p><span className="font-semibold">Postal Code:</span> {application.postalCode}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Documents</h2>
            {application.documentUrls && application.documentUrls.length > 0 ? (
              <div className="space-y-2">
                {application.documentUrls.map((url, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Document {index + 1}
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No documents uploaded</p>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t">
          <h2 className="text-xl font-semibold mb-4">Application Timeline</h2>
          <div className="space-y-2">
            <p><span className="font-semibold">Applied Date:</span> {formatDate(application.appliedDate)}</p>
            <p><span className="font-semibold">Last Updated:</span> {formatDate(application.updatedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
