import React, { useState } from 'react';
import { GraduationCap, Plus, Edit3, Trash2, Calendar, Award } from 'lucide-react';
import EducationModal from './EducationModal';
import { toast } from 'react-toastify';

export default function EducationSection({ education = [], onAdd, onUpdate, onDelete }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState(null);

  const handleOpenAdd = () => {
    setEditingEdu(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (edu) => {
    setEditingEdu(edu);
    setModalOpen(true);
  };

  const handleSave = (eduData) => {
    if (editingEdu) {
      onUpdate(editingEdu.id, eduData);
      toast.success('Education record updated!');
    } else {
      onAdd(eduData);
      toast.success('Academic qualification added!');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>Education & Certifications</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Academic degrees, certifications, and licenses ({education.length} listed)
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Education</span>
        </button>
      </div>

      {education.length > 0 ? (
        <div className="space-y-4 divide-y divide-slate-100">
          {education.map((edu) => (
            <div key={edu.id} className="pt-4 first:pt-0 group">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    {edu.degree}
                  </h4>
                  <p className="text-xs font-semibold text-indigo-600 mt-0.5">
                    {edu.institution} {edu.location && `• ${edu.location}`}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-1">
                    <span className="flex items-center gap-1 font-medium text-slate-600">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      Class of {edu.endYear} {edu.startYear && `(${edu.startYear} - ${edu.endYear})`}
                    </span>
                    {edu.grade && (
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
                        {edu.grade}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenEdit(edu)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition"
                    title="Edit Education"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      onDelete(edu.id);
                      toast.info('Education removed.');
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete Education"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {edu.activities && (
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {edu.activities}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl">
          <p className="text-xs text-slate-500">No education qualifications recorded yet.</p>
          <button
            onClick={handleOpenAdd}
            className="mt-2 text-xs font-bold text-indigo-600 hover:underline"
          >
            + Add degree or certificate
          </button>
        </div>
      )}

      {/* Education Modal */}
      <EducationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        educationToEdit={editingEdu}
      />
    </div>
  );
}
