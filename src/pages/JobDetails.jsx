import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import JobPostModal from '../components/jobs/JobPostModal';
import JobDeleteModal from '../components/jobs/JobDeleteModal';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { jobService } from '../services/jobService';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Users, 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Share2,
  Bookmark,
  ToggleLeft,
  ToggleRight,
  ShieldCheck
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const found = await jobService.getJobById(id);
        if (found) {
          setJob(found);
        } else {
          toast.error('Job posting not found');
          navigate('/jobs');
        }
      } catch (err) {
        toast.error('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, navigate]);

  const handleUpdate = async (formData) => {
    try {
      const updated = await jobService.updateJob(job.id, formData);
      setJob(updated);
      toast.success(`Job "${updated.title}" updated successfully!`);
    } catch (err) {
      toast.error('Failed to update job');
    }
  };

  const handleToggleStatus = async () => {
    try {
      const updated = await jobService.toggleJobStatus(job.id);
      setJob(updated);
      toast.info(`Job status toggled to "${updated.status}"`);
    } catch (err) {
      toast.error('Failed to toggle status');
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await jobService.deleteJob(job.id);
      toast.success(`Job "${job.title}" deleted.`);
      navigate('/jobs');
    } catch (err) {
      toast.error('Failed to delete job');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleApply = () => {
    toast.success(`Application submitted for "${job.title}"! Hiring team notified.`);
  };

  const handleSaveJob = () => {
    toast.success(`"${job.title}" added to your Saved Jobs!`);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto space-y-6">
          <SkeletonLoader count={2} />
        </div>
      </DashboardLayout>
    );
  }

  if (!job) return null;

  const isOpen = job.status === 'Open';

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top Back Nav & Quick Actions */}
        <div className="flex items-center justify-between">
          <Link
            to="/jobs"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Job Postings</span>
          </Link>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleStatus}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                isOpen
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-200 text-slate-700 border border-slate-300'
              }`}
            >
              {isOpen ? <ToggleRight className="w-4 h-4 text-emerald-600" /> : <ToggleLeft className="w-4 h-4" />}
              <span>{job.status}</span>
            </button>

            <button
              onClick={() => setEditModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition"
            >
              <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Edit Job</span>
            </button>

            <button
              onClick={() => setDeleteModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-rose-700 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center space-x-4">
              <img
                src={job.companyLogo}
                alt={job.company}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(job.company)}`;
                }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-slate-100 shadow-xs shrink-0"
              />
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {job.title}
                  </h1>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      isOpen
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-indigo-600">
                  {job.company} • {job.category}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.location}
                  </span>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold text-[11px]">
                    {job.employmentType}
                  </span>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                    {job.experienceLevel}
                  </span>
                </div>
              </div>
            </div>

            {/* Compensation & Apply Block */}
            <div className="flex flex-col sm:items-end gap-2 shrink-0">
              <div className="text-right sm:text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Annual Compensation
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 block">
                  {job.salaryRange}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={handleSaveJob}
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
                  title="Save Job"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  disabled={!isOpen}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
                >
                  <span>{isOpen ? 'Apply for Position' : 'Applications Closed'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Grid: Requirements, Responsibilities, Metadata */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Scope & Skills */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Overview / Scope */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                <span>Role Overview & Expectations</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Key Responsibilities */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                Key Responsibilities & Deliverables
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                {(job.responsibilities || [
                  'Develop, test, and maintain high-performance enterprise applications',
                  'Collaborate with product designers and engineering leadership',
                  'Participate in architecture design reviews and mentor teammates',
                ]).map((resp, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Required Skills Tag Badges */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                Required Technical Skills & Competencies
              </h3>
              <div className="flex flex-wrap gap-2">
                {(job.requiredSkills || []).map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Key Job Facts & Hiring Team */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Job Posting Summary
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Hiring Organization</span>
                  <span className="font-bold text-slate-900">{job.company}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Job Category</span>
                  <span className="font-semibold text-slate-800">{job.category}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Employment Type</span>
                  <span className="font-semibold text-slate-800">{job.employmentType}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Experience Requirement</span>
                  <span className="font-semibold text-slate-800">{job.experienceLevel}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Target Salary</span>
                  <span className="font-bold text-emerald-700">{job.salaryRange}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Application Deadline</span>
                  <span className="font-bold text-slate-900">{job.applicationDeadline}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Total Applicants</span>
                  <span className="font-semibold text-indigo-700">{job.applicantsCount || 0} Registered</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <button
                  type="button"
                  onClick={handleApply}
                  disabled={!isOpen}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  {isOpen ? 'Quick Apply' : 'Position Closed'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <JobPostModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleUpdate}
        jobToEdit={job}
      />

      {/* Delete Modal */}
      <JobDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        jobTitle={job.title}
        isDeleting={isDeleting}
      />
    </DashboardLayout>
  );
}
