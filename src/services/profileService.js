import { storage } from '../utils/localStorage';

const STORAGE_KEY = 'job_portal_candidate_profile';

const DEFAULT_PROFILE = {
  fullName: 'Sarah Jenkins',
  headline: 'Senior Full Stack & Frontend Engineer',
  email: 'candidate@jobportal.com',
  phone: '+1 (555) 234-5678',
  address: 'San Francisco, CA 94107, United States',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&auto=format&fit=crop&q=80',
  bio: 'Passionate Senior Engineer with 6+ years of experience crafting modern, accessible web applications using React, TypeScript, and cloud technologies. Proven track record of scaling frontend architectures, reducing bundle sizes, and driving high-converting product features.',
  socialLinks: {
    github: 'https://github.com/sarahjenkins-dev',
    linkedin: 'https://linkedin.com/in/sarahjenkins-tech',
    portfolio: 'https://sarahjenkins.io',
  },
  skills: [
    'React.js',
    'Tailwind CSS',
    'TypeScript',
    'Next.js',
    'Node.js',
    'JavaScript (ES6+)',
    'GraphQL',
    'REST APIs',
    'PostgreSQL',
    'Jest / RTL',
    'Docker',
    'Git & CI/CD',
  ],
  experience: [
    {
      id: 'exp_1',
      role: 'Senior Frontend Engineer',
      company: 'NexaCloud Global',
      location: 'San Francisco, CA (Hybrid)',
      startDate: 'Jan 2023',
      endDate: 'Present',
      current: true,
      description:
        'Architected and deployed micro-frontend design system across 4 mission-critical applications. Reduced first-contentful paint by 42% and standardized accessible WCAG components used by 30+ developers.',
    },
    {
      id: 'exp_2',
      role: 'Frontend Software Developer',
      company: 'Apex Health Systems',
      location: 'San Diego, CA (Remote)',
      startDate: 'Mar 2020',
      endDate: 'Dec 2022',
      current: false,
      description:
        'Engineered responsive telemedicine dashboards serving over 500k monthly active patients. Integrated HIPAA-compliant real-time video consults using WebRTC and WebSockets.',
    },
    {
      id: 'exp_3',
      role: 'Junior Web Developer',
      company: 'Quantum Tech Labs',
      location: 'Austin, TX',
      startDate: 'Jul 2018',
      endDate: 'Feb 2020',
      current: false,
      description:
        'Developed interactive merchant reporting portals and internal admin dashboards with React and Redux. Wrote automated unit tests achieving 88% test coverage.',
    },
  ],
  education: [
    {
      id: 'edu_1',
      degree: 'Bachelor of Science in Computer Science',
      institution: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      startYear: '2014',
      endYear: '2018',
      grade: '3.85 GPA • Magna Cum Laude',
      activities: 'President of Women in Computer Science, Hackathon Lead Organizer',
    },
    {
      id: 'edu_2',
      degree: 'Full Stack Cloud Engineering Certification',
      institution: 'AWS Training & Certification',
      location: 'Online',
      startYear: '2021',
      endYear: '2021',
      grade: 'AWS Certified Solutions Architect - Associate',
      activities: 'Serverless architecture, VPC networking, DynamoDB optimization',
    },
  ],
  resume: {
    name: 'Sarah_Jenkins_Senior_Frontend_Resume.pdf',
    size: '248 KB',
    uploadedAt: '2026-10-22T14:30:00Z',
    type: 'application/pdf',
  },
};

export const profileService = {
  // Get candidate profile
  getProfile: () => {
    const cached = storage.get(STORAGE_KEY, null);
    if (cached) return cached;
    storage.set(STORAGE_KEY, DEFAULT_PROFILE);
    return DEFAULT_PROFILE;
  },

  // Update core profile fields
  updateProfile: (updatedData) => {
    const current = profileService.getProfile();
    const updated = {
      ...current,
      ...updatedData,
      updatedAt: new Date().toISOString(),
    };
    storage.set(STORAGE_KEY, updated);
    return updated;
  },

  // Experience management
  addExperience: (expData) => {
    const profile = profileService.getProfile();
    const newExp = {
      id: 'exp_' + Date.now(),
      ...expData,
    };
    const updated = {
      ...profile,
      experience: [newExp, ...(profile.experience || [])],
    };
    storage.set(STORAGE_KEY, updated);
    return updated;
  },

  updateExperience: (id, expData) => {
    const profile = profileService.getProfile();
    const updatedExp = (profile.experience || []).map((exp) =>
      String(exp.id) === String(id) ? { ...exp, ...expData } : exp
    );
    const updated = { ...profile, experience: updatedExp };
    storage.set(STORAGE_KEY, updated);
    return updated;
  },

  deleteExperience: (id) => {
    const profile = profileService.getProfile();
    const updated = {
      ...profile,
      experience: (profile.experience || []).filter((exp) => String(exp.id) !== String(id)),
    };
    storage.set(STORAGE_KEY, updated);
    return updated;
  },

  // Education management
  addEducation: (eduData) => {
    const profile = profileService.getProfile();
    const newEdu = {
      id: 'edu_' + Date.now(),
      ...eduData,
    };
    const updated = {
      ...profile,
      education: [newEdu, ...(profile.education || [])],
    };
    storage.set(STORAGE_KEY, updated);
    return updated;
  },

  updateEducation: (id, eduData) => {
    const profile = profileService.getProfile();
    const updatedEdu = (profile.education || []).map((edu) =>
      String(edu.id) === String(id) ? { ...edu, ...eduData } : edu
    );
    const updated = { ...profile, education: updatedEdu };
    storage.set(STORAGE_KEY, updated);
    return updated;
  },

  deleteEducation: (id) => {
    const profile = profileService.getProfile();
    const updated = {
      ...profile,
      education: (profile.education || []).filter((edu) => String(edu.id) !== String(id)),
    };
    storage.set(STORAGE_KEY, updated);
    return updated;
  },

  // Skills management
  updateSkills: (skillsArray) => {
    const profile = profileService.getProfile();
    const updated = { ...profile, skills: skillsArray };
    storage.set(STORAGE_KEY, updated);
    return updated;
  },

  // Resume management
  uploadResume: (resumeInfo) => {
    const profile = profileService.getProfile();
    const updated = {
      ...profile,
      resume: {
        name: resumeInfo.name || 'Candidate_Resume.pdf',
        size: resumeInfo.size || '320 KB',
        uploadedAt: new Date().toISOString(),
        type: resumeInfo.type || 'application/pdf',
      },
    };
    storage.set(STORAGE_KEY, updated);
    return updated;
  },

  removeResume: () => {
    const profile = profileService.getProfile();
    const updated = { ...profile, resume: null };
    storage.set(STORAGE_KEY, updated);
    return updated;
  },

  // Calculate profile completeness score
  calculateCompleteness: (profile) => {
    if (!profile) return 0;
    let score = 0;
    if (profile.fullName) score += 15;
    if (profile.email) score += 10;
    if (profile.phone) score += 10;
    if (profile.address) score += 10;
    if (profile.bio && profile.bio.length > 20) score += 15;
    if (profile.skills && profile.skills.length >= 3) score += 15;
    if (profile.experience && profile.experience.length >= 1) score += 15;
    if (profile.education && profile.education.length >= 1) score += 5;
    if (profile.resume) score += 5;
    return Math.min(score, 100);
  },
};
