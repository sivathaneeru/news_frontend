document.addEventListener('DOMContentLoaded', () => {
    const jobListingsContainer = document.getElementById('jobListingsContainer');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const locationFilter = document.getElementById('locationFilter');
    const jobTypeFilter = document.getElementById('jobTypeFilter');

    // Dummy job data (replace with actual API call in a real application)
    const allJobs = [
        {
            id: 1,
            title: 'Software Engineer',
            company: 'Tech Solutions Inc.',
            location: 'New York, NY',
            type: 'Full-time',
            description: 'We are looking for a skilled Software Engineer to design, develop, and maintain software applications. The ideal candidate will have experience with various programming languages and a passion for technology.',
            postedDate: '2024-07-20'
        },
        {
            id: 2,
            title: 'Marketing Specialist',
            company: 'Creative Minds Agency',
            location: 'San Francisco, CA',
            type: 'Part-time',
            description: 'Join our dynamic team as a Marketing Specialist. You will be responsible for developing and implementing marketing strategies to enhance brand visibility and drive growth.',
            postedDate: '2024-07-18'
        },
        {
            id: 3,
            title: 'UX/UI Designer',
            company: 'Innovatech Ltd.',
            location: 'Remote',
            type: 'Contract',
            description: 'Seeking a talented UX/UI Designer to create intuitive and visually appealing user interfaces for web and mobile applications. Strong portfolio required.',
            postedDate: '2024-07-22'
        },
        {
            id: 4,
            title: 'Data Analyst',
            company: 'Analytics Corp.',
            location: 'New York, NY',
            type: 'Full-time',
            description: 'We need a Data Analyst to interpret data, analyze results using statistical techniques, and provide ongoing reports. Experience with SQL and data visualization tools is a plus.',
            postedDate: '2024-07-15'
        },
        {
            id: 5,
            title: 'Project Manager',
            company: 'BuildIt Right',
            location: 'Remote',
            type: 'Full-time',
            description: 'Experienced Project Manager needed to oversee various projects from conception to completion. Strong leadership and organizational skills are essential.',
            postedDate: '2024-07-21'
        },
         {
            id: 6,
            title: 'Frontend Developer',
            company: 'Web Wizards LLC',
            location: 'San Francisco, CA',
            type: 'Full-time',
            description: 'Join our team of talented developers to build responsive and engaging user interfaces. Proficiency in HTML, CSS, and JavaScript frameworks like React or Vue is required.',
            postedDate: '2024-07-23'
        },
        {
            id: 7,
            title: 'Customer Support Representative',
            company: 'SupportPro',
            location: 'Remote',
            type: 'Part-time',
            description: 'Provide excellent customer service and support to our clients. Strong communication skills and a problem-solving attitude are key.',
            postedDate: '2024-07-19'
        }
    ];

    // Function to create a job card HTML
    function createJobCard(job) {
        const card = document.createElement('div');
        card.classList.add('job-card');
        card.innerHTML = `
            <h3>${job.title}</h3>
            <p class="company">${job.company}</p>
            <p class="location"><strong>Location:</strong> ${job.location}</p>
            <p class="type"><strong>Type:</strong> ${job.type}</p>
            <p class="description">${job.description}</p>
            <a href="#" class="apply-button" data-job-id="${job.id}">Apply Now</a>
        `;
        // In a real app, the "Apply Now" button would link to an application page or trigger a modal.
        // For this example, it's just a placeholder.
        return card;
    }

    // Function to render job listings
    function renderJobs(jobsToRender) {
        jobListingsContainer.innerHTML = ''; // Clear existing listings
        if (jobsToRender.length === 0) {
            jobListingsContainer.innerHTML = '<p>No jobs found matching your criteria.</p>';
            return;
        }
        jobsToRender.forEach(job => {
            const jobCard = createJobCard(job);
            jobListingsContainer.appendChild(jobCard);
        });
    }

    // Function to filter and search jobs
    function filterAndSearchJobs() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedLocation = locationFilter.value;
        const selectedJobType = jobTypeFilter.value;

        let filteredJobs = allJobs;

        // Filter by search term (title, company, description)
        if (searchTerm) {
            filteredJobs = filteredJobs.filter(job =>
                job.title.toLowerCase().includes(searchTerm) ||
                job.company.toLowerCase().includes(searchTerm) ||
                job.description.toLowerCase().includes(searchTerm)
            );
        }

        // Filter by location
        if (selectedLocation) {
            filteredJobs = filteredJobs.filter(job => job.location.includes(selectedLocation) || (selectedLocation === "Remote" && job.location === "Remote"));
        }

        // Filter by job type
        if (selectedJobType) {
            filteredJobs = filteredJobs.filter(job => job.type === selectedJobType);
        }

        renderJobs(filteredJobs);
    }

    // Event Listeners
    if (searchButton) {
        searchButton.addEventListener('click', filterAndSearchJobs);
    }
    if (searchInput) {
        searchInput.addEventListener('keyup', (event) => { // Allow Enter key to trigger search
            if (event.key === 'Enter') {
                filterAndSearchJobs();
            }
        });
    }
    if (locationFilter) {
        locationFilter.addEventListener('change', filterAndSearchJobs);
    }
    if (jobTypeFilter) {
        jobTypeFilter.addEventListener('change', filterAndSearchJobs);
    }

    // Initial rendering of all jobs
    renderJobs(allJobs);
});
