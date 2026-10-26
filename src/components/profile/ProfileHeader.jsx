import React from 'react';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Edit3, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export default function ProfileHeader({ profile, completeness, onOpenEdit }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden relative">
      
      {/* Decorative Cover Banner */}
      <div className="h-32 sm:h-40 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 relative">
        <div className="absolute top-0 right-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-3 right-4 sm:right-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Verified Candidate Profile</span>
          </span>
        </div>
      </div>

      {/* Main Avatar & Profile Info Bar */}
      <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0 relative">
        
        {/* Avatar + Edit button row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-4">
          <div className="relative">
            <img
              src={profile?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240'}
              alt={profile?.fullName}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                  profile?.fullName || 'Candidate'
                )}`;
              }}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-white shadow-md bg-white shrink-0"
            />
            <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              type="button"
              onClick={onOpenEdit}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Profile Identity Details */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-1">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {profile?.fullName || 'Candidate Name'}
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3 h-3" /> Ready to Interview
              </span>
            </div>

            <p className="text-sm font-semibold text-indigo-600">
              {profile?.headline || 'Tech Professional'}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {profile?.email}
              </span>
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {profile?.phone}
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {profile?.address}
              </span>
            </div>
          </div>

          {/* Profile Completeness Gauge */}
          <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl min-w-[220px] self-start lg:self-auto">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-700">Profile Completeness</span>
              <span className="text-indigo-600 font-extrabold">{completeness}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-1.5">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${completeness}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400">
              {completeness >= 90 ? 'Excellent! Visible to verified recruiters' : 'Add remaining sections to reach 100%'}
            </p>
          </div>
        </div>

        {/* Bio Paragraph */}
        {profile?.bio && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl whitespace-pre-line">
              {profile.bio}
            </p>
          </div>
        )}

        {/* Social / Portfolio Links */}
        {profile?.socialLinks && (
          <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-slate-100 text-xs">
            {profile.socialLinks.github && (
              <a
                href={profile.socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="text-slate-600 hover:text-indigo-600 font-semibold flex items-center gap-1"
              >
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            )}
            {profile.socialLinks.linkedin && (
              <a
                href={profile.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-slate-600 hover:text-indigo-600 font-semibold flex items-center gap-1"
              >
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            )}
            {profile.socialLinks.portfolio && (
              <a
                href={profile.socialLinks.portfolio}
                target="_blank"
                rel="noreferrer"
                className="text-slate-600 hover:text-indigo-600 font-semibold flex items-center gap-1"
              >
                <span>Portfolio</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
