import React, { useState } from 'react';
import { 
  Briefcase, 
  Sparkles, 
  Clock, 
  GraduationCap, 
  Layers, 
  CheckCircle, 
  PlusCircle, 
  FileText, 
  Edit3, 
  RefreshCw,
  Tag
} from 'lucide-react';
import { JobDescriptionData } from '../types';

interface JDSectionProps {
  jd: JobDescriptionData;
  onUpdateJD: (newJD: JobDescriptionData) => void;
  isLoading: boolean;
  onParseRawJD: (rawText: string) => Promise<void>;
}

export const JDSection: React.FC<JDSectionProps> = ({
  jd,
  onUpdateJD,
  isLoading,
  onParseRawJD
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [rawTextInput, setRawTextInput] = useState(jd.rawText || '');
  const [activeTab, setActiveTab] = useState<'structured' | 'raw'>('structured');

  const handleApplyRawText = async () => {
    if (!rawTextInput.trim()) return;
    await onParseRawJD(rawTextInput);
    setIsEditing(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white tracking-tight">{jd.title}</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 font-medium border border-slate-700">
                {jd.seniorityLevel}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {jd.company || 'Apex Systems'} • {jd.department || 'Engineering Platform'}
            </p>
          </div>
        </div>

        {/* View and Edit Controls */}
        <div className="flex items-center space-x-2">
          <div className="bg-slate-800/80 p-1 rounded-lg border border-slate-700 flex space-x-1 text-xs">
            <button
              id="jd-tab-structured-btn"
              onClick={() => setActiveTab('structured')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                activeTab === 'structured'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Structured View
            </button>
            <button
              id="jd-tab-raw-btn"
              onClick={() => setActiveTab('raw')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                activeTab === 'raw'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Raw JD & Parser
            </button>
          </div>

          <button
            id="edit-jd-button"
            onClick={() => {
              setRawTextInput(jd.rawText || '');
              setIsEditing(!isEditing);
              if (!isEditing) setActiveTab('raw');
            }}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium flex items-center gap-1.5 transition-all"
          >
            <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit JD'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'raw' || isEditing ? (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              Job Description Text (Paste or upload raw text):
            </label>
            <span className="text-[11px] text-slate-400">Gemini 3.7 auto-extracts requirements</span>
          </div>

          <textarea
            id="jd-raw-textarea"
            rows={10}
            value={rawTextInput}
            onChange={(e) => setRawTextInput(e.target.value)}
            placeholder="Paste raw Job Description text here..."
            className="w-full bg-slate-950 text-slate-200 text-xs font-mono p-3.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all leading-relaxed"
          />

          <div className="flex items-center justify-between">
            <button
              id="extract-jd-gemini-btn"
              onClick={handleApplyRawText}
              disabled={isLoading || !rawTextInput.trim()}
              className="text-xs px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold flex items-center gap-2 transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Sparkles className="w-4 h-4 text-cyan-300" />
              )}
              <span>{isLoading ? 'Extracting with Gemini...' : 'Extract & Normalize Requirements'}</span>
            </button>

            <button
              onClick={() => setActiveTab('structured')}
              className="text-xs text-slate-400 hover:text-slate-200 font-medium"
            >
              Back to Overview
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          
          {/* Key Parameters Pill Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex items-center space-x-2.5">
              <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Min Experience</span>
                <span className="text-xs font-bold text-white">{jd.minYearsExperience}+ Years</span>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex items-center space-x-2.5">
              <GraduationCap className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Min Education</span>
                <span className="text-xs font-bold text-white truncate block" title={jd.educationRequirement}>
                  {jd.educationRequirement.split(',')[0] || "Bachelor's"}
                </span>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex items-center space-x-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Must-Haves</span>
                <span className="text-xs font-bold text-emerald-300">{jd.mustHaveSkills.length} Skills</span>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex items-center space-x-2.5">
              <PlusCircle className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Nice-to-Haves</span>
                <span className="text-xs font-bold text-blue-300">{jd.niceToHaveSkills.length} Skills</span>
              </div>
            </div>
          </div>

          {/* Must-Have Skills Grid */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Must-Have Technical Requirements (Normalized vs Skills Master):
              </span>
              <span className="text-[11px] text-slate-400 font-normal">Weight: 40%</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {jd.mustHaveSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="bg-slate-950/80 border border-emerald-500/30 hover:border-emerald-500/60 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 flex items-center space-x-2 transition-all shadow-sm group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform" />
                  <span className="font-semibold text-white">{skill.skillName}</span>
                  {skill.minYearsExp && (
                    <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-1.5 py-0.5 rounded">
                      {skill.minYearsExp}y+
                    </span>
                  )}
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/50 px-1 py-0.5 rounded border border-emerald-500/20 font-mono">
                    w{skill.importanceWeight}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Nice-to-Have Skills Grid */}
          {jd.niceToHaveSkills.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <PlusCircle className="w-3.5 h-3.5 text-blue-400" />
                  Preferred / Nice-to-Have Skills:
                </span>
                <span className="text-[11px] text-slate-400 font-normal">Weight: 15%</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {jd.niceToHaveSkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="bg-slate-950/60 border border-blue-500/20 rounded-lg px-2.5 py-1 text-xs text-slate-300 flex items-center space-x-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span>{skill.skillName}</span>
                    <span className="text-[10px] text-blue-400 bg-blue-950/40 px-1 py-0.5 rounded font-mono">
                      w{skill.importanceWeight}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Domain Knowledge */}
          {jd.domainKnowledge && jd.domainKnowledge.length > 0 && (
            <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-indigo-400" /> Domain Focus:
              </span>
              {jd.domainKnowledge.map((domain, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-medium bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700"
                >
                  {domain}
                </span>
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  );
};
