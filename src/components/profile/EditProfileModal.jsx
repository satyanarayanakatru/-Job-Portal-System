import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  FileText, 
  CheckCircle2, 
  Image, 
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';

export default function EditProfileModal({ isOpen, onClose, profile, onSave }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const avatarWatch = watch('avatar');

  useEffect(() => {
    if (profile && isOpen) {
      reset({
        fullName: profile.fullName || '',
        headline: profile.headline || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        avatar: profile.avatar || '',
        bio: profile.bio || '',
        github: profile.socialLinks?.github || '',
        linkedin: profile.socialLinks?.linkedin || '',
        portfolio: profile.socialLinks?.portfolio || '',
      });
    }
  }, [profile, isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    const payload = {
      fullName: data.fullName.trim(),
      headline: data.headline.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      address: data.address.trim(),
      avatar:
        data.avatar.trim() ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.fullName)}`,
      bio: data.bio.trim(),
      socialLinks: {
        github: data.github.trim(),
        linkedin: data.linkedin.trim(),
        portfolio: data.portfolio.trim(),
      },
    };

    await onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Edit Candidate Profile
              </h3>
              <p className="text-xs text-slate-500">
                Update your contact details, professional bio, and online links
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
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 text-xs">
          
          {/* Avatar Preview & URL */}
          <div className="flex items-center space-x-4 p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
            <img
              src={
                avatarWatch ||
                profile?.avatar ||
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120'
              }
              alt="Avatar Preview"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://api.dicebear.com/7.x/initials/svg?seed=Candidate';
              }}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow-xs shrink-0"
            />
            <div className="flex-1">
              <label className="block font-bold text-slate-700 mb-1">
                Profile Photo (Image URL)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Image className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... or leave blank for initials"
                  {...register('avatar')}
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-indigo-400 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Row 1: Full Name & Headline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Sarah Jenkins"
                {...register('fullName', {
                  required: 'Full name is required',
                  minLength: { value: 2, message: 'Minimum 2 characters' },
                })}
                className={`w-full px-3.5 py-2 bg-slate-50 border rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 transition ${
                  errors.fullName ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
              />
              {errors.fullName && (
                <p className="mt-1 text-[11px] text-rose-500 font-medium">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Professional Headline <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Frontend & React Engineer"
                {...register('headline', { required: 'Headline is required' })}
                className={`w-full px-3.5 py-2 bg-slate-50 border rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 transition ${
                  errors.headline ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
              />
              {errors.headline && (
                <p className="mt-1 text-[11px] text-rose-500 font-medium">
                  {errors.headline.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Email & Phone Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                placeholder="candidate@email.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email format',
                  },
                })}
                className={`w-full px-3.5 py-2 bg-slate-50 border rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 transition ${
                  errors.email ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-[11px] text-rose-500 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 234-5678"
                {...register('phone', { required: 'Mobile number is required' })}
                className={`w-full px-3.5 py-2 bg-slate-50 border rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 transition ${
                  errors.phone ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
              />
              {errors.phone && (
                <p className="mt-1 text-[11px] text-rose-500 font-medium">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 3: Address */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Residential Address / City & Country <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="e.g. San Francisco, CA 94107, United States"
                {...register('address', { required: 'Address is required' })}
                className={`w-full pl-10 pr-3.5 py-2 bg-slate-50 border rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 transition ${
                  errors.address ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
              />
            </div>
            {errors.address && (
              <p className="mt-1 text-[11px] text-rose-500 font-medium">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Row 4: Bio / Summary */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Professional Summary / Bio <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Highlight your domain expertise, engineering philosophy, and accomplishments..."
              {...register('bio', {
                required: 'Bio is required',
                minLength: { value: 20, message: 'Minimum 20 characters required' },
              })}
              className={`w-full px-3.5 py-2 bg-slate-50 border rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 transition ${
                errors.bio ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
            {errors.bio && (
              <p className="mt-1 text-[11px] text-rose-500 font-medium">
                {errors.bio.message}
              </p>
            )}
          </div>

          {/* Row 5: Social / Portfolio Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">GitHub Profile</label>
              <input
                type="text"
                placeholder="https://github.com/..."
                {...register('github')}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">LinkedIn Profile</label>
              <input
                type="text"
                placeholder="https://linkedin.com/in/..."
                {...register('linkedin')}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Portfolio Website</label>
              <input
                type="text"
                placeholder="https://yourportfolio.io"
                {...register('portfolio')}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden text-xs"
              />
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2.5">
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
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
