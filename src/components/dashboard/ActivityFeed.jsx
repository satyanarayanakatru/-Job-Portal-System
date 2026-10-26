import React, { useState } from 'react';
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

const INITIAL_ACTIVITIES = [
  {
    id: 1,
    category: 'applications',
    title: 'Senior Frontend Engineer Application',
    entity: 'Stripe Horizon',
    user: 'Sarah Jenkins',
    action: 'submitted an application with resume',
    status: 'In Review',
    statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
    time: '12m ago',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    category: 'jobs',
    title: 'New Position Published',
    entity: 'TechCorp Solutions',
    user: 'Alex Morgan',
    action: 'published "Staff Cloud Architect ($160k - $210k)"',
    status: 'Active',
    statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    time: '45m ago',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    category: 'interviews',
    title: 'Technical Round 1 Scheduled',
    entity: 'NexaCloud Data',
    user: 'David Kim',
    action: 'confirmed video interview for Oct 29, 2:00 PM',
    status: 'Scheduled',
    statusColor: 'bg-purple-50 text-purple-700 border-purple-200',
    time: '2h ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    category: 'applications',
    title: 'Applicant Shortlisted',
    entity: 'Apex FinTech',
    user: 'Elena Rostova',
    action: 'shortlisted candidate Marcus Vance for UX Lead',
    status: 'Shortlisted',
    statusColor: 'bg-teal-50 text-teal-700 border-teal-200',
    time: '4h ago',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 5,
    category: 'jobs',
    title: 'Job Posting Closed',
    entity: 'Quantum AI Labs',
    user: 'System Bot',
    action: 'closed "Junior React Intern" after 250 applications',
    status: 'Closed',
    statusColor: 'bg-slate-100 text-slate-700 border-slate-200',
    time: '6h ago',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
  },
];

export default function ActivityFeed({ role = 'candidate' }) {
  const [filter, setFilter] = useState('all');
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);

  const filtered = activities.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs">
      
      {/* Header with Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>Recent System & Team Activities</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time feed of applications, job publications, and interview milestones
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
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100 shrink-0"
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
