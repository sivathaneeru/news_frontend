// store.js
import Vue from 'vue';

const store = new Vue({
  data() {
    return {
      state: {
        currentUser: null,
        users: [
          { id: 1, username: 'admin', password: 'password', role: 'admin' },
          { id: 2, username: 'recruiter1', password: 'password', role: 'recruiter' },
          { id: 3, username: 'recruiter2', password: 'password', role: 'recruiter' },
        ],
        jobPostings: [
          {
            id: 'job1',
            title: 'Senior Vue Developer',
            description: 'Seeking an experienced Vue.js developer to build amazing user interfaces...',
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
            description: 'Join our dynamic team as a Frontend Engineer...',
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
      },
    };
  },
  methods: {
    // Simulated Auth
    login({ username, password }) {
      return new Promise((resolve, reject) => {
        const user = this.state.users.find(u => u.username === username && u.password === password);
        if (user) {
          const token = Math.random().toString(36).substring(7);
          this.state.currentUser = { ...user, token };
          localStorage.setItem('currentUser', JSON.stringify(this.state.currentUser));
          resolve(this.state.currentUser);
        } else {
          reject('Invalid username or password');
        }
      });
    },
    logout() {
      this.state.currentUser = null;
      localStorage.removeItem('currentUser');
    },
    tryAutoLogin() {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const userExists = this.state.users.find(u => u.id === user.id && u.username === user.username);
        if (userExists && user.token) {
          this.state.currentUser = user;
          return true;
        } else {
          localStorage.removeItem('currentUser');
        }
      }
      return false;
    },
    addJob(jobData) {
      const newJob = {
        ...jobData,
        id: `job${this.state.nextJobId++}`,
        postedBy: this.state.currentUser.username,
        datePosted: new Date().toISOString(),
      };
      this.state.jobPostings.unshift(newJob);
      return newJob;
    },
    addSubUser(userData) {
      if (this.isAdmin) {
        const exists = this.state.users.some(u => u.username === userData.username);
        if (exists) {
          return Promise.reject('Username already exists');
        }
        const newUser = {
          ...userData,
          id: this.state.nextUserId++,
          role: 'recruiter',
          createdBy: this.state.currentUser.username,
        };
        this.state.users.push(newUser);
        return Promise.resolve(newUser);
      }
      return Promise.reject('Only admin can create sub-users');
    },
  },
  computed: {
    isAuthenticated() {
      return !!this.state.currentUser && !!this.state.currentUser.token;
    },
    currentUser() {
      return this.state.currentUser;
    },
    isAdmin() {
      return this.state.currentUser?.role === 'admin';
    },
    isRecruiter() {
      return this.state.currentUser?.role === 'recruiter';
    },
    allUsers() {
      return this.state.users;
    },
    subUsers() {
      return this.state.users.filter(u => u.role === 'recruiter' && u.createdBy === 'admin');
    },
    allJobPostings() {
      return [...this.state.jobPostings].sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted));
    },
  },
});

// Call auto login immediately
store.tryAutoLogin();

export default store;
