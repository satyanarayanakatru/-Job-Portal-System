import React, { useState } from 'react';
import { Tag, Plus, X, Sparkles, Check } from 'lucide-react';
import { toast } from 'react-toastify';

const SUGGESTED_SKILLS = [
  'Next.js',
  'GraphQL',
  'PostgreSQL',
  'Docker',
  'AWS',
  'Redux Toolkit',
  'Figma',
  'Python',
  'CI/CD Pipelines',
];

export default function SkillsSection({ skills = [], onUpdateSkills }) {
  const [inputVal, setInputVal] = useState('');

  const handleAddSkill = (skillToAdd) => {
    const trimmed = (skillToAdd || inputVal).trim();
    if (!trimmed) return;

    if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      toast.info(`"${trimmed}" is already added to your skills.`);
      return;
    }

    const updated = [...skills, trimmed];
    onUpdateSkills(updated);
    setInputVal('');
    toast.success(`Added "${trimmed}" to profile skills!`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemove = (skillToRemove) => {
    const updated = skills.filter((s) => s !== skillToRemove);
    onUpdateSkills(updated);
    toast.info(`Removed "${skillToRemove}"`);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Tag className="w-4 h-4 text-indigo-600" />
            <span>Core Technical Competencies & Skills</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Key skills used by algorithmic candidate matching and job filters ({skills.length} skills listed)
          </p>
        </div>
      </div>

      {/* Skills Badges List */}
      <div className="flex flex-wrap gap-2 min-h-[40px]">
        {skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200/80 text-xs font-semibold text-indigo-800 shadow-2xs group transition"
          >
            <span>{skill}</span>
            <button
              type="button"
              onClick={() => handleRemove(skill)}
              className="text-indigo-400 hover:text-indigo-900 transition"
              title="Remove skill"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
      </div>

      {/* Add Skill Input */}
      <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new skill (e.g. Next.js, Docker, GraphQL) & press Enter..."
          className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
        />
        <button
          type="button"
          onClick={() => handleAddSkill()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Suggested Skills */}
      <div className="pt-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
          Suggested for your profile:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_SKILLS.filter((s) => !skills.includes(s)).slice(0, 5).map((sugg) => (
            <button
              key={sugg}
              type="button"
              onClick={() => handleAddSkill(sugg)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-[11px] font-medium text-slate-700 hover:text-indigo-700 transition"
            >
              <Plus className="w-3 h-3 text-slate-400" />
              <span>{sugg}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
