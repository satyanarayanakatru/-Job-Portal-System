import React from 'react';
import { Search, Filter, ArrowUpDown, X, RotateCcw } from 'lucide-react';

export default function CompanyFilters({
  searchTerm,
  onSearchChange,
  selectedIndustry,
  onIndustryChange,
  sortBy,
  onSortChange,
  industries,
  totalResults,
  onReset,
}) {
  const isFiltered = searchTerm || selectedIndustry !== 'All' || sortBy !== 'name-asc';

  return (
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
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search company by name, keyword, or city..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter by Industry */}
        <div className="flex items-center space-x-2">
          <div className="relative min-w-[180px]">
            <select
              value={selectedIndustry}
              onChange={(e) => onIndustryChange(e.target.value)}
              className="w-full pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
            >
              <option value="All">All Industries</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {/* Sort by Company Name / Jobs */}
          <div className="relative min-w-[180px]">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
            >
              <option value="name-asc">Sort: Name (A to Z)</option>
              <option value="name-desc">Sort: Name (Z to A)</option>
              <option value="jobs-desc">Sort: Most Open Jobs</option>
              <option value="newest">Sort: Newly Registered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count & Reset Link */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
        <div>
          Showing <span className="font-bold text-slate-800">{totalResults}</span> companies matching criteria
        </div>

        {isFiltered && (
          <button
            onClick={onReset}
            className="inline-flex items-center space-x-1 font-semibold text-indigo-600 hover:text-indigo-800 transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
