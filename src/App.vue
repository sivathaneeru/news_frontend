<template>
  <div id="app-container" :class="appClasses">
    <Navbar v-if="isLoggedIn" @toggle-sidebar="toggleSidebar" :is-sidebar-active="isSidebarActuallyActive" />

    <div class="main-layout-wrapper" :class="{'logged-in-layout': isLoggedIn}">
      <nav v-if="isLoggedIn" id="sidebarMenu" class="sidebar bg-light" :class="{ 'active': isSidebarActuallyActive }">
        <div class="position-sticky pt-3 sidebar-sticky">
          <ul class="nav flex-column">
            <li class="nav-item">
              <router-link class="nav-link" to="/dashboard" active-class="active" @click="closeMobileSidebar">
                <i class="bi bi-speedometer2"></i> Dashboard
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/post-job" active-class="active" @click="closeMobileSidebar">
                <i class="bi bi-plus-square"></i> Post New Job
              </router-link>
            </li>
            <li class="nav-item" v-if="isAdmin">
              <router-link class="nav-link" to="/manage-sub-users" active-class="active" @click="closeMobileSidebar">
                <i class="bi bi-people"></i> Manage Sub-Users
              </router-link>
            </li>
          </ul>
          <hr>
          <ul class="nav flex-column mb-2">
            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="handleLogout">
                <i class="bi bi-box-arrow-right"></i> Logout
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <main class="main-content-area">
        <router-view @user-logged-in="onUserLoggedIn" @user-logged-out="onUserLoggedOut" />
      </main>
    </div>

    <!-- Mobile overlay for sidebar -->
    <div v-if="isLoggedIn && isMobileView && isSidebarActuallyActive" class="sidebar-overlay" @click="closeMobileSidebar"></div>
  </div>
</template>

<script>
// import AppNavbar from './components/AppNavbar.vue';

export default {
  name: 'App',
  components: {
    // AppNavbar
  },
  data() {
    return {
      // Reactive properties from the store
      // isLoggedIn: this.$store.getters.isAuthenticated(), // Initialized in created/mounted
      // isAdmin: this.$store.getters.isAdmin(), // Initialized in created/mounted

      // Internal component state for UI
      sidebarOpenOnDesktop: true, // User's preference for desktop sidebar
      sidebarOpenOnMobile: false, // Sidebar state on mobile
      isMobileView: false, // Tracks if current view is mobile
    };
  },
  computed: {
    isLoggedIn() {
      // Accessing getter from the new store structure
      return this.$store.getters.isAuthenticated();
    },
    isAdmin() {
      // Accessing getter from the new store structure
      return this.$store.getters.isAdmin();
    },
    // Reactive access to state for UI updates
    currentUserForWatch() {
      return this.$store.state.currentUser;
    },
    isSidebarActuallyActive() {
      // Determines if the sidebar should be visually active
      if (this.isMobileView) {
        return this.sidebarOpenOnMobile;
      }
      return this.sidebarOpenOnDesktop;
    },
    appClasses() {
      return {
        'sidebar-desktop-collapsed': this.isLoggedIn && !this.isMobileView && !this.sidebarOpenOnDesktop,
        'sidebar-mobile-active': this.isLoggedIn && this.isMobileView && this.sidebarOpenOnMobile,
        'app-logged-in': this.isLoggedIn,
        'app-logged-out': !this.isLoggedIn,
      };
    }
  },
  methods: {
    toggleSidebar() {
      if (this.isMobileView) {
        this.sidebarOpenOnMobile = !this.sidebarOpenOnMobile;
      } else {
        this.sidebarOpenOnDesktop = !this.sidebarOpenOnDesktop;
      }
    },
    closeMobileSidebar() {
      if (this.isMobileView) {
        this.sidebarOpenOnMobile = false;
      }
    },
    onUserLoggedIn() {
      // No direct state mutation here, computed isLoggedIn/isAdmin will react
      this.updateLayoutForUser();
    },
    onUserLoggedOut() {
      this.$store.actions.logout(); // This will update $store.state.currentUser
      // Computed properties isLoggedIn/isAdmin will react to this change.
      this.sidebarOpenOnMobile = false;
      // this.sidebarOpenOnDesktop = true;
      if (this.$router.currentRoute.path !== '/login') {
        this.$router.push('/login');
      }
    },
    handleLogout() { // Method for sidebar logout button
      this.onUserLoggedOut();
    },
    checkViewport() {
      const currentlyMobile = window.innerWidth < 768;
      if (currentlyMobile !== this.isMobileView) {
        this.isMobileView = currentlyMobile;
        // If transitioning from desktop to mobile, ensure mobile sidebar is closed initially
        if (this.isMobileView) {
          this.sidebarOpenOnMobile = false;
        }
        // If transitioning from mobile to desktop, sidebar state is sidebarOpenOnDesktop
      }
    },
    updateLayoutForUser() {
      this.checkViewport(); // Set initial mobile/desktop state
      if (this.isLoggedIn) {
        if (this.isMobileView) {
          this.sidebarOpenOnMobile = false; // Start collapsed on mobile
        }
        // Desktop state (sidebarOpenOnDesktop) remains as per user preference or default true
      }
    }
  },
  watch: {
    '$route'() {
      this.closeMobileSidebar();
    },
    // Watch the reactive currentUser from the store's state
    currentUserForWatch: {
      handler(newUser) {
        // this.isLoggedIn and this.isAdmin are computed properties, they will update automatically.
        // This watcher is mainly to trigger component methods like updateLayoutForUser if needed,
        // or to react to the presence/absence of a user.
        if (newUser) {
          this.updateLayoutForUser();
        } else {
          // User logged out
          this.sidebarOpenOnMobile = false;
          // Potentially redirect if not on login page, though router guards should handle this
           if (this.$router.currentRoute.path !== '/login') {
             // this.$router.push('/login'); // router guard handles this
           }
        }
      },
      deep: true, // If currentUser is an object and we need to react to its property changes
      immediate: true // Run handler immediately with current value
    }
  },
  created() {
    this.updateLayoutForUser(); // Initial layout check
    window.addEventListener('resize', this.checkViewport);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkViewport);
  }
};
</script>

<style>
/* Using styles from public/index.html for .sidebar, .main-content etc. */
/* Add any App.vue specific styles here or override if necessary */

#app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-layout-wrapper {
  display: flex;
  flex-grow: 1;
  /* Default for logged-out state, router-view takes full space */
}

.main-layout-wrapper.logged-in-layout {
   padding-top: 56px; /* Navbar height */
}

.sidebar {
  /* Styles from public/index.html are primary */
  /* This ensures it's fixed and has correct width and transition */
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  padding: 56px 0 0; /* Navbar height */
  width: 220px;
  transform: translateX(0); /* Default visible state */
  transition: transform 0.3s ease-in-out;
}

.main-content-area {
  flex-grow: 1;
  padding: 0; /* Give router-view full control of its padding */
  transition: margin-left 0.3s ease-in-out;
  overflow-y: auto; /* Allow content to scroll */
}

.app-logged-in .main-content-area {
  margin-left: 220px; /* Default when sidebar is open */
   /* The padding for content inside views should be handled by the views themselves or a wrapper there */
}
.app-logged-out .main-content-area {
  margin-left: 0;
  /* router-view for login page will take full height */
}


/* Desktop collapsed state */
.app-logged-in.sidebar-desktop-collapsed .sidebar {
  transform: translateX(-220px);
}

.app-logged-in.sidebar-desktop-collapsed .main-content-area {
  margin-left: 0;
}

/* Mobile specific styles */
@media (max-width: 767.98px) {
  .app-logged-in .sidebar {
    transform: translateX(-220px); /* Hidden by default on mobile */
    z-index: 1030; /* Ensure it's above content, below navbar/modals */
  }

  .app-logged-in.sidebar-mobile-active .sidebar {
    transform: translateX(0); /* Show sidebar */
  }

  .app-logged-in .main-content-area {
    margin-left: 0 !important; /* Always full width on mobile, sidebar overlays */
  }

  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    z-index: 1020; /* Below sidebar, above content */
  }
}

.nav-link.active {
  font-weight: bold;
  color: #0d6efd !important; /* Bootstrap primary color */
}
.nav-link .bi {
  margin-right: 8px;
}
</style>
