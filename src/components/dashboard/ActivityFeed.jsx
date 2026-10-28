import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Building2, 
  UserCheck, 
  FileText, 
  Briefcase, 
  Filter,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import EmptyState from '../common/EmptyState';
import { analyticsService } from '../../services/analyticsService';

export default function ActivityFeed({ role = 'candidate' }) {
  const [filter, setFilter] = useState('all');
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const dynamicList = await analyticsService.getDynamicActivities(role);
        setActivities(dynamicList);
      } catch (err) {
        console.error('Failed to load dynamic activities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [role]);

  const filtered = activities.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs">
      
      {/* Header with Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Recent System & Team Activities</span>
            </h3>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
              Live Stream
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time feed generated directly from submitted applications and job postings
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'applications', label: 'Applications' },
            { id: 'jobs', label: 'Jobs' },
            { id: 'interviews', label: 'Interviews' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activity List */}
      {filtered.length > 0 ? (
        <div className="divide-y divide-slate-100">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-3 hover:bg-slate-50/50 p-2 rounded-xl transition-colors"
            >
              <div className="flex items-start space-x-3 min-w-0">
                <img
                  src={item.avatar}
                  alt={item.user}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(item.entity || 'Job')}`;
                  }}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100 shrink-0 bg-slate-100"
                />
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {item.user}
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal truncate">
                      • {item.entity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 truncate">
                    {item.action}
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {item.time}
                  </span>
                </div>
              </div>

              {/* Status Pill */}
              <div className="shrink-0 text-right">
                <span
                  className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.statusColor}`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title={`No ${filter} activities`}
          description={`There are currently no recent activities recorded under the "${filter}" filter.`}
          actionLabel="Show All Activities"
          onAction={() => setFilter('all')}
        />
      )}
    </div>
  );
}
