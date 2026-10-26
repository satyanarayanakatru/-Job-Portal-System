import { storage } from '../utils/localStorage';

const STORAGE_KEY = 'job_portal_jobs';

const DEFAULT_JOBS = [
  {
    id: 'job_1',
    title: 'Senior Frontend Engineer (React & Tailwind)',
    company: 'Stripe Horizon',
    companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80',
    category: 'Software Engineering',
    employmentType: 'Full Time',
    experienceLevel: 'Senior Level (5-8 yrs)',
    salaryRange: '$140,000 - $175,000',
    location: 'San Francisco, CA (Hybrid)',
    requiredSkills: ['React.js', 'Tailwind CSS', 'TypeScript', 'Next.js', 'REST APIs'],
    applicationDeadline: '2026-11-30',
    status: 'Open',
    applicantsCount: 28,
    postedDate: '2026-10-18',
    description:
      'We are looking for a Senior Frontend Engineer to build high-performance, accessible checkout interfaces and analytics dashboards. You will work closely with design systems, optimize Core Web Vitals, and architect modular UI components.',
    responsibilities: [
      'Architect and scale reusable React component libraries',
      'Optimize web performance, bundle size, and render cycles',
      'Collaborate with Product Managers and UI/UX Designers',
      'Mentor junior and mid-level engineering team members',
    ],
  },
  {
    id: 'job_2',
    title: 'Staff Cloud Infrastructure Architect',
    company: 'NexaCloud Global',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    category: 'DevOps & Cloud',
    employmentType: 'Remote',
    experienceLevel: 'Lead / Principal (8+ yrs)',
    salaryRange: '$180,000 - $225,000',
    location: 'Remote (Worldwide)',
    requiredSkills: ['AWS', 'Kubernetes', 'Terraform', 'Docker', 'Go', 'CI/CD'],
    applicationDeadline: '2026-12-15',
    status: 'Open',
    applicantsCount: 19,
    postedDate: '2026-10-21',
    description:
      'Lead the architecture and reliability of our global multi-region serverless cloud platform. You will design fault-tolerant Kubernetes topologies, automated failover protocols, and Terraform infrastructure-as-code.',
    responsibilities: [
      'Design zero-downtime deployment pipelines across 14 cloud regions',
      'Implement automated observability, distributed tracing, and metrics',
      'Enforce infrastructure security benchmarks and compliance',
    ],
  },
  {
    id: 'job_3',
    title: 'Lead AI / Machine Learning Scientist',
    company: 'Quantum AI Labs',
    companyLogo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=120&auto=format&fit=crop&q=80',
    category: 'Data & AI',
    employmentType: 'Full Time',
    experienceLevel: 'Senior Level (5-8 yrs)',
    salaryRange: '$190,000 - $250,000',
    location: 'Boston, MA',
    requiredSkills: ['PyTorch', 'Python', 'LLM Fine-Tuning', 'CUDA', 'Distributed Training'],
    applicationDeadline: '2026-12-05',
    status: 'Open',
    applicantsCount: 42,
    postedDate: '2026-10-15',
    description:
      'Train, fine-tune, and evaluate state-of-the-art transformer architectures for generative code synthesis and autonomous reasoning. You will optimize inference latencies on modern GPU clusters.',
    responsibilities: [
      'Conduct empirical experiments with synthetic data generation',
      'Optimize model quantization (FP8, INT4) for edge deployment',
      'Publish research findings and file enterprise patents',
    ],
  },
  {
    id: 'job_4',
    title: 'Principal Product Designer (Design Systems)',
    company: 'Apex Health Systems',
    companyLogo: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=120&auto=format&fit=crop&q=80',
    category: 'Product & Design',
    employmentType: 'Full Time',
    experienceLevel: 'Mid Level (3-5 yrs)',
    salaryRange: '$130,000 - $160,000',
    location: 'San Diego, CA (Hybrid)',
    requiredSkills: ['Figma', 'Design Systems', 'User Research', 'Prototyping', 'WCAG Accessibility'],
    applicationDeadline: '2026-11-25',
    status: 'Open',
    applicantsCount: 34,
    postedDate: '2026-10-12',
    description:
      'Craft intuitive, accessible digital health portals and telemedicine workflows. Champion our unified multi-platform design token system and conduct patient usability interviews.',
    responsibilities: [
      'Maintain and expand Figma design token libraries',
      'Conduct iterative user testing with clinical practitioners',
      'Partner with engineers on pixel-perfect WCAG 2.1 AA implementation',
    ],
  },
  {
    id: 'job_5',
    title: 'Senior Cyber Security Threat Analyst',
    company: 'Veloce Data Platforms',
    companyLogo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=120&auto=format&fit=crop&q=80',
    category: 'Cybersecurity',
    employmentType: 'Full Time',
    experienceLevel: 'Senior Level (5-8 yrs)',
    salaryRange: '$150,000 - $185,000',
    location: 'New York, NY',
    requiredSkills: ['SIEM', 'Threat Hunting', 'Incident Response', 'Python', 'Zero Trust'],
    applicationDeadline: '2026-10-31',
    status: 'Closed',
    applicantsCount: 65,
    postedDate: '2026-09-28',
    description:
      'Proactively identify threat vectors, conduct simulated red-team exercises, and respond to automated anomaly detections across financial trading networks.',
    responsibilities: [
      'Monitor and tune SIEM rules and intrusion detection algorithms',
      'Conduct post-mortem root cause analyses on security incidents',
      'Maintain zero-trust network boundaries and identity verification',
    ],
  },
  {
    id: 'job_6',
    title: 'Junior Full Stack Web Developer (Internship / Entry)',
    company: 'OmniCart Commerce',
    companyLogo: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=120&auto=format&fit=crop&q=80',
    category: 'Software Engineering',
    employmentType: 'Internship',
    experienceLevel: 'Entry Level (0-2 yrs)',
    salaryRange: '$70,000 - $90,000',
    location: 'Seattle, WA',
    requiredSkills: ['JavaScript', 'React.js', 'Node.js', 'PostgreSQL', 'Git'],
    applicationDeadline: '2026-12-30',
    status: 'Open',
    applicantsCount: 88,
    postedDate: '2026-10-22',
    description:
      'Exciting opportunity for entry-level developers to gain hands-on experience building scalable merchant storefronts, GraphQL endpoints, and checkout webhooks.',
    responsibilities: [
      'Write clean, test-covered JavaScript and React code',
      'Implement API endpoints connecting database models',
      'Participate in sprint retrospectives and peer code reviews',
    ],
  },
];

export const jobService = {
  // Get all jobs
  getJobs: async () => {
    const cached = storage.get(STORAGE_KEY, null);
    if (cached && Array.isArray(cached) && cached.length > 0) {
      return cached;
    }
    storage.set(STORAGE_KEY, DEFAULT_JOBS);
    return DEFAULT_JOBS;
  },

  // Get job by ID
  getJobById: async (id) => {
    const jobs = await jobService.getJobs();
    return jobs.find((j) => String(j.id) === String(id)) || null;
  },

  // Create new job posting
  createJob: async (jobData) => {
    const jobs = await jobService.getJobs();
    const newJob = {
      id: 'job_' + Date.now(),
      title: jobData.title.trim(),
      company: jobData.company.trim(),
      companyLogo:
        jobData.companyLogo ||
        `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(jobData.company)}`,
      category: jobData.category || 'Software Engineering',
      employmentType: jobData.employmentType || 'Full Time',
      experienceLevel: jobData.experienceLevel || 'Mid Level (3-5 yrs)',
      salaryRange: jobData.salaryRange || '$100,000 - $130,000',
      location: jobData.location || 'Remote',
      requiredSkills: Array.isArray(jobData.requiredSkills)
        ? jobData.requiredSkills
        : (jobData.requiredSkills || 'React, JavaScript').split(',').map((s) => s.trim()).filter(Boolean),
      applicationDeadline: jobData.applicationDeadline || '2026-12-31',
      status: jobData.status || 'Open',
      applicantsCount: 0,
      postedDate: new Date().toISOString().split('T')[0],
      description: jobData.description || 'Join our forward-thinking team to build innovative technology solutions.',
      responsibilities: jobData.responsibilities || [
        'Deliver scalable, maintainable application code',
        'Participate actively in technical architecture reviews',
        'Collaborate across cross-functional product squads',
      ],
      createdAt: new Date().toISOString(),
    };

    const updated = [newJob, ...jobs];
    storage.set(STORAGE_KEY, updated);
    return newJob;
  },

  // Update existing job posting
  updateJob: async (id, updatedFields) => {
    const jobs = await jobService.getJobs();
    const index = jobs.findIndex((j) => String(j.id) === String(id));
    if (index === -1) throw new Error('Job posting not found');

    const updatedJob = {
      ...jobs[index],
      ...updatedFields,
      requiredSkills: Array.isArray(updatedFields.requiredSkills)
        ? updatedFields.requiredSkills
        : typeof updatedFields.requiredSkills === 'string'
        ? updatedFields.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean)
        : jobs[index].requiredSkills,
      updatedAt: new Date().toISOString(),
    };

    jobs[index] = updatedJob;
    storage.set(STORAGE_KEY, jobs);
    return updatedJob;
  },

  // Toggle Job Status between Open and Closed
  toggleJobStatus: async (id) => {
    const jobs = await jobService.getJobs();
    const index = jobs.findIndex((j) => String(j.id) === String(id));
    if (index === -1) throw new Error('Job not found');

    const currentStatus = jobs[index].status;
    const newStatus = currentStatus === 'Open' ? 'Closed' : 'Open';

    jobs[index] = {
      ...jobs[index],
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    storage.set(STORAGE_KEY, jobs);
    return jobs[index];
  },

  // Delete job posting
  deleteJob: async (id) => {
    const jobs = await jobService.getJobs();
    const filtered = jobs.filter((j) => String(j.id) !== String(id));
    storage.set(STORAGE_KEY, filtered);
    return true;
  },

  // Reset to default seed
  resetDefaults: () => {
    storage.set(STORAGE_KEY, DEFAULT_JOBS);
    return DEFAULT_JOBS;
  },
};
