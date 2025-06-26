import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store' // Import the store

// Lazy load components for better performance
const Login = () => import(/* webpackChunkName: "login" */ '../views/Login.vue');
const Dashboard = () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue');
const PostJob = () => import(/* webpackChunkName: "postjob" */ '../views/PostJob.vue');
const ManageSubUsers = () => import(/* webpackChunkName: "managesubusers" */ '../views/ManageSubUsers.vue');

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guest: true } // For redirecting logged-in users from login page
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/post-job',
    name: 'PostJob',
    component: PostJob,
    meta: { requiresAuth: true }
  },
  {
    path: '/manage-sub-users',
    name: 'ManageSubUsers',
    component: ManageSubUsers,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/', // Default path
    redirect: () => {
      // Redirect to dashboard if logged in, else to login
      return store.getters.isAuthenticated() ? '/dashboard' : '/login';
    }
  },
  {
    path: '*', // Catch-all for 404, redirect to a sensible default
    redirect: () => {
      return store.getters.isAuthenticated() ? '/dashboard' : '/login';
    }
  }
]

const router = new VueRouter({
  mode: 'history', // Or 'hash'
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  }
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated();
  const isAdmin = store.getters.isAdmin();

  // Try to auto-login if not authenticated and there's a stored user
  // This is useful if the page is refreshed and store state is lost but localStorage has user
  if (!isAuthenticated && localStorage.getItem('currentUser')) {
      const loggedIn = store.actions.tryAutoLogin(); // This action updates the store's currentUser
      if (loggedIn) {
          // Re-check auth status after auto-login attempt
          const newIsAuthenticated = store.getters.isAuthenticated();
          const newIsAdmin = store.getters.isAdmin();

          // Proceed with navigation checks using updated status
          handleNavigation(to, from, next, newIsAuthenticated, newIsAdmin);
          return;
      }
  }

  handleNavigation(to, from, next, isAuthenticated, isAdmin);
});

function handleNavigation(to, from, next, isAuthenticated, isAdmin) {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // This route requires auth, check if logged in
    if (!isAuthenticated) {
      // If not, redirect to login page.
      next({
        name: 'Login',
        query: { redirect: to.fullPath } // Optionally pass redirect query
      });
    } else {
      // User is authenticated, check for admin rights if required
      if (to.matched.some(record => record.meta.requiresAdmin)) {
        if (!isAdmin) {
          // Not an admin, redirect to dashboard (or an 'Unauthorized' page)
          next({ name: 'Dashboard' });
        } else {
          next(); // Admin, proceed
        }
      } else {
        next(); // Authenticated and no admin rights needed, proceed
      }
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    // This is a guest route (like login page)
    if (isAuthenticated) {
      // If user is already logged in, redirect them from guest pages
      next({ name: 'Dashboard' });
    } else {
      next(); // Not logged in, proceed to guest page
    }
  } else {
    // No specific meta fields, allow access
    next();
  }
}

export default router;
