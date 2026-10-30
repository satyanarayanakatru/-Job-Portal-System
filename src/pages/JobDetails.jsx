import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import JobPostModal from '../components/jobs/JobPostModal';
import JobDeleteModal from '../components/jobs/JobDeleteModal';
import SkeletonLoader from '../components/common/SkeletonLoader';
import QuickApplyModal from '../components/search/QuickApplyModal';
import QuickActionModal from '../components/dashboard/QuickActionModal';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
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
  ShieldCheck,
  UserCheck,
  Award,
  FileText,
  Video,
  Send
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isRecruiter = user?.role === 'recruiter';

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);

  // Modals state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [candidateDirectoryOpen, setCandidateDirectoryOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadJobData = async () => {
    setLoading(true);
    try {
      const found = await jobService.getJobById(id);
      if (found) {
        setJob(found);
      } else {
        toast.error('Job posting not found');
        navigate('/jobs');
      }

      const allApps = applicationService.getApplications();
      setApplications(allApps || []);
    } catch (err) {
      toast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobData();
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
    setApplyModalOpen(true);
  };

  const handleSaveJob = () => {
    applicationService.saveJob(job);
    toast.success(`"${job.title}" added to your Saved Jobs!`);
  };

  // Recruiter actions on applicants for this job
  const handleUpdateApplicantStage = (appId, newStatus) => {
    const updated = applicationService.updateApplicationStage(appId, newStatus, {
      notes: newStatus === 'Offer Extended' 
        ? 'Formally Hired / Offer Extended by recruiter Alex Morgan.'
        : `Hiring stage updated to ${newStatus}.`,
    });
    setApplications(updated);
    toast.success(`Applicant status updated to "${newStatus}"!`);
  };

  const handleHireApplicant = (applicant) => {
    const updated = applicationService.updateApplicationStage(applicant.id, 'Offer Extended', {
      notes: `Formally Hired / Offer Extended by recruiter Alex Morgan for role "${job.title}".`,
    });
    setApplications(updated);
    toast.success(`🎉 Congratulations! ${applicant.applicantName} has been formally hired for "${job.title}"!`);
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

  // Find all applicants for this specific job
  const matchingApplicants = applications.filter((a) => String(a.jobId) === String(job.id));

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-12">
        
        {/* Top Back Nav & Quick Actions */}
        <div className="flex items-center justify-between">
          <Link
            to={isRecruiter ? '/jobs' : '/jobs/search'}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isRecruiter ? 'Back to Manage Postings' : 'Back to Job Search'}</span>
          </Link>

          {isRecruiter ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleToggleStatus}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  isOpen
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-200 text-slate-700 border border-slate-300'
                }`}
              >
                {isOpen ? <ToggleRight className="w-4 h-4 text-emerald-600" /> : <ToggleLeft className="w-4 h-4 text-slate-500" />}
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
          ) : (
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleSaveJob}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition"
              >
                <Bookmark className="w-3.5 h-3.5 text-amber-500" />
                <span>Save Job</span>
              </button>
              <button
                type="button"
                onClick={handleApply}
                disabled={!isOpen}
                className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isOpen ? 'Quick Apply' : 'Position Closed'}</span>
              </button>
            </div>
          )}
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
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-100 shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    isOpen ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-200 text-slate-700 border-slate-300'
                  }`}>
                    {job.status}
                  </span>
                  <span className="text-xs text-slate-500">
                    ID: <span className="font-mono">{job.id}</span>
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="font-bold text-slate-800">{job.company}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{job.location}</span>
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

            {/* Compensation & Role Action Block */}
            <div className="flex flex-col sm:items-end gap-2 shrink-0">
              <div className="text-right sm:text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Annual Compensation
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 block">
                  {job.salaryRange}
                </span>
              </div>

              {/* Recruiter vs Candidate Actions (No apply for recruiter!) */}
              <div className="flex items-center gap-2 mt-1">
                {isRecruiter ? (
                  <>
                    <button
                      type="button"
                      onClick={() => document.getElementById('applicants-pipeline')?.scrollIntoView({ behavior: 'smooth' })}
                      className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Users className="w-4 h-4" />
                      <span>Review Applicants ({matchingApplicants.length})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCandidateDirectoryOpen(true)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Hire Candidates</span>
                    </button>
                  </>
                ) : (
                  <>
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
                      <Send className="w-3.5 h-3.5" />
                      <span>{isOpen ? 'Quick Apply for Position' : 'Applications Closed'}</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recruiter Dedicated: Applicants Pipeline Section */}
        {isRecruiter && (
          <div id="applicants-pipeline" className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Live Applicants Pipeline ({matchingApplicants.length} Candidates)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Manage incoming submissions, advance screening stages, and extend formal job offers
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCandidateDirectoryOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition flex items-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Source from Directory</span>
              </button>
            </div>

            {matchingApplicants.length > 0 ? (
              <div className="divide-y divide-slate-100 pt-2">
                {matchingApplicants.map((applicant) => (
                  <div key={applicant.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start space-x-3.5 min-w-0">
                      <img
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(applicant.applicantName || 'Candidate')}`}
                        alt={applicant.applicantName}
                        className="w-11 h-11 rounded-xl object-cover ring-2 ring-slate-100 shrink-0 bg-slate-50"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {applicant.applicantName}
                          </h4>
                          <span className={`px-2 py-0.2 rounded-full text-[10px] font-extrabold ${
                            applicant.status === 'Offer Extended'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : applicant.status === 'Interview Scheduled'
                              ? 'bg-purple-100 text-purple-800 border border-purple-300'
                              : applicant.status === 'Under Review'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-blue-100 text-blue-800 border border-blue-300'
                          }`}>
                            {applicant.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {applicant.applicantEmail} • {applicant.phone || 'Phone verified'}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-indigo-600 font-semibold">
                          <FileText className="w-3.5 h-3.5" />
                          <span>{applicant.resumeName || applicant.resume || 'Resume.pdf'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Recruiter Hiring Action Controls */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Stage:</span>
                        <select
                          value={applicant.status}
                          onChange={(e) => handleUpdateApplicantStage(applicant.id, e.target.value)}
                          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                        >
                          <option value="Submitted">1. Submitted</option>
                          <option value="Under Review">2. Under Review</option>
                          <option value="Interview Scheduled">3. Interview Scheduled</option>
                          <option value="Offer Extended">4. Offer Extended</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>

                      {applicant.status === 'Offer Extended' ? (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-extrabold border border-emerald-300">
                          <Award className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Candidate Hired!</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleHireApplicant(applicant)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow-emerald-600/20 transition flex items-center gap-1.5"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Hire this Candidate</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500 text-xs bg-slate-50/50 rounded-2xl border border-slate-100">
                <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">No Candidate Applications Yet for this Role</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  When candidates apply from the job portal or candidate profile, their resumes appear here in real time.
                </p>
                <button
                  type="button"
                  onClick={() => setCandidateDirectoryOpen(true)}
                  className="mt-3 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition inline-flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Browse Candidates to Hire</span>
                </button>
              </div>
            )}
          </div>
        )}

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
                  <span className="font-semibold text-indigo-700">{matchingApplicants.length} Registered</span>
                </div>
              </div>

              {/* Sidebar Action: Recruiter gets Hire Candidate / Candidate gets Quick Apply */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                {isRecruiter ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setCandidateDirectoryOpen(true)}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Hire Candidate for this Opening</span>
                    </button>
                    <Link
                      to="/applications"
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center justify-center"
                    >
                      Open Full ATS Pipeline
                    </Link>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleApply}
                    disabled={!isOpen}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isOpen ? 'Quick Apply' : 'Position Closed'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Apply Modal for Candidates */}
      <QuickApplyModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        job={job}
        onApplied={() => loadJobData()}
      />

      {/* Candidate Directory Modal for Recruiter Hiring */}
      <QuickActionModal
        isOpen={candidateDirectoryOpen}
        onClose={() => {
          setCandidateDirectoryOpen(false);
          loadJobData();
        }}
        actionType="candidate-search"
        role="recruiter"
      />

      {/* Edit Modal (Recruiter only) */}
      <JobPostModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleUpdate}
        initialData={job}
      />

      {/* Delete Confirmation Modal (Recruiter only) */}
      <JobDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        jobTitle={job?.title}
        isDeleting={isDeleting}
      />
    </DashboardLayout>
  );
}