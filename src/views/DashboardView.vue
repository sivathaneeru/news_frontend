<template>
  <div class="dashboard-container container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3 mb-0 text-gray-800"><i class="bi bi-speedometer2 me-2"></i>Dashboard</h1>
      <router-link to="/post-job" class="btn btn-primary">
        <i class="bi bi-plus-circle-fill me-1"></i> Post New Job
      </router-link>
    </div>

    <!-- Welcome Message -->
    <div class="alert alert-info" role="alert" v-if="currentUser">
      <h4 class="alert-heading">Welcome back, {{ currentUser.username }}!</h4>
      <p>You are logged in as an <strong>{{ currentUser.role }}</strong>. You can view existing job postings below or create a new one.</p>
      <hr v-if="isAdmin">
      <p class="mb-0" v-if="isAdmin">As an admin, you can also manage sub-user accounts from the sidebar.</p>
    </div>

    <!-- Job Postings Section -->
    <div class="row">
      <div class="col-12">
        <div class="card shadow-sm mb-4">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary"><i class="bi bi-list-task me-2"></i>Current Job Postings</h6>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p>Loading jobs...</p>
            </div>
            <div v-else-if="jobPostings.length === 0" class="text-center py-5">
              <i class="bi bi-journal-x" style="font-size: 3rem; color: #6c757d;"></i>
              <h4 class="mt-3">No Job Postings Yet</h4>
              <p class="text-muted">Get started by creating a new job post.</p>
              <router-link to="/post-job" class="btn btn-success mt-2">
                <i class="bi bi-plus-square me-1"></i> Create First Job Post
              </router-link>
            </div>
            <div v-else class="row gy-4">
              <!-- JobCard components will be rendered here -->
              <div v-for="job in jobPostings" :key="job.id" class="col-md-6 col-lg-4">
                <JobCard
                  :job="job"
                  @view-details="handleViewDetails"
                  details-modal-id="#jobDetailsModal"
                  @edit-job="handleEditJob"
                  @delete-job="handleDeleteJob"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Job Details Modal (Example - Can be expanded) -->
    <div class="modal fade" id="jobDetailsModal" tabindex="-1" aria-labelledby="jobDetailsModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="jobDetailsModalLabel">
              <i class="bi bi-briefcase-fill me-2"></i>{{ selectedJob ? selectedJob.title : 'Job Details' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="selectedJob">
            <p><strong>Description:</strong></p>
            <p style="white-space: pre-wrap;">{{ selectedJob.description }}</p>
            <hr>
            <div class="row">
              <div class="col-md-6">
                <p><strong><i class="bi bi-geo-alt-fill me-1"></i>Location:</strong> {{ selectedJob.location }}</p>
                <p><strong><i class="bi bi-building-fill-gear me-1"></i>Type:</strong> {{ selectedJob.type }}</p>
              </div>
              <div class="col-md-6">
                <p><strong><i class="bi bi-graph-up me-1"></i>Experience:</strong> {{ selectedJob.experience }}</p>
                <p><strong><i class="bi bi-cash-coin me-1"></i>Salary:</strong> {{ selectedJob.salary }}</p>
              </div>
            </div>
             <p class="mt-3 text-muted small">
              Posted on: {{ formatDate(selectedJob.datePosted) }} by {{ selectedJob.postedBy }}
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <!-- Add apply or edit buttons here if needed -->
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import JobCard from '../components/JobCard.vue'; // Will create this component
// import { Modal } from 'bootstrap'; // Import if using JS instance for modal

export default {
  name:"DashboardView",
  components: {
    JobCard,
  },
  data() {
    return {
      // jobPostings: [], // Will be a computed property from store
      // loading: false, // Will use isLoadingJobs from store
      selectedJob: null,
    };
  },
  computed: {
    currentUser() {
      return this.$store.getters.currentUser();
    },
    isAdmin() {
      return this.$store.getters.isAdmin();
    },
    jobPostings() {
      return this.$store.getters.allJobPostings();
    },
    loading() { // Renamed from isLoading to match template variable
      return this.$store.getters.isLoadingJobs();
    }
  },
  methods: {
    fetchJobs() { // Method to dispatch the action
      this.$store.dispatch('fetchJobPostings');
    },
    // simulateInitialLoad() { // Replaced by fetchJobs and store's loading state
    // },
    handleViewDetails(job) {
      this.selectedJob = job;
      // Ensure modal instance is available if controlling via JS
      // if (!this.jobDetailsModalInstance) {
      //   this.jobDetailsModalInstance = new Modal(document.getElementById('jobDetailsModal'));
      // }
      // this.jobDetailsModalInstance.show();
      // For data-bs-toggle, ensure the button in JobCard has data-bs-target="#jobDetailsModal"
      // and we just need to make sure selectedJob is set.
      // The modal will be shown via Bootstrap's data attributes from JobCard if that's the chosen method.
      // If JobCard emits and Dashboard shows the modal programmatically:
      const modalElement = document.getElementById('jobDetailsModal');
      if (modalElement && window.bootstrap && window.bootstrap.Modal) {
        const modal = new window.bootstrap.Modal(modalElement); // Get existing or new instance
        modal.show();
      } else if (!window.bootstrap || !window.bootstrap.Modal) {
        console.error('Bootstrap Modal not found. Ensure Bootstrap JS is loaded.');
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    handleEditJob(job) {
      // Placeholder for edit functionality
      // Typically, this would navigate to a JobForm component with the job ID
      // or open a modal pre-filled with job data.
      console.log('Dashboard: Edit job requested:', job);
      this.$router.push({ name: 'PostJob', query: { jobId: job.id } }); // Example navigation
    },
    handleDeleteJob(jobId) {
      // Placeholder for delete functionality
      // This would typically involve a confirmation dialog and then a store action
      console.log('Dashboard: Delete job requested:', jobId);
      if (confirm(`Are you sure you want to delete this job post?`)) {
        this.$store.dispatch('deleteJobPosting', jobId)
          .then(() => {
            // Optionally, show a success message
            console.log('Job posting deleted successfully');
            // The list should reactively update as it's based on store getter
          })
          .catch(error => {
            console.error('Error deleting job posting:', error);
            // Optionally, show an error message to the user
          });
      }
    }
  },
  created() {
    // this.simulateInitialLoad(); // Replaced by store's fetchJobPostings action, called in store's init or here
    // If jobs are not fetched on store initialization, fetch them here.
    // Assuming store's `actions.fetchJobPostings()` is called on store init, so not strictly needed here
    // unless a refresh on component creation is desired.
    // For clarity, we can call it to ensure data is loaded/refreshed when component is created.
    this.fetchJobs();
  },
  mounted() {
    // Modal instance logic for jobDetailsModal remains the same,
    // ensure window.bootstrap.Modal is used if it was missed here.
    // The previous changes for bootstrap.Modal were specific to JobForm, SubUserForm.
    // It was correctly updated in DashboardView.vue in a previous step for this file.
    const modalElement = document.getElementById('jobDetailsModal');
    if (modalElement) {
      modalElement.addEventListener('hidden.bs.modal', () => {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove();
        }
        // Additionally, ensure body overflow is reset if Bootstrap doesn't handle it
        document.body.style.overflow = '';
      });
    }
  },
};
</script>

<style scoped>
.dashboard-container {
  /* background-color: #eef2f6; */ /* Light background for the content area */
}
.card-header .bi {
  color: var(--bs-primary);
}
.text-gray-800 {
  color: #5a5c69 !important; /* From SB Admin 2 theme */
}
.font-weight-bold {
  font-weight: 700 !important;
}
.shadow-sm {
  box-shadow: 0 .125rem .25rem rgba(0,0,0,.075) !important;
}
.gy-4 { /* Bootstrap 5 gutter class */
  --bs-gutter-y: 1.5rem;
}
/* Ensure modal content is scrollable */
.modal-body {
    max-height: calc(100vh - 210px); /* Adjust as needed */
    overflow-y: auto;
}
.modal-title .bi {
  color: var(--bs-primary);
}
</style>
