import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProfileHeader from '../components/profile/ProfileHeader';
import EditProfileModal from '../components/profile/EditProfileModal';
import SkillsSection from '../components/profile/SkillsSection';
import ExperienceSection from '../components/profile/ExperienceSection';
import EducationSection from '../components/profile/EducationSection';
import ResumeSection from '../components/profile/ResumeSection';
import SkeletonLoader from '../components/common/SkeletonLoader';
import QuickApplyModal from '../components/search/QuickApplyModal';
import { profileService } from '../services/profileService';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { 
  UserCircle, 
  Sparkles, 
  Briefcase, 
  GraduationCap, 
  Tag, 
  FileText, 
  ShieldCheck, 
  CheckCircle2,
  Share2,
  Send,
  Award,
  Calendar,
  Building2,
  MapPin,
  Clock,
  ArrowRight,
  UserCheck,
  Check
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export default function CandidateProfile() {
  const { user } = useAuth();
  const isRecruiter = user?.role === 'recruiter';

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Live Jobs & Applications for direct apply from profile
  const [availableJobs, setAvailableJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [selectedJobToApply, setSelectedJobToApply] = useState(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  // Load profile from service
  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = profileService.getProfile();
      setProfile(data);

      const jobsData = await jobService.getJobs();
      setAvailableJobs(jobsData || []);

      const apps = applicationService.getApplications();
      setMyApplications(apps || []);
    } catch (err) {
      toast.error('Failed to load candidate profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // Update Core Profile
  const handleSaveProfile = (updatedData) => {
    try {
      const res = profileService.updateProfile(updatedData);
      setProfile(res);
      toast.success('Candidate profile information updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  // Skills Handlers
  const handleUpdateSkills = (newSkills) => {
    const res = profileService.updateSkills(newSkills);
    setProfile(res);
  };

  // Experience Handlers
  const handleAddExperience = (expData) => {
    const res = profileService.addExperience(expData);
    setProfile(res);
  };

  const handleUpdateExperience = (id, expData) => {
    const res = profileService.updateExperience(id, expData);
    setProfile(res);
  };

  const handleDeleteExperience = (id) => {
    const res = profileService.deleteExperience(id);
    setProfile(res);
  };

  // Education Handlers
  const handleAddEducation = (eduData) => {
    const res = profileService.addEducation(eduData);
    setProfile(res);
  };

  const handleUpdateEducation = (id, eduData) => {
    const res = profileService.updateEducation(id, eduData);
    setProfile(res);
  };

  const handleDeleteEducation = (id) => {
    const res = profileService.deleteEducation(id);
    setProfile(res);
  };

  // Resume Handlers
  const handleUploadResume = (resumeInfo) => {
    const res = profileService.uploadResume(resumeInfo);
    setProfile(res);
  };

  const handleRemoveResume = () => {
    const res = profileService.removeResume();
    setProfile(res);
  };

  // Quick Apply from Profile Handlers
  const handleOpenApply = (job) => {
    setSelectedJobToApply(job);
    setApplyModalOpen(true);
  };

  const handleApplicationCompleted = (newApp) => {
    const updated = [newApp, ...myApplications];
    setMyApplications(updated);
  };

  // Recruiter Direct Hire Handler
  const handleDirectHireCandidate = () => {
    if (!profile) return;
    const existing = applicationService.getApplications();
    const candidateApp = existing.find(
      (a) => a.applicantEmail === profile.email || a.applicantName === profile.fullName
    );

    if (candidateApp) {
      applicationService.updateApplicationStage(candidateApp.id, 'Offer Extended', {
        notes: `Candidate ${profile.fullName} directly hired and extended formal offer package by Recruiter Alex Morgan.`,
      });
      toast.success(`🎉 Congratulations! Formal offer extended to ${profile.fullName}. Candidate hired!`);
    } else {
      // Create new hired record for top job
      const topJob = availableJobs[0] || { id: 'job_1', title: 'Senior Software Engineer', company: 'TechCorp' };
      const newHired = {
        id: 'app_' + Date.now(),
        jobId: String(topJob.id),
        jobTitle: topJob.title,
        company: topJob.company,
        companyLogo: topJob.companyLogo,
        location: topJob.location || 'San Francisco, CA',
        salaryRange: topJob.salaryRange || '$140,000 - $175,000',
        applicantName: profile.fullName,
        applicantEmail: profile.email,
        phone: profile.phone,
        resume: profile.resume?.name || 'Resume.pdf',
        resumeName: profile.resume?.name || 'Resume.pdf',
        status: 'Offer Extended',
        statusStep: 4,
        appliedAt: new Date().toISOString(),
        notes: `Candidate directly hired and extended formal offer package by Recruiter Alex Morgan.`,
      };
      const updated = [newHired, ...existing];
      applicationService.getApplications();
      localStorage.setItem('job_portal_applications', JSON.stringify(updated));
      toast.success(`🎉 Candidate ${profile.fullName} has been formally hired for "${topJob.title}"!`);
    }
    loadProfile();
  };

  const completeness = profile ? profileService.calculateCompleteness(profile) : 0;

  // Filter candidate's own applications
  const userApplications = myApplications.filter(
    (app) => app.applicantEmail === profile?.email || app.applicantName === profile?.fullName
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        
        {/* Recruiter Banner if viewing in recruiter portal */}
        {isRecruiter && (
          <div className="p-4 bg-gradient-to-r from-purple-900 to-indigo-950 text-white rounded-2xl border border-purple-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <h4 className="text-sm font-bold">Recruiter Talent Review Mode</h4>
                <p className="text-xs text-purple-200">
                  Reviewing verified credentials for {profile?.fullName || 'Candidate'}. You can extend an immediate formal offer.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleDirectHireCandidate}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/30 transition flex items-center gap-1.5"
              >
                <Award className="w-4 h-4" />
                <span>Hire this Candidate</span>
              </button>
            </div>
          </div>
        )}

        {/* Top Breadcrumb & Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-500">
              {isRecruiter ? 'Talent Directory' : 'Candidate Hub'}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-bold text-slate-900">
              {isRecruiter ? 'Candidate Technical Profile' : 'Profile Management'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                toast.success('Public profile link copied to clipboard!');
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Share Profile</span>
            </button>
          </div>
        </div>

        {/* Profile Header & Identity Card */}
        {loading ? (
          <SkeletonLoader count={1} />
        ) : (
          <ProfileHeader
            profile={profile}
            completeness={completeness}
            onOpenEdit={() => setEditModalOpen(true)}
          />
        )}

        {/* Candidate Direct Job Applications Tracker (Only for Candidates) */}
        {!isRecruiter && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    My Applied Positions ({userApplications.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Real-time status updates reflecting directly from the Recruiter Review queue
                  </p>
                </div>
              </div>

              <Link
                to="/applications"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1"
              >
                <span>View Full Pipeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {userApplications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {userApplications.slice(0, 4).map((app) => (
                  <div
                    key={app.id}
                    className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-xs transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {app.jobTitle}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-medium truncate">
                            {app.company} • {app.location}
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${
                          app.status === 'Offer Extended'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : app.status === 'Interview Scheduled'
                            ? 'bg-purple-100 text-purple-800 border border-purple-300'
                            : app.status === 'Under Review'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-blue-100 text-blue-800 border border-blue-300'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Applied: {new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="font-semibold text-indigo-600">Synced with Recruiter ATS</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-slate-500 text-xs bg-slate-50/50 rounded-2xl border border-slate-100">
                You haven't applied to any roles yet. Explore matching roles below and apply with one click!
              </div>
            )}
          </div>
        )}

        {/* Explore & Apply for Matched Positions (Direct Candidate Apply) */}
        {!isRecruiter && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Recommended Openings • Apply from Profile
                  </h3>
                  <p className="text-xs text-slate-500">
                    Applying here immediately reflects in the Recruiter's Portal & ATS Review Queue
                  </p>
                </div>
              </div>

              <Link
                to="/jobs/search"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1"
              >
                <span>Browse All Jobs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
              {availableJobs.slice(0, 4).map((job) => {
                const isAlreadyApplied = userApplications.some(
                  (a) => String(a.jobId) === String(job.id)
                );
                const appliedRecord = userApplications.find((a) => String(a.jobId) === String(job.id));

                return (
                  <div
                    key={job.id}
                    className="p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-indigo-300 hover:shadow-xs transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start space-x-3 mb-2.5">
                        <img
                          src={job.companyLogo}
                          alt={job.company}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(job.company)}`;
                          }}
                          className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100 shrink-0 bg-slate-50"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {job.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-semibold truncate">
                            {job.company} • {job.location}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] mb-3">
                        <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {job.salaryRange}
                        </span>
                        <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                          {job.employmentType}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        to={`/jobs/${job.id}`}
                        className="text-[11px] font-semibold text-slate-600 hover:text-indigo-600"
                      >
                        View Details
                      </Link>

                      {isAlreadyApplied ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                          <Check className="w-3.5 h-3.5" />
                          <span>Applied ({appliedRecord?.status || 'In Review'})</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenApply(job)}
                          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs hover:shadow-indigo-600/20 transition flex items-center gap-1.5"
                        >
                          <Send className="w-3 h-3" />
                          <span>Apply from Profile</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Resume Section */}
        {loading ? (
          <SkeletonLoader count={1} />
        ) : (
          <ResumeSection
            resume={profile?.resume}
            onUpload={handleUploadResume}
            onRemove={handleRemoveResume}
          />
        )}

        {/* Skills Management Section */}
        {loading ? (
          <SkeletonLoader count={1} />
        ) : (
          <SkillsSection
            skills={profile?.skills || []}
            onUpdateSkills={handleUpdateSkills}
          />
        )}

        {/* Work Experience Section */}
        {loading ? (
          <SkeletonLoader count={2} />
        ) : (
          <ExperienceSection
            experiences={profile?.experience || []}
            onAdd={handleAddExperience}
            onUpdate={handleUpdateExperience}
            onDelete={handleDeleteExperience}
          />
        )}

        {/* Education & Academic Section */}
        {loading ? (
          <SkeletonLoader count={2} />
        ) : (
          <EducationSection
            education={profile?.education || []}
            onAdd={handleAddEducation}
            onUpdate={handleUpdateEducation}
            onDelete={handleDeleteEducation}
          />
        )}
      </div>

      {/* Edit Profile Details Modal */}
      <EditProfileModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />

      {/* Quick Apply Modal for Direct Profile Apply */}
      <QuickApplyModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        job={selectedJobToApply}
        onApplied={handleApplicationCompleted}
      />
    </DashboardLayout>
  );
}