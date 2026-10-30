import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Clock, 
  Bookmark, 
  Trash2, 
  ArrowRight, 
  Briefcase,
  CheckCircle2,
  Calendar,
  UserCheck
} from 'lucide-react';

export default function SavedJobCard({ job, onApply, onRemove, isRecruiter = false }) {
  const formattedSavedDate = job.savedAt
    ? new Date(job.savedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : 'Recently';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-200 shadow-xs hover:shadow-md transition-all duration-200 p-5 group flex flex-col justify-between">
      
      <div>
        {/* Top Info Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start space-x-3.5 min-w-0">
            <img
              src={job.companyLogo}
              alt={job.company}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(job.company || 'Job')}`;
              }}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100 shrink-0 bg-slate-50"
            />
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                {job.category || 'Engineering'}
              </span>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition truncate mt-1">
                {job.title}
              </h3>
              <p className="text-xs font-semibold text-slate-600 truncate">
                {job.company}
              </p>
            </div>
          </div>

          {/* Remove from Saved Bookmark Button */}
          <button
            onClick={() => onRemove(job.id)}
            className="p-2 rounded-xl text-amber-500 hover:text-rose-600 hover:bg-rose-50 transition shrink-0"
            title={isRecruiter ? "Remove from Shortlist" : "Remove from saved jobs"}
          >
            <Bookmark className="w-5 h-5 fill-amber-400 stroke-amber-500 hover:fill-none hover:stroke-rose-600" />
          </button>
        </div>

        {/* Badges / Meta row */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            <DollarSign className="w-3.5 h-3.5" />
            <span>{job.salaryRange}</span>
          </span>

          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span>{job.location}</span>
          </span>

          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
            <Briefcase className="w-3 h-3 text-slate-400" />
            <span>{job.employmentType}</span>
          </span>
        </div>

        {/* Required skills */}
        {job.requiredSkills && job.requiredSkills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {job.requiredSkills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md"
              >
                {skill}
              </span>
            ))}
            {job.requiredSkills.length > 4 && (
              <span className="text-[10px] text-slate-400 font-medium self-center">
                +{job.requiredSkills.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Deadline and saved time */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Saved {formattedSavedDate}
          </span>
          {job.applicationDeadline && (
            <span className="text-slate-500 font-medium">
              Deadline: {job.applicationDeadline}
            </span>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <Link
          to={`/jobs/${job.id}`}
          className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition flex items-center gap-1"
        >
          <span>View Job Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {isRecruiter ? (
          <Link
            to={`/jobs/${job.id}`}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Hire for this Role</span>
          </Link>
        ) : (
          <button
            onClick={() => onApply(job)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs hover:shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Apply Now</span>
          </button>
        )}
      </div>
    </div>
  );
}