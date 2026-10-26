import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Users, 
  Edit3, 
  Trash2, 
  ArrowRight,
  Clock,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export default function JobPostCard({ job, onEdit, onDelete, onToggleStatus }) {
  const isOpen = job.status === 'Open';

  // Check if deadline is approaching
  const isClosingSoon = () => {
    if (!job.applicationDeadline) return false;
    const diff = new Date(job.applicationDeadline).getTime() - new Date().getTime();
    const days = diff / (1000 * 3600 * 24);
    return days >= 0 && days <= 7;
  };

  return (
    <div className={`bg-white rounded-2xl border transition-all flex flex-col justify-between group overflow-hidden ${
      isOpen ? 'border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-300' : 'border-slate-200 bg-slate-50/50 opacity-90'
    }`}>
      
      {/* Top Section */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center space-x-3 min-w-0">
            <img
              src={job.companyLogo}
              alt={job.company}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(job.company)}`;
              }}
              className="w-11 h-11 rounded-xl object-cover ring-2 ring-slate-100 shrink-0"
            />
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                {job.title}
              </h3>
              <p className="text-xs font-semibold text-slate-500 truncate">
                {job.company} • {job.category}
              </p>
            </div>
          </div>

          {/* Quick Edit & Delete Icons */}
          <div className="flex items-center space-x-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(job)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
              title="Edit Job"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(job)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
              title="Delete Job"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Badges Row: Employment Type, Experience, Location */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3 text-[11px]">
          <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100/80">
            {job.employmentType}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
            {job.experienceLevel}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold">
            {job.salaryRange}
          </span>
          <span className="inline-flex items-center gap-0.5 text-slate-500 font-medium">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span>{job.location}</span>
          </span>
        </div>

        {/* Required Skills Chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {(job.requiredSkills || []).slice(0, 4).map((skill, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-200/80 text-[10px] font-semibold text-slate-600"
            >
              {skill}
            </span>
          ))}
          {(job.requiredSkills || []).length > 4 && (
            <span className="text-[10px] text-slate-400 font-medium self-center">
              +{job.requiredSkills.length - 4} more
            </span>
          )}
        </div>

        {/* Deadline & Applicants Count */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px]">
              Deadline: <span className={`font-semibold ${isClosingSoon() ? 'text-amber-600 font-bold' : 'text-slate-700'}`}>{job.applicationDeadline}</span>
            </span>
            {isClosingSoon() && (
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                Closing Soon
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1 text-slate-600 font-medium text-[11px]">
            <Users className="w-3.5 h-3.5 text-indigo-500" />
            <span>{job.applicantsCount || 0} Applicants</span>
          </div>
        </div>
      </div>

      {/* Footer Bar: Status Toggle & Details Link */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        {/* Status Toggle Button */}
        <button
          type="button"
          onClick={() => onToggleStatus(job.id)}
          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition ${
            isOpen
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200/70'
              : 'bg-slate-200 text-slate-700 border border-slate-300 hover:bg-slate-300'
          }`}
          title="Click to toggle status between Open and Closed"
        >
          {isOpen ? <ToggleRight className="w-4 h-4 text-emerald-600" /> : <ToggleLeft className="w-4 h-4 text-slate-500" />}
          <span>{job.status}</span>
        </button>

        <Link
          to={`/jobs/${job.id}`}
          className="inline-flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
        >
          <span>View Job Details</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
