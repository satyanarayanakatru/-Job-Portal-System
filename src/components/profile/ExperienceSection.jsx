import React, { useState } from 'react';
import { Briefcase, Plus, Edit3, Trash2, Calendar, MapPin } from 'lucide-react';
import ExperienceModal from './ExperienceModal';
import { toast } from 'react-toastify';

export default function ExperienceSection({ experiences = [], onAdd, onUpdate, onDelete }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState(null);

  const handleOpenAdd = () => {
    setEditingExp(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (exp) => {
    setEditingExp(exp);
    setModalOpen(true);
  };

  const handleSave = (expData) => {
    if (editingExp) {
      onUpdate(editingExp.id, expData);
      toast.success('Experience record updated!');
    } else {
      onAdd(expData);
      toast.success('New work experience added!');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            <span>Work Experience History</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Previous positions, achievements, and impact ({experiences.length} positions recorded)
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Position</span>
        </button>
      </div>

      {experiences.length > 0 ? (
        <div className="space-y-4 divide-y divide-slate-100">
          {experiences.map((exp) => (
            <div key={exp.id} className="pt-4 first:pt-0 group">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    {exp.role}
                  </h4>
                  <p className="text-xs font-semibold text-indigo-600 mt-0.5">
                    {exp.company}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-1">
                    <span className="flex items-center gap-1 font-medium text-slate-600">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {exp.startDate} – {exp.endDate}
                    </span>
                    {exp.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {exp.location}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenEdit(exp)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition"
                    title="Edit Experience"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      onDelete(exp.id);
                      toast.info('Experience removed.');
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete Experience"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {exp.description && (
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl">
          <p className="text-xs text-slate-500">No work experience listed yet.</p>
          <button
            onClick={handleOpenAdd}
            className="mt-2 text-xs font-bold text-indigo-600 hover:underline"
          >
            + Add your first experience
          </button>
        </div>
      )}

      {/* Experience Modal */}
      <ExperienceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        experienceToEdit={editingExp}
      />
    </div>
  );
}
