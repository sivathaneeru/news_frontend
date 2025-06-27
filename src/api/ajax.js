// src/api/ajax.js
import { API_ENDPOINTS } from './mappings';

// Dummy data store
const dummyData = {
  jobs: [
    {
      id: 'job1',
      title: 'Senior Vue Developer (Dummy)',
      description: 'Seeking an experienced Vue.js developer... (Loaded from dummy API)',
      location: 'Remote',
      experience: '5+ Years',
      type: 'Full-time',
      salary: '$120,000 - $150,000',
      postedBy: 'admin_dummy_api',
      datePosted: new Date(2023, 10, 10).toISOString()
    },
    {
      id: 'job2',
      title: 'Frontend Engineer (React) (Dummy)',
      description: 'Join our dynamic team... (Loaded from dummy API)',
      location: 'New York, NY',
      experience: '3-5 Years',
      type: 'Full-time',
      salary: '$100,000 - $130,000',
      postedBy: 'recruiter1_dummy_api',
      datePosted: new Date(2023, 10, 18).toISOString()
    },
     {
      id: 'job3',
      title: 'UI/UX Designer (Dummy)',
      description: 'We are looking for a creative UI/UX Designer... (Loaded from dummy API)',
      location: 'San Francisco, CA',
      experience: '2+ Years',
      type: 'Contract',
      salary: '$70 - $90 / hour',
      postedBy: 'admin_dummy_api',
      datePosted: new Date(2023, 11, 5).toISOString()
    }
  ],
  users: [
    { id: 1, username: 'admin_dummy_api', password: 'password', role: 'admin' },
    { id: 2, username: 'recruiter1_dummy_api', password: 'password', role: 'recruiter' },
  ],
  nextJobId: 4,
};

/**
 * Simulates an AJAX request.
 * @param {object} endpoint - The endpoint object from mappings.js.
 * @param {object} params - URL parameters (e.g., for /api/jobs/:id).
 * @param {object} data - Request body data for POST/PUT.
 * @returns {Promise<any>} - A promise that resolves with dummy data or rejects with an error.
 */
export const ajaxRequest = (endpoint, params = {}, data = {}) => {
  console.log(`AJAX Request: ${endpoint.method} ${endpoint.url}`, "Params:", params, "Data:", data);

  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      try {
        if (endpoint.url === API_ENDPOINTS.GET_JOB_POSTINGS.url && endpoint.method === 'GET') {
          resolve([...dummyData.jobs].sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted)));
        } else if (endpoint.url === API_ENDPOINTS.GET_JOB_DETAILS.url && endpoint.method === 'GET') {
          const job = dummyData.jobs.find(j => j.id === params.id);
          if (job) {
            resolve(job);
          } else {
            reject({ status: 404, message: 'Job not found (dummy)' });
          }
        } else if (endpoint.url === API_ENDPOINTS.CREATE_JOB_POSTING.url && endpoint.method === 'POST') {
          const newJob = {
            ...data,
            id: `job${dummyData.nextJobId++}`,
            // postedBy should be set by the service/auth layer, here using a placeholder
            postedBy: data.postedBy || 'dummy_user_api',
            datePosted: new Date().toISOString(),
          };
          dummyData.jobs.unshift(newJob);
          resolve(newJob);
        } else if (endpoint.url === API_ENDPOINTS.DELETE_JOB_POSTING.url && endpoint.method === 'DELETE') {
            const index = dummyData.jobs.findIndex(j => j.id === params.id);
            if (index !== -1) {
                const deletedJob = dummyData.jobs.splice(index, 1);
                resolve({ message: 'Job deleted successfully (dummy)', job: deletedJob[0] });
            } else {
                reject({ status: 404, message: 'Job not found for deletion (dummy)' });
            }
        } else if (endpoint.url === API_ENDPOINTS.LOGIN.url && endpoint.method === 'POST') {
            const user = dummyData.users.find(u => u.username === data.username && u.password === data.password);
            if (user) {
                const token = Math.random().toString(36).substring(7) + '_dummy_token';
                resolve({ ...user, token });
            } else {
                reject({ status: 401, message: 'Invalid credentials (dummy)' });
            }
        } else if (endpoint.url === API_ENDPOINTS.ADD_SUB_USER.url && endpoint.method === 'POST') {
            const existingUser = dummyData.users.find(u => u.username === data.username);
            if (existingUser) {
                reject({ status: 409, message: 'Username already exists (dummy)' });
                return;
            }
            const newSubUser = {
                ...data,
                id: dummyData.users.length + 1, // simple id generation
                role: 'recruiter',
                // createdBy should ideally come from authenticated user context
                createdBy: data.createdBy || 'admin_dummy_api'
            };
            dummyData.users.push(newSubUser);
            resolve(newSubUser);
        }
        // Add more conditions for other endpoints (PUT, DELETE, etc.)
        else {
          console.warn(`No dummy data handler for ${endpoint.method} ${endpoint.url}`);
          resolve({ message: `Request to ${endpoint.method} ${endpoint.url} received (no specific dummy data).`, data });
        }
      } catch (error) {
        console.error("Error in dummy AJAX handler:", error);
        reject({ status: 500, message: 'Internal dummy server error' });
      }
    }, 500); // Simulate 500ms delay
  });
};
