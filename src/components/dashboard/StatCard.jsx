import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  colorScheme = 'indigo',
  subtitle = 'vs last month',
}) {
  const schemes = {
    indigo: {
      bg: 'bg-indigo-50 text-indigo-600',
      border: 'border-indigo-100',
    },
    purple: {
      bg: 'bg-purple-50 text-purple-600',
      border: 'border-purple-100',
    },
    emerald: {
      bg: 'bg-emerald-50 text-emerald-600',
      border: 'border-emerald-100',
    },
    sky: {
      bg: 'bg-sky-50 text-sky-600',
      border: 'border-sky-100',
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600',
      border: 'border-amber-100',
    },
    rose: {
      bg: 'bg-rose-50 text-rose-600',
      border: 'border-rose-100',
    },
  };

  const scheme = schemes[colorScheme] || schemes.indigo;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all group flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${scheme.bg} group-hover:scale-105 transition-transform`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
        
        {change && (
          <div className="flex items-center space-x-1.5 mt-2 text-xs">
            <span
              className={`inline-flex items-center font-bold px-1.5 py-0.5 rounded ${
                isPositive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-rose-50 text-rose-700'
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3 h-3 mr-0.5" />
              )}
              {change}
            </span>
            <span className="text-slate-400 font-medium text-[11px]">{subtitle}</span>
          </div>
        )}
      </div>
    </div>
  );
}
