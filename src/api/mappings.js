// src/api/mappings.js
export const API_ENDPOINTS = {
  GET_JOB_POSTINGS: {
    method: 'GET',
    url: '/api/jobs', // Example endpoint
  },
  GET_JOB_DETAILS: {
    method: 'GET',
    url: '/api/jobs/:id', // Example endpoint for specific job
  },
  CREATE_JOB_POSTING: {
    method: 'POST',
    url: '/api/jobs',
  },
  UPDATE_JOB_POSTING: {
    method: 'PUT',
    url: '/api/jobs/:id',
  },
  DELETE_JOB_POSTING: {
    method: 'DELETE',
    url: '/api/jobs/:id',
  },
  LOGIN: {
    method: 'POST',
    url: '/api/auth/login',
  },
  ADD_SUB_USER: {
    method: 'POST',
    url: '/api/users/sub',
  },
  GET_COMPANY_BY_ID: {
    method: 'GET',
    url: '/api/companies/:id',
  },
  GET_JOBS_BY_COMPANY_ID: {
    method: 'GET',
    url: '/api/companies/:id/jobs',
  },
  // Add other endpoints as needed
};
