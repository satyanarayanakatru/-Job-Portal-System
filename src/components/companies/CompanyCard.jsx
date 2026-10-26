import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Mail, 
  Users, 
  Briefcase, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function CompanyCard({ company, onEdit, onDelete }) {
  const getIndustryBadgeColor = (ind) => {
    switch (ind) {
      case 'Finance & FinTech':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Cloud Computing':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Artificial Intelligence':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Cybersecurity':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Healthcare & Biotech':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'E-Commerce':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between group overflow-hidden">
      
      {/* Top Banner / Info */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center space-x-3 min-w-0">
            <img
              src={company.logo}
              alt={company.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(company.name)}`;
              }}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100 shadow-2xs shrink-0"
            />
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                {company.name}
              </h3>
              <span
                className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mt-0.5 ${getIndustryBadgeColor(
                  company.industry
                )}`}
              >
                {company.industry}
              </span>
            </div>
          </div>

          {/* Quick Edit & Delete Icons */}
          <div className="flex items-center space-x-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(company)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
              title="Edit Company Details"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(company)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
              title="Delete Company"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Company Description */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
          {company.description}
        </p>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 mb-2">
          <div className="flex items-center space-x-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{company.location}</span>
          </div>
          <div className="flex items-center space-x-1.5 truncate">
            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{company.employees} staff</span>
          </div>
          <div className="flex items-center space-x-1.5 truncate">
            <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 hover:underline truncate"
            >
              {company.website.replace('https://', '').replace('http://', '')}
            </a>
          </div>
          <div className="flex items-center space-x-1.5 truncate">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{company.email}</span>
          </div>
        </div>
      </div>

      {/* Footer Bar */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
          <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
          <span>{company.openJobsCount || 4} Open Positions</span>
        </span>

        <Link
          to={`/companies/${company.id}`}
          className="inline-flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
        >
          <span>View Profile</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
