// src/api/services.js
import { ajaxRequest } from './ajax';
import { API_ENDPOINTS } from './mappings';

export const JobService = {
  getAllJobPostings: () => {
    return ajaxRequest(API_ENDPOINTS.GET_JOB_POSTINGS);
  },
  getJobDetails: (id) => {
    // Replace placeholder :id in URL with actual id
    const endpoint = { ...API_ENDPOINTS.GET_JOB_DETAILS };
    endpoint.url = endpoint.url.replace(':id', id);
    return ajaxRequest(endpoint, { id });
  },
  createJobPosting: (jobData, currentUser) => {
    // Pass current user's username to be used as postedBy
    const dataWithUser = { ...jobData, postedBy: currentUser ? currentUser.username : 'unknown_api_user' };
    return ajaxRequest(API_ENDPOINTS.CREATE_JOB_POSTING, {}, dataWithUser);
  },
  deleteJobPosting: (id) => {
    const endpoint = { ...API_ENDPOINTS.DELETE_JOB_POSTING };
    endpoint.url = endpoint.url.replace(':id', id);
    return ajaxRequest(endpoint, { id });
  },
  // Add other job-related service methods here
};

export const AuthService = {
  login: (credentials) => {
    return ajaxRequest(API_ENDPOINTS.LOGIN, {}, credentials);
  },
  // Add other auth-related service methods here (e.g., logout, register)
};

export const UserService = {
  addSubUser: (userData, adminUser) => {
    const dataWithAdmin = { ...userData, createdBy: adminUser ? adminUser.username : 'unknown_admin_api'};
    return ajaxRequest(API_ENDPOINTS.ADD_SUB_USER, {}, dataWithAdmin);
  }
  // Add other user-related service methods here
};

// You can export more services as they are created
// export const AnotherService = { ... };
