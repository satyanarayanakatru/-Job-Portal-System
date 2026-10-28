import React, { useState } from 'react';
import { AlertTriangle, X, CheckCircle2, RotateCcw } from 'lucide-react';

export default function WithdrawModal({ isOpen, onClose, onConfirm, application }) {
  const [reason, setReason] = useState('Accepted another offer');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !application) return null;

  const handleWithdraw = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 450));
    setIsSubmitting(false);
    onConfirm(application.id, reason);
    onClose();
  };

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

        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h3 className="text-base font-extrabold text-slate-900">
          Withdraw Application?
        </h3>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          Are you sure you want to withdraw your application for{' '}
          <span className="font-bold text-slate-800">{application.jobTitle}</span> at{' '}
          <span className="font-bold text-slate-800">{application.company}</span>?
        </p>

        {/* Withdrawal Reason Selector */}
        <div className="text-left mt-4 mb-5">
          <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
            Reason for Withdrawal <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
          >
            <option value="Accepted another offer">Accepted another offer</option>
            <option value="Salary expectation mismatch">Salary expectation mismatch</option>
            <option value="Location or commute constraint">Location or commute constraint</option>
            <option value="Role scope no longer aligned">Role scope no longer aligned</option>
            <option value="Personal circumstances">Personal circumstances</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            Keep Application Active
          </button>
          <button
            type="button"
            onClick={handleWithdraw}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition flex items-center gap-1.5"
          >
            {isSubmitting ? (
              <span>Updating...</span>
            ) : (
              <span>Confirm Withdrawal</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
