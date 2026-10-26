import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import CompanyCard from '../components/companies/CompanyCard';
import CompanyFilters from '../components/companies/CompanyFilters';
import CompanyModal from '../components/companies/CompanyModal';
import DeleteConfirmModal from '../components/companies/DeleteConfirmModal';
import SkeletonLoader from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';
import { companyService } from '../services/companyService';
import { 
  Building2, 
  Plus, 
  Sparkles, 
  Briefcase, 
  Globe, 
  MapPin, 
  ChevronLeft, 
  ChevronRight,
  RotateCw,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';

const ITEMS_PER_PAGE = 6;

export default function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companyToEdit, setCompanyToEdit] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch companies from service (Third-Party API + LocalStorage)
  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await companyService.getCompanies();
      setCompanies(data);
    } catch (err) {
      console.error('Failed to load companies:', err);
      setError('Failed to load companies from API. Please try again.');
      toast.error('Error fetching companies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Compute available industry options
  const industries = useMemo(() => {
    const set = new Set();
    companies.forEach((c) => {
      if (c.industry) set.add(c.industry);
    });
    return Array.from(set).sort();
  }, [companies]);

  // Filter and sort companies
  const filteredCompanies = useMemo(() => {
    let result = [...companies];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.location.toLowerCase().includes(term) ||
          c.description.toLowerCase().includes(term) ||
          c.industry.toLowerCase().includes(term)
      );
    }

    // Industry filter
    if (selectedIndustry !== 'All') {
      result = result.filter((c) => c.industry === selectedIndustry);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'name-desc') {
        return b.name.localeCompare(a.name);
      }
      if (sortBy === 'jobs-desc') {
        return (b.openJobsCount || 0) - (a.openJobsCount || 0);
      }
      if (sortBy === 'newest') {
        return (b.foundedYear || 0) - (a.foundedYear || 0);
      }
      return 0;
    });

    return result;
  }, [companies, searchTerm, selectedIndustry, sortBy]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedIndustry, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE) || 1;
  const paginatedCompanies = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCompanies.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCompanies, currentPage]);

  // Handlers for Add & Edit
  const handleOpenAddModal = () => {
    setCompanyToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (comp) => {
    setCompanyToEdit(comp);
    setIsModalOpen(true);
  };

  const handleSaveCompany = async (formData) => {
    try {
      if (companyToEdit) {
        // Edit existing
        const updated = await companyService.updateCompany(companyToEdit.id, formData);
        setCompanies((prev) =>
          prev.map((c) => (String(c.id) === String(updated.id) ? updated : c))
        );
        toast.success(`Company "${updated.name}" updated successfully!`);
      } else {
        // Add new
        const created = await companyService.addCompany(formData);
        setCompanies((prev) => [created, ...prev]);
        toast.success(`Company "${created.name}" registered successfully!`);
      }
    } catch (err) {
      toast.error(err.message || 'Action failed');
    }
  };

  // Handlers for Delete
  const handleOpenDeleteModal = (comp) => {
    setCompanyToDelete(comp);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!companyToDelete) return;
    setIsDeleting(true);
    try {
      await companyService.deleteCompany(companyToDelete.id);
      setCompanies((prev) => prev.filter((c) => String(c.id) !== String(companyToDelete.id)));
      toast.success(`Company "${companyToDelete.name}" removed from directory.`);
      setDeleteModalOpen(false);
      setCompanyToDelete(null);
    } catch (err) {
      toast.error('Failed to delete company');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedIndustry('All');
    setSortBy('name-asc');
  };

  // Quick stats
  const totalOpenJobs = companies.reduce((acc, c) => acc + (c.openJobsCount || 0), 0);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Top Header Banner */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Module 3: Third-Party API Enterprise Directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Company Management Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Browse, filter, and manage partner companies integrated via third-party REST API. Add new hiring partners, update corporate headquarters, and track active vacancies.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Company</span>
            </button>
          </div>
        </div>

        {/* Highlight Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-semibold text-slate-400 block mb-1">Partner Companies</span>
            <div className="flex items-center justify-between">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900">{companies.length}</span>
              <Building2 className="w-4 h-4 text-indigo-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-semibold text-slate-400 block mb-1">Active Verticals</span>
            <div className="flex items-center justify-between">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900">{industries.length}</span>
              <Globe className="w-4 h-4 text-purple-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-semibold text-slate-400 block mb-1">Open Positions</span>
            <div className="flex items-center justify-between">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900">{totalOpenJobs}</span>
              <Briefcase className="w-4 h-4 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-semibold text-slate-400 block mb-1">API Status</span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Connected 200 OK
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Filters & Search Component */}
        <CompanyFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedIndustry={selectedIndustry}
          onIndustryChange={setSelectedIndustry}
          sortBy={sortBy}
          onSortChange={setSortBy}
          industries={industries}
          totalResults={filteredCompanies.length}
          onReset={handleResetFilters}
        />

        {/* Error Alert if any */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchCompanies}
              className="font-bold underline text-rose-900 hover:text-rose-950"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Company Cards Grid or Skeleton Loader */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonLoader key={i} />
            ))}
          </div>
        ) : paginatedCompanies.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedCompanies.map((company) => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  onEdit={handleOpenEditModal}
                  onDelete={handleOpenDeleteModal}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  Showing page <span className="font-bold text-slate-800">{currentPage}</span> of{' '}
                  <span className="font-bold text-slate-800">{totalPages}</span> (
                  {filteredCompanies.length} total companies)
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
            icon={Building2}
            title="No Companies Found"
            description={
              searchTerm || selectedIndustry !== 'All'
                ? 'No companies match your search and industry filter parameters.'
                : 'No companies are currently registered in the database.'
            }
            actionLabel="Clear Filters & Search"
            onAction={handleResetFilters}
          />
        )}
      </div>

      {/* Add / Edit Company Modal */}
      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveCompany}
        companyToEdit={companyToEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        companyName={companyToDelete?.name}
        isDeleting={isDeleting}
      />
    </DashboardLayout>
  );
}
