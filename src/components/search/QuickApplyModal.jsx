import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../utils/localStorage';
import { 
  X, 
  Briefcase, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  FileUp,
  DollarSign,
  MapPin
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function QuickApplyModal({ isOpen, onClose, job }) {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+1 (555) 234-5678',
    portfolioUrl: 'https://github.com',
    coverNote: 'Excited to apply! I bring hands-on experience in building scalable web apps with React and clean architectures.',
    resumeName: 'Sarah_Jenkins_Frontend_CV.pdf',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !job) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate application processing
    await new Promise((r) => setTimeout(r, 650));

    // Save to LocalStorage under 'job_portal_applications'
    const existingApps = storage.get('job_portal_applications', []);
    const newApplication = {
      id: 'app_' + Date.now(),
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      companyLogo: job.companyLogo,
      location: job.location,
      salaryRange: job.salaryRange,
      applicantName: formData.fullName,
      applicantEmail: formData.email,
      phone: formData.phone,
      resume: formData.resumeName,
      status: 'Submitted',
      appliedAt: new Date().toISOString(),
    };

    storage.set('job_portal_applications', [newApplication, ...existingApps]);

    // Also update applicants count on the job
    try {
      const existingJobs = storage.get('job_portal_jobs', []);
      const updatedJobs = existingJobs.map((j) => {
        if (String(j.id) === String(job.id)) {
          return { ...j, applicantsCount: (j.applicantsCount || 0) + 1 };
        }
        return j;
      });
      storage.set('job_portal_jobs', updatedJobs);
    } catch (err) {
      console.error('Failed to update job applicants count', err);
    }

    setIsSubmitting(false);
    toast.success(`Application for "${job.title}" at ${job.company} submitted successfully!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center space-x-3">
            <img
              src={job.companyLogo}
              alt={job.company}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(job.company)}`;
              }}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100 shrink-0"
            />
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                Quick Apply: {job.title}
              </h3>
              <p className="text-xs text-indigo-600 font-medium">
                {job.company} • {job.location} • {job.salaryRange}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Row 1: Candidate Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Your full legal name"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@email.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Phone & Portfolio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Portfolio / GitHub / LinkedIn
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Globe className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={formData.portfolioUrl}
                  onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                  placeholder="https://github.com/username"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Resume Attached */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Attached Resume Document
            </label>
            <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-xs">{formData.resumeName}</p>
                  <p className="text-[10px] text-slate-400">Default verified profile resume (PDF, 240 KB)</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-300">
                Ready
              </span>
            </div>
          </div>

          {/* Cover Note / Pitch */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Brief Note for Hiring Team <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={3}
              value={formData.coverNote}
              onChange={(e) => setFormData({ ...formData, coverNote: e.target.value })}
              placeholder="Why are you a great fit for this position? Highlight relevant projects or skills..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
            />
          </div>

          {/* Footer Action */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
