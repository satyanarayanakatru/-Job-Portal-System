import axios from 'axios';
import { storage } from '../utils/localStorage';

const STORAGE_KEY = 'job_portal_companies';

// Default enriched companies data to ensure instant, reliable loading and fallbacks
const FALLBACK_COMPANIES = [
  {
    id: 'comp_1',
    name: 'Stripe Horizon',
    industry: 'Finance & FinTech',
    location: 'San Francisco, CA',
    website: 'https://stripehorizon.io',
    email: 'careers@stripehorizon.io',
    employees: '1,500 - 2,500',
    openJobsCount: 18,
    foundedYear: 2017,
    logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80',
    description:
      'Stripe Horizon builds global financial infrastructure for modern internet businesses. Powering autonomous checkout, billing APIs, and multi-currency payouts across 140+ countries.',
    benefits: ['Remote First', '$5,000 Learning Budget', 'Full Health & Dental', 'Stock Options'],
  },
  {
    id: 'comp_2',
    name: 'NexaCloud Global',
    industry: 'Cloud Computing',
    location: 'Austin, TX',
    website: 'https://nexacloud.tech',
    email: 'recruiting@nexacloud.tech',
    employees: '800 - 1,200',
    openJobsCount: 12,
    foundedYear: 2019,
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    description:
      'Next-generation distributed serverless cloud infrastructure designed for microservices, edge computing, and real-time streaming architectures.',
    benefits: ['Flexible Hours', 'Annual Offsite in Bali', 'Unlimited PTO', 'Health Wellness Stipend'],
  },
  {
    id: 'comp_3',
    name: 'Quantum AI Labs',
    industry: 'Artificial Intelligence',
    location: 'Boston, MA',
    website: 'https://quantumailabs.ai',
    email: 'talent@quantumailabs.ai',
    employees: '250 - 500',
    openJobsCount: 9,
    foundedYear: 2021,
    logo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=120&auto=format&fit=crop&q=80',
    description:
      'Pioneering foundation intelligence models and neural compilers. Specializing in generative code synthesis, automated reasoning, and enterprise AI guardrails.',
    benefits: ['Top-Tier Compute Access', 'Parental Leave (6 Months)', 'Competitive Equity', 'Free Daily Lunch'],
  },
  {
    id: 'comp_4',
    name: 'Apex Health Systems',
    industry: 'Healthcare & Biotech',
    location: 'San Diego, CA',
    website: 'https://apexhealth.org',
    email: 'hr@apexhealth.org',
    employees: '2,000 - 5,000',
    openJobsCount: 15,
    foundedYear: 2014,
    logo: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=120&auto=format&fit=crop&q=80',
    description:
      'Developing AI-driven diagnostic platforms and telemedicine networks that connect millions of underserved patients with specialist doctors in seconds.',
    benefits: ['Comprehensive Medical Cover', '401k Matching 6%', 'Tuition Reimbursement', 'Fitness Subsidy'],
  },
  {
    id: 'comp_5',
    name: 'Veloce Data Platforms',
    industry: 'Cybersecurity',
    location: 'New York, NY',
    website: 'https://velocedata.com',
    email: 'security-hiring@velocedata.com',
    employees: '450 - 700',
    openJobsCount: 7,
    foundedYear: 2020,
    logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=120&auto=format&fit=crop&q=80',
    description:
      'Zero-trust data security fabric protecting high-frequency trading platforms, sovereign cloud networks, and biometric credentials against threat actors.',
    benefits: ['Home Office Setup $2,000', 'Quarterly Bonuses', 'Top Health Coverage', 'Mental Health Days'],
  },
  {
    id: 'comp_6',
    name: 'OmniCart Commerce',
    industry: 'E-Commerce',
    location: 'Seattle, WA',
    website: 'https://omnicart.shop',
    email: 'jobs@omnicart.shop',
    employees: '1,200 - 1,800',
    openJobsCount: 11,
    foundedYear: 2016,
    logo: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=120&auto=format&fit=crop&q=80',
    description:
      'Headless omnichannel commerce platform used by over 45,000 direct-to-consumer lifestyle and apparel brands worldwide.',
    benefits: ['Employee Discount 40%', 'Pet-Friendly Office', 'Commuter Benefits', 'Performance Equity'],
  },
];

export const companyService = {
  // Fetch companies: checks localStorage first; if empty, fetches from Third-Party API
  getCompanies: async () => {
    const cached = storage.get(STORAGE_KEY, null);
    if (cached && Array.isArray(cached) && cached.length > 0) {
      return cached;
    }

    try {
      // Third-party API integration: JSONPlaceholder Users endpoint
      const response = await axios.get('https://jsonplaceholder.typicode.com/users', { timeout: 6000 });
      
      const industries = ['Technology', 'Finance & FinTech', 'Cloud Computing', 'Artificial Intelligence', 'Cybersecurity', 'Healthcare & Biotech'];
      const logos = [
        'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=120&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=120&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=120&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=120&auto=format&fit=crop&q=80',
      ];

      // Enrich API data to match enterprise requirements
      const apiCompanies = response.data.map((user, idx) => ({
        id: 'comp_api_' + user.id,
        name: user.company?.name || `Enterprise ${user.id} Corp`,
        industry: industries[idx % industries.length],
        location: `${user.address?.city || 'San Francisco'}, ${user.address?.zipcode?.substring(0, 2) || 'CA'}`,
        website: `https://${user.website || 'example.com'}`,
        email: user.email?.toLowerCase() || `contact@${user.company?.name?.toLowerCase().replace(/\s+/g, '')}.com`,
        employees: `${(idx + 1) * 200} - ${(idx + 2) * 350}`,
        openJobsCount: (user.id % 7) + 3,
        foundedYear: 2012 + (user.id % 10),
        logo: logos[idx % logos.length],
        description: `${user.company?.catchPhrase || 'Empowering innovation through software'}. ${user.company?.bs || 'Driving scale with enterprise technology solutions'}. Specialized in cloud-native platforms, high availability, and candidate satisfaction.`,
        benefits: ['Flexible Work Options', 'Health & Dental', 'Stock Options', 'Annual Growth Stipend'],
      }));

      // Combine API data with high-quality fallback items
      const merged = [...FALLBACK_COMPANIES, ...apiCompanies];
      storage.set(STORAGE_KEY, merged);
      return merged;
    } catch (err) {
      console.warn('Third-party API fetch failed or timed out. Falling back to curated seed dataset.', err);
      storage.set(STORAGE_KEY, FALLBACK_COMPANIES);
      return FALLBACK_COMPANIES;
    }
  },

  // Get single company by ID
  getCompanyById: async (id) => {
    const companies = await companyService.getCompanies();
    return companies.find((c) => String(c.id) === String(id)) || null;
  },

  // Add Company
  addCompany: async (companyData) => {
    const companies = await companyService.getCompanies();
    const newCompany = {
      id: 'comp_' + Date.now(),
      name: companyData.name.trim(),
      industry: companyData.industry || 'Technology',
      location: companyData.location || 'Remote, US',
      website: companyData.website || 'https://example.com',
      email: companyData.email || 'careers@example.com',
      employees: companyData.employees || '100 - 250',
      openJobsCount: Number(companyData.openJobsCount) || 1,
      foundedYear: Number(companyData.foundedYear) || new Date().getFullYear(),
      logo:
        companyData.logo ||
        `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(companyData.name)}`,
      description: companyData.description || 'Innovative enterprise advancing technology solutions.',
      benefits: companyData.benefits || ['Remote Work', 'Health Benefits', 'Learning Budget'],
      createdAt: new Date().toISOString(),
    };

    const updated = [newCompany, ...companies];
    storage.set(STORAGE_KEY, updated);
    return newCompany;
  },

  // Edit / Update Company
  updateCompany: async (id, updatedFields) => {
    const companies = await companyService.getCompanies();
    const index = companies.findIndex((c) => String(c.id) === String(id));
    if (index === -1) throw new Error('Company not found');

    const updatedCompany = {
      ...companies[index],
      ...updatedFields,
      updatedAt: new Date().toISOString(),
    };

    companies[index] = updatedCompany;
    storage.set(STORAGE_KEY, companies);
    return updatedCompany;
  },

  // Delete Company
  deleteCompany: async (id) => {
    const companies = await companyService.getCompanies();
    const filtered = companies.filter((c) => String(c.id) !== String(id));
    storage.set(STORAGE_KEY, filtered);
    return true;
  },

  // Reset to default seed
  resetDefaults: () => {
    storage.set(STORAGE_KEY, FALLBACK_COMPANIES);
    return FALLBACK_COMPANIES;
  },
};
