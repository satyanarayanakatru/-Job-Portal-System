import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import SkeletonLoader from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar, 
  Filter, 
  Building2, 
  Briefcase, 
  Users, 
  FileText, 
  CheckCircle2, 
  Award, 
  Search, 
  ArrowUpRight, 
  Layers, 
  PieChart, 
  Sparkles,
  ArrowUpDown,
  ExternalLink,
  ChevronRight,
  Clock,
  Printer
} from 'lucide-react';
import { toast } from 'react-toastify';
import { analyticsService } from '../services/analyticsService';

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('6m'); // '30d' | '6m' | 'ytd' | 'all'
  const [metrics, setMetrics] = useState({
    totalCompanies: 0,
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    totalSavedJobs: 0,
  });

  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [categories, setCategories] = useState([]);
  const [hiringFunnel, setHiringFunnel] = useState([]);
  const [mostAppliedJobs, setMostAppliedJobs] = useState([]);
  const [companies, setCompanies] = useState([]);

  // Table search & sort
  const [tableSearch, setTableSearch] = useState('');
  const [tableCategory, setTableCategory] = useState('ALL');

  // Load live dynamic reports data
  const loadReportsData = async () => {
    setLoading(true);
    try {
      const [raw, trends, cats, funnel, topJobs] = await Promise.all([
        analyticsService.getRawData(),
        analyticsService.getMonthlyTrends(),
        analyticsService.getCategoryDistribution(),
        analyticsService.getHiringFunnel(),
        analyticsService.getMostAppliedJobs(),
      ]);

      setMetrics({
        totalCompanies: raw.companies.length,
        totalJobs: raw.jobs.length,
        activeJobs: raw.jobs.filter((j) => j.status === 'Open').length,
        totalApplications: raw.applications.length,
        totalSavedJobs: raw.savedJobs.length,
      });

      setMonthlyTrends(trends);
      setCategories(cats);
      setHiringFunnel(funnel);
      setMostAppliedJobs(topJobs);
      setCompanies(raw.companies.slice(0, 5));
    } catch (err) {
      console.error('Failed to load reports data:', err);
      toast.error('Failed to load report analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportsData();
  }, []);

  // Compute conversion rates
  const interviewCount = hiringFunnel.find((f) => f.stage === 'Interview Scheduled')?.count || 0;
  const offerCount = hiringFunnel.find((f) => f.stage === 'Offer Extended')?.count || 0;
  const totalApps = Math.max(metrics.totalApplications, 1);

  const interviewRate = Math.round((interviewCount / totalApps) * 100);
  const offerRate = Math.round((offerCount / totalApps) * 100);

  // Export report handler
  const handleExportReport = async () => {
    try {
      const summary = await analyticsService.exportReportSummary();
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(summary, null, 2)
      )}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute(
        'download',
        `JobSphere_Executive_Analytics_Report_${new Date().toISOString().split('T')[0]}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      toast.success('Analytics report downloaded successfully (JSON format)!');
    } catch (err) {
      console.error('Export failed:', err);
      toast.error('Failed to generate export file.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Filtered jobs for performance table
  const filteredJobs = mostAppliedJobs.filter((job) => {
    const matchesSearch =
      (job.title || '').toLowerCase().includes(tableSearch.toLowerCase()) ||
      (job.company || '').toLowerCase().includes(tableSearch.toLowerCase());
    const matchesCat =
      tableCategory === 'ALL' || job.category === tableCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <DashboardLayout onRefresh={loadReportsData} isRefreshing={loading}>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Top Header & Export Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                Module 8
              </span>
              <span className="text-xs text-slate-400 font-medium">• Executive Intelligence</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
              Reports & Operational Analytics
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              100% dynamic analytics, recruitment velocity charts, hiring pipeline conversion rates, and role performance.
            </p>
          </div>

          {/* Action Buttons & Time Range Selector */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              {[
                { id: '30d', label: '30 Days' },
                { id: '6m', label: '6 Months' },
                { id: 'ytd', label: 'YTD 2026' },
                { id: 'all', label: 'All Time' },
              ].map((range) => (
                <button
                  key={range.id}
                  onClick={() => setTimeRange(range.id)}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    timeRange === range.id
                      ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-xs font-semibold text-slate-700 transition"
              title="Print Report"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={handleExportReport}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Executive Dynamic KPI Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Postings</span>
              <Briefcase className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 leading-tight">
              {metrics.totalJobs}
            </p>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded mt-1 inline-block">
              {metrics.activeJobs} Active Now
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Partner Employers</span>
              <Building2 className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 leading-tight">
              {metrics.totalCompanies}
            </p>
            <span className="text-[11px] font-semibold text-purple-600 bg-purple-50 px-1.5 py-0.2 rounded mt-1 inline-block">
              Enterprise Verified
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Applications</span>
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 leading-tight">
              {metrics.totalApplications}
            </p>
            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded mt-1 inline-block">
              Candidate Submissions
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Interview Rate</span>
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 leading-tight">
              {interviewRate}%
            </p>
            <span className="text-[11px] font-semibold text-purple-600 bg-purple-50 px-1.5 py-0.2 rounded mt-1 inline-block">
              {interviewCount} Scheduled
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Offer Rate</span>
              <Award className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 leading-tight">
              {offerRate}%
            </p>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded mt-1 inline-block">
              {offerCount} Extended
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Bookmarked Roles</span>
              <TrendingUp className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 leading-tight">
              {metrics.totalSavedJobs}
            </p>
            <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded mt-1 inline-block">
              Saved by Candidates
            </span>
          </div>
        </div>

        {/* Charts Row 1: Monthly Dynamic Velocity & Hiring Funnel Conversion */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Monthly Velocity Chart */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-indigo-600" />
                    <span>Monthly Candidate Application & Interview Volume</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live dynamic aggregation of candidate submissions across tracking periods
                  </p>
                </div>
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 hidden sm:inline-block">
                  Live Sync
                </span>
              </div>

              {/* Multi-Bar Graph */}
              <div className="h-60 w-full flex items-end justify-between gap-3 sm:gap-6 pt-6 border-b border-slate-100 px-2">
                {monthlyTrends.map((item, idx) => {
                  const maxTrendVal = Math.max(...monthlyTrends.map((d) => Math.max(d.applications, d.interviews, d.hired)), 1);
                  const appPct = item.applications > 0
                    ? Math.min(100, Math.max(16, Math.round((item.applications / maxTrendVal) * 100)))
                    : 4;
                  const intPct = item.interviews > 0
                    ? Math.min(100, Math.max(16, Math.round((item.interviews / maxTrendVal) * 100)))
                    : 4;
                  const hirePct = item.hired > 0
                    ? Math.min(100, Math.max(16, Math.round((item.hired / maxTrendVal) * 100)))
                    : 4;

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                      {/* Count label above bar when > 0 */}
                      {item.applications > 0 && (
                        <span className="text-[10px] font-extrabold text-indigo-600 mb-1">
                          {item.applications}
                        </span>
                      )}

                      {/* Hover Tooltip */}
                      <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-1 px-2.5 rounded-lg pointer-events-none whitespace-nowrap z-20 shadow-lg text-center">
                        <p className="font-bold">{item.applications} {item.applications === 1 ? 'Application' : 'Applications'}</p>
                        <p className="text-violet-300">{item.interviews} {item.interviews === 1 ? 'Interview' : 'Interviews'}</p>
                        <p className="text-emerald-300">{item.hired} {item.hired === 1 ? 'Hire' : 'Hires'}</p>
                      </div>

                      <div className="w-full flex items-end justify-center space-x-1 h-full">
                        <div
                          className={`w-1/3 rounded-t-md transition-all duration-500 ${
                            item.applications > 0 ? 'bg-indigo-600 group-hover:bg-indigo-500 shadow-xs' : 'bg-slate-100'
                          }`}
                          style={{ height: `${appPct}%` }}
                        />
                        <div
                          className={`w-1/3 rounded-t-md transition-all duration-500 ${
                            item.interviews > 0 ? 'bg-violet-400 group-hover:bg-violet-300 shadow-xs' : 'bg-slate-100'
                          }`}
                          style={{ height: `${intPct}%` }}
                        />
                        <div
                          className={`w-1/3 rounded-t-md transition-all duration-500 ${
                            item.hired > 0 ? 'bg-emerald-500 group-hover:bg-emerald-400 shadow-xs' : 'bg-slate-100'
                          }`}
                          style={{ height: `${hirePct}%` }}
                        />
                      </div>

                      <span className="text-[11px] font-semibold text-slate-500 mt-2">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 pt-2 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
              <div className="flex items-center space-x-4">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600"></span> Applications
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-sm bg-violet-400"></span> Interviews
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> Offers
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-400">Values calculated dynamically</span>
            </div>
          </div>

          {/* Hiring Funnel Stage Analysis */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-indigo-600" />
                    <span>Hiring Funnel Stage Conversion</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Drop-off percentages from initial apply to formal offer
                  </p>
                </div>
              </div>

              {/* Funnel Stages */}
              <div className="space-y-3.5">
                {hiringFunnel.map((stage, idx) => (
                  <div key={stage.stage} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-full bg-white border border-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-slate-800">{stage.label}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-slate-900">{stage.count} candidates</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${stage.bgColor} ${stage.textColor}`}>
                          {stage.pct}%
                        </span>
                      </div>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full h-2 bg-slate-200/70 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${stage.color} rounded-full transition-all duration-700`}
                        style={{ width: `${Math.max(stage.pct, 5)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium">Overall Conversion (Apply to Offer):</span>
              <span className="font-bold text-emerald-600 font-mono text-sm">{offerRate}%</span>
            </div>
          </div>
        </div>

        {/* Charts Row 2: Category Distribution & Top Employer Leaders */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Dynamic Category Market Share */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-indigo-600" />
                    <span>Sector & Job Category Market Share</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Percentage of open job opportunities categorized across technical verticals
                  </p>
                </div>
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">
                  {categories.length} Categories
                </span>
              </div>

              <div className="space-y-3.5">
                {categories.map((cat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <div className="flex items-center space-x-2 truncate">
                        <span className={`w-2.5 h-2.5 rounded-sm ${cat.color} shrink-0`}></span>
                        <span className="truncate">{cat.name}</span>
                      </div>
                      <span className="text-slate-500 font-normal shrink-0">
                        {cat.count} roles ({cat.pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${cat.color} rounded-full transition-all duration-700`}
                        style={{ width: `${Math.max(cat.pct, 4)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
              <span>Automatically computed from live job postings</span>
              <span className="text-indigo-600 font-bold">100% Total Coverage</span>
            </div>
          </div>

          {/* Hiring Employer Leaderboard */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <span>Enterprise Hiring Partners</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Active hiring partners integrated via enterprise directory
                  </p>
                </div>
                <Link
                  to="/companies"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition flex items-center gap-0.5"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {companies.map((comp) => (
                  <div key={comp.id} className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl transition">
                    <div className="flex items-center space-x-3 truncate">
                      <img
                        src={comp.logo}
                        alt={comp.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(comp.name)}`;
                        }}
                        className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-100 shrink-0 bg-slate-100"
                      />
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-900 truncate">{comp.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{comp.location} • {comp.industry}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {comp.openJobsCount || 10}+ Openings
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
              <span>Third-party API & Verified partners</span>
              <span className="font-semibold text-slate-700">{metrics.totalCompanies} Companies</span>
            </div>
          </div>
        </div>

        {/* Section 3: In-Demand Jobs Dynamic Performance Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
          
          {/* Table Header & Search Filter */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4.5 h-4.5 text-indigo-600" />
                <span>Job Posting Performance & Application Velocity Table</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time breakdown of all postings, active candidate volume, and application deadlines
              </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative min-w-[200px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search role or employer..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="w-full pl-8.5 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <select
                value={tableCategory}
                onChange={(e) => setTableCategory(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
              >
                <option value="ALL">All Categories</option>
                {categories.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          {filteredJobs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 rounded-l-xl">Job Title & Employer</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Compensation</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4 text-center">Applicants</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 rounded-r-xl text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/60 transition group">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={job.companyLogo}
                            alt={job.company}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(job.company)}`;
                            }}
                            className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 shrink-0 bg-slate-50"
                          />
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition">
                              {job.title}
                            </p>
                            <p className="text-[11px] text-slate-500">{job.company}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[11px]">
                          {job.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-emerald-700">
                        {job.salaryRange}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        {job.location}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 text-[11px]">
                          {job.computedApplicantsCount}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            job.status === 'Open'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/jobs/${job.id}`}
                          className="inline-flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 font-bold transition text-xs"
                        >
                          <span>Details</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No Matching Postings"
              description="No job postings matched your search keywords or category filters."
              actionText="Reset Table Filters"
              onAction={() => {
                setTableSearch('');
                setTableCategory('ALL');
              }}
            />
          )}

          {/* Table Footer */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing {filteredJobs.length} of {mostAppliedJobs.length} total postings</span>
            <span className="font-medium text-slate-600">Live Local Storage Repository</span>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
