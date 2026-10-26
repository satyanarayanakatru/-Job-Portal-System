import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProfileHeader from '../components/profile/ProfileHeader';
import EditProfileModal from '../components/profile/EditProfileModal';
import SkillsSection from '../components/profile/SkillsSection';
import ExperienceSection from '../components/profile/ExperienceSection';
import EducationSection from '../components/profile/EducationSection';
import ResumeSection from '../components/profile/ResumeSection';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { profileService } from '../services/profileService';
import { 
  UserCircle, 
  Sparkles, 
  Briefcase, 
  GraduationCap, 
  Tag, 
  FileText, 
  ShieldCheck, 
  CheckCircle2,
  Share2
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function CandidateProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Load profile from service
  const loadProfile = () => {
    setLoading(true);
    try {
      const data = profileService.getProfile();
      setProfile(data);
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

  const completeness = profile ? profileService.calculateCompleteness(profile) : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        
        {/* Top Breadcrumb & Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-500">Candidate Hub</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-bold text-slate-900">Profile Management</span>
          </div>

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
    </DashboardLayout>
  );
}
