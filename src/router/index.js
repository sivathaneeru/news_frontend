import Vue from 'vue';
import store from '../store'; // Import the store
import VueRouter from 'vue-router'; // Ensuring VueRouter is imported

// Lazy load components for better performance
// Using actual filenames as confirmed by `ls`
const Login=()=>import('../views/LoginView.vue');
const Dashboard = () => import('../views/DashboardView.vue');
const PostJobView = () => import( '../views/PostJob.vue');
const ManageSubUsersView = () => import( '../views/ManageSubUsers.vue');
const PublicJobListView = () => import('../views/PublicJobListView.vue'); // Corrected path
const CompanyProfileView = () => import('../views/CompanyProfileView.vue'); // Import Company Profile View

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guest: true }
  },
  {
    path: '/jobs', // New public route for job listings
    name: 'PublicJobList',
    component: PublicJobListView, // Initially points to DashboardView as a placeholder
    meta: { guest: true } // Allow guest access
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
    component: PostJobView,
    meta: { requiresAuth: true }
  },
  {
    path: '/manage-sub-users',
    name: 'ManageSubUsers',
    component: ManageSubUsersView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/company/:companyId',
    name: 'CompanyProfile',
    component: CompanyProfileView,
    props: true, // Pass route params as props to the component
    // meta: { guest: true } // Or requiresAuth: true, depending on if profiles are public
                           // For now, let's assume they are public (guest: true)
    meta: { guest: true } // Allowing guest access for now
  },
  {
    path: '/', // Default path
    redirect: () => {
      // Redirect to dashboard if logged in, else to the new public jobs page
      return store.getters.isAuthenticated() ? '/dashboard' : '/jobs';
    }
  },
  {
    path: '*', // Catch-all for 404, redirect to a sensible default
    redirect: () => {
      // Redirect to dashboard if logged in, else to the new public jobs page
      return store.getters.isAuthenticated() ? '/dashboard' : '/jobs';
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
