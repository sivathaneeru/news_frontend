// src/api/ajax.js
import { API_ENDPOINTS } from './mappings';

// Helper function to calculate listing end date
const calculateListingEndDate = (datePosted, tier) => {
  const startDate = new Date(datePosted);
  const days = tier === 'premium' ? 60 : 30;
  startDate.setDate(startDate.getDate() + days);
  return startDate.toISOString();
};

// Dummy data store
const initialJobs = [
  {
    id: 'job1',
    title: 'Senior Vue Developer (Dummy)',
    description: 'Seeking an experienced Vue.js developer... (Loaded from dummy API)',
    location: 'Remote',
    experience: '5+ Years',
    type: 'Full-time',
    salary: '$120,000 - $150,000',
    postedBy: 'admin_dummy_api',
    datePosted: new Date(Date.UTC(2023, 10, 10)).toISOString(), // Use UTC for consistency
    tier: 'premium', // Example of a premium post
    isFeatured: true,
    paymentId: 'sim_payment_123',
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
    datePosted: new Date(Date.UTC(2023, 10, 18)).toISOString(),
    tier: 'free',
    isFeatured: false,
    paymentId: null,
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
    datePosted: new Date(Date.UTC(2023, 11, 5)).toISOString(),
    tier: 'free',
    isFeatured: false,
    paymentId: null,
  }
];

// Populate listingEndDate for initial jobs
initialJobs.forEach(job => {
  job.listingEndDate = calculateListingEndDate(job.datePosted, job.tier);
});

const dummyCompanies = [
  {
    companyId: 'comp1',
    companyName: 'Innovatech Solutions',
    companyLogoUrl: 'https://via.placeholder.com/150/FF5733/FFFFFF?Text=Innovatech',
    companyDescription: 'Leading the charge in next-generation technology solutions. We foster innovation and collaboration to solve complex problems.',
    websiteUrl: 'https://example-innovatech.com',
    adminUsernames: ['admin_dummy_api'],
    isActiveProfile: true,
  },
  {
    companyId: 'comp2',
    companyName: 'GreenLeaf Organics',
    companyLogoUrl: 'https://via.placeholder.com/150/28B463/FFFFFF?Text=GreenLeaf',
    companyDescription: 'Dedicated to providing the best organic products. Sustainability and health are at the core of our values.',
    websiteUrl: 'https://example-greenleaf.com',
    adminUsernames: ['recruiter1_dummy_api'],
    isActiveProfile: true,
  },
  {
    companyId: 'comp3',
    companyName: 'Quantum Leap AI',
    companyLogoUrl: 'https://via.placeholder.com/150/884EA0/FFFFFF?Text=QuantumLeap',
    companyDescription: 'Pioneering advancements in artificial intelligence and machine learning. Join us to build the future.',
    websiteUrl: 'https://example-quantumleap.com',
    adminUsernames: ['admin_dummy_api', 'recruiter1_dummy_api'], // Both can manage
    isActiveProfile: true,
  }
];

// Assign companyId and companyName to initialJobs
initialJobs[0].companyId = 'comp1'; // Senior Vue Developer -> Innovatech
initialJobs[0].companyName = dummyCompanies.find(c => c.companyId === 'comp1').companyName;

initialJobs[1].companyId = 'comp2'; // Frontend Engineer -> GreenLeaf
initialJobs[1].companyName = dummyCompanies.find(c => c.companyId === 'comp2').companyName;

initialJobs[2].companyId = 'comp1'; // UI/UX Designer -> Innovatech (example)
initialJobs[2].companyName = dummyCompanies.find(c => c.companyId === 'comp1').companyName;


const dummyData = {
  jobs: initialJobs,
  companies: dummyCompanies,
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
          const tier = data.tier || 'free';
          const datePosted = new Date().toISOString();
          const postedByUsername = data.postedBy || 'dummy_user_api'; // Should be set by auth context

          let companyId = data.companyId;
          let companyName = data.companyName;

          // Auto-assign company if not provided, based on postedByUsername
          if (!companyId) {
            const company = dummyData.companies.find(c => c.adminUsernames.includes(postedByUsername));
            if (company) {
              companyId = company.companyId;
              companyName = company.companyName;
            } else {
              // Fallback: if no company found for the user, create a placeholder or leave null
              // For now, we'll leave it null, or assign a generic "Individual Poster" company if that makes sense.
              // Or, we could create a new company on the fly - for simplicity, let's assume jobs are posted by users linked to existing companies.
              console.warn(`No company found for user ${postedByUsername} when creating job. companyId will be null.`);
            }
          } else if (!companyName && companyId) {
            // If companyId is provided but not companyName, look it up
            const company = dummyData.companies.find(c => c.companyId === companyId);
            if (company) {
              companyName = company.companyName;
            }
          }


          const newJob = {
            ...data, // original job data from form
            id: `job${dummyData.nextJobId++}`,
            postedBy: postedByUsername,
            datePosted: datePosted,
            tier: tier,
            isFeatured: tier === 'premium',
            listingEndDate: calculateListingEndDate(datePosted, tier),
            paymentId: tier === 'premium' ? `sim_payment_${Date.now()}` : null,
            companyId: companyId,
            companyName: companyName,
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
        // Company Endpoints
        else if (endpoint.url.startsWith(API_ENDPOINTS.GET_COMPANY_BY_ID.url.split('/:')[0]) && endpoint.method === 'GET') { // e.g., /api/companies/:id
            const companyId = params.id || endpoint.url.substring(endpoint.url.lastIndexOf('/') + 1);
            const company = dummyData.companies.find(c => c.companyId === companyId);
            if (company) {
                resolve(company);
            } else {
                reject({ status: 404, message: 'Company not found (dummy)' });
            }
        } else if (endpoint.url.includes('/jobs') && endpoint.url.startsWith(API_ENDPOINTS.GET_JOBS_BY_COMPANY_ID.url.split('/:')[0]) && endpoint.method === 'GET') { // e.g., /api/companies/:id/jobs
            const companyId = params.id || endpoint.url.split('/')[3]; // Assumes URL like /api/companies/:id/jobs
            const companyJobs = dummyData.jobs.filter(job => job.companyId === companyId)
                                            .sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted));
            resolve(companyJobs);
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
