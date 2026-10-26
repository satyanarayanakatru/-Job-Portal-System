import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { 
  Briefcase, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  Building2, 
  Search, 
  UserCircle, 
  FileText, 
  BarChart3, 
  Sparkles 
} from 'lucide-react';
import { AuthProvider } from './context/AuthContext';

function StarterHome() {
  const modules = [
    { id: 1, title: 'Authentication', desc: 'Login, Register, Forgot Password, Role Selection, Protected Routes', icon: ShieldCheck, status: 'Ready to build' },
    { id: 2, title: 'Dashboard', desc: 'Stats, Quick Actions, Recent Activities, Responsive Overview', icon: Layers, status: 'Ready to build' },
    { id: 3, title: 'Company Management', desc: 'CRUD, 3rd-Party API, Industry Filter, Search, Details', icon: Building2, status: 'Ready to build' },
    { id: 4, title: 'Job Posting', desc: 'Create, Edit, Delete, Salary & Experience, Status Toggle', icon: Briefcase, status: 'Ready to build' },
    { id: 5, title: 'Job Search', desc: 'Multi-filter Search, Experience, Salary, Pagination, Detail View', icon: Search, status: 'Ready to build' },
    { id: 6, title: 'Candidate Profile', desc: 'Profile Management, Skills, Education, Resume Upload UI', icon: UserCircle, status: 'Ready to build' },
    { id: 7, title: 'Applications & Saved Jobs', desc: 'Apply, Saved Jobs, Status Tracking, Withdraw UI', icon: FileText, status: 'Ready to build' },
    { id: 8, title: 'Reports & Analytics', desc: 'Summary Cards, Application Stats, Charts & Visuals', icon: BarChart3, status: 'Ready to build' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-900 leading-tight">JobPortal</h1>
              <p className="text-xs text-slate-500 font-medium">Enterprise Job Management System</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => toast.success('Vite + Tailwind CSS + Toastify is working smoothly!')}
              className="inline-flex items-center space-x-2 text-xs font-semibold px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200/60"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Test Toast Notification</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero / Status Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-medium mb-3">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Base Project Scaffolded & Configured</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Basic Vite Project Setup Complete</h2>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                Configured with <strong>React 19</strong>, <strong>Tailwind CSS</strong>, <strong>Context API</strong>, <strong>React Router</strong>, <strong>React Hook Form</strong>, <strong>React Toastify</strong>, and <strong>Axios</strong>. No git operations have been performed so you can handle version control manually.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-600">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="block text-slate-400">Bundler</span>
                <span className="font-semibold text-slate-800">Vite React</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="block text-slate-400">Styling</span>
                <span className="font-semibold text-slate-800">Tailwind CSS</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="block text-slate-400">State</span>
                <span className="font-semibold text-slate-800">Context API</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modules Roadmap Grid */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Project Modules Checklist</h3>
          <span className="text-xs text-slate-500 font-medium">Awaiting module selection</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      Module {mod.id}
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-900 text-sm mb-1">{mod.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{mod.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{mod.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StarterHome />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </AuthProvider>
  );
}
