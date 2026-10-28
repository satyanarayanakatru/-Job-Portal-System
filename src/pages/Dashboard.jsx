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
  Layers,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-toastify';
import { analyticsService } from '../services/analyticsService';

export default function Dashboard() {
  const { user } = useAuth();
  const activeRole = user?.role || 'candidate';
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [metrics, setMetrics] = useState({
    totalCompanies: 0,
    totalJobs: 0,
    activePostings: 0,
    activeOpenings: 0,
    totalCandidates: 0,
    myApplications: 0,
    totalApplications: 0,
    savedJobs: 0,
    savedTalent: 0,
  });

  // Load live dynamic data from storage
  const loadDynamicData = async () => {
    try {
      const data = await analyticsService.getDashboardMetrics(activeRole);
      setMetrics(data);
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDynamicData();
  }, [activeRole]);

  // Refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDynamicData();
    await new Promise((r) => setTimeout(r, 450));
    setIsRefreshing(false);
    toast.success('Dashboard metrics refreshed with live market data!');
  };

  // Dynamic Metrics matching Module 2 requirements:
  const candidateStats = [
    { title: 'Total Companies', value: metrics.totalCompanies, change: 'Verified Directory', icon: Building2, colorScheme: 'indigo' },
    { title: 'Total Jobs', value: metrics.totalJobs, change: `${metrics.activePostings} Active`, icon: Briefcase, colorScheme: 'purple' },
    { title: 'Active Postings', value: metrics.activePostings, change: 'Open for apply', icon: CheckCircle2, colorScheme: 'emerald' },
    { title: 'Total Candidates', value: metrics.totalCandidates, change: 'Global Network', icon: Users, colorScheme: 'sky' },
    { title: 'My Applications', value: metrics.myApplications, change: 'Tracked Pipeline', icon: FileText, colorScheme: 'rose' },
    { title: 'Saved Jobs', value: metrics.savedJobs, change: 'Bookmarked', icon: BookmarkCheck, colorScheme: 'amber' },
  ];

  const recruiterStats = [
    { title: 'Total Companies', value: metrics.totalCompanies, change: 'Hiring Partners', icon: Building2, colorScheme: 'indigo' },
    { title: 'Total Jobs', value: metrics.totalJobs, change: 'Across All Sectors', icon: Briefcase, colorScheme: 'purple' },
    { title: 'Active Openings', value: metrics.activeOpenings, change: 'Live Positions', icon: CheckCircle2, colorScheme: 'emerald' },
    { title: 'Total Candidates', value: metrics.totalCandidates, change: 'Active Pool', icon: Users, colorScheme: 'sky' },
    { title: 'Total Applications', value: metrics.totalApplications, change: 'Received Submissions', icon: FileText, colorScheme: 'purple' },
    { title: 'Saved Talent', value: metrics.savedTalent, change: 'Shortlisted', icon: BookmarkCheck, colorScheme: 'amber' },
  ];

  const currentStats = activeRole === 'recruiter' ? recruiterStats : candidateStats;

  return (
    <DashboardLayout
      onRefresh={handleRefresh}
      isRefreshing={isRefreshing}
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
                <span>Operational System • 100% Dynamic Realtime Statistics</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome back, {user?.name || 'Professional'}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                {activeRole === 'recruiter'
                  ? `Manage your active job postings, review candidate resumes, and track recruitment pipeline conversions with real-time analytics.`
                  : 'Track your submitted job applications, explore newly posted tech roles, and monitor status updates from hiring managers in real time.'}
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <div className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-2 text-xs">
                <span className={`w-2 h-2 rounded-full ${activeRole === 'recruiter' ? 'bg-purple-400' : 'bg-emerald-400'}`}></span>
                <span className="font-semibold text-slate-200">
                  Role: <span className="font-bold text-white capitalize">{activeRole}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Dashboard Statistics Cards (100% Dynamic) */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Core Platform Live Statistics</span>
            </h2>
            <span className="text-xs font-medium text-slate-500">
              Synced with local storage repository
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
          <QuickActionCards role={activeRole} metrics={metrics} />
        )}

        {/* Section 3: Visual Analytics & Charts (100% Dynamic) */}
        {loading ? (
          <SkeletonLoader type="chart" />
        ) : (
          <AnalyticsChart role={activeRole} />
        )}

        {/* Section 4: Recent Activities Feed (100% Dynamic) */}
        {loading ? (
          <SkeletonLoader type="list" count={4} />
        ) : (
          <ActivityFeed role={activeRole} />
        )}
      </div>
    </DashboardLayout>
  );
}
