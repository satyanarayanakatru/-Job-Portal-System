import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  FileUp, 
  UserCheck, 
  BookmarkCheck, 
  FileText, 
  Building2, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Plus
} from 'lucide-react';
import QuickActionModal from './QuickActionModal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function QuickActionCards({ role = 'candidate' }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalActionType, setModalActionType] = useState('post-job');
  const navigate = useNavigate();

  const handleAction = (action) => {
    if (action === 'post-job') {
      setModalActionType('post-job');
      setModalOpen(true);
    } else if (action === 'upload-resume') {
      setModalActionType('upload-resume');
      setModalOpen(true);
    } else if (action === 'browse-jobs') {
      toast.info('Navigating to Job Search (Module 5)...');
      navigate('/jobs');
    } else if (action === 'saved-jobs') {
      toast.info('Navigating to Saved Jobs (Module 7)...');
      navigate('/applications');
    } else if (action === 'candidate-search') {
      toast.info('Candidate Directory loaded with 12,850 profiles.');
    } else if (action === 'analytics-report') {
      toast.info('Opening detailed Reports & Analytics (Module 8)...');
      navigate('/reports');
    }
  };

  const candidateActions = [
    {
      id: 'search',
      title: 'Explore Tech Jobs',
      desc: 'Browse 1,420+ active verified engineering & design roles',
      icon: Search,
      action: 'browse-jobs',
      btnText: 'Search Roles',
      gradient: 'from-blue-600 to-indigo-600',
    },
    {
      id: 'resume',
      title: 'Upload / Update Resume',
      desc: 'Attach your latest CV for AI matching & recruiter discovery',
      icon: FileUp,
      action: 'upload-resume',
      btnText: 'Upload PDF',
      gradient: 'from-indigo-600 to-violet-600',
    },
    {
      id: 'saved',
      title: 'Saved Opportunities',
      desc: 'View bookmarked job openings and track deadlines',
      icon: BookmarkCheck,
      action: 'saved-jobs',
      btnText: 'View Saved (18)',
      gradient: 'from-violet-600 to-purple-600',
    },
    {
      id: 'track',
      title: 'Track Applications',
      desc: 'Check live review status, interview calls, and offers',
      icon: FileText,
      action: 'saved-jobs',
      btnText: 'Track Status',
      gradient: 'from-emerald-600 to-teal-600',
    },
  ];

  const recruiterActions = [
    {
      id: 'post',
      title: 'Post a New Job',
      desc: 'Publish a new opening with compensation & skill filters',
      icon: Plus,
      action: 'post-job',
      btnText: 'Create Job Post',
      gradient: 'from-purple-600 to-indigo-600',
    },
    {
      id: 'candidates',
      title: 'Candidate Directory',
      desc: 'Filter 12,850+ pre-vetted engineers by tech stack',
      icon: UserCheck,
      action: 'candidate-search',
      btnText: 'Search Talent',
      gradient: 'from-indigo-600 to-blue-600',
    },
    {
      id: 'applications',
      title: 'Review Applications',
      desc: 'Screen 184 incoming applicants & schedule interviews',
      icon: FileText,
      action: 'saved-jobs',
      btnText: 'Review Queue',
      gradient: 'from-sky-600 to-indigo-600',
    },
    {
      id: 'reports',
      title: 'Hiring Analytics',
      desc: 'Check candidate conversion metrics and time-to-hire',
      icon: TrendingUp,
      action: 'analytics-report',
      btnText: 'View Reports',
      gradient: 'from-emerald-600 to-teal-600',
    },
  ];

  const actions = role === 'recruiter' ? recruiterActions : candidateActions;

  return (
    <div>
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Quick Operational Actions</span>
        </h3>
        <span className="text-[11px] text-slate-500 font-medium">
          Contextual to {role === 'recruiter' ? 'Recruiter Hub' : 'Candidate Hub'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <div
              key={act.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${act.gradient} text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {act.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {act.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 relative z-10">
                <button
                  type="button"
                  onClick={() => handleAction(act.action)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-indigo-50 text-indigo-700 hover:text-indigo-800 text-xs font-bold transition flex items-center justify-between"
                >
                  <span>{act.btnText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Modal */}
      <QuickActionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        actionType={modalActionType}
        role={role}
      />
    </div>
  );
}
