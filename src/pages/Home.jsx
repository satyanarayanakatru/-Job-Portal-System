import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  Building2, 
  Users, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2, 
  ChevronRight,
  UserCheck,
  Star,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  const categories = [
    { title: 'Software Engineering', openJobs: '4,120+ Jobs', icon: Briefcase, color: 'text-indigo-600 bg-indigo-50' },
    { title: 'Product & Design', openJobs: '1,840+ Jobs', icon: Sparkles, color: 'text-violet-600 bg-violet-50' },
    { title: 'Data & AI / ML', openJobs: '2,950+ Jobs', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
    { title: 'DevOps & Cloud', openJobs: '1,210+ Jobs', icon: Layers, color: 'text-sky-600 bg-sky-50' },
  ];

  const featuredCompanies = [
    'TechCorp', 'NexaCloud', 'Quantum AI', 'Apex Health', 'Stripe Horizon', 'Veloce Data'
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-100/50 via-slate-50 to-transparent blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-200/80 shadow-xs text-xs font-semibold text-indigo-700">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Next-Gen Enterprise Recruitment Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Connect with Careers that <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-800">
                Shape the Future
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              JobSphere connects ambitious candidates with elite tech enterprises. Role-based static authentication with secure local storage, real-time validations, and seamless onboarding.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2"
                >
                  <span>Go to My Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 transition flex items-center justify-center gap-2"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Join as Candidate</span>
                  </Link>
                  <Link
                    to="/login"
                    className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 rounded-2xl text-sm font-bold shadow-2xs transition flex items-center justify-center gap-2"
                  >
                    <Building2 className="w-4 h-4 text-purple-600" />
                    <span>Recruiter Portal Access</span>
                  </Link>
                </>
              )}
            </div>

            {/* Quick Demo Credentials Info Box */}
            <div className="pt-4 max-w-xl mx-auto">
              <div className="p-3 bg-white/80 backdrop-blur-xs rounded-2xl border border-slate-200 text-xs text-slate-500 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="font-semibold text-slate-700">Module 1 (Auth) Ready:</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline"
                  >
                    Test Candidate / Recruiter Login &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Logos */}
          <div className="mt-16 text-center">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-4">
              Trusted by 3,200+ forward-thinking teams worldwide
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-70">
              {featuredCompanies.map((c, i) => (
                <span key={i} className="font-bold text-sm sm:text-base text-slate-600 tracking-tight">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
                Explore Specializations
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Popular Career Disciplines
              </h2>
            </div>
            <Link
              to="/login"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Explore all 80+ categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all group bg-slate-50/50 hover:bg-white"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${cat.color} group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">{cat.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">{cat.openJobs}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Project Modules Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
              Development Roadmap
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              System Architecture & Modules
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Module 1 is completely operational with full validation, role switching, password management, and protected routes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { id: '1', title: 'Authentication', desc: 'Login, Register, Role Selector, Forgot Password, Protected Routes, LocalStorage', status: 'Active & Verified', active: true },
              { id: '2', title: 'Dashboard', desc: 'Metrics, Recent activities, Quick action cards, Role statistics', status: 'Next Up', active: false },
              { id: '3', title: 'Company Management', desc: 'CRUD, 3rd party API, Industry filters, Pagination', status: 'Pending', active: false },
              { id: '4', title: 'Job Posting', desc: 'Recruiter job creator, salary range, deadlines, status toggle', status: 'Pending', active: false },
              { id: '5', title: 'Job Search', desc: 'Multi-filter candidate search, location, job type, details view', status: 'Pending', active: false },
              { id: '6', title: 'Candidate Profile', desc: 'Experience, education, skills, resume upload UI', status: 'Pending', active: false },
              { id: '7', title: 'Applications & Saved Jobs', desc: 'Apply flow, saved jobs list, withdrawal simulation', status: 'Pending', active: false },
              { id: '8', title: 'Reports & Analytics', desc: 'Job trends, candidate ratios, interactive visual charts', status: 'Pending', active: false },
            ].map((m) => (
              <div
                key={m.id}
                className={`p-5 rounded-2xl border transition-all ${
                  m.active
                    ? 'bg-white border-emerald-300 shadow-md ring-2 ring-emerald-500/10'
                    : 'bg-white/60 border-slate-200/80 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    m.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    Module {m.id}
                  </span>
                  {m.active && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{m.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">{m.desc}</p>
                <div className="pt-2 border-t border-slate-100 text-[11px] font-medium text-slate-400">
                  Status: <span className={m.active ? 'text-emerald-600 font-semibold' : ''}>{m.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
