import Vue from 'vue';
import { JobService, AuthService, UserService } from '../api/services'; // Import new services

// --- State ---
// Make the state observable
const state = Vue.observable({
  currentUser: null, // { id, username, role, token }
  users: [ // This can remain for local user management until a user API is fully integrated
    { id: 1, username: 'admin', password: 'password', role: 'admin' },
    { id: 2, username: 'recruiter1', password: 'password', role: 'recruiter' },
    { id: 3, username: 'recruiter2', password: 'password', role: 'recruiter' },
  ],
  jobPostings: [], // Will be fetched from the dummy API
  nextJobId: 4, // Kept if local creation still happens or as a fallback
  nextUserId: 4, // Kept for local user creation
  isLoadingJobs: false,
});

// --- Getters ---
const getters = {
  isAuthenticated: () => {
    return !!state.currentUser && !!state.currentUser.token;
  },
  currentUser: () => {
    return state.currentUser;
  },
  isAdmin: () => {
    return state.currentUser && state.currentUser.role === 'admin';
  },
  isRecruiter: () => {
    return state.currentUser && state.currentUser.role === 'recruiter';
  },
  allUsers: () => { // Still provides local users
    return state.users;
  },
  subUsers: () => { // Still provides local sub-users
    return state.users.filter(user => user.role === 'recruiter' && user.createdBy === 'admin');
  },
  allJobPostings: () => {
    // Returns jobPostings from state, which will be populated by an action.
    // Sorting remains here as a presentation concern for the getter.
    return state.jobPostings.sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted));
  },
  isLoadingJobs: () => {
    return state.isLoadingJobs;
  }
};

// --- Actions / Mutations ---
const actions = {
  // Example: Fetching job postings using the new service
  fetchJobPostings: async () => {
    state.isLoadingJobs = true;
    try {
      const jobs = await JobService.getAllJobPostings();
      state.jobPostings = jobs; // Update state with fetched jobs
    } catch (error) {
      console.error('Error fetching job postings:', error);
      // Handle error appropriately (e.g., set an error state)
      state.jobPostings = []; // Clear jobs or keep stale, depending on UX choice
    } finally {
      state.isLoadingJobs = false;
    }
  },

  login: async ({ username, password }) => {
    // Using AuthService for login
    try {
      // First, try local user list for existing behavior
      const localUser = state.users.find(u => u.username === username && u.password === password);
      if (localUser) {
        const token = Math.random().toString(36).substring(7) + '_local_token';
        state.currentUser = { ...localUser, token };
        localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
        return state.currentUser;
      } else {
        // If not found locally, try dummy API (as a fallback or primary if local is removed)
        console.log("Attempting login via dummy API service...");
        const apiUser = await AuthService.login({ username, password });
        state.currentUser = apiUser; // Assumes apiUser includes a token
        localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
        return state.currentUser;
      }
    } catch (error) {
      console.error('Login failed:', error.message || error);
      throw error; // Re-throw to be caught by UI
    }
  },
  logout: () => {
    state.currentUser = null;
    localStorage.removeItem('currentUser');
  },
  tryAutoLogin: () => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      // Check if this user (from localStorage) is valid against our current user list or API logic
      // For simplicity, we'll assume if it's in localStorage and has a token, it's valid for now.
      // A more robust check might involve validating the token with an API endpoint.
      const userExists = state.users.find(u => u.id === user.id && u.username === user.username) || user.token.includes('_dummy_token');

      if (userExists && user.token) {
          state.currentUser = user;
          return true;
      } else {
          localStorage.removeItem('currentUser');
          return false;
      }
    }
    return false;
  },
  addJob: async (jobData) => {
    if (!state.currentUser) {
      console.error("Cannot add job: No user logged in.");
      return Promise.reject("User not logged in");
    }
    try {
      // Use JobService to create job posting
      const newJob = await JobService.createJobPosting(jobData, state.currentUser);
      // state.jobPostings.unshift(newJob); // Add to local state, will be overwritten on next fetch or handled by service
      await actions.fetchJobPostings(); // Re-fetch all jobs to reflect the new one
      return newJob;
    } catch (error) {
      console.error('Error adding job posting:', error);
      throw error; // Re-throw to be caught by UI
    }
  },
  deleteJobPosting: async (jobId) => {
    try {
      await JobService.deleteJobPosting(jobId);
      // state.jobPostings = state.jobPostings.filter(job => job.id !== jobId); // Optimistic update
      await actions.fetchJobPostings(); // Re-fetch to confirm deletion and get updated list
      console.log(`Job ${jobId} deleted via service.`);
    } catch (error) {
      console.error(`Error deleting job ${jobId} via service:`, error);
      throw error;
    }
  },
  addSubUser: async (userData) => {
    if (!getters.isAdmin()) {
      return Promise.reject('Only admins can create sub-users.');
    }
    if (!state.currentUser) {
      return Promise.reject('Admin user not found for createdBy field.');
    }
    try {
      // Try local user list first for existing behavior
      const localExistingUser = state.users.find(u => u.username === userData.username);
      if (localExistingUser) {
          return Promise.reject('Username already exists (local).');
      }

      // If not found locally, try dummy API (as a fallback or primary if local is removed)
      // Note: The dummy API also checks for existing usernames within its own list.
      const newUser = await UserService.addSubUser(userData, state.currentUser);
      // Optionally, add to local users list if maintaining both, or rely on API for user management
      // For now, we'll assume the API is the source of truth if it succeeds.
      // If we want to keep local state.users in sync:
      // state.users.push(newUser); // This might lead to duplicates if API and local lists diverge
      console.log("Sub user added via API:", newUser);
      // It might be better to have a fetchUsers action if users are primarily managed via API.
      // For now, we'll add to local state if API call was successful as a simple sync.
      if (!state.users.find(u => u.username === newUser.username)) {
        state.users.push(newUser); // Add to local list if not already there
      }
      return newUser;
    } catch (error) {
      console.error('Error adding sub user:', error.message || error);
      // If the error is just a string (like from Promise.reject), wrap it
      if (typeof error === 'string') throw new Error(error);
      throw error;
    }
  },
};

// Attempt auto-login on store initialization
actions.tryAutoLogin();

// Initial fetch of job postings when the store is initialized
actions.fetchJobPostings();


// Export the store parts
export default {
  state,
  getters,
  actions,
};
