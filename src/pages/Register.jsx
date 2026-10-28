import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  UserCheck, 
  Building2, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle, 
  Sparkles, 
  ShieldCheck
} from 'lucide-react';
import AuthShowcase from '../components/auth/AuthShowcase';

export default function Register() {
  const { register: registerUser, loading } = useAuth();
  const [selectedRole, setSelectedRole] = useState('candidate');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      password: '',
      confirmPassword: '',
      terms: true,
    },
  });

  const passwordValue = watch('password', '');

  // Calculate password strength
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, text: 'None', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, text: 'Weak', color: 'bg-rose-500' };
    if (score <= 3) return { score: 2, text: 'Fair', color: 'bg-amber-500' };
    return { score: 3, text: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(passwordValue);

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: selectedRole === 'recruiter' ? data.company : undefined,
      password: data.password,
      role: selectedRole,
    };

    const result = await registerUser(payload);
    if (result.success) {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden flex flex-col justify-between py-2 sm:py-3 px-4 sm:px-6 lg:px-8 bg-slate-50 relative select-none">
      
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar (No Navbar - matches Login Screen) */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between z-20 shrink-0 h-10">
        <Link to="/login" className="flex items-center space-x-2 group">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition">
            <Briefcase className="h-4 w-4" />
          </div>
          <span className="font-extrabold text-base text-slate-900 tracking-tight flex items-center gap-1">
            JobSphere
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          </span>
        </Link>

        <Link
          to="/login"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-white/90 hover:bg-white px-3 py-1.5 rounded-full border border-slate-200/80 transition shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Login</span>
        </Link>
      </header>

      {/* Main Grid Section - Guaranteed Fits in Viewport Without Scrolling */}
      <main className="flex-1 flex items-center justify-center max-w-6xl w-full mx-auto my-auto min-h-0 z-10 py-1">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch max-h-full">
          
          {/* Left: Realtime Showcase Banner */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-6 h-full">
            <AuthShowcase activeRole={selectedRole} />
          </div>

          {/* Right: Modern Compact Register Card (Zero Scroll) */}
          <div className="lg:col-span-7 xl:col-span-6 flex flex-col justify-center max-h-full">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/40 p-5 sm:p-6 lg:p-7 transition-all flex flex-col justify-between">
              
              {/* Header */}
              <div className="mb-2.5">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Create Free Account
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] font-semibold text-emerald-700">
                    <Sparkles className="w-3 h-3 text-emerald-600" /> Instant Access
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Get discovered by world-class tech companies or post job openings.
                </p>
              </div>

              {/* Role Selection Tabs (matches Login) */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200/80 mb-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedRole('candidate')}
                  className={`flex items-center justify-center space-x-1.5 py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedRole === 'candidate'
                      ? 'bg-white text-indigo-700 shadow-xs border border-slate-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Job Candidate</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('recruiter')}
                  className={`flex items-center justify-center space-x-1.5 py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedRole === 'recruiter'
                      ? 'bg-white text-purple-700 shadow-xs border border-slate-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>Employer / Recruiter</span>
                </button>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                
                {/* Row 1: Full Name & Conditional Phone/Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. Sarah Jenkins"
                        {...register('name', {
                          required: 'Name is required',
                          minLength: { value: 2, message: 'Min 2 characters' },
                        })}
                        className={`w-full pl-8 pr-3 py-1.5 bg-slate-50 border rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 transition ${
                          errors.name
                            ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                            : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                        }`}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-0.5 text-[10px] text-rose-500 font-medium">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    {selectedRole === 'recruiter' ? (
                      <>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                          Company Name <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Building2 className="w-3.5 h-3.5" />
                          </div>
                          <input
                            type="text"
                            placeholder="e.g. TechCorp Solutions"
                            {...register('company', {
                              required: 'Company name is required',
                            })}
                            className={`w-full pl-8 pr-3 py-1.5 bg-slate-50 border rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 transition ${
                              errors.company
                                ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                                : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                            }`}
                          />
                        </div>
                        {errors.company && (
                          <p className="mt-0.5 text-[10px] text-rose-500 font-medium">
                            {errors.company.message}
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                          Phone Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Phone className="w-3.5 h-3.5" />
                          </div>
                          <input
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            {...register('phone')}
                            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Row 2: Email Address & (Phone for recruiter) */}
                <div className={`grid grid-cols-1 ${selectedRole === 'recruiter' ? 'sm:grid-cols-2' : ''} gap-2.5`}>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address',
                          },
                        })}
                        className={`w-full pl-8 pr-3 py-1.5 bg-slate-50 border rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 transition ${
                          errors.email
                            ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                            : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-0.5 text-[10px] text-rose-500 font-medium">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {selectedRole === 'recruiter' && (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                        Work Phone
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Phone className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          {...register('phone')}
                          className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Row 3: Password & Confirm Password (2 columns side by side) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Min 6 characters"
                        {...register('password', {
                          required: 'Password is required',
                          minLength: { value: 6, message: 'Min 6 characters' },
                        })}
                        className={`w-full pl-8 pr-8 py-1.5 bg-slate-50 border rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 transition ${
                          errors.password
                            ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                            : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                    </div>

                    {/* Compact strength bar */}
                    {passwordValue && (
                      <div className="flex items-center space-x-1.5 mt-1">
                        <div className="h-1 flex-1 bg-slate-200 rounded-full overflow-hidden flex gap-0.5">
                          <div className={`h-full ${strength.color} ${strength.score >= 1 ? 'w-1/3' : 'w-0'}`} />
                          <div className={`h-full ${strength.color} ${strength.score >= 2 ? 'w-1/3' : 'w-0'}`} />
                          <div className={`h-full ${strength.color} ${strength.score >= 3 ? 'w-1/3' : 'w-0'}`} />
                        </div>
                        <span className="text-[9px] font-bold text-slate-600">{strength.text}</span>
                      </div>
                    )}

                    {errors.password && (
                      <p className="mt-0.5 text-[10px] text-rose-500 font-medium">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      Confirm Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Re-enter password"
                        {...register('confirmPassword', {
                          required: 'Please confirm password',
                          validate: (val) => val === watch('password') || 'Passwords do not match',
                        })}
                        className={`w-full pl-8 pr-8 py-1.5 bg-slate-50 border rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 transition ${
                          errors.confirmPassword
                            ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                            : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-0.5 text-[10px] text-rose-500 font-medium">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Terms checkbox */}
                <div className="pt-0.5">
                  <label className="flex items-center space-x-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      {...register('terms', {
                        required: 'You must accept the terms of service',
                      })}
                      className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                    />
                    <span className="text-[11px] text-slate-600">
                      I agree to the{' '}
                      <span className="text-indigo-600 font-semibold hover:underline">Terms</span> &{' '}
                      <span className="text-indigo-600 font-semibold hover:underline">Privacy Policy</span>
                    </span>
                  </label>
                  {errors.terms && (
                    <p className="mt-0.5 text-[10px] text-rose-500 font-medium">
                      {errors.terms.message}
                    </p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-1.5 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Bottom Row */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Already have an account?</span>
                <Link
                  to="/login"
                  className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-0.5"
                >
                  <span>Sign In Here</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer minimal info (matches Login Screen) */}
      <footer className="max-w-6xl w-full mx-auto flex items-center justify-between text-[10px] text-slate-400 shrink-0 h-7 z-20">
        <span>© 2026 JobSphere Inc. All rights reserved.</span>
        <div className="flex items-center space-x-3">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" /> SOC2 Compliant
          </span>
          <span>•</span>
          <span>GDPR Ready</span>
        </div>
      </footer>
    </div>
  );
}
