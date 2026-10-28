import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Calendar, ArrowUpRight, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';

export default function AnalyticsChart({ role = 'candidate' }) {
  const [timeRange, setTimeRange] = useState('3m'); // Default to 3M for active populated data
  const [activeTab, setActiveTab] = useState('timeline'); // 'timeline' | 'stages'
  const [monthlyData, setMonthlyData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stageData, setStageData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [trends, cats, stages] = await Promise.all([
          analyticsService.getMonthlyTrends(timeRange, role),
          analyticsService.getCategoryDistribution(),
          analyticsService.getStageBreakdown(),
        ]);
        setMonthlyData(trends);
        setCategories(cats.slice(0, 5));
        setStageData(stages);
      } catch (err) {
        console.error('Failed to load chart analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange, role]);

  const totalAppsInTimeline = monthlyData.reduce((acc, d) => acc + d.applications, 0);
  const totalInterviewsInTimeline = monthlyData.reduce((acc, d) => acc + d.interviews, 0);

  const maxVal = monthlyData.length > 0
    ? Math.max(...monthlyData.map((d) => Math.max(d.applications, d.interviews)), 1)
    : 10;

  const totalCalculatedRoles = categories.reduce((acc, c) => acc + c.count, 0);

  // Dynamic role-specific titles and metrics
  const chartTitle = role === 'recruiter'
    ? 'Talent Pipeline Inflow & Interview Volume'
    : 'My Application Activity & Progress';

  const chartSubtitle = role === 'recruiter'
    ? `Live aggregation of ${totalAppsInTimeline} candidate submissions & screening conversions`
    : `Live tracking of your personal submissions across ${totalAppsInTimeline} active applications`;

  const bar1Label = role === 'recruiter' ? 'Applications Received' : 'Applications Submitted';
  const bar2Label = role === 'recruiter' ? 'Interviews Scheduled' : 'Interview Invitations';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Monthly Application & Hiring Volume Chart */}
      <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-slate-900">
                {chartTitle}
              </h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <ArrowUpRight className="w-2.5 h-2.5" /> 100% Dynamic Sync
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {chartSubtitle}
            </p>
          </div>

          {/* Controls: Timeline Toggle & Funnel View Switcher */}
          <div className="flex items-center space-x-1.5 self-start sm:self-auto">
            <div className="flex items-center p-0.5 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('timeline')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  activeTab === 'timeline' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600'
                }`}
              >
                Monthly Timeline
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('stages')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  activeTab === 'stages' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600'
                }`}
              >
                Pipeline Stages
              </button>
            </div>

            {activeTab === 'timeline' && (
              <div className="flex items-center p-0.5 bg-slate-100 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setTimeRange('3m')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    timeRange === '3m' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600'
                  }`}
                  title="Last 3 Months (Active)"
                >
                  3M
                </button>
                <button
                  type="button"
                  onClick={() => setTimeRange('6m')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    timeRange === '6m' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600'
                  }`}
                  title="Last 6 Months"
                >
                  6M
                </button>
                <button
                  type="button"
                  onClick={() => setTimeRange('1y')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    timeRange === '1y' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600'
                  }`}
                  title="Year 2026"
                >
                  1Y
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tab 1: Responsive Bar Graphic (Timeline View) */}
        {activeTab === 'timeline' ? (
          <div className="h-56 w-full flex items-end justify-between gap-2 sm:gap-4 pt-4 border-b border-slate-100 px-2">
            {monthlyData.map((item, idx) => {
              const heightPct = item.applications > 0
                ? Math.min(100, Math.max(16, Math.round((item.applications / maxVal) * 100)))
                : 4;

              const interviewHeightPct = item.interviews > 0
                ? Math.min(100, Math.max(16, Math.round((item.interviews / maxVal) * 100)))
                : 4;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  
                  {/* Subtle count indicator above bar when > 0 */}
                  {item.applications > 0 && (
                    <span className="text-[10px] font-extrabold text-indigo-600 mb-1 transition-opacity">
                      {item.applications}
                    </span>
                  )}

                  {/* Hover Tooltip */}
                  <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-1.5 px-2.5 rounded-xl pointer-events-none whitespace-nowrap z-30 shadow-xl text-center">
                    <p className="font-bold">
                      {item.applications} {item.applications === 1 ? 'Application' : 'Applications'}
                    </p>
                    <p className="text-violet-300 font-medium">
                      {item.interviews} {item.interviews === 1 ? 'Interview' : 'Interviews'}
                    </p>
                    {item.hired > 0 && (
                      <p className="text-emerald-300 font-medium">
                        {item.hired} {item.hired === 1 ? 'Offer' : 'Offers'}
                      </p>
                    )}
                  </div>

                  <div className="w-full flex items-end justify-center space-x-1 h-full">
                    {/* Applications Bar */}
                    <div
                      className={`w-1/2 rounded-t-md transition-all duration-500 ${
                        item.applications > 0
                          ? 'bg-gradient-to-t from-indigo-600 to-indigo-500 group-hover:from-indigo-500 group-hover:to-indigo-400 shadow-xs'
                          : 'bg-slate-100'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                    {/* Interviews Bar */}
                    <div
                      className={`w-1/2 rounded-t-md transition-all duration-500 ${
                        item.interviews > 0
                          ? 'bg-gradient-to-t from-violet-400 to-violet-300 group-hover:from-violet-300 group-hover:to-violet-200 shadow-xs'
                          : 'bg-slate-100'
                      }`}
                      style={{ height: `${interviewHeightPct}%` }}
                    />
                  </div>

                  <span className="text-[11px] font-semibold text-slate-500 mt-2">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          /* Tab 2: Live Pipeline Stages Funnel */
          <div className="h-56 w-full flex flex-col justify-center space-y-3 px-2 border-b border-slate-100 pb-4">
            {stageData.map((stage, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <span className={`w-2 h-2 rounded-full ${stage.color}`}></span>
                    <span>{stage.label}</span>
                  </span>
                  <span className="text-slate-500 font-normal">
                    <strong className="text-slate-900 font-extrabold">{stage.count}</strong> {stage.count === 1 ? 'candidate' : 'candidates'} ({stage.pct}%)
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${stage.color} rounded-full transition-all duration-700`}
                    style={{ width: `${Math.max(stage.pct, 6)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Legend & Total Dynamic Badge */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600"></span> {bar1Label}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-xs bg-violet-400"></span> {bar2Label}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
              Total Active: {totalAppsInTimeline}
            </span>
            <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Live Storage Sync
            </span>
          </div>
        </div>
      </div>

      {/* Category Breakdown & Industry Distribution */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Openings by Sector
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 mb-4">
            Active roles distributed across real job categories ({totalCalculatedRoles} total)
          </p>

          <div className="space-y-4">
            {categories.map((cat, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span className="truncate pr-2">{cat.name}</span>
                  <span className="text-slate-500 font-normal shrink-0">
                    {cat.count} {cat.count === 1 ? 'role' : 'roles'} ({cat.pct}%)
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

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-700 font-semibold bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/60">
          <span>Active Category Count</span>
          <span className="font-mono text-sm font-extrabold text-indigo-900">
            {categories.length} {categories.length === 1 ? 'Sector' : 'Sectors'}
          </span>
        </div>
      </div>
    </div>
  );
}
