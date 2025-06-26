<template>
  <div class="modal fade" :id="modalId" tabindex="-1" :aria-labelledby="modalLabelId" aria-hidden="true" ref="jobFormModal">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <form @submit.prevent="submitJobForm">
          <div class="modal-header">
            <h5 class="modal-title" :id="modalLabelId">
              <i class="bi bi-pencil-square me-2"></i>{{ formTitle }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="formError" class="alert alert-danger d-flex align-items-center" role="alert">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              <div>{{ formError }}</div>
            </div>

            <div class="mb-3">
              <label for="jobTitle" class="form-label">Job Title <span class="text-danger">*</span></label>
              <input type="text" class="form-control" id="jobTitle" v-model.trim="formData.title" required placeholder="e.g., Senior Software Engineer">
            </div>

            <div class="mb-3">
              <label for="jobDescription" class="form-label">Description <span class="text-danger">*</span></label>
              <textarea class="form-control" id="jobDescription" v-model.trim="formData.description" rows="5" required placeholder="Describe the job responsibilities, requirements, etc."></textarea>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="jobLocation" class="form-label">Location <span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="jobLocation" v-model.trim="formData.location" required placeholder="e.g., Remote, New York, NY">
              </div>
              <div class="col-md-6 mb-3">
                <label for="jobExperience" class="form-label">Experience Required <span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="jobExperience" v-model.trim="formData.experience" required placeholder="e.g., 5+ Years, Entry Level">
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="jobType" class="form-label">Job Type <span class="text-danger">*</span></label>
                <select class="form-select" id="jobType" v-model="formData.type" required>
                  <option value="" disabled>Select job type...</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Temporary">Temporary</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label for="jobSalary" class="form-label">Salary Range</label>
                <input type="text" class="form-control" id="jobSalary" v-model.trim="formData.salary" placeholder="e.g., $100,000 - $120,000 or Competitive">
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              <i class="bi bi-x-circle"></i> Cancel
            </button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              <i v-else class="bi bi-check-circle-fill me-1"></i>
              {{ submitButtonText }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
// import { Modal } from 'bootstrap'; // Only if programmatically controlling ALL aspects

export default {
  name: 'JobFormModal',
  props: {
    jobToEdit: { // Pass a job object if editing, null for new job
      type: Object,
      default: null,
    },
    modalId: {
      type: String,
      default: 'jobFormModalComponent' // Unique ID for the modal
    }
  },
  data() {
    return {
      formData: {
        title: '',
        description: '',
        location: '',
        experience: '',
        type: '', // Default to empty, user must select
        salary: '',
      },
      isSubmitting: false,
      formError: null,
      modalInstance: null, // Store Bootstrap modal instance
    };
  },
  computed: {
    formTitle() {
      return this.jobToEdit ? 'Edit Job Post' : 'Create New Job Post';
    },
    submitButtonText() {
      return this.jobToEdit ? 'Save Changes' : 'Create Job Post';
    },
    modalLabelId() {
        return `${this.modalId}Label`;
    }
  },
  watch: {
    jobToEdit: {
      handler(newVal) {
        if (newVal) {
          // Pre-fill form if editing
          this.formData = { ...newVal };
        } else {
          // Reset form for new job
          this.resetForm();
        }
      },
      immediate: true, // Run on component creation if jobToEdit is initially passed
      deep: true
    },
  },
  methods: {
    resetForm() {
      this.formData = {
        title: '',
        description: '',
        location: '',
        experience: '',
        type: '',
        salary: '',
      };
      this.formError = null;
      this.isSubmitting = false;
    },
    async submitJobForm() {
      this.isSubmitting = true;
      this.formError = null;

      // Basic frontend validation (Bootstrap HTML5 validation also helps)
      if (!this.formData.title || !this.formData.description || !this.formData.location || !this.formData.experience || !this.formData.type) {
        this.formError = 'Please fill in all required fields.';
        this.isSubmitting = false;
        return;
      }

      try {
        let savedJob;
        if (this.jobToEdit && this.jobToEdit.id) {
          // Placeholder for edit logic - requires store action for updating
          // savedJob = await this.$store.actions.updateJob({ ...this.formData, id: this.jobToEdit.id });
          // For now, we'll just simulate it by adding a new one for simplicity in this example,
          // as update logic in the store is not yet defined.
          // Or, emit an event for parent to handle update, then parent calls store.
          console.warn('Update job functionality not fully implemented in store. Simulating save.');
          savedJob = { ...this.formData, id: this.jobToEdit.id, updatedDate: new Date().toISOString() }; // Simulate update
          this.$store.actions.addJob(savedJob); // Temp: treat as new job for demo
        } else {
          savedJob = await this.$store.actions.addJob(this.formData);
        }
        this.$emit('job-saved', savedJob); // Emit event with saved job data
        this.closeModal();
      } catch (error) {
        this.formError = error.message || 'An error occurred while saving the job post.';
        console.error("Error saving job:", error);
      } finally {
        this.isSubmitting = false;
      }
    },
    openModal() {
      this.resetForm(); // Reset form when opening for a new job, or repopulate if editing
      if (this.jobToEdit) {
         this.formData = { ...this.jobToEdit };
      }
      if (this.modalInstance) {
        this.modalInstance.show();
      }
    },
    closeModal() {
      if (this.modalInstance) {
        this.modalInstance.hide();
      }
      // Emitting event even if closed via X button or backdrop click
      // The 'hidden.bs.modal' event listener below handles this better
    },
    handleModalHidden() {
      // This event is triggered by Bootstrap after the modal is fully hidden
      this.resetForm();
      this.$emit('modal-closed');
    }
  },
  mounted() {
    // Initialize Bootstrap modal instance
    const modalElement = this.$refs.jobFormModal;
    if (modalElement) {
      // Ensure bootstrap is available. In a CLI project, it's usually imported.
      // For CDN, it's globally available.
      this.modalInstance = new bootstrap.Modal(modalElement);
      modalElement.addEventListener('hidden.bs.modal', this.handleModalHidden);
    }
  },
  beforeDestroy() {
    // Clean up modal instance and event listener
    if (this.modalInstance) {
      // modalElement.removeEventListener('hidden.bs.modal', this.handleModalHidden);
      // Bootstrap 5 modals might not need explicit dispose if not causing issues,
      // but it's good practice for SPAs to prevent memory leaks or conflicts.
      // this.modalInstance.dispose();
      // However, disposing can be tricky if the element is reused.
      // For now, just remove listener. Parent controls if modal element is destroyed.
       const modalElement = this.$refs.jobFormModal;
       if (modalElement) {
           modalElement.removeEventListener('hidden.bs.modal', this.handleModalHidden);
       }
    }
  },
};
</script>

<style scoped>
.modal-body {
  max-height: 70vh; /* Example max height */
  overflow-y: auto;
}
.form-label .text-danger {
  font-size: 0.8em;
  margin-left: 2px;
}
.modal-header .bi {
  color: var(--bs-primary);
}
</style>
