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

            <hr class="my-4">

            <div class="mb-3">
              <h6 class="mb-3"><i class="bi bi-gem me-1"></i>Posting Tier</h6>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="jobTier" id="freeTier" value="free" v-model="formData.tier" checked>
                <label class="form-check-label" for="freeTier">
                  <strong>Free Tier</strong> - Standard visibility (30 days)
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="jobTier" id="premiumTier" value="premium" v-model="formData.tier">
                <label class="form-check-label" for="premiumTier">
                  <strong>Premium Tier</strong> - <span class="badge bg-warning text-dark me-1"><i class="bi bi-star-fill"></i> Featured</span> Higher visibility, top placement (60 days)
                  <span class="text-success fw-bold ms-2">($10.00 Mock Price)</span>
                </label>
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
        tier: 'free', // Default to free tier
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
        tier: 'free', // Reset tier to free
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

      // Tier-specific logic
      if (this.formData.tier === 'premium') {
        // Simulate payment confirmation for premium tier
        const paymentConfirmed = confirm("You've selected the Premium Tier for $10.00. Click OK to simulate successful payment and proceed.");
        if (!paymentConfirmed) {
          this.isSubmitting = false;
          return; // User cancelled payment
        }
        // In a real app, here you would integrate with a payment gateway.
        // For now, we just log it and proceed.
        console.log("Mock payment successful for Premium Tier.");
      }

      try {
        // The addJob action in the store is now async because JobService methods are async.
        // We should await its resolution.
        let jobPayload = { ...this.formData };

        if (this.jobToEdit && this.jobToEdit.id) {
          jobPayload.id = this.jobToEdit.id; // Ensure ID is included for updates
          // NOTE: The current store doesn't have an 'updateJob' action.
          // For this feature, we'll focus on 'addJob'.
          // A proper 'updateJob' would be needed for editing premium features.
          // For now, if editing, it might just re-add or error if not handled by addJob.
          // The existing `addJob` will effectively overwrite if ID is the same due to how dummy API works.
          // This is acceptable for now for the mock.
          console.warn('Update job functionality with premium tiers might require a dedicated update action in the store.');
          await this.$store.dispatch('addJob', jobPayload); // Assuming addJob can handle updates or it's a new job
        } else {
          await this.$store.dispatch('addJob', jobPayload);
        }

        // No direct 'savedJob' return from dispatch, success is implied if no error.
        // The store action 'fetchJobPostings' is called within 'addJob' or 'deleteJob' to update the list.
        this.$emit('job-saved', jobPayload); // Emit with the data sent
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
         // Ensure tier is also part of the editing payload if it exists
         this.formData = { ...this.jobToEdit, tier: this.jobToEdit.tier || 'free' };
      } else {
        this.formData.tier = 'free'; // Default to free for new jobs
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
      if (window.bootstrap && window.bootstrap.Modal) {
        this.modalInstance = new window.bootstrap.Modal(modalElement);
        modalElement.addEventListener('hidden.bs.modal', this.handleModalHidden);
      } else {
        console.error('Bootstrap Modal not found. Ensure Bootstrap JS is loaded.');
      }
    }
  },
  beforeUnmount() {
    // Clean up modal instance and event listener
    const modalElement = this.$refs.jobFormModal;
    if (modalElement) {
        modalElement.removeEventListener('hidden.bs.modal', this.handleModalHidden);
    }
    if (this.modalInstance) {
      // It's generally safer to let Bootstrap handle disposal if the modal element itself might be removed by Vue's rendering.
      // If you manually dispose, ensure the element isn't needed later by Bootstrap.
      // For this setup, removing the event listener is the most critical part.
      // this.modalInstance.dispose(); // Consider if needed, might conflict with Vue's DOM management
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
