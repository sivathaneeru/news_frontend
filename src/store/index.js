import Vue from 'vue';

// --- State ---
// Make the state observable
const state = Vue.observable({
  currentUser: null, // { id, username, role, token }
  users: [
    { id: 1, username: 'admin', password: 'password', role: 'admin' },
    { id: 2, username: 'recruiter1', password: 'password', role: 'recruiter' },
    { id: 3, username: 'recruiter2', password: 'password', role: 'recruiter' },
  ],
  jobPostings: [
    {
      id: 'job1',
      title: 'Senior Vue Developer',
      description: 'Seeking an experienced Vue.js developer...',
      location: 'Remote',
      experience: '5+ Years',
      type: 'Full-time',
      salary: '$120,000 - $150,000',
      postedBy: 'admin',
      datePosted: new Date(2023, 10, 15).toISOString()
    },
    {
      id: 'job2',
      title: 'Frontend Engineer (React)',
      description: 'Join our dynamic team...',
      location: 'New York, NY',
      experience: '3-5 Years',
      type: 'Full-time',
      salary: '$100,000 - $130,000',
      postedBy: 'recruiter1',
      datePosted: new Date(2023, 10, 20).toISOString()
    },
    {
      id: 'job3',
      title: 'UI/UX Designer',
      description: 'We are looking for a creative UI/UX Designer...',
      location: 'San Francisco, CA',
      experience: '2+ Years',
      type: 'Contract',
      salary: '$70 - $90 / hour',
      postedBy: 'admin',
      datePosted: new Date(2023, 11, 1).toISOString()
    }
  ],
  nextJobId: 4,
  nextUserId: 4,
});

// --- Getters ---
// Getters will now be functions that can access the state directly or be passed the state.
// For convenience, they will access the `state` object from the same module scope.
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
  allUsers: () => {
    return state.users;
  },
  subUsers: () => {
    return state.users.filter(user => user.role === 'recruiter' && user.createdBy === 'admin');
  },
  allJobPostings: () => {
    return state.jobPostings.sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted));
  },
};

// --- Actions / Mutations ---
// These functions will mutate the state directly.
// In Vuex, these would be mutations, and actions would commit mutations.
// For this simple store, actions will directly modify state.
const actions = {
  login: ({ username, password }) => {
    return new Promise((resolve, reject) => {
      const user = state.users.find(u => u.username === username && u.password === password);
      if (user) {
        const token = Math.random().toString(36).substring(7);
        state.currentUser = { ...user, token }; // Directly mutate observable state
        localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
        resolve(state.currentUser);
      } else {
        reject('Invalid username or password');
      }
    });
  },
  logout: () => {
    state.currentUser = null; // Directly mutate
    localStorage.removeItem('currentUser');
  },
  tryAutoLogin: () => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const userExists = state.users.find(u => u.id === user.id && u.username === user.username);
      if (userExists && user.token) {
          state.currentUser = user; // Directly mutate
          return true;
      } else {
          localStorage.removeItem('currentUser');
          return false;
      }
    }
    return false;
  },
  addJob: (jobData) => {
      if (!state.currentUser) {
        // Or handle this more gracefully, maybe throw an error
        console.error("Cannot add job: No user logged in.");
        return null; // Or reject a promise if actions are expected to be async
      }
      const newJob = {
          ...jobData,
          id: `job${state.nextJobId++}`,
          postedBy: state.currentUser.username,
          datePosted: new Date().toISOString(),
      };
      state.jobPostings.unshift(newJob); // Directly mutate
      return newJob; // Return the created job
  },
  addSubUser: (userData) => {
    // Getter can be called directly as it's in the same module scope
    if (getters.isAdmin()) {
        const existingUser = state.users.find(u => u.username === userData.username);
        if (existingUser) {
            return Promise.reject('Username already exists.');
        }
        if (!state.currentUser) {
             return Promise.reject('Admin user not found for createdBy field.');
        }
        const newUser = {
            ...userData,
            id: state.nextUserId++,
            role: 'recruiter',
            createdBy: state.currentUser.username,
        };
        state.users.push(newUser); // Directly mutate
        return Promise.resolve(newUser);
    }
    return Promise.reject('Only admins can create sub-users.');
  },
};

// Attempt auto-login on store initialization
actions.tryAutoLogin();

// Export the store parts
export default {
  state,
  getters,
  actions,
};
