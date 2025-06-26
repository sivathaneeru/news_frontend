<template>
  <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/dashboard">
        <i class="bi bi-briefcase-fill"></i> JobPostify
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        @click="toggleSidebar"
        aria-controls="sidebarMenu"
        :aria-expanded="isSidebarActive.toString()"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarDefault">
        <ul class="navbar-nav ms-auto mb-2 mb-md-0 align-items-center">
          <li class="nav-item" v-if="currentUser">
            <span class="navbar-text me-3">
              Welcome, {{ currentUser.username }} ({{ currentUser.role }})
            </span>
          </li>
          <li class="nav-item">
            <button class="btn btn-outline-light" @click="handleLogout">
              <i class="bi bi-box-arrow-right"></i> Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  props: {
    isSidebarActive: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    currentUser() {
      return this.$store.getters.currentUser();
    }
  },
  methods: {
    toggleSidebar() {
      this.$emit('toggle-sidebar');
    },
    handleLogout() {
      // It's better to emit an event to App.vue to handle logout,
      // as App.vue is controlling the overall loggedIn state and routing.
      this.$root.$emit('user-logged-out'); // Global event bus on root instance
      // OR call store action and let App.vue react to store changes
      // this.$store.actions.logout();
      // if (this.$router.currentRoute.path !== '/login') {
      //   this.$router.push('/login');
      // }
    }
  },
  mounted() {
    // Bootstrap's collapse functionality for navbar items on medium screens and below
    // This is for the items within the navbar itself if we add more that need to collapse
    // The main navbar-toggler is for the sidebar.
    // If we had more links in the navbar that should collapse into a dropdown on mobile:
    // const navbarCollapse = document.getElementById('navbarDefault');
    // if (navbarCollapse) {
    //   new this.$bootstrap.Collapse(navbarCollapse, { // Assuming Vue.prototype.$bootstrap is set
    //     toggle: false
    //   });
    // }
  }
};
</script>

<style scoped>
.navbar {
  z-index: 1030; /* Ensure navbar is above sidebar */
}
.navbar-brand .bi {
  margin-right: 0.3rem;
  vertical-align: text-bottom;
}
.navbar-toggler {
  /* Specific for sidebar toggle, Bootstrap default might be for navbar internal collapse */
}

/* Adjust navbar height if necessary, and ensure App.vue padding-top matches */
/* .navbar { height: 56px; } */

.navbar-text {
  color: rgba(255, 255, 255, 0.75); /* Lighter text for welcome message */
}
</style>
