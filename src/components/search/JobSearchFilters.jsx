import React from 'react';
import { 
  Filter, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Users, 
  RotateCcw, 
  Check, 
  Sparkles 
} from 'lucide-react';

const LOCATIONS = [
  'All Locations',
  'Remote (Worldwide)',
  'San Francisco, CA',
  'New York, NY',
  'Austin, TX',
  'Boston, MA',
  'Seattle, WA',
  'San Diego, CA',
];

const EMPLOYMENT_TYPES = [
  'All Types',
  'Full Time',
  'Part Time',
  'Remote',
  'Contract',
  'Internship',
];

const EXPERIENCE_LEVELS = [
  'All Levels',
  'Entry Level (0-2 yrs)',
  'Mid Level (3-5 yrs)',
  'Senior Level (5-8 yrs)',
  'Lead / Principal (8+ yrs)',
];

const SALARY_RANGES = [
  { label: 'Any Salary', min: 0 },
  { label: '$80,000+ / yr', min: 80000 },
  { label: '$120,000+ / yr', min: 120000 },
  { label: '$150,000+ / yr', min: 150000 },
  { label: '$180,000+ / yr', min: 180000 },
];

export default function JobSearchFilters({
  selectedLocation,
  onLocationChange,
  selectedType,
  onTypeChange,
  selectedExperience,
  onExperienceChange,
  selectedSalaryMin,
  onSalaryMinChange,
  onResetFilters,
  isFiltered,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-600" />
          <span>Filters & Preferences</span>
        </h3>
        {isFiltered && (
          <button
            onClick={onResetFilters}
            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Filter 1: Location */}
      <div>
        <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-indigo-500" />
          <span>Location</span>
        </label>
        <select
          value={selectedLocation}
          onChange={(e) => onLocationChange(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 font-medium"
        >
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Filter 2: Employment Type */}
      <div>
        <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
          <span>Employment Type</span>
        </label>
        <div className="space-y-1.5">
          {EMPLOYMENT_TYPES.map((type) => (
            <label
              key={type}
              className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition ${
                selectedType === type
                  ? 'bg-indigo-50/80 text-indigo-900 font-bold border border-indigo-200'
                  : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="employmentType"
                  checked={selectedType === type}
                  onChange={() => onTypeChange(type)}
                  className="w-3.5 h-3.5 text-indigo-600 focus:ring-indigo-500"
                />
                <span>{type}</span>
              </div>
              {selectedType === type && <Check className="w-3.5 h-3.5 text-indigo-600" />}
            </label>
          ))}
        </div>
      </div>

      {/* Filter 3: Experience Level */}
      <div>
        <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-indigo-500" />
          <span>Experience Level</span>
        </label>
        <div className="space-y-1.5">
          {EXPERIENCE_LEVELS.map((lvl) => (
            <label
              key={lvl}
              className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition ${
                selectedExperience === lvl
                  ? 'bg-indigo-50/80 text-indigo-900 font-bold border border-indigo-200'
                  : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="experienceLevel"
                  checked={selectedExperience === lvl}
                  onChange={() => onExperienceChange(lvl)}
                  className="w-3.5 h-3.5 text-indigo-600 focus:ring-indigo-500"
                />
                <span>{lvl}</span>
              </div>
              {selectedExperience === lvl && <Check className="w-3.5 h-3.5 text-indigo-600" />}
            </label>
          ))}
        </div>
      </div>

      {/* Filter 4: Minimum Salary Range */}
      <div>
        <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
          <span>Minimum Salary</span>
        </label>
        <div className="space-y-1.5">
          {SALARY_RANGES.map((sal) => (
            <label
              key={sal.min}
              className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition ${
                selectedSalaryMin === sal.min
                  ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                  : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="salaryMin"
                  checked={selectedSalaryMin === sal.min}
                  onChange={() => onSalaryMinChange(sal.min)}
                  className="w-3.5 h-3.5 text-emerald-600 focus:ring-emerald-500"
                />
                <span>{sal.label}</span>
              </div>
              {selectedSalaryMin === sal.min && <Check className="w-3.5 h-3.5 text-emerald-600" />}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
