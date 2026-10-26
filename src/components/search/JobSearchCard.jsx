import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Calendar, 
  Bookmark, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Clock,
  Send
} from 'lucide-react';
import { storage } from '../../utils/localStorage';
import { toast } from 'react-toastify';

export default function JobSearchCard({ job, onQuickApply, isSaved, onToggleSave }) {
  const isOpen = job.status === 'Open';

  // Check if closing soon
  const isClosingSoon = () => {
    if (!job.applicationDeadline) return false;
    const diff = new Date(job.applicationDeadline).getTime() - new Date().getTime();
    const days = diff / (1000 * 3600 * 24);
    return days >= 0 && days <= 7;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all p-5 flex flex-col justify-between group relative overflow-hidden">
      
      {/* Top Section */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center space-x-3 min-w-0">
            <img
              src={job.companyLogo}
              alt={job.company}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(job.company)}`;
              }}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100 shrink-0"
            />
            <div className="min-w-0">
              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                {job.title}
              </h3>
              <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{job.company}</span>
                <span>•</span>
                <span className="text-indigo-600 font-medium">{job.category}</span>
              </div>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={() => onToggleSave(job)}
            className={`p-2 rounded-xl border transition shrink-0 ${
              isSaved
                ? 'bg-purple-50 text-purple-600 border-purple-200 shadow-2xs'
                : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border-slate-200/80'
            }`}
            title={isSaved ? 'Remove from Saved Jobs' : 'Save Job Opportunity'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-purple-600' : ''}`} />
          </button>
        </div>

        {/* Badges: Salary, Location, Type, Level */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3 text-[11px]">
          <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/80">
            {job.salaryRange}
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
            {job.employmentType}
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-medium">
            {job.experienceLevel}
          </span>
          <span className="inline-flex items-center gap-1 text-slate-500 font-medium ml-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span>{job.location}</span>
          </span>
        </div>

        {/* Job Description Excerpt */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
          {job.description}
        </p>

        {/* Required Skills Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
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
      </div>

      {/* Card Footer: Metadata & Actions */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Posted {job.postedDate || 'recently'}</span>
          </span>
          <span>•</span>
          <span className={isClosingSoon() ? 'text-amber-600 font-bold' : ''}>
            Deadline: {job.applicationDeadline}
          </span>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <Link
            to={`/jobs/${job.id}`}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
          >
            View Details
          </Link>
          <button
            type="button"
            onClick={() => onQuickApply(job)}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs hover:shadow-indigo-600/20 transition flex items-center gap-1"
          >
            <Send className="w-3 h-3" />
            <span>Quick Apply</span>
          </button>
        </div>
      </div>
    </div>
  );
}
