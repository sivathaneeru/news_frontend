<template>
  <div class="public-job-listings-container container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3 mb-0 text-gray-800"><i class="bi bi-briefcase-fill me-2"></i>Available Job Postings</h1>
      <!-- Login/Register button could be added here for unauthenticated users -->
      <!-- For example:
      <router-link to="/login" class="btn btn-outline-primary" v-if="!isLoggedIn">
        <i class="bi bi-box-arrow-in-right me-1"></i> Login to Post or Manage Jobs
      </router-link>
      -->
    </div>

    <!-- Job Postings Section -->
    <div class="row">
      <div class="col-12">
        <div class="card shadow-sm mb-4">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary"><i class="bi bi-list-task me-2"></i>Current Job Openings</h6>
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
              <h4 class="mt-3">No Job Postings Currently Available</h4>
              <p class="text-muted">Please check back later for new opportunities.</p>
            </div>
            <div v-else class="row gy-4">
              <!-- JobCard components will be rendered here -->
              <div v-for="job in jobPostings" :key="job.id" class="col-md-6 col-lg-4">
                <JobCard
                  :job="job"
                  @view-details="handleViewDetails"
                  :show-edit-delete="false"
                  details-modal-id="#publicJobDetailsModal"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Job Details Modal -->
    <div class="modal fade" id="publicJobDetailsModal" tabindex="-1" aria-labelledby="publicJobDetailsModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="publicJobDetailsModalLabel">
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
              Posted on: {{ formatDate(selectedJob.datePosted) }}
              <!-- Optionally show 'postedBy' if it's non-sensitive, or anonymize -->
              <!-- <span v-if="selectedJob.postedBy"> by {{ selectedJob.postedBy }}</span> -->
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <!-- Add apply button or link here if applicable -->
            <!-- <button type="button" class="btn btn-primary" @click="applyForJob">Apply Now</button> -->
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import JobCard from '../components/JobCard.vue';
// import { Modal } from 'bootstrap'; // Only if controlling modal programmatically AND not relying on data attributes solely

export default {
  name: "PublicJobListView",
  components: {
    JobCard,
  },
  data() {
    return {
      loading: false,
      selectedJob: null,
      // jobDetailsModalInstance: null, // If controlling modal via JS
    };
  },
  computed: {
    jobPostings() {
      return this.$store.getters.allJobPostings();
    },
    // Optional: Check if user is logged in, for conditional UI elements like a login button
    // isLoggedIn() {
    //   return this.$store.getters.isAuthenticated();
    // }
  },
  methods: {
    simulateInitialLoad() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
    handleViewDetails(job) {
      this.selectedJob = job;
      const modalElement = document.getElementById('publicJobDetailsModal');
      if (modalElement && window.bootstrap && window.bootstrap.Modal) {
        // Ensure JobCard is configured to target 'publicJobDetailsModal'
        // Or, if JobCard doesn't trigger it via data-bs-target, show it programmatically:
        const modal = window.bootstrap.Modal.getOrCreateInstance(modalElement);
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
    // applyForJob() {
    //   // Placeholder for apply functionality
    //   alert('Apply functionality not yet implemented.');
    // }
  },
  created() {
    this.simulateInitialLoad();
  },
  mounted() {
    // If JobCard is expected to emit an event that includes data-bs-toggle and data-bs-target,
    // then manual instantiation here might not be needed unless for specific programmatic control.
    // Make sure JobCard's view details button has:
    // data-bs-toggle="modal" data-bs-target="#publicJobDetailsModal"
    // And the JobCard component correctly emits the job data.
    // The current DashboardView used data-bs-target from JobCard, so this should be similar.
    // I've added `show-edit-delete="false"` to JobCard to hide auth-only buttons.
    // This prop needs to be handled in JobCard.vue
  }
};
</script>

<style scoped>
.public-job-listings-container {
  /* background-color: #f8f9fa; */ /* A slightly different background if desired */
}
.card-header .bi {
  color: var(--bs-primary);
}
.text-gray-800 {
  color: #5a5c69 !important;
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
.modal-body {
    max-height: calc(100vh - 210px);
    overflow-y: auto;
}
.modal-title .bi {
  color: var(--bs-primary);
}
</style>
