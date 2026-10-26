import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  X, 
  Building2, 
  MapPin, 
  Globe, 
  Mail, 
  Users, 
  Image, 
  FileText, 
  CheckCircle2, 
  Sparkles,
  Briefcase,
  AlertCircle
} from 'lucide-react';

const INDUSTRIES = [
  'Technology',
  'Finance & FinTech',
  'Cloud Computing',
  'Artificial Intelligence',
  'Cybersecurity',
  'Healthcare & Biotech',
  'E-Commerce',
  'Telecommunications',
  'Automotive & EV',
];

export default function CompanyModal({ isOpen, onClose, onSubmit, companyToEdit = null }) {
  const isEditing = Boolean(companyToEdit);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      industry: 'Technology',
      location: '',
      website: '',
      email: '',
      employees: '100 - 500',
      openJobsCount: 4,
      logo: '',
      description: '',
    },
  });

  const logoValue = watch('logo');
  const nameValue = watch('name');

  // Populate form if editing
  useEffect(() => {
    if (companyToEdit) {
      reset({
        name: companyToEdit.name || '',
        industry: companyToEdit.industry || 'Technology',
        location: companyToEdit.location || '',
        website: companyToEdit.website || '',
        email: companyToEdit.email || '',
        employees: companyToEdit.employees || '100 - 500',
        openJobsCount: companyToEdit.openJobsCount || 4,
        logo: companyToEdit.logo || '',
        description: companyToEdit.description || '',
      });
    } else {
      reset({
        name: '',
        industry: 'Technology',
        location: 'San Francisco, CA',
        website: 'https://',
        email: '',
        employees: '100 - 500',
        openJobsCount: 3,
        logo: '',
        description: '',
      });
    }
  }, [companyToEdit, reset, isOpen]);

  if (!isOpen) return null;

  const handleFormSubmit = async (data) => {
    // If no custom logo provided, generate unique Dicebear avatar based on name
    const finalData = {
      ...data,
      logo:
        data.logo.trim() ||
        `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(data.name)}`,
    };
    await onSubmit(finalData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isEditing ? `Edit Company: ${companyToEdit.name}` : 'Register New Company'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? 'Update verified corporate information, contacts, and headcount'
                  : 'Add a new enterprise hiring partner to the global directory'}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4 text-xs">
          
          {/* Row 1: Company Name & Industry */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Stripe Horizon Inc."
                  {...register('name', {
                    required: 'Company name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  })}
                  className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 transition ${
                    errors.name ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-[11px] text-rose-500 font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Industry Vertical <span className="text-rose-500">*</span>
              </label>
              <select
                {...register('industry', { required: 'Please select an industry' })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Location & Headcount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Headquarters Location <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Austin, TX or Remote"
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
                Number of Employees <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Users className="w-4 h-4" />
                </div>
                <select
                  {...register('employees')}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                >
                  <option value="1 - 50">1 - 50 employees (Early Startup)</option>
                  <option value="50 - 200">50 - 200 employees (Growth)</option>
                  <option value="200 - 500">200 - 500 employees (Scale-up)</option>
                  <option value="500 - 1,500">500 - 1,500 employees (Mid-Enterprise)</option>
                  <option value="1,500 - 5,000">1,500 - 5,000 employees (Large Enterprise)</option>
                  <option value="5,000+">5,000+ employees (Global Multicorp)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Row 3: Website & Contact Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Company Website <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Globe className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="https://company.com"
                  {...register('website', {
                    required: 'Website is required',
                    pattern: {
                      value: /^https?:\/\/.+/i,
                      message: 'Must start with http:// or https://',
                    },
                  })}
                  className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 transition ${
                    errors.website ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
              </div>
              {errors.website && (
                <p className="mt-1 text-[11px] text-rose-500 font-medium">
                  {errors.website.message}
                </p>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Contact / Talent Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="recruiting@company.com"
                  {...register('email', {
                    required: 'Contact email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address format',
                    },
                  })}
                  className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 transition ${
                    errors.email ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-[11px] text-rose-500 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 4: Logo URL & Open Jobs Count */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Logo Image URL <span className="text-slate-400 font-normal">(optional - auto-generates if empty)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Image className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... or leave blank"
                  {...register('logo')}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Active Openings
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  {...register('openJobsCount')}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Row 5: Description */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Company Overview & Culture Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Describe the company's product, mission, engineering culture, and work environment..."
              {...register('description', {
                required: 'Company description is required',
                minLength: { value: 15, message: 'Please provide at least 15 characters of description' },
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

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-md shadow-indigo-500/20 transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Create Company'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
