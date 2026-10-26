import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import QuickActionCards from '../components/dashboard/QuickActionCards';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import AnalyticsChart from '../components/dashboard/AnalyticsChart';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { 
  Building2, 
  Briefcase, 
  CheckCircle2, 
  Users, 
  FileText, 
  BookmarkCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Clock,
  Layers
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const { user } = useAuth();
  
  // Allow toggling between Candidate view and Recruiter view for demonstration
  const [activeRole, setActiveRole] = useState(user?.role || 'candidate');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initial load simulation to demonstrate skeleton loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Update activeRole when user changes
  useEffect(() => {
    if (user?.role) {
      setActiveRole(user.role);
    }
  }, [user]);

  // Refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 700));
    setIsRefreshing(false);
    toast.success('Dashboard metrics refreshed with live market data!');
  };

  const handleRoleSwitch = () => {
    const nextRole = activeRole === 'recruiter' ? 'candidate' : 'recruiter';
    setActiveRole(nextRole);
    toast.info(`Switched view to ${nextRole === 'recruiter' ? 'Recruiter / Employer' : 'Job Candidate'}`);
  };

  // Metrics Data matching Module 2 requirements:
  // Total Companies, Total Jobs, Active Job Postings, Total Candidates, Total Applications, Saved Jobs
  const candidateStats = [
    { title: 'Total Companies', value: 850, change: '+12.4%', icon: Building2, colorScheme: 'indigo' },
    { title: 'Total Jobs', value: 1420, change: '+18.2%', icon: Briefcase, colorScheme: 'purple' },
    { title: 'Active Postings', value: 842, change: '+9.5%', icon: CheckCircle2, colorScheme: 'emerald' },
    { title: 'Total Candidates', value: 12850, change: '+24.1%', icon: Users, colorScheme: 'sky' },
    { title: 'My Applications', value: 7, change: '+2 this wk', icon: FileText, colorScheme: 'rose' },
    { title: 'Saved Jobs', value: 18, change: '+3 closing', icon: BookmarkCheck, colorScheme: 'amber' },
  ];

  const recruiterStats = [
    { title: 'Total Companies', value: 850, change: '+12.4%', icon: Building2, colorScheme: 'indigo' },
    { title: 'Total Jobs', value: 1420, change: '+18.2%', icon: Briefcase, colorScheme: 'purple' },
    { title: 'Active Openings', value: 12, change: '+2 posted', icon: CheckCircle2, colorScheme: 'emerald' },
    { title: 'Total Candidates', value: 12850, change: '+24.1%', icon: Users, colorScheme: 'sky' },
    { title: 'Total Applications', value: 184, change: '+28 unreviewed', icon: FileText, colorScheme: 'purple' },
    { title: 'Saved Talent', value: 36, change: '+8 shortlisted', icon: BookmarkCheck, colorScheme: 'amber' },
  ];

  const currentStats = activeRole === 'recruiter' ? recruiterStats : candidateStats;

  return (
    <DashboardLayout
      onRefresh={handleRefresh}
      isRefreshing={isRefreshing}
      currentRole={activeRole}
      onRoleSwitch={handleRoleSwitch}
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl text-white p-6 sm:p-8 relative overflow-hidden shadow-xl border border-slate-800">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Module 2: Dashboard Operational • Realtime Statistics</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome back, {user?.name || 'Professional'}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                {activeRole === 'recruiter'
                  ? `Manage your active job postings at ${user?.company || 'TechCorp Global'}, review candidate resumes, and track recruitment pipeline conversions.`
                  : 'Track your submitted job applications, explore newly posted tech roles, and monitor status updates from hiring managers in real time.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleRoleSwitch}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold backdrop-blur-md transition flex items-center justify-center gap-2"
              >
                <span>Switch View: {activeRole === 'recruiter' ? 'Candidate' : 'Recruiter'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 1: Dashboard Statistics Cards (Module 2 Requirement) */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Core Platform Statistics</span>
            </h2>
            <span className="text-xs font-medium text-slate-500">
              Live indicators across verified database
            </span>
          </div>

          {loading ? (
            <SkeletonLoader type="stat" count={6} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {currentStats.map((item, index) => (
                <StatCard
                  key={index}
                  title={item.title}
                  value={item.value}
                  change={item.change}
                  icon={item.icon}
                  colorScheme={item.colorScheme}
                />
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Quick Action Cards */}
        {loading ? (
          <SkeletonLoader count={1} />
        ) : (
          <QuickActionCards role={activeRole} />
        )}

        {/* Section 3: Visual Analytics & Charts */}
        {loading ? (
          <SkeletonLoader type="chart" />
        ) : (
          <AnalyticsChart />
        )}

        {/* Section 4: Recent Activities Feed */}
        {loading ? (
          <SkeletonLoader type="list" count={4} />
        ) : (
          <ActivityFeed role={activeRole} />
        )}
      </div>
    </DashboardLayout>
  );
}
