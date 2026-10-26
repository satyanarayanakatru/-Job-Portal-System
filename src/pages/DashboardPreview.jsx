import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  UserCheck, 
  Building2, 
  Briefcase, 
  ShieldCheck, 
  LogOut, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Mail, 
  Phone, 
  ArrowUpRight,
  BookmarkCheck,
  FileText,
  BarChart3,
  Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPreview() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isRecruiter = user?.role === 'recruiter';

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Header & Role Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-100/40 via-purple-50/20 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center space-x-4">
              <div className="relative">
                <img
                  src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
                  alt={user?.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-indigo-50 border border-slate-200 shadow-sm"
                />
                <span
                  className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-white ${
                    isRecruiter ? 'bg-purple-600' : 'bg-emerald-500'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {user?.name || 'Authorized User'}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                      isRecruiter
                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                        : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {isRecruiter ? (
                      <>
                        <Building2 className="w-3 h-3" />
                        <span>Recruiter / Employer</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-3 h-3" />
                        <span>Job Candidate</span>
                      </>
                    )}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    <ShieldCheck className="w-3 h-3" /> Protected Route Active
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {user?.email}
                  </span>
                  {user?.company && (
                    <span className="flex items-center gap-1 text-indigo-600 font-semibold">
                      <Building2 className="w-3.5 h-3.5" />
                      {user.company}
                    </span>
                  )}
                  {user?.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {user.phone}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Session Active
                  </span>
                </div>
              </div>
            </div>

            {/* Logout button */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleLogout}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition shadow-2xs"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* LocalStorage Verified Banner */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Module 1 (Authentication) Fully Operational
              </h4>
              <p className="text-[11px] text-slate-600">
                Logged in successfully. Credentials and JWT mock token verified in browser's Local Storage.
              </p>
            </div>
          </div>
          <div className="text-[11px] font-mono text-emerald-800 bg-emerald-100/70 px-3 py-1.5 rounded-lg border border-emerald-300/60 self-start sm:self-auto truncate max-w-xs">
            Token: {user?.token?.substring(0, 24)}...
          </div>
        </div>

        {/* Dynamic Quick Stat Cards according to Role */}
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-3">
            {isRecruiter ? 'Recruitment Hub Overview' : 'Candidate Career Hub'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {isRecruiter ? (
              <>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">Active Job Openings</span>
                    <Briefcase className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900">12</h3>
                  <p className="text-[11px] text-emerald-600 mt-1 font-semibold flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" /> 2 posted this week
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">Total Applicants</span>
                    <FileText className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900">184</h3>
                  <p className="text-[11px] text-indigo-600 mt-1 font-semibold">
                    28 awaiting initial review
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">Shortlisted Candidates</span>
                    <UserCheck className="w-4 h-4 text-teal-600" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900">36</h3>
                  <p className="text-[11px] text-teal-600 mt-1 font-semibold">
                    8 interviews scheduled
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">Company Profile</span>
                    <Building2 className="w-4 h-4 text-amber-600" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900">98%</h3>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">
                    Profile completeness score
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">Applications Submitted</span>
                    <FileText className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900">7</h3>
                  <p className="text-[11px] text-emerald-600 mt-1 font-semibold flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" /> 2 in review stage
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">Saved Job Opportunities</span>
                    <BookmarkCheck className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900">14</h3>
                  <p className="text-[11px] text-purple-600 mt-1 font-semibold">
                    3 closing within 48 hours
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">Profile Views</span>
                    <UserCheck className="w-4 h-4 text-teal-600" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900">42</h3>
                  <p className="text-[11px] text-teal-600 mt-1 font-semibold">
                    +12 views this week
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">Resume Status</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900">Verified</h3>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">
                    Standard Tech CV attached
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Next Modules Guide Banner */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Next Upcoming Modules</h3>
              <p className="text-xs text-slate-500">
                Module 1 (Authentication) is fully complete. Tell me which module you want to develop next:
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
              Module 1 Completed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border border-slate-200/70 bg-slate-50/50">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block mb-1">
                Module 2
              </span>
              <h4 className="text-xs font-bold text-slate-900">Full Analytics Dashboard</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Detailed stats, recent activities, quick action cards, and charts.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/70 bg-slate-50/50">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block mb-1">
                Module 3
              </span>
              <h4 className="text-xs font-bold text-slate-900">Company Management</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Third-Party API integration, CRUD, industry filters, and details.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/70 bg-slate-50/50">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block mb-1">
                Module 4 & 5
              </span>
              <h4 className="text-xs font-bold text-slate-900">Job Posting & Job Search</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Posting jobs with salary/skills, multi-filter search, pagination.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
