import React from 'react';

export default function SkeletonLoader({ type = 'card', count = 1 }) {
  const items = Array.from({ length: count });

  if (type === 'stat') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 animate-pulse">
        {items.map((_, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 bg-slate-200 rounded"></div>
              <div className="h-8 w-8 bg-slate-200 rounded-xl"></div>
            </div>
            <div className="h-7 w-16 bg-slate-200 rounded"></div>
            <div className="h-2.5 w-24 bg-slate-100 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs animate-pulse space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-4 w-36 bg-slate-200 rounded"></div>
          <div className="h-3 w-24 bg-slate-100 rounded"></div>
        </div>
        <div className="h-56 bg-slate-100 rounded-xl flex items-end justify-between p-4 gap-2">
          {[40, 65, 30, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, idx) => (
            <div key={idx} className="w-full bg-slate-200 rounded-t" style={{ height: `${h}%` }}></div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4 animate-pulse">
        <div className="h-4 w-32 bg-slate-200 rounded"></div>
        <div className="space-y-3">
          {items.map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-2">
              <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0"></div>
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-40 bg-slate-200 rounded"></div>
                <div className="h-2.5 w-24 bg-slate-100 rounded"></div>
              </div>
              <div className="h-4 w-16 bg-slate-100 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs animate-pulse space-y-3">
      <div className="h-4 w-1/3 bg-slate-200 rounded"></div>
      <div className="h-3 w-full bg-slate-100 rounded"></div>
      <div className="h-3 w-4/5 bg-slate-100 rounded"></div>
    </div>
  );
}
