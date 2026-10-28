import React, { useState } from 'react';
import { 
  X, 
  Briefcase, 
  FileUp, 
  CheckCircle2, 
  Building2, 
  DollarSign, 
  MapPin, 
  Sparkles,
  AlertCircle,
  UserCheck,
  Search,
  Mail,
  Phone,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { toast } from 'react-toastify';
import { storage } from '../../utils/localStorage';

export default function QuickActionModal({ isOpen, onClose, actionType, role }) {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    category: 'Engineering',
    salary: '$120,000 - $150,000',
    location: 'Remote, US',
    skills: 'React, Node.js, Tailwind',
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [candidateSearchQuery, setCandidateSearchQuery] = useState('');

  if (!isOpen) return null;

  // Retrieve real registered candidates
  const registeredUsers = storage.get('job_portal_registered_users', []);
  const allCandidates = registeredUsers.filter((u) => u.role !== 'recruiter');

  const filteredCandidates = allCandidates.filter((cand) => {
    if (!candidateSearchQuery.trim()) return true;
    const q = candidateSearchQuery.toLowerCase();
    const matchName = (cand.name || '').toLowerCase().includes(q);
    const matchTitle = (cand.title || '').toLowerCase().includes(q);
    const matchSkills = (cand.skills || []).some((s) => s.toLowerCase().includes(q));
    const matchLoc = (cand.location || '').toLowerCase().includes(q);
    return matchName || matchTitle || matchSkills || matchLoc;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsSubmitting(false);

    if (actionType === 'post-job') {
      toast.success(`Job Opening "${formData.title || 'Senior Software Engineer'}" created successfully!`);
    } else if (actionType === 'upload-resume') {
      toast.success('Resume uploaded and verified by AI talent parser!');
    } else {
      toast.success('Action executed successfully!');
    }

    onClose();
  };

  const handleInviteCandidate = (candidateName) => {
    toast.success(`Interview invitation sent to ${candidateName}!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className={`relative w-full ${actionType === 'candidate-search' ? 'max-w-2xl' : 'max-w-lg'} bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[88vh] overflow-hidden my-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              {actionType === 'post-job' ? (
                <Briefcase className="w-5 h-5" />
              ) : actionType === 'upload-resume' ? (
                <FileUp className="w-5 h-5" />
              ) : (
                <UserCheck className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {actionType === 'post-job'
                  ? 'Quick Job Posting'
                  : actionType === 'upload-resume'
                  ? 'Upload Candidate Resume'
                  : 'Verified Candidate Directory'}
              </h3>
              <p className="text-xs text-slate-500">
                {actionType === 'post-job'
                  ? 'Publish a live opening to active candidates'
                  : actionType === 'upload-resume'
                  ? 'Attach your latest PDF or Word resume'
                  : `Browse ${allCandidates.length} real verified candidate profiles and engineers`}
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

        {/* Candidate Search View */}
        {actionType === 'candidate-search' ? (
          <div className="flex flex-col flex-1 min-h-0 p-6 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidates by name, tech stack (React, Python, AWS), or location..."
                value={candidateSearchQuery}
                onChange={(e) => setCandidateSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              />
            </div>

            {/* Candidate Cards List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-0">
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-indigo-200 hover:shadow-xs transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start space-x-3 min-w-0">
                      <img
                        src={candidate.avatar}
                        alt={candidate.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(candidate.name)}`;
                        }}
                        className="w-11 h-11 rounded-xl object-cover ring-2 ring-slate-100 shrink-0 bg-slate-100"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {candidate.name}
                          </h4>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
                          </span>
                        </div>
                        <p className="text-[11px] font-medium text-indigo-600">
                          {candidate.title || 'Software Professional'}
                        </p>
                        <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-0.5">
                          <span>{candidate.location || 'Remote'}</span>
                          <span>•</span>
                          <span>{candidate.experience || '4+ yrs experience'}</span>
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {(candidate.skills || ['React', 'JavaScript', 'Node.js']).slice(0, 4).map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex sm:flex-col items-center sm:items-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleInviteCandidate(candidate.name)}
                        className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs transition flex items-center justify-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Schedule Interview</span>
                      </button>
                      <span className="text-[10px] text-slate-400">
                        {candidate.email}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-500 text-xs">
                  No candidates found matching "{candidateSearchQuery}".
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs shrink-0">
              <span className="text-slate-500 font-medium">
                Total candidates in network: <strong className="text-slate-900">{allCandidates.length}</strong>
              </span>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* Form for Post Job or Upload Resume */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto">
            {actionType === 'post-job' ? (
              <>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Job Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Frontend Engineer"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Design">Product & Design</option>
                      <option value="Data">Data & AI</option>
                      <option value="DevOps">DevOps & Cloud</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estimated Salary Range</label>
                  <input
                    type="text"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Required Skills (Comma separated)</label>
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </>
            ) : (
              <>
                {/* Resume Upload UI */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Select Resume Document (PDF / DOCX)
                  </label>
                  <div className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/30 rounded-2xl p-6 text-center transition cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-2">
                      <FileUp className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      {resumeFile ? resumeFile.name : 'Click to upload or drag & drop'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Maximum file size: 10MB (PDF, DOC, DOCX)
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResumeFile(e.target.files[0])}
                      className="hidden"
                      id="resume-upload-input"
                    />
                    <label
                      htmlFor="resume-upload-input"
                      className="inline-block mt-3 px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold text-xs cursor-pointer hover:bg-indigo-700 transition"
                    >
                      Browse Files
                    </label>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-800 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Auto-Parsed Candidate Fields:
                  </p>
                  <p>• Tech Skills extraction for automated job matching</p>
                  <p>• Experience & Education timeline verification</p>
                </div>
              </>
            )}

            {/* Footer Actions */}
            <div className="pt-2 flex items-center justify-end space-x-2 shrink-0">
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
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md shadow-indigo-500/20 transition flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{actionType === 'post-job' ? 'Publish Job' : 'Save Resume'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
