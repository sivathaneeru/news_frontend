<template>
  <div class="card h-100 shadow-sm job-card" :class="{ 'border-warning border-2': job.isFeatured }">
    <div class="card-body d-flex flex-column">
      <div class="d-flex justify-content-between align-items-start">
        <h5 class="card-title text-primary mb-1">
          <i class="bi bi-briefcase card-title-icon"></i> {{ job.title }}
        </h5>
        <span v-if="job.isFeatured" class="badge bg-warning text-dark ms-2 animate__animated animate__flash animate__slower animate__infinite">
          <i class="bi bi-star-fill"></i> Featured
        </span>
      </div>
      <p class="card-subtitle mb-2 text-muted">
        <i class="bi bi-geo-alt"></i> {{ job.location }} &bull; <span :class="daysRemainingColor(job.listingEndDate)"><i class="bi bi-calendar-check"></i> {{ daysRemaining(job.listingEndDate) }}</span>
      </p>
      <p class="card-text description-truncate flex-grow-1">
        {{ truncateDescription(job.description, 120) }}
      </p>
      <div class="mt-auto"> <!-- Pushes button to the bottom -->
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="badge bg-secondary">{{ job.type }}</span>
          <span class="text-muted small">
            <i class="bi bi-clock-history"></i> Posted: {{ timeSince(job.datePosted) }}
          </span>
        </div>
        <button
          class="btn btn-outline-primary w-100"
          @click="viewDetails"
          data-bs-toggle="modal"
          :data-bs-target="detailsModalId"
        >
          <i class="bi bi-eye-fill"></i> View Details
        </button>

        <div v-if="showEditDelete && canManage" class="mt-2 d-flex justify-content-end">
          <button class="btn btn-sm btn-outline-secondary me-2" @click="editJob"><i class="bi bi-pencil"></i> Edit</button>
          <button class="btn btn-sm btn-outline-danger" @click="deleteJob"><i class="bi bi-trash"></i> Delete</button>
        </div>
      </div>
    </div>
    <div class="card-footer bg-transparent border-top-0">
        <small class="text-muted">
          <span v-if="job.companyId && job.companyName">
            Posted by:
            <!-- Using computed property for :to for easier debugging -->
            <router-link :to="jobDataForLink" class="text-decoration-none company-link">
              {{ job.companyName }} (ID: {{job.companyId}})
            </router-link>
          </span>
          <span v-else>
            Posted by: {{ job.postedBy }}
          </span>
        </small>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    job: {
      type: Object,
      required: true,
    },
    showEditDelete: {
      type: Boolean,
      default: true,
    },
    detailsModalId: {
      type: String,
      default: '#jobDetailsModal',
    }
  },
  computed: {
    canManage() {
      const currentUser = this.$store.getters.currentUser ? this.$store.getters.currentUser() : null;
      if (!currentUser) return false;

      // Check if isAdmin getter exists and works
      const isAdmin = typeof this.$store.getters.isAdmin === 'function' ? this.$store.getters.isAdmin() : false;

      return isAdmin || (currentUser.username === this.job.postedBy);
    },
    // For debugging the router-link
    jobDataForLink() {
      // console.log('JobCard job object:', JSON.parse(JSON.stringify(this.job)));
      return {
        name: 'CompanyProfile',
        params: { companyId: this.job.companyId }
      };
    }
  },
  created() {
    // Log job object when card is created to check its contents
    // console.log('JobCard created with job:', JSON.parse(JSON.stringify(this.job)));
  },
  methods: {
    truncateDescription(text, length) {
      if (text.length <= length) {
        return text;
      }
      return text.substring(0, length) + '...';
    },
    viewDetails() {
      this.$emit('view-details', this.job);
    },
    editJob() {
      this.$emit('edit-job', this.job);
      // console.log('Attempting to edit job:', this.job.id);
    },
    deleteJob() {
      this.$emit('delete-job', this.job.id);
      // console.log('Attempting to delete job:', this.job.id);
    },
    timeSince(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      const seconds = Math.floor((new Date() - date) / 1000);
      let interval = seconds / 31536000;

      if (interval > 1) {
        return Math.floor(interval) + " years ago";
      }
      interval = seconds / 2592000;
      if (interval > 1) {
        return Math.floor(interval) + " months ago";
      }
      interval = seconds / 86400;
      if (interval > 1) {
        return Math.floor(interval) + " days ago";
      }
      interval = seconds / 3600;
      if (interval > 1) {
        return Math.floor(interval) + " hours ago";
      }
      interval = seconds / 60;
      if (interval > 1) {
        return Math.floor(interval) + " minutes ago";
      }
      return Math.floor(seconds) + " seconds ago";
    },
    daysRemaining(endDateString) {
      if (!endDateString) return 'N/A';
      const endDate = new Date(endDateString);
      const now = new Date();
      const diffTime = endDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) return 'Expired';
      if (diffDays === 1) return '1 day left';
      return `${diffDays} days left`;
    },
    daysRemainingColor(endDateString) {
      if (!endDateString) return 'text-muted';
      const endDate = new Date(endDateString);
      const now = new Date();
      const diffTime = endDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) return 'text-danger fw-bold';
      if (diffDays <= 7) return 'text-warning';
      return 'text-success';
    }
  },
};
</script>

<style scoped>
.job-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.job-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
}
.card-title {
  font-weight: 600;
}
.card-title-icon {
  font-size: 1.2rem; /* Slightly smaller than h5 default */
  margin-right: 0.4rem;
  vertical-align: middle;
}
.card-subtitle .bi {
  margin-right: 0.3rem;
}
.description-truncate {
  font-size: 0.9rem;
  color: #6c757d; /* text-muted color */
  line-height: 1.5;
  min-height: 60px; /* Ensure a minimum height even for short descriptions */
}
.card-footer {
  font-size: 0.8rem;
}
.btn .bi {
  margin-right: 0.3rem;
}
</style>
