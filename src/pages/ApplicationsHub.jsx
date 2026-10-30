import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BookmarkCheck, 
  Briefcase, 
  Building2, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Video, 
  Award, 
  Sparkles,
  ArrowUpDown,
  PlusCircle,
  FileText,
  UserCheck
} from 'lucide-react';
import { toast } from 'react-toastify';
import DashboardLayout from '../components/layout/DashboardLayout';
import ApplicationCard from '../components/applications/ApplicationCard';
import SavedJobCard from '../components/applications/SavedJobCard';
import WithdrawModal from '../components/applications/WithdrawModal';
import ApplicationDetailsModal from '../components/applications/ApplicationDetailsModal';
import QuickApplyModal from '../components/search/QuickApplyModal';
import EmptyState from '../components/common/EmptyState';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { applicationService } from '../services/applicationService';

export default function ApplicationsHub() {
  const { user } = useAuth();
  const isRecruiter = user?.role === 'recruiter';

  const [activeTab, setActiveTab] = useState('applications'); // 'applications' | 'saved'
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');

  // Modal states
  const [selectedWithdrawApp, setSelectedWithdrawApp] = useState(null);
  const [selectedDetailsApp, setSelectedDetailsApp] = useState(null);
  const [applyJobTarget, setApplyJobTarget] = useState(null);

  // Load data
  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      const apps = applicationService.getApplications();
      const saved = applicationService.getSavedJobs();
      setApplications(apps);
      setSavedJobs(saved);
      setLoading(false);
    }, 250);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Recruiter handler: Advance candidate hiring stage
  const handleUpdateStage = (appId, newStatus) => {
    let notes = undefined;
    if (newStatus === 'Interview Scheduled') {
      notes = 'Recruiter confirmed technical video interview for Thursday at 2:00 PM EST.';
    } else if (newStatus === 'Offer Extended') {
      notes = 'Formal written offer extended: competitive base salary and equity package.';
    } else if (newStatus === 'Under Review') {
      notes = 'Application screened by talent acquisition team and forwarded to hiring manager.';
    }
    const updated = applicationService.updateApplicationStage(appId, newStatus, { notes });
    setApplications(updated);
    toast.success(`Candidate hiring stage updated to "${newStatus}"!`);
  };

  // Handle Application Withdrawal (Candidate)
  const handleConfirmWithdraw = (appId, reason) => {
    const updated = applicationService.withdrawApplication(appId, reason);
    setApplications(updated);
    toast.info('Application withdrawn successfully.');
  };

  // Handle Delete Application
  const handleDeleteApplication = (appId) => {
    if (window.confirm('Are you sure you want to remove this application record from your list?')) {
      const updated = applicationService.deleteApplication(appId);
      setApplications(updated);
      toast.success('Application record removed.');
    }
  };

  // Handle Remove Saved Job
  const handleRemoveSavedJob = (jobId) => {
    const updated = applicationService.removeSavedJob(jobId);
    setSavedJobs(updated);
    toast.info('Removed from saved jobs.');
  };

  // Stats calculation
  const totalAppsCount = applications.length;
  const underReviewCount = applications.filter((a) => a.status === 'Under Review').length;
  const interviewCount = applications.filter((a) => a.status === 'Interview Scheduled').length;
  const offerCount = applications.filter((a) => a.status === 'Offer Extended').length;
  const savedCount = savedJobs.length;

  // Filtered Applications
  const filteredApplications = applications
    .filter((app) => {
      const matchesSearch =
        (app.jobTitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.company || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === 'ALL' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.appliedAt || 0) - new Date(a.appliedAt || 0);
      }
      return new Date(a.appliedAt || 0) - new Date(b.appliedAt || 0);
    });

  // Filtered Saved Jobs
  const filteredSavedJobs = savedJobs.filter((job) => {
    return (
      (job.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.category || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <DashboardLayout onRefresh={loadData} isRefreshing={loading}>
      <div className="space-y-6">
        
        {/* Top Header & Overview */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                {isRecruiter ? 'Recruiter ATS' : 'Career Tracking'}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                • {isRecruiter ? 'Talent Acquisition & Stage Advancement' : 'Applications & Bookmarks'}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
              {isRecruiter ? 'Candidate Applications & ATS Pipeline' : 'Applications & Saved Jobs'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {isRecruiter
                ? 'Review candidate resumes, screen incoming talent submissions, and advance candidates across hiring stages.'
                : 'Monitor active hiring stages, interview invitations, offer packages, and bookmarked roles.'}
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <Link
              to={isRecruiter ? '/jobs' : '/jobs/search'}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
            >
              {isRecruiter ? <Briefcase className="w-4 h-4" /> : <Search className="w-4 h-4" />}
              <span>{isRecruiter ? 'Manage Job Postings' : 'Explore More Jobs'}</span>
            </Link>
          </div>
        </div>

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">Total Applied</p>
              <p className="text-xl font-extrabold text-slate-900 leading-tight">{totalAppsCount}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">Under Review</p>
              <p className="text-xl font-extrabold text-slate-900 leading-tight">{underReviewCount}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">Interviews</p>
              <p className="text-xl font-extrabold text-slate-900 leading-tight">{interviewCount}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">Offers Extended</p>
              <p className="text-xl font-extrabold text-slate-900 leading-tight">{offerCount}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-3 col-span-2 sm:col-span-1">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">Saved Jobs</p>
              <p className="text-xl font-extrabold text-slate-900 leading-tight">{savedCount}</p>
            </div>
          </div>
        </div>

        {/* Tab Switcher & Filter Toolbar */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Tabs */}
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'applications'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{isRecruiter ? 'Candidate Submissions' : 'My Applications'}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'applications' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-600'
              }`}>
                {totalAppsCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'saved'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>{isRecruiter ? 'Shortlisted Talent' : 'Saved Jobs'}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'saved' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-600'
              }`}>
                {savedCount}
              </span>
            </button>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative min-w-[200px] flex-1 md:flex-none">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={activeTab === 'applications' ? "Search job or company..." : "Search saved jobs..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8.5 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Applications Status Filter */}
            {activeTab === 'applications' && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
              >
                <option value="ALL">All Statuses</option>
                <option value="Submitted">Submitted</option>
                <option value="Under Review">Under Review</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Offer Extended">Offer Extended</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            )}

            {/* Sort Order */}
            <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-1.5 rounded-xl text-xs text-slate-600">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none text-xs text-slate-700 font-medium focus:outline-hidden cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Listing Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SkeletonLoader count={4} />
          </div>
        ) : activeTab === 'applications' ? (
          // Applications Tab View
          filteredApplications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredApplications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  onViewDetails={(a) => setSelectedDetailsApp(a)}
                  onWithdraw={(a) => setSelectedWithdrawApp(a)}
                  onDelete={handleDeleteApplication}
                  isRecruiter={isRecruiter}
                  onUpdateStage={handleUpdateStage}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Applications Found"
              description={
                searchTerm || statusFilter !== 'ALL'
                  ? 'No applications match your selected criteria. Try adjusting your filters or search keyword.'
                  : "You haven't submitted any job applications yet. Discover open roles and apply in just a few clicks."
              }
              actionText="Browse Open Positions"
              onAction={() => window.location.assign('/jobs')}
            />
          )
        ) : (
          // Saved Jobs Tab View
          filteredSavedJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSavedJobs.map((job) => (
                <SavedJobCard
                  key={job.id}
                  job={job}
                  onApply={(j) => setApplyJobTarget(j)}
                  onRemove={handleRemoveSavedJob}
                  isRecruiter={isRecruiter}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Saved Jobs"
              description={
                searchTerm
                  ? 'No bookmarked jobs match your search keywords.'
                  : 'You have not saved any jobs yet. Bookmark interesting job postings while searching to easily review them later.'
              }
              actionText="Explore Job Listings"
              onAction={() => window.location.assign('/jobs')}
            />
          )
        )}

        {/* Withdraw Confirmation Modal */}
        <WithdrawModal
          isOpen={!!selectedWithdrawApp}
          onClose={() => setSelectedWithdrawApp(null)}
          onConfirm={handleConfirmWithdraw}
          application={selectedWithdrawApp}
        />

        {/* Full Details & Hiring Journey Modal */}
        <ApplicationDetailsModal
          isOpen={!!selectedDetailsApp}
          onClose={() => setSelectedDetailsApp(null)}
          application={selectedDetailsApp}
        />

        {/* Quick Apply Modal for Saved Jobs */}
        <QuickApplyModal
          isOpen={!!applyJobTarget}
          onClose={() => {
            setApplyJobTarget(null);
            loadData();
          }}
          job={applyJobTarget}
        />

      </div>
    </DashboardLayout>
  );
}
