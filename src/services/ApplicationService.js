import requests from './httpServices';

const ApplicationService = {
  // Create a new application
  createApplication: async (applicationData) => {
    return requests.post('applications', applicationData);
  },

  // Get all applications with optional filters
  getAllApplications: async (params) => {
    return requests.get('applications', { params });
  },

  // Get application by ID
  getApplicationById: async (id) => {
    return requests.get(`applications/${id}`);
  },

};

export default ApplicationService;
