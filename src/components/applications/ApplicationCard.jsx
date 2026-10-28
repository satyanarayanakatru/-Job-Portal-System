import React from 'react';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Calendar, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  XCircle, 
  Trash2,
  Video,
  ChevronRight,
  Award
} from 'lucide-react';

const STATUS_CONFIG = {
  'Submitted': {
    color: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20',
    dot: 'bg-blue-500',
    step: 1,
    desc: 'Application received and awaiting recruiter review',
  },
  'Under Review': {
    color: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
    dot: 'bg-amber-500',
    step: 2,
    desc: 'Resume and portfolio under hiring manager screening',
  },
  'Interview Scheduled': {
    color: 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/20',
    dot: 'bg-purple-500',
    step: 3,
    desc: 'Interview rounds in progress with engineering team',
  },
  'Offer Extended': {
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
    dot: 'bg-emerald-500',
    step: 4,
    desc: 'Congratulations! Formal job offer package sent',
  },
  'Withdrawn': {
    color: 'bg-slate-100 text-slate-600 border-slate-300 ring-slate-400/20',
    dot: 'bg-slate-400',
    step: 0,
    desc: 'Candidate has voluntarily withdrawn this application',
  },
};

const PIPELINE_STEPS = [
  { step: 1, label: 'Submitted' },
  { step: 2, label: 'Under Review' },
  { step: 3, label: 'Interview' },
  { step: 4, label: 'Offer' },
];

export default function ApplicationCard({ 
  application, 
  onViewDetails, 
  onWithdraw, 
  onDelete,
  isRecruiter = false,
  onUpdateStage,
}) {
  const statusInfo = STATUS_CONFIG[application.status] || STATUS_CONFIG['Submitted'];
  const currentStep = application.statusStep || statusInfo.step;
  const isWithdrawn = application.status === 'Withdrawn';
  const isOffer = application.status === 'Offer Extended';

  // Format application date
  const formattedDate = application.appliedAt
    ? new Date(application.appliedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-200 shadow-xs hover:shadow-md transition-all duration-200 p-5 group flex flex-col justify-between">
      
      {/* Top Section */}
      <div>
        <div className="flex items-start justify-between gap-4">
          
          {/* Company Logo + Job & Company Names */}
          <div className="flex items-start space-x-3.5 min-w-0">
            <img
              src={application.companyLogo}
              alt={application.company}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(application.company || 'Company')}`;
              }}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100 shrink-0 bg-slate-50"
            />
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition truncate leading-snug">
                {application.jobTitle}
              </h3>
              <p className="text-xs font-semibold text-slate-600 mt-0.5 truncate">
                {application.company}
              </p>
              
              {/* Meta pills */}
              <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-slate-500">
                {application.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{application.location}</span>
                  </span>
                )}
                {application.salaryRange && (
                  <span className="inline-flex items-center gap-1 font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <DollarSign className="w-3 h-3" />
                    <span>{application.salaryRange}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="shrink-0 flex flex-col items-end gap-1">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ring-1 ${statusInfo.color}`}
            >
              <span className={`w-2 h-2 rounded-full ${statusInfo.dot} animate-pulse`} />
              {application.status}
            </span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Applied {formattedDate}
            </span>
          </div>
        </div>

        {/* Pipeline Tracker Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          {isWithdrawn ? (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-semibold">Withdrawn on {application.withdrawnAt ? new Date(application.withdrawnAt).toLocaleDateString() : 'N/A'}:</span>
                <span className="italic text-slate-500 truncate max-w-xs">{application.withdrawalReason || 'Candidate withdrew'}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Archived</span>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between relative mb-2">
                {/* Connecting track line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 w-full z-0 rounded-full" />
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 transition-all duration-500 z-0 rounded-full"
                  style={{
                    width: `${((Math.max(1, currentStep) - 1) / 3) * 100}%`
                  }}
                />

                {/* Pipeline step nodes */}
                {PIPELINE_STEPS.map((stepItem) => {
                  const isCompleted = currentStep > stepItem.step;
                  const isCurrent = currentStep === stepItem.step;
                  return (
                    <div key={stepItem.step} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                          isCompleted
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : isCurrent
                            ? 'bg-white border-2 border-indigo-600 text-indigo-600 ring-4 ring-indigo-50 shadow-xs'
                            : 'bg-white border-2 border-slate-200 text-slate-400'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : stepItem.step}
                      </div>
                      <span
                        className={`text-[10px] font-semibold mt-1 transition ${
                          isCurrent
                            ? 'text-indigo-600 font-bold'
                            : isCompleted
                            ? 'text-slate-700'
                            : 'text-slate-400'
                        }`}
                      >
                        {stepItem.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Special Notification for Interview or Offer */}
        {application.status === 'Interview Scheduled' && application.interviewDate && (
          <div className="mt-3.5 p-3 rounded-xl bg-purple-50/80 border border-purple-200 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-purple-900 font-medium">
              <Video className="w-4 h-4 text-purple-600 shrink-0" />
              <span>
                <strong>Upcoming Interview:</strong> {new Date(application.interviewDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })} ({application.interviewType || 'Video Call'})
              </span>
            </div>
            <button
              onClick={() => onViewDetails(application)}
              className="text-purple-700 font-bold hover:underline shrink-0 text-[11px]"
            >
              View Prep Details &rarr;
            </button>
          </div>
        )}

        {application.status === 'Offer Extended' && (
          <div className="mt-3.5 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-emerald-900 font-medium">
              <Award className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Formal Offer Package Ready!</strong> Please review terms and compensation details.
              </span>
            </div>
            <button
              onClick={() => onViewDetails(application)}
              className="text-emerald-700 font-bold hover:underline shrink-0 text-[11px]"
            >
              View Offer Details &rarr;
            </button>
          </div>
        )}

        {/* Candidate Resume Badge */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 px-3 py-2 rounded-xl">
          <div className="flex items-center space-x-2 truncate">
            <FileText className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="font-semibold text-slate-700 truncate">
              {application.resumeName || application.resume || 'Resume.pdf'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono shrink-0">Attached</span>
        </div>
      </div>

      {/* Bottom Actions Bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* View Details */}
          <button
            onClick={() => onViewDetails(application)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isRecruiter ? 'Review Application' : 'View Timeline'}</span>
          </button>

          {/* Recruiter Stage Advance Selector */}
          {isRecruiter ? (
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase hidden sm:inline">Hiring Stage:</span>
              <select
                value={application.status}
                onChange={(e) => onUpdateStage && onUpdateStage(application.id, e.target.value)}
                className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="Submitted">1. Submitted</option>
                <option value="Under Review">2. Under Review</option>
                <option value="Interview Scheduled">3. Interview Scheduled</option>
                <option value="Offer Extended">4. Offer Extended</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          ) : (
            /* Candidate Withdraw Action */
            !isWithdrawn && !isOffer && (
              <button
                onClick={() => onWithdraw(application)}
                className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 text-xs font-medium transition"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Withdraw</span>
              </button>
            )
          )}
        </div>

        {/* Delete Record */}
        <button
          onClick={() => onDelete(application.id)}
          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
          title="Delete application from history"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
