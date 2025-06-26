<template>
  <div class="modal fade" :id="modalId" tabindex="-1" :aria-labelledby="modalLabelId" aria-hidden="true" ref="subUserFormModal">
    <div class="modal-dialog modal-md modal-dialog-centered">
      <div class="modal-content">
        <form @submit.prevent="submitSubUserForm">
          <div class="modal-header">
            <h5 class="modal-title" :id="modalLabelId">
              <i class="bi bi-person-plus-fill me-2"></i>Create New Sub-User Account
            </h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="formError" class="alert alert-danger d-flex align-items-center" role="alert">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              <div>{{ formError }}</div>
            </div>

            <p class="text-muted small mb-3">
              Sub-users will be created with the 'recruiter' role and will be able to log in and post jobs.
            </p>

            <div class="mb-3">
              <label for="subUsername" class="form-label">Username <span class="text-danger">*</span></label>
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-person"></i></span>
                <input type="text" class="form-control" id="subUsername" v-model.trim="formData.username" required placeholder="Enter a unique username">
              </div>
            </div>

            <div class="mb-3">
              <label for="subPassword" class="form-label">Password <span class="text-danger">*</span></label>
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-lock"></i></span>
                <input type="password" class="form-control" id="subPassword" v-model="formData.password" required placeholder="Enter a strong password">
              </div>
            </div>

            <div class="mb-3">
              <label for="subConfirmPassword" class="form-label">Confirm Password <span class="text-danger">*</span></label>
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-shield-lock"></i></span>
                <input type="password" class="form-control" id="subConfirmPassword" v-model="formData.confirmPassword" required placeholder="Re-enter password">
              </div>
               <div v-if="formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword" class="text-danger small mt-1">
                Passwords do not match.
              </div>
            </div>

            <!-- Role is fixed to 'recruiter' for sub-users for this app's logic -->
            <input type="hidden" v-model="formData.role">

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              <i class="bi bi-x-circle"></i> Cancel
            </button>
            <button type="submit" class="btn btn-success" :disabled="isSubmitting || (formData.password && formData.password !== formData.confirmPassword)">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              <i v-else class="bi bi-check-circle-fill me-1"></i>
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
// import { Modal } from 'bootstrap'; // If needed for full programmatic control

export default {
  name: 'SubUserFormModal',
  props: {
    modalId: {
      type: String,
      default: 'subUserFormModalComponent' // Unique ID for the modal
    }
  },
  data() {
    return {
      formData: {
        username: '',
        password: '',
        confirmPassword: '',
        role: 'recruiter', // Fixed role for sub-users
      },
      isSubmitting: false,
      formError: null,
      modalInstance: null,
    };
  },
  computed: {
    modalLabelId() {
        return `${this.modalId}Label`;
    }
  },
  methods: {
    resetForm() {
      this.formData = {
        username: '',
        password: '',
        confirmPassword: '',
        role: 'recruiter',
      };
      this.formError = null;
      this.isSubmitting = false;
    },
    async submitSubUserForm() {
      this.isSubmitting = true;
      this.formError = null;

      if (!this.formData.username || !this.formData.password || !this.formData.confirmPassword) {
        this.formError = 'Please fill in all required fields.';
        this.isSubmitting = false;
        return;
      }

      if (this.formData.password !== this.formData.confirmPassword) {
        this.formError = 'Passwords do not match.';
        this.isSubmitting = false;
        return;
      }

      // Password strength check (basic example)
      if (this.formData.password.length < 6) {
        this.formError = 'Password must be at least 6 characters long.';
        this.isSubmitting = false;
        return;
      }

      try {
        // Destructure to avoid sending confirmPassword to the store action
        // eslint-disable-next-line no-unused-vars
        const { confirmPassword, ...userDataToSave } = this.formData;
        const savedUser = await this.$store.actions.addSubUser(userDataToSave);
        this.$emit('sub-user-saved', savedUser);
        this.closeModal();
      } catch (error) {
        this.formError = typeof error === 'string' ? error : (error.message || 'An error occurred while creating the sub-user.');
        this.$emit('sub-user-save-error', this.formError);
        console.error("Error creating sub-user:", error);
      } finally {
        this.isSubmitting = false;
      }
    },
    openModal() {
      this.resetForm();
      if (this.modalInstance) {
        this.modalInstance.show();
      }
    },
    closeModal() {
      if (this.modalInstance) {
        this.modalInstance.hide();
      }
    },
    handleModalHidden() {
      this.resetForm();
      this.$emit('modal-closed'); // Optional: if parent needs to know
    }
  },
  mounted() {
    const modalElement = this.$refs.subUserFormModal;
    if (modalElement) {
      if (window.bootstrap && window.bootstrap.Modal) {
        this.modalInstance = new window.bootstrap.Modal(modalElement);
        modalElement.addEventListener('hidden.bs.modal', this.handleModalHidden);
      } else {
        console.error('Bootstrap Modal not found. Ensure Bootstrap JS is loaded.');
      }
    }
  },
  beforeUnmount() {
    const modalElement = this.$refs.subUserFormModal;
    if (modalElement) {
       modalElement.removeEventListener('hidden.bs.modal', this.handleModalHidden);
    }
    // if (this.modalInstance) {
    //   // this.modalInstance.dispose(); // Consider implications
    // }
  },
};
</script>

<style scoped>
.modal-body {
  max-height: 70vh;
  overflow-y: auto;
}
.form-label .text-danger {
  font-size: 0.8em;
  margin-left: 2px;
}
.modal-header .bi {
  color: var(--bs-success); /* Using success color for user creation */
}
.input-group-text {
  background-color: #e9ecef;
  border-right: none;
}
.form-control {
  border-left: none;
}
.form-control:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
  border-left: none;
}
.input-group:focus-within .input-group-text {
  border-color: #86b7fe;
}
</style>
