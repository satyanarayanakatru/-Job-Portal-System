import { storage } from '../utils/localStorage';

const APPS_STORAGE_KEY = 'job_portal_applications';
const SAVED_STORAGE_KEY = 'job_portal_saved_jobs';

const DEFAULT_APPLICATIONS = [
  {
    id: 'app_1',
    jobId: 'job_1',
    jobTitle: 'Senior Frontend Engineer (React & Tailwind)',
    company: 'Stripe Horizon',
    companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80',
    location: 'San Francisco, CA (Hybrid)',
    salaryRange: '$140,000 - $175,000',
    employmentType: 'Full Time',
    applicantName: 'Sarah Jenkins',
    applicantEmail: 'candidate@jobportal.com',
    phone: '+1 (555) 234-5678',
    resumeName: 'Sarah_Jenkins_Senior_Frontend_Resume.pdf',
    status: 'Under Review',
    statusStep: 2, // 1: Submitted, 2: Under Review, 3: Interview, 4: Offer
    appliedAt: '2026-10-20T10:15:00Z',
    notes: 'Application reviewed by Engineering Lead. Pre-screening passed.',
  },
  {
    id: 'app_2',
    jobId: 'job_2',
    jobTitle: 'Staff Cloud Infrastructure Architect',
    company: 'NexaCloud Global',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    location: 'Remote (Worldwide)',
    salaryRange: '$180,000 - $225,000',
    employmentType: 'Remote',
    applicantName: 'Sarah Jenkins',
    applicantEmail: 'candidate@jobportal.com',
    phone: '+1 (555) 234-5678',
    resumeName: 'Sarah_Jenkins_Senior_Frontend_Resume.pdf',
    status: 'Interview Scheduled',
    statusStep: 3,
    interviewDate: '2026-10-29T14:00:00Z',
    interviewType: 'System Architecture (Google Meet)',
    appliedAt: '2026-10-14T08:30:00Z',
    notes: 'Technical panel with VP of Engineering confirmed for Thursday at 2:00 PM EST.',
  },
  {
    id: 'app_3',
    jobId: 'job_4',
    jobTitle: 'Principal Product Designer (Design Systems)',
    company: 'Apex Health Systems',
    companyLogo: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=120&auto=format&fit=crop&q=80',
    location: 'San Diego, CA (Hybrid)',
    salaryRange: '$130,000 - $160,000',
    employmentType: 'Full Time',
    applicantName: 'Sarah Jenkins',
    applicantEmail: 'candidate@jobportal.com',
    phone: '+1 (555) 234-5678',
    resumeName: 'Sarah_Jenkins_Senior_Frontend_Resume.pdf',
    status: 'Submitted',
    statusStep: 1,
    appliedAt: '2026-10-24T16:45:00Z',
    notes: 'Candidate submission received. Awaiting talent acquisition screening.',
  },
  {
    id: 'app_4',
    jobId: 'job_3',
    jobTitle: 'Lead AI / Machine Learning Scientist',
    company: 'Quantum AI Labs',
    companyLogo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=120&auto=format&fit=crop&q=80',
    location: 'Boston, MA',
    salaryRange: '$190,000 - $250,000',
    employmentType: 'Full Time',
    applicantName: 'Sarah Jenkins',
    applicantEmail: 'candidate@jobportal.com',
    phone: '+1 (555) 234-5678',
    resumeName: 'Sarah_Jenkins_Senior_Frontend_Resume.pdf',
    status: 'Offer Extended',
    statusStep: 4,
    appliedAt: '2026-10-10T11:00:00Z',
    notes: 'Official written offer package sent via DocuSign: $210,000 base + 0.25% equity.',
  },
];

const DEFAULT_SAVED_JOBS = [
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
    requiredSkills: ['React.js', 'Tailwind CSS', 'TypeScript', 'Next.js'],
    applicationDeadline: '2026-11-30',
    status: 'Open',
    savedAt: '2026-10-21T09:00:00Z',
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
    requiredSkills: ['JavaScript', 'React.js', 'Node.js', 'PostgreSQL'],
    applicationDeadline: '2026-12-30',
    status: 'Open',
    savedAt: '2026-10-23T11:20:00Z',
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
    requiredSkills: ['Figma', 'Design Systems', 'WCAG Accessibility'],
    applicationDeadline: '2026-11-25',
    status: 'Open',
    savedAt: '2026-10-24T15:30:00Z',
  },
];

export const applicationService = {
  // Get all submitted applications
  getApplications: () => {
    const cached = storage.get(APPS_STORAGE_KEY, null);
    if (cached && Array.isArray(cached) && cached.length > 0) {
      return cached;
    }
    storage.set(APPS_STORAGE_KEY, DEFAULT_APPLICATIONS);
    return DEFAULT_APPLICATIONS;
  },

  // Withdraw Application (UI Only feature)
  withdrawApplication: (appId, reason = 'Withdrawn by candidate') => {
    const apps = applicationService.getApplications();
    const updated = apps.map((app) => {
      if (String(app.id) === String(appId)) {
        return {
          ...app,
          status: 'Withdrawn',
          statusStep: 0,
          withdrawnAt: new Date().toISOString(),
          withdrawalReason: reason,
          notes: `Candidate withdrew application: "${reason}"`,
        };
      }
      return app;
    });
    storage.set(APPS_STORAGE_KEY, updated);
    return updated;
  },

  // Delete Application record
  deleteApplication: (appId) => {
    const apps = applicationService.getApplications();
    const updated = apps.filter((app) => String(app.id) !== String(appId));
    storage.set(APPS_STORAGE_KEY, updated);
    return updated;
  },

  // Get Saved Jobs
  getSavedJobs: () => {
    const cached = storage.get(SAVED_STORAGE_KEY, null);
    if (cached && Array.isArray(cached) && cached.length > 0) {
      return cached;
    }
    storage.set(SAVED_STORAGE_KEY, DEFAULT_SAVED_JOBS);
    return DEFAULT_SAVED_JOBS;
  },

  // Save Job
  saveJob: (job) => {
    const saved = applicationService.getSavedJobs();
    if (saved.some((j) => String(j.id) === String(job.id))) return saved;
    const newSaved = [{ ...job, savedAt: new Date().toISOString() }, ...saved];
    storage.set(SAVED_STORAGE_KEY, newSaved);
    return newSaved;
  },

  // Remove Saved Job
  removeSavedJob: (jobId) => {
    const saved = applicationService.getSavedJobs();
    const updated = saved.filter((j) => String(j.id) !== String(jobId));
    storage.set(SAVED_STORAGE_KEY, updated);
    return updated;
  },

  // Check if job is saved
  isSaved: (jobId) => {
    const saved = applicationService.getSavedJobs();
    return saved.some((j) => String(j.id) === String(jobId));
  },
};
