import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function JobDeleteModal({ isOpen, onClose, onConfirm, jobTitle, isDeleting }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h3 className="text-base font-extrabold text-slate-900">
          Delete Job Posting?
        </h3>
        <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
          Are you sure you want to delete <span className="font-bold text-slate-800">{jobTitle}</span>? This action cannot be undone and will close active candidate applications.
        </p>

        <div className="mt-6 flex items-center justify-center space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition flex items-center gap-1.5"
          >
            {isDeleting ? (
              <span>Deleting...</span>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Yes, Delete Job</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
