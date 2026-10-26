import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';

export default function AnalyticsChart() {
  const [timeRange, setTimeRange] = useState('6m');

  const monthlyData = [
    { month: 'May', applications: 240, interviews: 45, hired: 18 },
    { month: 'Jun', applications: 310, interviews: 62, hired: 24 },
    { month: 'Jul', applications: 290, interviews: 58, hired: 20 },
    { month: 'Aug', applications: 450, interviews: 90, hired: 35 },
    { month: 'Sep', applications: 520, interviews: 110, hired: 42 },
    { month: 'Oct', applications: 610, interviews: 135, hired: 56 },
  ];

  const maxVal = Math.max(...monthlyData.map((d) => d.applications));

  const categories = [
    { name: 'Software Engineering', count: 4120, pct: 45, color: 'bg-indigo-600' },
    { name: 'Data & Artificial Intelligence', count: 2950, pct: 30, color: 'bg-violet-600' },
    { name: 'Product, UX & Design', count: 1840, pct: 15, color: 'bg-sky-500' },
    { name: 'Cloud, DevOps & Security', count: 1210, pct: 10, color: 'bg-emerald-500' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Monthly Application & Hiring Volume Chart */}
      <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-slate-900">
                Application & Interview Statistics
              </h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <ArrowUpRight className="w-2.5 h-2.5" /> +32% Growth
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Monthly candidate pipeline volume and interview conversions
            </p>
          </div>

          <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => setTimeRange('6m')}
              className={`px-2.5 py-1 rounded-lg transition ${
                timeRange === '6m' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              Last 6 Months
            </button>
            <button
              onClick={() => setTimeRange('1y')}
              className={`px-2.5 py-1 rounded-lg transition ${
                timeRange === '1y' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              Year 2026
            </button>
          </div>
        </div>

        {/* Responsive Bar Graphic */}
        <div className="h-56 w-full flex items-end justify-between gap-3 sm:gap-6 pt-4 border-b border-slate-100 px-2">
          {monthlyData.map((item, idx) => {
            const heightPct = Math.round((item.applications / maxVal) * 100);
            const interviewHeightPct = Math.round((item.interviews / maxVal) * 100);

            return (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                
                {/* Hover Tooltip */}
                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap z-20 shadow-md">
                  <p className="font-bold">{item.applications} Applications</p>
                  <p className="text-slate-300">{item.interviews} Interviews</p>
                </div>

                <div className="w-full flex items-end justify-center space-x-1 h-full">
                  {/* Applications Bar */}
                  <div
                    className="w-1/2 bg-gradient-to-t from-indigo-600 to-indigo-500 rounded-t-md transition-all duration-500 group-hover:from-indigo-500 group-hover:to-indigo-400"
                    style={{ height: `${heightPct}%` }}
                  />
                  {/* Interviews Bar */}
                  <div
                    className="w-1/2 bg-gradient-to-t from-violet-400 to-violet-300 rounded-t-md transition-all duration-500 group-hover:from-violet-300 group-hover:to-violet-200"
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

        {/* Legend */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600"></span> Applications Submitted
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-sm bg-violet-400"></span> Interviews Scheduled
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-400">Updated in real-time</span>
        </div>
      </div>

      {/* Category Breakdown & Industry Distribution */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Openings by Sector
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 mb-4">
            Active roles distributed across core tech verticals
          </p>

          <div className="space-y-4">
            {categories.map((cat, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>{cat.name}</span>
                  <span className="text-slate-500 font-normal">{cat.count.toLocaleString()} roles ({cat.pct}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${cat.color} rounded-full transition-all duration-700`}
                    style={{ width: `${cat.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-700 font-semibold bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/60">
          <span>Hiring Index Score</span>
          <span className="font-mono text-sm font-extrabold text-indigo-900">94.8 / 100</span>
        </div>
      </div>
    </div>
  );
}
