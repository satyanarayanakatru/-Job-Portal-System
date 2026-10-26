import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Building, 
  Star, 
  ShieldCheck, 
  Clock, 
  ArrowUpRight 
} from 'lucide-react';

const RECENT_ACTIVITIES = [
  { id: 1, user: 'Sarah J.', action: 'accepted an offer at NexaCloud', role: 'Staff React Engineer', time: '2m ago' },
  { id: 2, user: 'TechCorp', action: 'posted a new position', role: 'Senior Cloud Architect', time: '7m ago' },
  { id: 3, user: 'David K.', action: 'scheduled an interview with', role: 'Stripe Horizon', time: '14m ago' },
  { id: 4, user: 'Quantum AI', action: 'shortlisted 4 candidates for', role: 'ML Infrastructure Lead', time: '22m ago' },
];

export default function AuthShowcase({ activeRole = 'candidate' }) {
  const [activeActivityIndex, setActiveActivityIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveActivityIndex((prev) => (prev + 1) % RECENT_ACTIVITIES.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const currentActivity = RECENT_ACTIVITIES[activeActivityIndex];

  return (
    <div className="relative hidden lg:flex flex-col justify-between w-full h-full bg-slate-950 text-white p-6 xl:p-7 overflow-hidden rounded-3xl shadow-xl border border-slate-800/80">
      
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 -left-12 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-12 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      
      {/* Top Banner & Live Pulse */}
      <div className="relative z-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-400/25 text-[11px] font-semibold text-indigo-300 mb-3.5">
          <span className="flex h-1.5 w-1.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          <span>Real-time Talent Network • 14,800+ Roles</span>
        </div>

        <h2 className="text-2xl xl:text-3xl font-extrabold tracking-tight text-white leading-tight">
          {activeRole === 'recruiter' ? (
            <>
              Scale Your Tech Team with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-indigo-100">
                Verified Global Talent.
              </span>
            </>
          ) : (
            <>
              Accelerate Your Career with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-indigo-100">
                Transparent Opportunities.
              </span>
            </>
          )}
        </h2>

        <p className="mt-2 text-xs text-slate-300/85 leading-relaxed max-w-sm">
          {activeRole === 'recruiter'
            ? 'Source verified candidates, automate technical screening, and cut your time-to-hire by 4x.'
            : 'Access roles with verified compensation ranges, direct recruiter messaging, and 1-click applications.'}
        </p>
      </div>

      {/* Live Activity Ticker Card */}
      <div className="relative z-10 my-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3 text-indigo-400" /> Live Stream
          </span>
          <span className="text-[9px] text-emerald-400 font-semibold px-2 py-0.2 rounded-full bg-emerald-500/15 border border-emerald-500/30">
            Realtime
          </span>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-2xl p-3 shadow-lg">
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-start space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                {currentActivity.user.substring(0, 2)}
              </div>
              <div>
                <p className="text-[11px] text-slate-200">
                  <span className="font-bold text-white">{currentActivity.user}</span>{' '}
                  <span className="text-slate-400">{currentActivity.action}</span>
                </p>
                <p className="text-[11px] font-semibold text-indigo-300 mt-0.5">
                  {currentActivity.role}
                </p>
              </div>
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-slate-300 shrink-0">
              {currentActivity.time}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 mt-2.5 pt-2 border-t border-white/10">
            {RECENT_ACTIVITIES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveActivityIndex(i)}
                className={`h-1 rounded-full transition-all ${
                  activeActivityIndex === i ? 'w-5 bg-indigo-400' : 'w-1.5 bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating Metrics Highlights */}
      <div className="relative z-10 grid grid-cols-2 gap-2.5 my-1">
        <div className="bg-white/5 backdrop-blur-xs border border-white/10 rounded-xl p-2.5">
          <span className="text-[9px] font-semibold text-slate-400 block">Weekly Matches</span>
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-base font-extrabold text-white">4,820+</span>
            <span className="text-[9px] font-bold text-emerald-400 flex items-center">
              <ArrowUpRight className="w-2.5 h-2.5" /> +24%
            </span>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xs border border-white/10 rounded-xl p-2.5">
          <span className="text-[9px] font-semibold text-slate-400 block">Verified Companies</span>
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-base font-extrabold text-white">3,200+</span>
            <span className="text-[9px] font-bold text-sky-400">99.8%</span>
          </div>
        </div>
      </div>

      {/* Trust Badges Footer */}
      <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center space-x-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-300">Enterprise SSL Certified</span>
        </div>
        <div className="flex items-center space-x-1 text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-amber-400" />
          ))}
          <span className="font-bold text-white ml-0.5">4.9/5</span>
        </div>
      </div>
    </div>
  );
}
