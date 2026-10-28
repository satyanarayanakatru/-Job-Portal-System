import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  UserCheck, 
  Building2, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  X,
  Zap,
  Info
} from 'lucide-react';
import AuthShowcase from '../components/auth/AuthShowcase';
import ForgotPasswordModal from '../components/auth/ForgotPasswordModal';

export default function Login() {
  const { login, demoLogin, loading } = useAuth();
  const [selectedRole, setSelectedRole] = useState('candidate'); // 'candidate' or 'recruiter'
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const fromPath = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  const emailValue = watch('email', '');

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password, selectedRole);
    if (result.success) {
      navigate(fromPath, { replace: true });
    }
  };

  // Quick fill handler for demo accounts
  const handleSelectDemoProfile = (role) => {
    setSelectedRole(role);
    if (role === 'candidate') {
      setValue('email', 'candidate@jobportal.com', { shouldValidate: true });
      setValue('password', 'Password@123', { shouldValidate: true });
    } else {
      setValue('email', 'recruiter@jobportal.com', { shouldValidate: true });
      setValue('password', 'Password@123', { shouldValidate: true });
    }
  };

  // 1-Click Instant Demo Login
  const handleInstantDemoLogin = async (role) => {
    const res = await demoLogin(role);
    if (res.success) {
      navigate(fromPath, { replace: true });
    }
  };

  // Social Login Mock Handler
  const handleSocialLogin = async (provider) => {
    const res = await demoLogin(selectedRole);
    if (res.success) {
      navigate(fromPath, { replace: true });
    }
  };

  // Detect CapsLock on password field
  const handleKeyUp = (e) => {
    if (e.getModifierState) {
      setCapsLockActive(e.getModifierState('CapsLock'));
    }
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden flex flex-col justify-between py-2 sm:py-3 px-4 sm:px-6 lg:px-8 bg-slate-50 relative select-none">
      
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar (Compact Header - No Navbar) */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between z-20 shrink-0 h-10">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Briefcase className="h-4 w-4" />
          </div>
          <span className="font-extrabold text-base text-slate-900 tracking-tight flex items-center gap-1">
            JobSphere
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500 hidden sm:inline">New to JobSphere?</span>
          <Link
            to="/register"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 px-3.5 py-1.5 rounded-full border border-indigo-200 transition shadow-2xs"
          >
            <span>Create Account</span>
          </Link>
        </div>
      </header>

      {/* Main Grid Section - Guaranteed Fits in Viewport */}
      <main className="flex-1 flex items-center justify-center max-w-6xl w-full mx-auto my-auto min-h-0 z-10 py-1">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch max-h-full">
          
          {/* Left: Realtime Showcase Banner */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-6 h-full">
            <AuthShowcase activeRole={selectedRole} />
          </div>

          {/* Right: Modern Compact Card (Zero Scroll) */}
          <div className="lg:col-span-7 xl:col-span-6 flex flex-col justify-center max-h-full">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/40 p-5 sm:p-6 lg:p-7 transition-all flex flex-col justify-between">
              
              {/* Header */}
              <div className="mb-3">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Welcome Back
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-[11px] font-semibold text-indigo-700">
                    <Sparkles className="w-3 h-3 text-indigo-600" /> Secure Portal
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sign in to access your applications, pipeline, and matched roles.
                </p>
              </div>

              {/* Role Selection Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200/80 mb-3">
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
                  <span>Recruiter</span>
                </button>
              </div>

              {/* Quick 1-Click Demo Profiles Strip */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80 mb-3 text-xs">
                <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500 fill-amber-500" /> Quick Demo:
                </span>
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => handleInstantDemoLogin('candidate')}
                    className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 text-slate-700 transition flex items-center gap-1 shadow-2xs"
                  >
                    <span>Sarah (Candidate)</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInstantDemoLogin('recruiter')}
                    className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-white border border-slate-200 hover:border-purple-400 hover:text-purple-600 text-slate-700 transition flex items-center gap-1 shadow-2xs"
                  >
                    <span>Alex (Recruiter)</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>

              {/* Social Logins */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                  className="flex items-center justify-center space-x-1 py-1.5 px-2 border border-slate-200/90 rounded-lg hover:bg-slate-50 text-[11px] font-semibold text-slate-700 transition"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin('LinkedIn')}
                  className="flex items-center justify-center space-x-1 py-1.5 px-2 border border-slate-200/90 rounded-lg hover:bg-slate-50 text-[11px] font-semibold text-slate-700 transition"
                >
                  <svg className="w-3.5 h-3.5 fill-[#0A66C2]" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.65 1.65 0 1 0 0-3.3 1.66 1.66 0 0 0 0 3.3m1.4 9.74v-8.37H5.06v8.37z" />
                  </svg>
                  <span>LinkedIn</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin('GitHub')}
                  className="flex items-center justify-center space-x-1 py-1.5 px-2 border border-slate-200/90 rounded-lg hover:bg-slate-50 text-[11px] font-semibold text-slate-700 transition"
                >
                  <svg className="w-3.5 h-3.5 fill-slate-800" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>

              {/* Form Section */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">
                
                {/* Email field */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="email"
                      placeholder={selectedRole === 'recruiter' ? 'recruiter@jobportal.com' : 'candidate@jobportal.com'}
                      {...register('email', {
                        required: 'Email address is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      className={`w-full pl-9 pr-8 py-2 bg-slate-50 border rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 transition ${
                        errors.email
                          ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                          : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                      }`}
                    />
                    {emailValue && (
                      <button
                        type="button"
                        onClick={() => setValue('email', '', { shouldValidate: true })}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  {errors.email && (
                    <p className="mt-0.5 text-[10px] text-rose-500 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-2.5 h-2.5 shrink-0" /> {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-700">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setForgotPasswordOpen(true)}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      onKeyUp={handleKeyUp}
                      placeholder="Enter your password"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Min 6 characters' },
                      })}
                      className={`w-full pl-9 pr-9 py-2 bg-slate-50 border rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 transition ${
                        errors.password
                          ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                          : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {capsLockActive && (
                    <p className="mt-0.5 text-[10px] text-amber-600 flex items-center gap-1 font-medium">
                      <Info className="w-2.5 h-2.5" /> Caps Lock is ON
                    </p>
                  )}

                  {errors.password && (
                    <p className="mt-0.5 text-[10px] text-rose-500 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-2.5 h-2.5 shrink-0" /> {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex items-center space-x-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      {...register('rememberMe')}
                      className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                    />
                    <span className="text-[11px] text-slate-600 font-medium">Stay signed in</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">256-Bit SSL</span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to {selectedRole === 'recruiter' ? 'Recruiter Hub' : 'Candidate Hub'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Bottom Row */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>New to JobSphere?</span>
                <Link
                  to="/register"
                  className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-0.5"
                >
                  <span>Create Account</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer minimal info */}
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

      {/* Forgot Password Modal Dialog */}
      <ForgotPasswordModal
        isOpen={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
        onPasswordResetSuccess={(email) => {
          setValue('email', email, { shouldValidate: true });
        }}
      />
    </div>
  );
}
