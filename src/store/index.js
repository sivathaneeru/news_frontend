import Vue from 'vue';

const store = new Vue({
  data: {
    state: {
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
          description: 'Seeking an experienced Vue.js developer to build amazing user interfaces. Must have 5+ years of experience with Vue, Vuex, and Vue Router. Familiarity with modern JavaScript (ES6+), HTML5, CSS3, and RESTful APIs is essential. Experience with Nuxt.js is a plus.',
          location: 'Remote',
          experience: '5+ Years',
          type: 'Full-time',
          salary: '$120,000 - $150,000',
          postedBy: 'admin', // or user ID
          datePosted: new Date(2023, 10, 15).toISOString()
        },
        {
          id: 'job2',
          title: 'Frontend Engineer (React)',
          description: 'Join our dynamic team as a Frontend Engineer. You will be responsible for developing and maintaining web applications using React and Redux. Strong proficiency in JavaScript, CSS, and HTML is required. Bachelor\'s degree in Computer Science or related field preferred.',
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
          description: 'We are looking for a creative UI/UX Designer to shape the user experience of our products. You will work closely with product managers and engineers to create intuitive and visually appealing designs. Portfolio showcasing your design skills is required.',
          location: 'San Francisco, CA',
          experience: '2+ Years',
          type: 'Contract',
          salary: '$70 - $90 / hour',
          postedBy: 'admin',
          datePosted: new Date(2023, 11, 1).toISOString()
        }
      ],
      nextJobId: 4, // For generating new job IDs
      nextUserId: 4, // For generating new user IDs for sub-users
    },
  },
  getters: {
    isAuthenticated: (state) => {
      return !!state.currentUser && !!state.currentUser.token;
    },
    currentUser: (state) => {
      return state.currentUser;
    },
    isAdmin: (state) => {
      return state.currentUser && state.currentUser.role === 'admin';
    },
    isRecruiter: (state) => {
      return state.currentUser && state.currentUser.role === 'recruiter';
    },
    allUsers: (state) => {
      return state.users;
    },
    subUsers: (state) => { // Recruiters created by admin
      return state.users.filter(user => user.role === 'recruiter' && user.createdBy === 'admin'); // Assuming a createdBy field
    },
    allJobPostings: (state) => {
      return state.jobPostings.sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted)); // Show newest first
    },
  },
  actions: {
    login(context, { username, password }) {
      return new Promise((resolve, reject) => {
        const user = context.state.users.find(u => u.username === username && u.password === password);
        if (user) {
          // In a real app, token would come from backend
          const token = Math.random().toString(36).substring(7);
          context.state.currentUser = { ...user, token };
          // Persist user session (optional, using localStorage for simplicity)
          localStorage.setItem('currentUser', JSON.stringify(context.state.currentUser));
          resolve(context.state.currentUser);
        } else {
          reject('Invalid username or password');
        }
      });
    },
    logout(context) {
      context.state.currentUser = null;
      localStorage.removeItem('currentUser');
    },
    tryAutoLogin(context) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        // Basic validation: check if user still exists in our "DB"
        const userExists = context.state.users.find(u => u.id === user.id && u.username === user.username);
        if (userExists && user.token) {
            context.state.currentUser = user;
            return true;
        } else {
            // User from local storage is invalid (e.g. deleted from DB, or structure changed)
            localStorage.removeItem('currentUser');
            return false;
        }
      }
      return false;
    },
    addJob(context, jobData) {
        const newJob = {
            ...jobData,
            id: `job${context.state.nextJobId++}`,
            postedBy: context.state.currentUser.username, // or ID
            datePosted: new Date().toISOString(),
        };
        context.state.jobPostings.unshift(newJob); // Add to the beginning of the array
        return newJob;
    },
    addSubUser(context, userData) {
        if (context.getters.isAdmin()) {
            const existingUser = context.state.users.find(u => u.username === userData.username);
            if (existingUser) {
                return Promise.reject('Username already exists.');
            }
            const newUser = {
                ...userData,
                id: context.state.nextUserId++,
                role: 'recruiter', // Sub-users are recruiters by default
                createdBy: context.state.currentUser.username, // Track who created them
            };
            context.state.users.push(newUser);
            return Promise.resolve(newUser);
        }
        return Promise.reject('Only admins can create sub-users.');
    },
    // Example: updateJob, deleteJob can be added later
  },
  // Expose state, getters, actions for easy access from Vue.prototype.$store
  // This is a simplified pattern. For more complex apps, Vuex is recommended.
  // We need to make sure 'this' inside actions/getters refers to the Vue instance (store)
  // Vue automatically binds 'this' correctly for methods, computed (getters), and data.
  // So, we can call this.state, this.getters, this.actions from components via Vue.prototype.$store.
  // However, inside actions, to call another action or a getter, we pass `this` (the store instance) as `context`.
  // And getters are defined as functions that take `state` as the first argument.

  // To make `this.$store.getters.isAuthenticated()` work, we need to process getters.
  // This is a bit manual without Vuex.
  // A common pattern is to have getters as computed properties on the Vue instance.
  computed: {
    // This makes store.getters.isAuthenticated callable
    // This is how Vuex structures its getters internally as well
    // We need to ensure `this` inside these computed properties refers to the store's Vue instance
  }
});

// Manually wire up getters to be callable like store.getters.isAuthenticated()
// The getters object above is a definition; we need to make them computed properties
// or methods on the store instance for them to work as expected with `this.state`.
// A simpler way for this non-Vuex store is to have getters access `store.data.state`.

const processedGetters = {};
for (const key in store.getters) {
  processedGetters[key] = () => store.getters[key](store.data.state);
}
store.getters = processedGetters;

// For actions, ensure `context` is passed correctly.
// The actions above are defined as methods on the store instance, so `this` will be the store.
// We pass `this` (the store instance) as `context` to the action handlers.
const processedActions = {};
for (const key in store.actions) {
  processedActions[key] = (...args) => store.actions[key](store, ...args);
}
store.actions = processedActions;


// Attempt auto-login on store initialization
store.actions.tryAutoLogin();

export default store;
