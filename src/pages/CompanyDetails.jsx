import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import CompanyModal from '../components/companies/CompanyModal';
import DeleteConfirmModal from '../components/companies/DeleteConfirmModal';
import SkeletonLoader from '../components/common/SkeletonLoader';
import QuickApplyModal from '../components/search/QuickApplyModal';
import { useAuth } from '../context/AuthContext';
import { companyService } from '../services/companyService';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Mail, 
  Users, 
  Briefcase, 
  Calendar, 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Star,
  DollarSign,
  UserCheck
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function CompanyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isRecruiter = user?.role === 'recruiter';
  const [applyJobTarget, setApplyJobTarget] = useState(null);

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadCompany = async () => {
      setLoading(true);
      try {
        const found = await companyService.getCompanyById(id);
        if (found) {
          setCompany(found);
        } else {
          toast.error('Company profile not found');
          navigate('/companies');
        }
      } catch (err) {
        toast.error('Failed to load company details');
      } finally {
        setLoading(false);
      }
    };

    loadCompany();
  }, [id, navigate]);

  const handleUpdate = async (formData) => {
    try {
      const updated = await companyService.updateCompany(company.id, formData);
      setCompany(updated);
      toast.success(`Updated ${updated.name} successfully!`);
    } catch (err) {
      toast.error('Failed to update company');
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await companyService.deleteCompany(company.id);
      toast.success(`Company ${company.name} deleted.`);
      navigate('/companies');
    } catch (err) {
      toast.error('Failed to delete company');
    } finally {
      setIsDeleting(false);
    }
  };

  // Sample active job openings for this specific company
  const mockJobs = [
    {
      id: 'job_1',
      title: 'Senior Full Stack Engineer (React / Node)',
      type: 'Full Time',
      level: 'Senior Level',
      salary: '$140k - $175k',
      location: company?.location || 'Remote, US',
      deadline: 'Nov 30, 2026',
    },
    {
      id: 'job_2',
      title: 'Staff Cloud Infrastructure Architect',
      type: 'Full Time',
      level: 'Lead / Staff',
      salary: '$180k - $220k',
      location: 'Remote',
      deadline: 'Dec 15, 2026',
    },
    {
      id: 'job_3',
      title: 'Product Designer (Design Systems)',
      type: 'Full Time',
      level: 'Mid - Senior',
      salary: '$125k - $150k',
      location: company?.location || 'San Francisco, CA',
      deadline: 'Dec 05, 2026',
    },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto space-y-6">
          <SkeletonLoader count={2} />
        </div>
      </DashboardLayout>
    );
  }

  if (!company) return null;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            to="/companies"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Companies Directory</span>
          </Link>

          {/* Action buttons (Recruiter only) */}
          {isRecruiter && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setEditModalOpen(true)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition"
              >
                <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Edit Company</span>
              </button>
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-rose-700 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Company Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center space-x-5">
              <img
                src={company.logo}
                alt={company.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(company.name)}`;
                }}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-slate-100 shadow-xs shrink-0"
              />
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {company.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-3 h-3" /> Verified Partner
                  </span>
                </div>

                <p className="text-xs font-semibold text-indigo-600">
                  {company.industry} • Founded {company.foundedYear || 2018}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {company.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    {company.employees} Employees
                  </span>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-indigo-600 hover:underline font-medium"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Official Website</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="shrink-0 bg-indigo-50 border border-indigo-100 p-4 rounded-2xl text-center self-stretch sm:self-auto min-w-[140px]">
              <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-600 block">
                Active Openings
              </span>
              <span className="text-2xl font-extrabold text-indigo-950 mt-0.5 block">
                {company.openJobsCount || mockJobs.length}
              </span>
              <span className="text-[10px] text-indigo-500 font-medium">Hiring this month</span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: About & Jobs */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* About / Description Section */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span>About {company.name}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {company.description}
              </p>

              {/* Core Benefits */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 mb-2">Workplace Benefits & Culture:</h4>
                <div className="flex flex-wrap gap-2">
                  {(company.benefits || ['Remote Flexibility', 'Full Healthcare', 'Competitive Equity', 'Learning Budget']).map(
                    (b, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-700"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{b}</span>
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Active Job Postings from this Company */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-indigo-600" />
                    <span>Open Positions at {company.name}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Roles matching candidate credentials
                  </p>
                </div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                  {mockJobs.length} Live Openings
                </span>
              </div>

              <div className="space-y-3">
                {mockJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 rounded-xl border border-slate-200/70 hover:border-indigo-300 hover:shadow-xs transition bg-slate-50/40 hover:bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {job.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                          {job.type}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-emerald-700">{job.salary}</span>
                        <span>•</span>
                        <span>{job.location}</span>
                      </div>
                    </div>

                    {isRecruiter ? (
                      <Link
                        to="/jobs"
                        className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Hire for this Role</span>
                      </Link>
                    ) : (
                      <button
                        onClick={() => setApplyJobTarget({
                          id: `job_comp_${job.id}`,
                          title: job.title,
                          company: company.name,
                          companyLogo: company.logo,
                          location: job.location,
                          salaryRange: job.salary,
                          employmentType: job.type
                        })}
                        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-2xs transition shrink-0"
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact & Quick Facts Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Corporate Contact Info
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Contact Email</span>
                  <a href={`mailto:${company.email}`} className="font-semibold text-indigo-600 hover:underline">
                    {company.email}
                  </a>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Phone Inquiries</span>
                  <span className="font-semibold text-slate-800">{company.phone}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Headquarters</span>
                  <span className="font-semibold text-slate-800">{company.location}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Organization Size</span>
                  <span className="font-semibold text-slate-800">{company.employees} Team Members</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Industry Vertical</span>
                  <span className="font-semibold text-slate-800">{company.industry}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => toast.success(`Contact inquiry sent to ${company.email}!`)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Direct Inquiry</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <CompanyModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleUpdate}
        companyToEdit={company}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        companyName={company.name}
        isDeleting={isDeleting}
      />

      {/* Quick Apply Modal for Candidate Direct Apply */}
      <QuickApplyModal
        isOpen={!!applyJobTarget}
        onClose={() => setApplyJobTarget(null)}
        job={applyJobTarget}
      />
    </DashboardLayout>
  );
}