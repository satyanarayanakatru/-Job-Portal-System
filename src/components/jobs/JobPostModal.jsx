import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  X, 
  Briefcase, 
  Building2, 
  DollarSign, 
  MapPin, 
  Calendar, 
  Tag, 
  CheckCircle2, 
  Plus, 
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

const CATEGORIES = [
  'Software Engineering',
  'DevOps & Cloud',
  'Data & AI',
  'Product & Design',
  'Cybersecurity',
  'Mobile Development',
  'Quality Assurance',
  'Sales & Marketing',
];

const EMPLOYMENT_TYPES = [
  'Full Time',
  'Part Time',
  'Contract',
  'Remote',
  'Internship',
];

const EXPERIENCE_LEVELS = [
  'Entry Level (0-2 yrs)',
  'Mid Level (3-5 yrs)',
  'Senior Level (5-8 yrs)',
  'Lead / Principal (8+ yrs)',
];

export default function JobPostModal({ isOpen, onClose, onSubmit, jobToEdit = null }) {
  const isEditing = Boolean(jobToEdit);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [status, setStatus] = useState('Open');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: '',
      company: '',
      category: 'Software Engineering',
      employmentType: 'Full Time',
      experienceLevel: 'Mid Level (3-5 yrs)',
      salaryRange: '$120,000 - $155,000',
      location: 'San Francisco, CA (Hybrid)',
      applicationDeadline: '2026-12-31',
      description: '',
    },
  });

  // Populate form if editing
  useEffect(() => {
    if (jobToEdit) {
      reset({
        title: jobToEdit.title || '',
        company: jobToEdit.company || '',
        category: jobToEdit.category || 'Software Engineering',
        employmentType: jobToEdit.employmentType || 'Full Time',
        experienceLevel: jobToEdit.experienceLevel || 'Mid Level (3-5 yrs)',
        salaryRange: jobToEdit.salaryRange || '$120,000 - $155,000',
        location: jobToEdit.location || 'Remote',
        applicationDeadline: jobToEdit.applicationDeadline || '2026-12-31',
        description: jobToEdit.description || '',
      });
      setSkills(Array.isArray(jobToEdit.requiredSkills) ? jobToEdit.requiredSkills : []);
      setStatus(jobToEdit.status || 'Open');
    } else {
      reset({
        title: '',
        company: 'Stripe Horizon',
        category: 'Software Engineering',
        employmentType: 'Full Time',
        experienceLevel: 'Mid Level (3-5 yrs)',
        salaryRange: '$125,000 - $160,000',
        location: 'Remote',
        applicationDeadline: '2026-12-31',
        description: '',
      });
      setSkills(['React.js', 'Tailwind CSS', 'TypeScript']);
      setStatus('Open');
    }
  }, [jobToEdit, reset, isOpen]);

  if (!isOpen) return null;

  // Add skill tag
  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const handleKeyDownSkill = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleFormSubmit = async (data) => {
    const payload = {
      ...data,
      requiredSkills: skills.length > 0 ? skills : ['General Tech', 'Problem Solving'],
      status,
    };
    await onSubmit(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[88vh] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed at Top */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                {isEditing ? `Edit Job Posting: ${jobToEdit.title}` : 'Create New Job Posting'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? 'Update compensation, requirements, application deadline, and visibility'
                  : 'Publish a new opening to discover and attract qualified candidates'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form - Body with Dedicated Scrolling */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          
          <div className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
          {/* Row 1: Job Title & Hiring Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Job Title <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Senior Frontend Engineer"
                  {...register('title', {
                    required: 'Job title is required',
                    minLength: { value: 3, message: 'Title must be at least 3 characters' },
                  })}
                  className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 transition ${
                    errors.title ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
              </div>
              {errors.title && (
                <p className="mt-1 text-[11px] text-rose-500 font-medium">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Hiring Company / Employer <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Stripe Horizon"
                  {...register('company', { required: 'Company is required' })}
                  className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 transition ${
                    errors.company ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
              </div>
              {errors.company && (
                <p className="mt-1 text-[11px] text-rose-500 font-medium">
                  {errors.company.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Category & Employment Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Job Category <span className="text-rose-500">*</span>
              </label>
              <select
                {...register('category')}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Employment Type <span className="text-rose-500">*</span>
              </label>
              <select
                {...register('employmentType')}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              >
                {EMPLOYMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Experience Level & Salary Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Experience Level <span className="text-rose-500">*</span>
              </label>
              <select
                {...register('experienceLevel')}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              >
                {EXPERIENCE_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Salary Range (Annual Compensation) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <DollarSign className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. $130,000 - $165,000"
                  {...register('salaryRange', { required: 'Salary range is required' })}
                  className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 transition ${
                    errors.salaryRange ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
              </div>
              {errors.salaryRange && (
                <p className="mt-1 text-[11px] text-rose-500 font-medium">
                  {errors.salaryRange.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 4: Location & Application Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Location <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Austin, TX or Remote (Worldwide)"
                  {...register('location', { required: 'Location is required' })}
                  className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 transition ${
                    errors.location ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
              </div>
              {errors.location && (
                <p className="mt-1 text-[11px] text-rose-500 font-medium">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Application Deadline <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="date"
                  {...register('applicationDeadline', { required: 'Deadline is required' })}
                  className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 transition ${
                    errors.applicationDeadline ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
              </div>
              {errors.applicationDeadline && (
                <p className="mt-1 text-[11px] text-rose-500 font-medium">
                  {errors.applicationDeadline.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 5: Required Skills Tags Input */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Required Skills (Tags)
            </label>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex flex-wrap gap-1.5 min-h-[28px]">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-200"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-indigo-400 hover:text-indigo-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center space-x-2 pt-1 border-t border-slate-200/60">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleKeyDownSkill}
                  placeholder="Type skill & press Enter or comma (e.g. Next.js, Node.js, AWS)"
                  className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-indigo-400"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Row 6: Job Status Toggle (Open / Closed) */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">Job Status</span>
              <span className="text-[11px] text-slate-500">
                {status === 'Open'
                  ? 'Open for candidate submissions and actively listed in search.'
                  : 'Closed for new applications. Stored as an inactive posting.'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setStatus(status === 'Open' ? 'Closed' : 'Open')}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                status === 'Open'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-200 text-slate-700 border border-slate-300'
              }`}
            >
              {status === 'Open' ? <ToggleRight className="w-4 h-4 text-emerald-600" /> : <ToggleLeft className="w-4 h-4 text-slate-500" />}
              <span>{status.toUpperCase()}</span>
            </button>
          </div>

          {/* Row 7: Description */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Job Description & Core Scope <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Outline candidate responsibilities, expectations, and day-to-day requirements..."
              {...register('description', {
                required: 'Job description is required',
                minLength: { value: 20, message: 'Minimum 20 characters required' },
              })}
              className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 transition ${
                errors.description ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-[11px] text-rose-500 font-medium">
                {errors.description.message}
              </p>
            )}
          </div>

          </div>

          {/* Action Footer - Fixed at Bottom */}
          <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end space-x-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isEditing ? 'Save Job Posting' : 'Publish Job Posting'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
