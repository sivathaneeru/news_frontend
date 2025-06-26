<template>
  <div class="manage-sub-users-container container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3 mb-0 text-gray-800"><i class="bi bi-people-fill me-2"></i>Manage Sub-Users</h1>
      <button class="btn btn-lg btn-success" @click="openSubUserFormModal" v-if="isAdmin">
        <i class="bi bi-person-plus-fill me-1"></i> Create New Sub-User
      </button>
    </div>

    <!-- Alert for successful sub-user creation -->
    <div v-if="showAlert" :class="['alert alert-dismissible fade show d-flex align-items-center', alertType === 'success' ? 'alert-success' : 'alert-danger']" role="alert">
      <i :class="[alertType === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill', 'bi me-2']"></i>
      <div>
        <strong>{{ alertType === 'success' ? 'Success!' : 'Error!' }}</strong> {{ alertMessage }}
      </div>
      <button type="button" class="btn-close" @click="dismissAlert" aria-label="Close"></button>
    </div>

    <div class="card shadow-sm">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary"><i class="bi bi-list-ul me-2"></i>Recruiter Accounts</h6>
      </div>
      <div class="card-body">
        <div v-if="loading" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading users...</span>
          </div>
        </div>
        <div v-else-if="subUsers.length === 0" class="text-center py-5">
          <i class="bi bi-person-badge" style="font-size: 3rem; color: #6c757d;"></i>
          <h4 class="mt-3">No Sub-Users Found</h4>
          <p class="text-muted">Create recruiter accounts to allow them to post jobs.</p>
           <button class="btn btn-info mt-2" @click="openSubUserFormModal" v-if="isAdmin">
            <i class="bi bi-person-plus-fill me-1"></i> Create First Sub-User
          </button>
        </div>
        <div v-else class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Username</th>
                <th scope="col">Role</th>
                <th scope="col">Created By</th>
                <!-- <th scope="col">Actions</th> -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in subUsers" :key="user.id">
                <td>{{ index + 1 }}</td>
                <td><i class="bi bi-person-circle me-2 text-muted"></i>{{ user.username }}</td>
                <td><span class="badge bg-info text-dark">{{ user.role }}</span></td>
                <td>{{ user.createdBy || 'N/A' }}</td>
                <!-- <td>
                  <button class="btn btn-sm btn-outline-secondary me-1" title="Edit (Not Implemented)">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" title="Delete (Not Implemented)">
                    <i class="bi bi-trash"></i>
                  </button>
                </td> -->
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- SubUserForm Modal -->
    <SubUserFormModal
      ref="subUserFormModalRef"
      @sub-user-saved="handleSubUserSaved"
      @sub-user-save-error="handleSubUserSaveError"
    />
  </div>
</template>

<script>
import SubUserFormModal from '../components/SubUserForm.vue';

export default {
  name: 'ManageSubUsersView', // To satisfy multi-word component names rule
  components: {
    SubUserFormModal,
  },
  data() {
    return {
      // subUsers: [], // Will be a computed property
      loading: false,
      showAlert: false,
      alertMessage: '',
      alertType: 'success',
    };
  },
  computed: {
    isAdmin() {
      return this.$store.getters.isAdmin(); // Getter usage is fine
    },
    subUsers() {
      // Reactive source from store via getter
      // Filter for users created by the current admin, or all recruiters.
      // The store's subUsers getter might be too specific if it looks for 'createdBy'.
      // For this view, we likely want all users with 'recruiter' role.
      return this.$store.getters.allUsers().filter(u => u.role === 'recruiter');
    }
  },
  methods: {
    // fetchSubUsers is no longer needed if subUsers is computed.
    // simulateInitialLoad can be used if a loading spinner is desired.
    simulateInitialLoad() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 300);
    },
    openSubUserFormModal() {
      if (this.isAdmin) {
        this.$refs.subUserFormModalRef.openModal();
      } else {
        this.alertType = 'error';
        this.alertMessage = 'You do not have permission to create sub-users.';
        this.showAlert = true;
      }
    },
    handleSubUserSaved(userData) {
      this.alertType = 'success';
      this.alertMessage = `Sub-user "${userData.username}" has been created successfully.`;
      this.showAlert = true;
      // this.fetchSubUsers(); // No longer needed, computed property will update
    },
    handleSubUserSaveError(errorMessage) {
      this.alertType = 'error';
      this.alertMessage = errorMessage || 'Failed to create sub-user.';
      this.showAlert = true;
    },
    dismissAlert() {
      this.showAlert = false;
      this.alertMessage = '';
    }
  },
  created() {
    if (!this.isAdmin) {
      // Optional: Redirect if not admin, or rely on UI cues
      // this.$router.push('/dashboard');
      // For now, just show a message if they somehow land here.
      // Route guards should prevent non-admins from accessing.
      console.warn("Non-admin accessed ManageSubUsers page. This should be prevented by route guard.");
    }
    // this.fetchSubUsers(); // Replaced by computed and simulateInitialLoad
    this.simulateInitialLoad();
  },
};
</script>

<style scoped>
.text-gray-800 {
  color: #5a5c69 !important;
}
.card {
    border: none;
}
.table th {
  font-weight: 500;
}
.table .badge {
  font-size: 0.85em;
}
.align-middle {
  vertical-align: middle !important;
}
.alert .bi {
  font-size: 1.25rem;
}
</style>
