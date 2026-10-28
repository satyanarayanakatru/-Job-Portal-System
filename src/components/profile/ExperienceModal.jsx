import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Briefcase, Building2, MapPin, Calendar, CheckCircle2 } from 'lucide-react';

export default function ExperienceModal({ isOpen, onClose, onSave, experienceToEdit = null }) {
  const isEditing = Boolean(experienceToEdit);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const isCurrent = watch('current');

  useEffect(() => {
    if (experienceToEdit && isOpen) {
      reset({
        role: experienceToEdit.role || '',
        company: experienceToEdit.company || '',
        location: experienceToEdit.location || '',
        startDate: experienceToEdit.startDate || '',
        endDate: experienceToEdit.endDate || '',
        current: experienceToEdit.current || false,
        description: experienceToEdit.description || '',
      });
    } else {
      reset({
        role: '',
        company: '',
        location: 'San Francisco, CA',
        startDate: 'Jan 2023',
        endDate: 'Present',
        current: true,
        description: '',
      });
    }
  }, [experienceToEdit, isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      endDate: data.current ? 'Present' : data.endDate,
    };
    await onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[88vh] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                {isEditing ? 'Edit Work Experience' : 'Add Work Experience'}
              </h3>
              <p className="text-xs text-slate-500">Record your career history and key technical deliverables</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Job Title / Designation <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Senior Frontend Engineer"
              {...register('role', { required: 'Job title is required' })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
            />
            {errors.role && <p className="mt-1 text-[11px] text-rose-500">{errors.role.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Stripe Horizon"
                {...register('company', { required: 'Company is required' })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden"
              />
              {errors.company && <p className="mt-1 text-[11px] text-rose-500">{errors.company.message}</p>}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                placeholder="City, State or Remote"
                {...register('location')}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Start Date</label>
              <input
                type="text"
                placeholder="e.g. Jan 2023"
                {...register('startDate', { required: 'Start date is required' })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">End Date</label>
              <input
                type="text"
                disabled={isCurrent}
                placeholder="e.g. Present or Dec 2024"
                {...register('endDate')}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('current')}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <span className="text-xs font-semibold text-slate-700">I currently work here</span>
            </label>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Key Responsibilities & Impact</label>
            <textarea
              rows={3}
              placeholder="Outline what you built, technologies used, and business achievements..."
              {...register('description')}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
            />
          </div>

          </div>

          <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end space-x-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Experience</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
