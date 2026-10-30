import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import JobSearchCard from '../components/search/JobSearchCard';
import JobSearchFilters from '../components/search/JobSearchFilters';
import QuickApplyModal from '../components/search/QuickApplyModal';
import SkeletonLoader from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';
import { jobService } from '../services/jobService';
import { storage } from '../utils/localStorage';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Sparkles, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  CheckCircle2,
  BookmarkCheck,
  TrendingUp,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { toast } from 'react-toastify';

const ITEMS_PER_PAGE = 6;

export default function JobSearch() {
  const { user } = useAuth();
  const isRecruiter = user?.role === 'recruiter';
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [keyword, setKeyword] = useState('');
  const [locationKeyword, setLocationKeyword] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedExperience, setSelectedExperience] = useState('All Levels');
  const [selectedSalaryMin, setSelectedSalaryMin] = useState(0);
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Saved Jobs tracking
  const [savedJobs, setSavedJobs] = useState(() => storage.get('job_portal_saved_jobs', []));

  // Quick Apply Modal
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedJobToApply, setSelectedJobToApply] = useState(null);

  // Fetch jobs from service
  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await jobService.getJobs();
      setJobs(data);
    } catch (err) {
      toast.error('Failed to load active jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  // Sync saved jobs with Local Storage
  const handleToggleSaveJob = (job) => {
    const isAlreadySaved = savedJobs.some((j) => String(j.id) === String(job.id));
    let updated;
    if (isAlreadySaved) {
      updated = savedJobs.filter((j) => String(j.id) !== String(job.id));
      toast.info(`Removed "${job.title}" from Saved Jobs`);
    } else {
      updated = [job, ...savedJobs];
      toast.success(`Saved "${job.title}" to your Saved Jobs list!`);
    }
    setSavedJobs(updated);
    storage.set('job_portal_saved_jobs', updated);
  };

  // Open Quick Apply modal
  const handleOpenQuickApply = (job) => {
    setSelectedJobToApply(job);
    setApplyModalOpen(true);
  };

  // Extract numeric salary for comparison
  const extractSalaryNumber = (salaryStr) => {
    if (!salaryStr) return 0;
    const match = salaryStr.replace(/,/g, '').match(/\$?(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let result = jobs.filter((j) => j.status === 'Open'); // By default candidate searches open roles

    // Keyword Search (title, company, description, skills)
    if (keyword.trim()) {
      const kw = keyword.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(kw) ||
          j.company.toLowerCase().includes(kw) ||
          j.description.toLowerCase().includes(kw) ||
          (j.requiredSkills || []).some((s) => s.toLowerCase().includes(kw))
      );
    }

    // Location search from top bar
    if (locationKeyword.trim()) {
      const loc = locationKeyword.toLowerCase();
      result = result.filter((j) => j.location.toLowerCase().includes(loc));
    }

    // Sidebar Location Filter
    if (selectedLocation !== 'All Locations') {
      result = result.filter((j) =>
        j.location.toLowerCase().includes(selectedLocation.toLowerCase().replace('all locations', ''))
      );
    }

    // Employment Type Filter
    if (selectedType !== 'All Types') {
      result = result.filter((j) => j.employmentType.toLowerCase() === selectedType.toLowerCase());
    }

    // Experience Level Filter
    if (selectedExperience !== 'All Levels') {
      result = result.filter((j) => j.experienceLevel.toLowerCase().includes(selectedExperience.toLowerCase().split(' ')[0]));
    }

    // Salary Min Filter
    if (selectedSalaryMin > 0) {
      result = result.filter((j) => {
        const salNum = extractSalaryNumber(j.salaryRange);
        return salNum >= selectedSalaryMin;
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.postedDate || 0).getTime() - new Date(a.postedDate || 0).getTime();
      }
      if (sortBy === 'salary-desc') {
        return extractSalaryNumber(b.salaryRange) - extractSalaryNumber(a.salaryRange);
      }
      if (sortBy === 'popular') {
        return (b.applicantsCount || 0) - (a.applicantsCount || 0);
      }
      if (sortBy === 'company-asc') {
        return a.company.localeCompare(b.company);
      }
      return 0;
    });

    return result;
  }, [
    jobs,
    keyword,
    locationKeyword,
    selectedLocation,
    selectedType,
    selectedExperience,
    selectedSalaryMin,
    sortBy,
  ]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    keyword,
    locationKeyword,
    selectedLocation,
    selectedType,
    selectedExperience,
    selectedSalaryMin,
    sortBy,
  ]);

  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE) || 1;
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredJobs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredJobs, currentPage]);

  const handleResetFilters = () => {
    setKeyword('');
    setLocationKeyword('');
    setSelectedLocation('All Locations');
    setSelectedType('All Types');
    setSelectedExperience('All Levels');
    setSelectedSalaryMin(0);
    setSortBy('latest');
  };

  const isFiltered = Boolean(
    keyword ||
      locationKeyword ||
      selectedLocation !== 'All Locations' ||
      selectedType !== 'All Types' ||
      selectedExperience !== 'All Levels' ||
      selectedSalaryMin > 0 ||
      sortBy !== 'latest'
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
          <Link
            to="/jobs/search"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow-xs transition flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Job Search Engine</span>
          </Link>
          <Link
            to="/jobs"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition flex items-center gap-1.5"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Manage Postings</span>
          </Link>
        </div>

        {/* Hero Search Bar Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-time Multi-Filter Job Search Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Find Your Next High-Impact Tech Career
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Search verified roles by location, job category, salary range, and tech stack. Apply with one click or bookmark opportunities for later.
            </p>

            {/* Global Search Bar */}
            <div className="pt-2">
              <div className="bg-white p-2 rounded-2xl shadow-xl flex flex-col md:flex-row items-stretch md:items-center gap-2 text-slate-800">
                
                {/* Keyword search */}
                <div className="flex-1 flex items-center px-3 py-1.5 border-b md:border-b-0 md:border-r border-slate-200">
                  <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Job title, tech skills (React, AWS), or company..."
                    className="w-full text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden"
                  />
                  {keyword && (
                    <button onClick={() => setKeyword('')} className="text-slate-400 hover:text-slate-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Location search */}
                <div className="flex-1 flex items-center px-3 py-1.5">
                  <MapPin className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={locationKeyword}
                    onChange={(e) => setLocationKeyword(e.target.value)}
                    placeholder="City, state, or 'Remote'..."
                    className="w-full text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden"
                  />
                  {locationKeyword && (
                    <button onClick={() => setLocationKeyword('')} className="text-slate-400 hover:text-slate-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentPage(1)}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/25 transition shrink-0"
                >
                  Find Jobs
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Bar with Sort & Mobile Filter Toggle */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
              <span>Filters</span>
            </button>
            <span className="text-xs text-slate-600 font-medium">
              Found <span className="font-extrabold text-slate-900">{filteredJobs.length}</span> verified tech opportunities
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-medium shrink-0">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
            >
              <option value="latest">Latest Jobs (Newest)</option>
              <option value="salary-desc">Highest Salary</option>
              <option value="popular">Most Popular (Applicants)</option>
              <option value="company-asc">Company (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Search Engine Layout: Filters Sidebar + Job Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Filter Panel (Desktop & Mobile Drawer) */}
          <div className={`lg:col-span-4 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <JobSearchFilters
              selectedLocation={selectedLocation}
              onLocationChange={setSelectedLocation}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              selectedExperience={selectedExperience}
              onExperienceChange={setSelectedExperience}
              selectedSalaryMin={selectedSalaryMin}
              onSalaryMinChange={setSelectedSalaryMin}
              onResetFilters={handleResetFilters}
              isFiltered={isFiltered}
            />
          </div>

          {/* Right Column: Job Cards Grid */}
          <div className="lg:col-span-8 space-y-4">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonLoader key={i} />
                ))}
              </div>
            ) : paginatedJobs.length > 0 ? (
              <>
                <div className="space-y-4">
                  {paginatedJobs.map((job) => (
                    <JobSearchCard
                      key={job.id}
                      job={job}
                      onQuickApply={handleOpenQuickApply}
                      isSaved={savedJobs.some((j) => String(j.id) === String(job.id))}
                      onToggleSave={handleToggleSaveJob}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
                    <span className="text-xs text-slate-500">
                      Page <span className="font-bold text-slate-800">{currentPage}</span> of{' '}
                      <span className="font-bold text-slate-800">{totalPages}</span>
                    </span>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition"
                        title="Previous Page"
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
                        title="Next Page"
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
                title="No Matching Tech Jobs"
                description="We couldn't find any job openings matching your search and filter parameters. Try loosening your salary or location filters."
                actionLabel="Reset Search & Filters"
                onAction={handleResetFilters}
              />
            )}
          </div>
        </div>
      </div>

      {/* Quick Apply Modal */}
      <QuickApplyModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        job={selectedJobToApply}
        onApplied={() => loadJobs()}
      />
    </DashboardLayout>
  );
}
