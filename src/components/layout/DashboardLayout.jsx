import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Briefcase, 
  LayoutDashboard, 
  Building2, 
  Search, 
  UserCircle, 
  FileText, 
  BarChart3, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Users,
  BookmarkCheck,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function DashboardLayout({ children, onRefresh, isRefreshing }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const activeRole = user?.role || 'candidate';

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Companies', path: '/companies', icon: Building2 },
    { name: 'Job Postings & Search', path: '/jobs', icon: Search },
    { name: 'Applications & Saved', path: '/applications', icon: BookmarkCheck },
    { name: 'Candidate Profile', path: '/profile', icon: UserCircle },
    { name: 'Reports & Analytics', path: '/reports', icon: BarChart3 },
  ];

  const notifications = [
    { id: 1, title: 'Application Update', desc: 'TechCorp reviewed your React.js application', time: '10m ago', unread: true },
    { id: 2, title: 'New Job Matched', desc: '3 positions match your Full Stack profile', time: '1h ago', unread: true },
    { id: 3, title: 'Profile View', desc: 'A recruiter from NexaCloud viewed your profile', time: '3h ago', unread: false },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="h-screen max-h-screen bg-slate-50 flex overflow-hidden text-slate-800">
      
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation - Sticky and fixed to left */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-slate-950 text-slate-300 flex flex-col justify-between border-r border-slate-800/80 transition-all duration-300 lg:static lg:h-screen lg:shrink-0 ${
          mobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Top Header & Brand */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 overflow-hidden">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
              <Briefcase className="h-5 w-5" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-base tracking-tight leading-tight">
                  JobSphere
                </span>
                <span className="text-[10px] uppercase tracking-wider text-indigo-400 font-semibold">
                  Enterprise Suite
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const current = isActive(item.path);

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  current
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`}
                title={sidebarCollapsed ? item.name : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${current ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                {!sidebarCollapsed && (
                  <span className="flex-1 truncate">{item.name}</span>
                )}
              </Link>
            );
          })}
        </div>

        {/* User Profile / Logout Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
              alt={user?.name}
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-500/20 shrink-0"
            />
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate leading-tight">{user?.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area - Scrolls independently while sidebar stays pinned */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb / Title */}
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Enterprise Dashboard
              </h2>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Welcome back, {user?.name} • Live statistics and operational overview
              </p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-2.5">
            {/* Refresh Data Button */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-xs font-semibold text-slate-700 transition"
              title="Refresh statistics"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
              <span className="hidden sm:inline">{isRefreshing ? 'Updating...' : 'Refresh'}</span>
            </button>

            {/* Notifications Menu */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 relative transition"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white"></span>
              </button>

              {notificationsOpen && (
                <div
                  onMouseLeave={() => setNotificationsOpen(false)}
                  className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-xl py-3 z-50 animate-in fade-in zoom-in-95"
                >
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Notifications</span>
                    <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                      2 Unread
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-3 hover:bg-slate-50 transition cursor-pointer">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-3 pt-2 border-t border-slate-100 text-center">
                    <button
                      onClick={() => {
                        setNotificationsOpen(false);
                        toast.info('All notifications marked as read.');
                      }}
                      className="text-[11px] font-semibold text-indigo-600 hover:underline"
                    >
                      Mark all as read
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Role Badge Indicator */}
            <span
              className={`hidden sm:inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                activeRole === 'recruiter'
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
              }`}
            >
              {activeRole === 'recruiter' ? 'Recruiter' : 'Candidate'}
            </span>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
