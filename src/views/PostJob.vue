<template>
  <div class="post-job-container container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3 mb-0 text-gray-800"><i class="bi bi-plus-square-dotted me-2"></i>Post New Job</h1>
      <button class="btn btn-lg btn-primary" @click="openJobFormModal">
        <i class="bi bi-pencil-square me-1"></i> Open Job Form
      </button>
    </div>

    <!-- Alert for successful job creation -->
    <div v-if="showAlert" class="alert alert-success alert-dismissible fade show d-flex align-items-center" role="alert">
      <i class="bi bi-check-circle-fill me-2"></i>
      <div>
        <strong>Success!</strong> {{ alertMessage }}
      </div>
      <button type="button" class="btn-close" @click="dismissAlert" aria-label="Close"></button>
    </div>

    <div class="card shadow-sm">
      <div class="card-body text-center py-5">
        <i class="bi bi-file-earmark-plus-fill" style="font-size: 4rem; color: var(--bs-primary);"></i>
        <h4 class="mt-3">Ready to find the perfect candidate?</h4>
        <p class="text-muted">Click the button above to open the job creation form and fill in the details for your new job posting.</p>
        <p class="mt-4">
          Your posted jobs will appear on the <router-link to="/dashboard">Dashboard</router-link>.
        </p>
      </div>
    </div>

    <!-- Job Form Modal -->
    <JobFormModal
      ref="jobFormModalRef"
      :job-to-edit="null"
      @job-saved="handleJobSaved"
      @modal-closed="handleModalClosed"
    />
  </div>
</template>

<script>
import JobFormModal from '../components/JobForm.vue'; // Will be created next

export default {
  name: 'PostJob',
  components: {
    JobFormModal,
  },
  data() {
    return {
      showAlert: false,
      alertMessage: '',
    };
  },
  methods: {
    openJobFormModal() {
      this.$refs.jobFormModalRef.openModal();
    },
    handleJobSaved(jobData) {
      // The store action is called within JobForm.vue
      // This handler is primarily for showing a success message on this page
      this.alertMessage = `Job "${jobData.title}" has been created successfully!`;
      this.showAlert = true;
      // Optionally, navigate away or reset something
      // this.$router.push('/dashboard');
    },
    handleModalClosed() {
      // Handle any cleanup if the modal is closed without saving, if necessary
      console.log('Job form modal closed.');
    },
    dismissAlert() {
      this.showAlert = false;
      this.alertMessage = '';
    }
  },
  mounted() {
    // For convenience, could open the modal automatically if a query param is set, e.g. /post-job?action=create
    if (this.$route.query.action === 'create') {
        // Ensure modal is ready
        this.$nextTick(() => {
            this.openJobFormModal();
        });
    }
  }
};
</script>

<style scoped>
.post-job-container {
  /* background-color: #eef2f6; */
}
.text-gray-800 {
  color: #5a5c69 !important;
}
.card {
    border: none;
}
.alert .bi {
  font-size: 1.25rem; /* Make icon a bit larger in alert */
}
</style>
