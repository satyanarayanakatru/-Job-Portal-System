import React from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Clock, 
  FileText, 
  User, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Video, 
  Award, 
  AlertCircle, 
  XCircle,
  Download,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function ApplicationDetailsModal({ isOpen, onClose, application }) {
  if (!isOpen || !application) return null;

  const isWithdrawn = application.status === 'Withdrawn';
  const currentStep = application.statusStep || 1;

  const handleDownloadResume = () => {
    toast.success(`Downloading "${application.resumeName || 'Resume.pdf'}"...`);
  };

  const timelineSteps = [
    {
      step: 1,
      title: 'Application Submitted',
      date: application.appliedAt ? new Date(application.appliedAt).toLocaleString() : 'Recently',
      desc: 'Your application materials and profile resume were received by the applicant tracking system.',
      status: currentStep >= 1 ? 'completed' : 'pending',
    },
    {
      step: 2,
      title: 'Talent Acquisition & Screening',
      date: currentStep >= 2 ? 'Completed' : 'Pending Review',
      desc: application.notes || 'The hiring manager is reviewing your background against open role qualifications.',
      status: currentStep >= 2 ? 'completed' : currentStep === 1 ? 'current' : 'pending',
    },
    {
      step: 3,
      title: 'Technical / Cultural Interview Rounds',
      date: application.interviewDate 
        ? new Date(application.interviewDate).toLocaleString() 
        : currentStep >= 3 ? 'In Progress' : 'Pending Screening',
      desc: application.interviewType 
        ? `Scheduled Format: ${application.interviewType}`
        : 'Interviews with engineering leads and product managers.',
      status: currentStep >= 3 ? 'completed' : 'pending',
    },
    {
      step: 4,
      title: 'Final Decision & Formal Offer',
      date: application.status === 'Offer Extended' ? 'Offer Extended' : 'Awaiting Completion',
      desc: application.status === 'Offer Extended'
        ? application.notes || 'Official offer package generated. Includes compensation and benefits.'
        : 'Final selection and compensation review.',
      status: application.status === 'Offer Extended' ? 'completed' : 'pending',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[88vh] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar - Fixed */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/70 flex items-start justify-between shrink-0">
          <div className="flex items-start space-x-4">
            <img
              src={application.companyLogo}
              alt={application.company}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(application.company || 'Company')}`;
              }}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white shadow-xs shrink-0 bg-white"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    application.status === 'Offer Extended'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : application.status === 'Interview Scheduled'
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : application.status === 'Withdrawn'
                      ? 'bg-slate-200 text-slate-700'
                      : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                  }`}
                >
                  {application.status}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  ID: #{application.id}
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 leading-snug">
                {application.jobTitle}
              </h2>
              <p className="text-xs text-slate-600 font-semibold mt-0.5">
                {application.company} • {application.location} • {application.salaryRange}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto min-h-0">
          
          {/* Withdrawn Notice if applicable */}
          {isWithdrawn && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs">
              <div className="flex items-center gap-2 font-bold mb-1">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Application Withdrawn</span>
              </div>
              <p className="text-rose-700">
                Reason: <em>"{application.withdrawalReason || 'Candidate withdrew'}"</em> on {application.withdrawnAt ? new Date(application.withdrawnAt).toLocaleString() : 'N/A'}.
              </p>
            </div>
          )}

          {/* Hiring Pipeline Journey */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Hiring Progression Timeline
            </h3>

            <div className="space-y-4">
              {timelineSteps.map((step, idx) => {
                const isStepActive = step.status === 'completed';
                const isCurrent = step.status === 'current';

                return (
                  <div key={step.step} className="flex items-start space-x-3.5 relative">
                    {/* Vertical connecting line */}
                    {idx < timelineSteps.length - 1 && (
                      <div 
                        className={`absolute left-3.5 top-7 w-0.5 h-12 -z-0 ${
                          isStepActive ? 'bg-indigo-600' : 'bg-slate-200'
                        }`} 
                      />
                    )}

                    {/* Step Icon */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 text-xs font-bold ${
                        isStepActive
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : isCurrent
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {isStepActive ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span>{step.step}</span>
                      )}
                    </div>

                    {/* Step Text Info */}
                    <div className="flex-1 bg-slate-50/80 rounded-2xl p-3 border border-slate-200/70">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900">
                          {step.title}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {step.date}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Candidate Submission Info */}
          <div className="border-t border-slate-100 pt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Candidate Submission Summary
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Applicant Name
                </span>
                <span className="font-bold text-slate-800">
                  {application.applicantName || 'Candidate'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Email Contact
                </span>
                <span className="font-bold text-slate-800">
                  {application.applicantEmail || 'candidate@jobportal.com'}
                </span>
              </div>
            </div>

            {/* Attached Resume */}
            <div className="mt-3 p-3.5 bg-indigo-50/60 border border-indigo-100 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3 truncate">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {application.resumeName || application.resume || 'Candidate_Resume.pdf'}
                  </p>
                  <p className="text-[10px] text-slate-500">Verified Profile Attachment</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadResume}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-xl transition shadow-xs shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Hiring Team Notes */}
          {application.notes && (
            <div className="border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-1.5">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <span>Hiring Team Note / Activity</span>
              </div>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed italic">
                "{application.notes}"
              </p>
            </div>
          )}
        </div>

        {/* Modal Actions Footer - Fixed */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          {application.jobId ? (
            <Link
              to={`/jobs/${application.jobId}`}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition"
            >
              <span>View Original Job Posting</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          ) : <div />}

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
