import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import JobPostCard from '../components/jobs/JobPostCard';
import JobPostModal from '../components/jobs/JobPostModal';
import JobDeleteModal from '../components/jobs/JobDeleteModal';
import SkeletonLoader from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';
import { jobService } from '../services/jobService';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Users, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  RotateCcw,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { toast } from 'react-toastify';

const ITEMS_PER_PAGE = 6;

export default function JobManagement() {
  const { user } = useAuth();
  const isRecruiter = user?.role === 'recruiter';

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // All, Open, Closed
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load jobs from service
  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await jobService.getJobs();
      setJobs(data);
    } catch (err) {
      toast.error('Failed to load job postings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  // Compute categories & employment types
  const categories = useMemo(() => {
    const set = new Set();
    jobs.forEach((j) => {
      if (j.category) set.add(j.category);
    });
    return Array.from(set).sort();
  }, [jobs]);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    // Status filter
    if (statusFilter !== 'All') {
      result = result.filter((j) => j.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'All') {
      result = result.filter((j) => j.category === categoryFilter);
    }

    // Employment type filter
    if (employmentTypeFilter !== 'All') {
      result = result.filter((j) => j.employmentType === employmentTypeFilter);
    }

    // Search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(term) ||
          j.company.toLowerCase().includes(term) ||
          j.location.toLowerCase().includes(term) ||
          (j.requiredSkills || []).some((s) => s.toLowerCase().includes(term))
      );
    }

    return result;
  }, [jobs, statusFilter, categoryFilter, employmentTypeFilter, searchTerm]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, categoryFilter, employmentTypeFilter, searchTerm]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE) || 1;
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredJobs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredJobs, currentPage]);

  // Handlers for Add & Edit
  const handleOpenAdd = () => {
    setJobToEdit(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (job) => {
    setJobToEdit(job);
    setModalOpen(true);
  };

  const handleSaveJob = async (jobData) => {
    try {
      if (jobToEdit) {
        const updated = await jobService.updateJob(jobToEdit.id, jobData);
        setJobs((prev) =>
          prev.map((j) => (String(j.id) === String(updated.id) ? updated : j))
        );
        toast.success(`Job Posting "${updated.title}" updated successfully!`);
      } else {
        const created = await jobService.createJob(jobData);
        setJobs((prev) => [created, ...prev]);
        toast.success(`Job Posting "${created.title}" published live!`);
      }
    } catch (err) {
      toast.error(err.message || 'Action failed');
    }
  };

  // Status Toggle
  const handleToggleStatus = async (id) => {
    try {
      const updated = await jobService.toggleJobStatus(id);
      setJobs((prev) =>
        prev.map((j) => (String(j.id) === String(updated.id) ? updated : j))
      );
      toast.info(`Job status toggled to "${updated.status}"`);
    } catch (err) {
      toast.error('Failed to toggle status');
    }
  };

  // Delete Job
  const handleOpenDelete = (job) => {
    setJobToDelete(job);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!jobToDelete) return;
    setIsDeleting(true);
    try {
      await jobService.deleteJob(jobToDelete.id);
      setJobs((prev) => prev.filter((j) => String(j.id) !== String(jobToDelete.id)));
      toast.success(`Job "${jobToDelete.title}" deleted.`);
      setDeleteModalOpen(false);
      setJobToDelete(null);
    } catch (err) {
      toast.error('Failed to delete job');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setCategoryFilter('All');
    setEmploymentTypeFilter('All');
  };

  // Metrics summary
  const openCount = jobs.filter((j) => j.status === 'Open').length;
  const closedCount = jobs.filter((j) => j.status === 'Closed').length;
  const totalApplicants = jobs.reduce((acc, j) => acc + (j.applicantsCount || 0), 0);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
          <Link
            to="/jobs/search"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Job Search Engine</span>
          </Link>
          <Link
            to="/jobs"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow-xs transition flex items-center gap-1.5"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Manage Postings</span>
          </Link>
        </div>

        {/* Header Banner */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Job Posting & Lifecycle Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Job Postings Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Create, edit, toggle visibility, and monitor application deadlines. Target qualified candidates by category, experience level, salary range, and required skills.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            {isRecruiter ? (
              <button
                onClick={handleOpenAdd}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create Job Posting</span>
              </button>
            ) : (
              <Link
                to="/jobs/search"
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
              >
                <Search className="w-4 h-4" />
                <span>Open Search Engine</span>
              </Link>
            )}
          </div>
        </div>

        {/* Highlight Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-semibold text-slate-400 block mb-1">Total Postings</span>
            <div className="flex items-center justify-between">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900">{jobs.length}</span>
              <Briefcase className="w-4 h-4 text-indigo-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-semibold text-slate-400 block mb-1">Open Positions</span>
            <div className="flex items-center justify-between">
              <span className="text-xl sm:text-2xl font-extrabold text-emerald-600">{openCount}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-semibold text-slate-400 block mb-1">Closed Postings</span>
            <div className="flex items-center justify-between">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-700">{closedCount}</span>
              <XCircle className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-semibold text-slate-400 block mb-1">Total Applicants</span>
            <div className="flex items-center justify-between">
              <span className="text-xl sm:text-2xl font-extrabold text-indigo-900">{totalApplicants}</span>
              <Users className="w-4 h-4 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search job title, company, skills, or location..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition"
              />
            </div>

            {/* Status Pills */}
            <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl">
              {['All', 'Open', 'Closed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    statusFilter === st
                      ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st} Postings
                </button>
              ))}
            </div>

            {/* Dropdown Filters */}
            <div className="flex items-center space-x-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              >
                <option value="All">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                value={employmentTypeFilter}
                onChange={(e) => setEmploymentTypeFilter(e.target.value)}
                className="pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              >
                <option value="All">All Types</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Remote">Remote</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          {/* Results summary & Reset */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>
              Showing <span className="font-bold text-slate-800">{filteredJobs.length}</span> job postings
            </span>

            {(searchTerm || statusFilter !== 'All' || categoryFilter !== 'All' || employmentTypeFilter !== 'All') && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center space-x-1 font-semibold text-indigo-600 hover:text-indigo-800 transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Job Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonLoader key={i} />
            ))}
          </div>
        ) : paginatedJobs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedJobs.map((job) => (
                <JobPostCard
                  key={job.id}
                  job={job}
                  onEdit={handleOpenEdit}
                  onDelete={handleOpenDelete}
                  onToggleStatus={handleToggleStatus}
                  isRecruiter={isRecruiter}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  Showing page <span className="font-bold text-slate-800">{currentPage}</span> of{' '}
                  <span className="font-bold text-slate-800">{totalPages}</span> ({filteredJobs.length} total jobs)
                </span>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-xl text-xs font-bold transition ${
                          currentPage === pageNum
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            icon={Briefcase}
            title="No Job Postings Found"
            description="No job postings match your active search and filter criteria. Try adjusting your parameters or create a new job."
            actionLabel="Create Job Posting"
            onAction={handleOpenAdd}
          />
        )}
      </div>

      {/* Create / Edit Modal */}
      <JobPostModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSaveJob}
        jobToEdit={jobToEdit}
      />

      {/* Delete Confirmation Modal */}
      <JobDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        jobTitle={jobToDelete?.title}
        isDeleting={isDeleting}
      />
    </DashboardLayout>
  );
}
