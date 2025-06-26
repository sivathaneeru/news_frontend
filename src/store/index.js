import Vue from 'vue';

const store = new Vue({
  data() {
    return {
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
    };
  },
  getters: {
    isAuthenticated: (state) => {
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
      }
      // Note: original 'state' was directly under 'data', now it's under data() { return { state: { ... } } }
      // So access in getters/actions needs to be aware if 'state' is passed directly or if they access `this.state` (if store methods)
      // or `context.state.state` if `context.state` is the whole return of `data()`.
      // The current getter signature `(state)` implies the `state` object (the one with currentUser etc.) is passed.
      // Let's adjust how getters are processed if `this.data.state` was the previous pattern.
      // current `store.getters[key](store.data.state)` will become `store.getters[key](store.state)` if Vue makes data() return reactive.
      // Or, if `store.state` refers to the whole object returned by `data()`, then it would be `store.getters[key](store.state.state)`.
      // Vue instances usually expose `this.$data` which is the object returned by `data()`. So `this.$data.state` would be correct.
      // For the manual wiring of getters: `store.getters[key](store.$data.state)`
      // For actions: `context.state` usually refers to `this.$data`. So `context.state.state` for the actual application state.
      // This is getting complex. Let's simplify the store structure slightly if `data` is now a function.
      // The Vue instance `store` will have its reactive data available via `store.state` (if `state` is the top-level key in returned object).
    };
  },
  getters: {
    // These getters expect the `state` object (the one containing currentUser, users, etc.)
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
        const user = context.$data.state.users.find(u => u.username === username && u.password === password);
        if (user) {
          const token = Math.random().toString(36).substring(7);
          context.$data.state.currentUser = { ...user, token };
          localStorage.setItem('currentUser', JSON.stringify(context.$data.state.currentUser));
          resolve(context.$data.state.currentUser);
        } else {
          reject('Invalid username or password');
        }
      });
    },
    logout(context) {
      context.$data.state.currentUser = null;
      localStorage.removeItem('currentUser');
    },
    tryAutoLogin(context) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const userExists = context.$data.state.users.find(u => u.id === user.id && u.username === user.username);
        if (userExists && user.token) {
            context.$data.state.currentUser = user;
            return true;
        } else {
            localStorage.removeItem('currentUser');
            return false;
        }
      }
      return false;
    },
    addJob(context, jobData) {
        const newJob = {
            ...jobData,
            id: `job${context.$data.state.nextJobId++}`,
            postedBy: context.$data.state.currentUser.username,
            datePosted: new Date().toISOString(),
        };
        context.$data.state.jobPostings.unshift(newJob);
        return newJob;
    },
    addSubUser(context, userData) {
        // context is the store instance. context.getters is already processed.
        if (context.getters.isAdmin()) { // This call should work as getters are processed
            const existingUser = context.$data.state.users.find(u => u.username === userData.username);
            if (existingUser) {
                return Promise.reject('Username already exists.');
            }
            const newUser = {
                ...userData,
                id: context.$data.state.nextUserId++,
                role: 'recruiter',
                createdBy: context.$data.state.currentUser.username,
            };
            context.$data.state.users.push(newUser);
            return Promise.resolve(newUser);
        }
        return Promise.reject('Only admins can create sub-users.');
    },
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
// `store.$data` will hold the object returned by `data()`. So `store.$data.state` is where our state lives.
for (const key in store.getters) {
  processedGetters[key] = () => store.getters[key](store.$data.state);
}
store.getters = processedGetters;

const processedActions = {};
// In actions, `context` is the store instance. `context.$data.state` is the path to the state object.
// The actions themselves are defined to receive `context` as the first param,
// and internally they use `context.state` to refer to the state object.
// So, when calling an action: `store.actions[key](store, ...args)`
// Inside the action: `login(context, { username, password })`
// `context.state.users` should become `context.$data.state.users`.
// This requires modifying all actions.
// Let's adjust the actions to use `this.$data.state` directly, as they are methods of the Vue instance.

// Original actions:
// login(context, { username, password }) { ... context.state.users ... }
// We need to change this. If actions are methods of the Vue instance `store`,
// then `this` inside them is `store`. So `this.$data.state` is the state.

// Let's redefine actions to use `this` correctly.
const originalActions = store.actions;
store.actions = {}; // Reset
for (const key in originalActions) {
  store.actions[key] = (...args) => {
    // `this` inside originalActions[key] needs to be the store instance.
    // And originalActions[key] expects `context` as first arg, which is the store.
    // This is a bit circular. Let's simplify.
    // The actions are already methods of `store`. `this` inside them is `store`.
    // So, they should use `this.$data.state` to access state.
    // The `context` parameter was an attempt to mimic Vuex but makes it confusing here.
    // Let's make actions directly modify `this.$data.state`.

    // Example:
    // login({ username, password }) { // No context needed if it's a method of the store
    //   const user = this.$data.state.users.find(u => u.username === username && u.password === password);
    //   if (user) {
    //     this.$data.state.currentUser = { ...user, token: '...' };
    //     // ... resolve ...
    //   } // ... reject ...
    // }
    // The current `processedActions` loop passes `store` as context, which is fine.
    // The issue is what `context.state` points to inside the action definition.
    // If action is `login(context, credentials)`, and we call `action(store, credentials)`,
    // then inside `login`, `context` is `store`.
    // So `context.state` (as written before) would be `store.state`.
    // If `data()` returns `{ state: { ... } }`, then `store.state` is undefined.
    // `store.$data` is `{ state: { ... } }`. So `store.$data.state` is the actual state.
    // So actions should use `context.$data.state`.

    // Let's modify the original action definitions to use `context.$data.state`.
    // This is less intrusive than rewriting the `processedActions` part for now.
    // This change needs to be made in the original action definitions themselves.
    // I will do that with another replace operation after this one, as it's a different part of the file.
    return originalActions[key](store, ...args); // Keep this processing for now
  };
}
// The `processedActions` part is okay, the issue is within the action definitions' use of `context.state`.
// For now, I'll assume the actions will be fixed separately to use `context.$data.state`.


// Attempt auto-login on store initialization
store.actions.tryAutoLogin();

export default store;
