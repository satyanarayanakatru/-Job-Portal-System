import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  Mail, 
  KeyRound, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  Sparkles,
  Lock
} from 'lucide-react';

export default function ForgotPasswordModal({ isOpen, onClose, onPasswordResetSuccess }) {
  const { resetPassword, registeredUsers } = useAuth();
  const [step, setStep] = useState(1); // 1: Email entry, 2: OTP + New Password, 3: Success
  const [targetEmail, setTargetEmail] = useState('');
  const [mockCode, setMockCode] = useState('8492');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // React Hook Form for Step 1
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
    reset: resetEmailForm,
  } = useForm();

  // React Hook Form for Step 2
  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    watch: watchReset,
    setValue: setResetValue,
    formState: { errors: resetErrors },
    reset: resetResetForm,
  } = useForm();

  if (!isOpen) return null;

  const handleClose = () => {
    setStep(1);
    setTargetEmail('');
    resetEmailForm();
    resetResetForm();
    onClose();
  };

  // Step 1: Request reset code
  const onSubmitEmail = async (data) => {
    setIsSubmitting(true);
    const emailNorm = data.email.trim().toLowerCase();
    
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 600));
    setIsSubmitting(false);

    setTargetEmail(emailNorm);
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setMockCode(code);
    setStep(2);
  };

  // Step 2: Verify code and set new password
  const onSubmitReset = async (data) => {
    setIsSubmitting(true);
    const res = await resetPassword(targetEmail, data.newPassword);
    setIsSubmitting(false);

    if (res.success) {
      setStep(3);
      if (onPasswordResetSuccess) {
        onPasswordResetSuccess(targetEmail);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Reset Your Password</h3>
              <p className="text-xs text-slate-500">
                {step === 1 && 'Step 1 of 2: Verify your account'}
                {step === 2 && 'Step 2 of 2: Create new password'}
                {step === 3 && 'Password Reset Complete'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* STEP 1: Email Form */}
          {step === 1 && (
            <form onSubmit={handleEmailSubmit(onSubmitEmail)} className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter the email address associated with your account. We will simulate sending a secure verification PIN to reset your password.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Registered Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    placeholder="e.g. candidate@jobportal.com"
                    {...registerEmail('email', {
                      required: 'Email address is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address format',
                      },
                    })}
                    className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 transition ${
                      emailErrors.email
                        ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                        : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                    }`}
                  />
                </div>
                {emailErrors.email && (
                  <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3" />
                    {emailErrors.email.message}
                  </p>
                )}
              </div>

              {/* Registered user hint */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700 block mb-1">Quick Test Accounts:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => resetEmailForm({ email: 'candidate@jobportal.com' })}
                    className="px-2 py-0.5 rounded bg-white border border-slate-200 hover:border-indigo-300 text-indigo-600 font-mono"
                  >
                    candidate@jobportal.com
                  </button>
                  <button
                    type="button"
                    onClick={() => resetEmailForm({ email: 'recruiter@jobportal.com' })}
                    className="px-2 py-0.5 rounded bg-white border border-slate-200 hover:border-indigo-300 text-indigo-600 font-mono"
                  >
                    recruiter@jobportal.com
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-500/20 transition flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Send Verification Code</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Code & New Password */}
          {step === 2 && (
            <form onSubmit={handleResetSubmit(onSubmitReset)} className="space-y-4">
              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-900 flex items-center justify-between">
                <div>
                  <span className="font-semibold">Resetting for:</span> {targetEmail}
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-indigo-600 hover:underline font-semibold flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" /> Change
                </button>
              </div>

              {/* Simulation Banner for Demo */}
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold">Simulated Verification PIN:</span>{' '}
                  <span className="font-mono font-bold tracking-widest text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded">
                    {mockCode}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setResetValue('verificationCode', mockCode)}
                  className="text-[11px] font-bold text-amber-900 underline hover:text-amber-950"
                >
                  Auto-fill PIN
                </button>
              </div>

              {/* Verification Code Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  4-Digit Verification PIN <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="Enter 4-digit PIN"
                  {...registerReset('verificationCode', {
                    required: 'Verification PIN is required',
                    validate: (val) => val === mockCode || 'Invalid verification PIN. Use ' + mockCode,
                  })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono text-base tracking-widest text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                />
                {resetErrors.verificationCode && (
                  <p className="mt-1 text-[11px] text-rose-500 font-medium">
                    {resetErrors.verificationCode.message}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 6 characters"
                    {...registerReset('newPassword', {
                      required: 'New password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {resetErrors.newPassword && (
                  <p className="mt-1 text-[11px] text-rose-500 font-medium">
                    {resetErrors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm New Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your new password"
                    {...registerReset('confirmPassword', {
                      required: 'Please confirm your new password',
                      validate: (val) =>
                        val === watchReset('newPassword') || 'Passwords do not match',
                    })}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {resetErrors.confirmPassword && (
                  <p className="mt-1 text-[11px] text-rose-500 font-medium">
                    {resetErrors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-500/20 transition flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Success Confirmation */}
          {step === 3 && (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Password Changed!</h4>
                <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                  Your password for <span className="font-semibold text-slate-800">{targetEmail}</span> has been securely updated in local storage.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md transition"
              >
                Proceed to Log In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
