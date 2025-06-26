<template>
  <div class="card h-100 shadow-sm job-card">
    <div class="card-body d-flex flex-column">
      <h5 class="card-title text-primary">
        <i class="bi bi-briefcase card-title-icon"></i> {{ job.title }}
      </h5>
      <p class="card-subtitle mb-2 text-muted">
        <i class="bi bi-geo-alt"></i> {{ job.location }}
      </p>
      <p class="card-text description-truncate flex-grow-1">
        {{ truncateDescription(job.description, 120) }}
      </p>
      <div class="mt-auto"> <!-- Pushes button to the bottom -->
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="badge bg-secondary">{{ job.type }}</span>
          <span class="text-muted small">
            <i class="bi bi-clock-history"></i> {{ timeSince(job.datePosted) }}
          </span>
        </div>
        <button
          class="btn btn-outline-primary w-100"
          @click="viewDetails"
          data-bs-toggle="modal"
          data-bs-target="#jobDetailsModal"
        >
          <i class="bi bi-eye-fill"></i> View Details
        </button>
        <!-- Future actions like Edit/Delete for admin/owner -->
        <!--
        <div v-if="canManage" class="mt-2 d-flex justify-content-end">
          <button class="btn btn-sm btn-outline-secondary me-2"><i class="bi bi-pencil"></i> Edit</button>
          <button class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i> Delete</button>
        </div>
        -->
      </div>
    </div>
    <div class="card-footer bg-transparent border-top-0">
        <small class="text-muted">Posted by: {{ job.postedBy }}</small>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JobCard',
  props: {
    job: {
      type: Object,
      required: true,
    },
  },
  computed: {
    // Example: Check if current user can manage this job post
    // canManage() {
    //   const currentUser = this.$store.getters.currentUser();
    //   if (!currentUser) return false;
    //   return currentUser.isAdmin() || currentUser.username === this.job.postedBy;
    // }
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
