import React from 'react';
import { Layers } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = Layers, 
  title = 'No items found', 
  description = 'There are currently no records to display.', 
  actionLabel, 
  onAction 
}) {
  return (
    <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 border border-slate-200 flex items-center justify-center mx-auto mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-bold text-slate-800">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
