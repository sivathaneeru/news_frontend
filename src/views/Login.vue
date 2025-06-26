<template>
  <div class="login-container d-flex align-items-center justify-content-center">
    <div class="login-card card p-4 shadow">
      <div class="card-body">
        <div class="text-center mb-4">
          <i class="bi bi-briefcase-fill" style="font-size: 3rem; color: var(--bs-primary);"></i>
          <h2 class="mt-2">JobPostify Login</h2>
          <p class="text-muted">Access your job management dashboard.</p>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-person-fill"></i></span>
              <input type="text" class="form-control" id="username" v-model="username" placeholder="e.g., admin or recruiter1" required>
            </div>
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-lock-fill"></i></span>
              <input type="password" class="form-control" id="password" v-model="password" placeholder="password" required>
            </div>
          </div>

          <div v-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            <div>{{ error }}</div>
          </div>

          <div class="d-grid">
            <button type="submit" class="btn btn-primary btn-lg" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <i v-else class="bi bi-box-arrow-in-right me-2"></i>
              Login
            </button>
          </div>
        </form>
        <hr>
        <div class="text-center text-muted">
          <p class="mb-1 small">Available users for testing:</p>
          <ul class="list-unstyled small">
            <li>Admin: <code>admin</code> / <code>password</code></li>
            <li>Recruiter: <code>recruiter1</code> / <code>password</code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      username: '',
      password: '',
      error: null,
      loading: false,
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.error = null;
      try {
        // Actions are called directly, payload is the first argument
        await this.$store.actions.login({ username: this.username, password: this.password });
        this.$emit('user-logged-in'); // Emit event for App.vue to react
        this.$router.push('/dashboard');
      } catch (err) {
        this.error = err || 'An unknown error occurred.';
        this.password = ''; // Clear password field on error
      } finally {
        this.loading = false;
      }
    }
  },
  created() {
    // If user is already logged in, redirect to dashboard
    if (this.$store.getters.isAuthenticated()) { // Getter usage remains the same
      this.$router.push('/dashboard');
    }
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh; /* Full viewport height */
  background: linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12);
  /* Or a simpler background: background-color: #f0f2f5; */
  padding: 1rem;
}

.login-card {
  width: 100%;
  max-width: 420px; /* Max width of the login card */
  border: none; /* Remove default card border if using shadow */
  border-radius: 0.75rem; /* Softer corners */
}

.input-group-text {
  background-color: #e9ecef;
  border-right: none;
}
.form-control {
  border-left: none;
}
.form-control:focus {
  border-color: #86b7fe; /* Bootstrap focus color */
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25); /* Bootstrap focus shadow */
  border-left: none; /* Keep border consistent on focus */
}
.input-group:focus-within .input-group-text {
  border-color: #86b7fe; /* Match input focus */
}
.input-group:focus-within .form-control {
   border-left: none; /* Ensure border is not re-added */
}


.d-grid .btn {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}
</style>
