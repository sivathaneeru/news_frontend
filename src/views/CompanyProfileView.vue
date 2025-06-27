<template>
  <div class="company-profile-view container py-4">
    <div v-if="isLoading" class="text-center mt-5">
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
        <span class="visually-hidden">Loading company profile...</span>
      </div>
      <p class="mt-2">Loading company profile...</p>
    </div>

    <div v-else-if="!company" class="alert alert-danger text-center mt-5" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-2"></i> Company profile not found.
    </div>

    <div v-else>
      <div class="card shadow-sm company-header mb-4">
        <div class="card-body">
          <div class="row align-items-center">
            <div class="col-md-2 text-center text-md-start mb-3 mb-md-0">
              <img :src="company.companyLogoUrl || 'https://via.placeholder.com/150?text=No+Logo'"
                   :alt="`${company.companyName} Logo`"
                   class="img-fluid rounded company-logo"
                   style="max-width: 150px; height: auto;">
            </div>
            <div class="col-md-10">
              <h1 class="mb-1">{{ company.companyName }}</h1>
              <p class="text-muted mb-2" v-if="company.websiteUrl">
                <i class="bi bi-link-45deg"></i>
                <a :href="company.websiteUrl" target="_blank" rel="noopener noreferrer">{{ company.websiteUrl }}</a>
              </p>
              <p class="company-description" style="white-space: pre-wrap;">{{ company.companyDescription }}</p>
            </div>
          </div>
        </div>
      </div>

      <h2 class="mb-4">
        <i class="bi bi-briefcase-fill me-2 text-primary"></i>Open Positions at {{ company.companyName }} ({{ jobs.length }})
      </h2>
      <div v-if="jobs.length === 0" class="alert alert-info">
        <i class="bi bi-info-circle me-1"></i> There are currently no open positions listed for this company.
      </div>
      <div v-else class="row gy-4">
        <div v-for="job in jobs" :key="job.id" class="col-md-6 col-lg-4">
          <JobCard
            :job="job"
            @view-details="handleViewJobDetails"
            :details-modal-id="'#companyJobDetailsModal-' + job.id"
          />
        </div>
      </div>
    </div>

    <!-- Modal for Job Details (can reuse or make specific if needed) -->
    <!-- For simplicity, this example assumes a global modal or that JobCard handles its own modal target -->
    <!-- If JobCard needs a unique modal target from this view, pass it as a prop -->
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
              Posted on: {{ formatDate(selectedJob.datePosted) }} by
              <router-link v-if="selectedJob.companyId && selectedJob.companyName" :to="{ name: 'CompanyProfile', params: { companyId: selectedJob.companyId } }">
                {{ selectedJob.companyName }}
              </router-link>
              <span v-else>{{ selectedJob.postedBy }}</span>
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import JobCard from '../components/JobCard.vue';
// import { Modal } from 'bootstrap'; // Needed if controlling modal programmatically

export default {
  name: 'CompanyProfileView',
  components: {
    JobCard,
  },
  props: {
    companyId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      selectedJob: null,
      // jobDetailsModalInstance: null, // If controlling modal programmatically
    };
  },
  computed: {
    isLoading() {
      return this.$store.getters.isLoadingCompany();
    },
    company() {
      return this.$store.getters.getCurrentCompanyDetails();
    },
    jobs() {
      // If currentCompanyJobs is populated directly by fetchCompanyById action
      return this.$store.getters.getCurrentCompanyJobs();
      // Alternative: Filter from all jobs if not fetched separately for the company
      // return this.$store.getters.allJobPostings().filter(job => job.companyId === this.companyId);
    },
  },
  methods: {
    fetchCompanyData() {
      this.$store.dispatch('fetchCompanyById', this.companyId);
    },
    handleViewJobDetails(job) {
      this.selectedJob = job;
      // This view reuses the global 'jobDetailsModal' ID from DashboardView for simplicity.
      // A more robust solution might involve dynamic modal IDs or a dedicated modal component.
      const modalElement = document.getElementById('jobDetailsModal');
      if (modalElement && window.bootstrap && window.bootstrap.Modal) {
        const modal = window.bootstrap.Modal.getOrCreateInstance(modalElement);
        modal.show();
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
  },
  created() {
    this.fetchCompanyData();
  },
  watch: {
    companyId(newId) {
      // Refetch if the companyId prop changes (e.g., navigating between company profiles)
      this.fetchCompanyData();
    },
  },
  // mounted() {
    // If controlling job details modal programmatically from here:
    // const modalEl = document.getElementById('jobDetailsModal'); // Ensure this ID is unique or managed
    // if (modalEl) {
    //   this.jobDetailsModalInstance = new Modal(modalEl);
    // }
  // },
  // beforeUnmount() {
    // if (this.jobDetailsModalInstance) {
      // this.jobDetailsModalInstance.dispose();
    // }
  // }
};
</script>

<style scoped>
.company-profile-view {
  /* Add any specific styling for the view */
}
.company-header {
  background-color: #f8f9fa; /* Light background for header */
  border: 1px solid #dee2e6;
}
.company-logo {
  border: 3px solid #dee2e6;
}
.company-description {
  font-size: 1rem;
  color: #495057;
}
.modal-title .bi {
  color: var(--bs-primary);
}
</style>
