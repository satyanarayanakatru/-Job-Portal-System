import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, GraduationCap, Building2, Calendar, Award, CheckCircle2 } from 'lucide-react';

export default function EducationModal({ isOpen, onClose, onSave, educationToEdit = null }) {
  const isEditing = Boolean(educationToEdit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (educationToEdit && isOpen) {
      reset({
        degree: educationToEdit.degree || '',
        institution: educationToEdit.institution || '',
        location: educationToEdit.location || '',
        startYear: educationToEdit.startYear || '',
        endYear: educationToEdit.endYear || '',
        grade: educationToEdit.grade || '',
        activities: educationToEdit.activities || '',
      });
    } else {
      reset({
        degree: 'Bachelor of Science in Computer Science',
        institution: '',
        location: '',
        startYear: '2016',
        endYear: '2020',
        grade: '',
        activities: '',
      });
    }
  }, [educationToEdit, isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    await onSave(data);
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
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                {isEditing ? 'Edit Education & Qualifications' : 'Add Academic Qualification'}
              </h3>
              <p className="text-xs text-slate-500">Record university degrees and recognized certificates</p>
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
              Degree or Certificate Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Bachelor of Science in Computer Science"
              {...register('degree', { required: 'Degree title is required' })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
            />
            {errors.degree && <p className="mt-1 text-[11px] text-rose-500">{errors.degree.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Institution / University <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. UC Berkeley or MIT"
                {...register('institution', { required: 'Institution is required' })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden"
              />
              {errors.institution && <p className="mt-1 text-[11px] text-rose-500">{errors.institution.message}</p>}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                placeholder="City, Country"
                {...register('location')}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Start Year</label>
              <input
                type="text"
                placeholder="e.g. 2016"
                {...register('startYear')}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Graduation Year</label>
              <input
                type="text"
                placeholder="e.g. 2020"
                {...register('endYear', { required: 'Graduation year is required' })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Grade / GPA / Honors</label>
            <input
              type="text"
              placeholder="e.g. 3.85 GPA • First Class Honours"
              {...register('grade')}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Academic Highlights & Activities</label>
            <textarea
              rows={2}
              placeholder="Thesis topics, societies, awards, or hackathon wins..."
              {...register('activities')}
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
              <span>Save Education</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
