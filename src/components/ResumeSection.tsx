import React, { useState } from 'react';
import { 
  User, 
  Upload, 
  Plus, 
  Trash2, 
  FileText, 
  Award, 
  GraduationCap, 
  Briefcase, 
  Quote, 
  Sparkles, 
  RefreshCw,
  EyeOff,
  Clock,
  MapPin,
  Check
} from 'lucide-react';
import { ResumeData } from '../types';

interface ResumeSectionProps {
  resumes: ResumeData[];
  selectedResumeId: string;
  onSelectResume: (id: string) => void;
  onAddResume: (resume: ResumeData) => void;
  onDeleteResume: (id: string) => void;
  onParseRawResume: (rawText: string) => Promise<void>;
  isLoading: boolean;
  isAnonymized: boolean;
}

export const ResumeSection: React.FC<ResumeSectionProps> = ({
  resumes,
  selectedResumeId,
  onSelectResume,
  onAddResume,
  onDeleteResume,
  onParseRawResume,
  isLoading,
  isAnonymized
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newResumeText, setNewResumeText] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const currentResume = resumes.find(r => r.id === selectedResumeId) || resumes[0];

  const handleApplyNewResume = async () => {
    if (!newResumeText.trim()) return;
    await onParseRawResume(newResumeText);
    setNewResumeText('');
    setIsAddModalOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        setNewResumeText(content);
      }
    };
    reader.readAsText(file);
  };

  const getDisplayName = (resume: ResumeData, index: number) => {
    if (isAnonymized) {
      return `Candidate ${String.fromCharCode(65 + index)}`;
    }
    return resume.name;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      
      {/* Top Header & Multi-Resume Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        
        {/* Candidate Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1 shrink-0">
            <User className="w-3.5 h-3.5 text-indigo-400" /> Candidates ({resumes.length}):
          </span>

          {resumes.map((res, index) => {
            const isSelected = res.id === currentResume?.id;
            return (
              <button
                key={res.id}
                id={`resume-tab-${res.id}`}
                onClick={() => onSelectResume(res.id)}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all flex items-center space-x-2 shrink-0 border ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{getDisplayName(res, index)}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isSelected ? 'bg-indigo-700 text-indigo-200' : 'bg-slate-900 text-slate-400'
                }`}>
                  {res.totalYearsExperience}y
                </span>
              </button>
            );
          })}
        </div>

        {/* Add Resume Button */}
        <div className="flex items-center space-x-2">
          <button
            id="add-new-resume-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Resume</span>
          </button>

          {resumes.length > 1 && currentResume && (
            <button
              id="delete-current-resume-btn"
              onClick={() => onDeleteResume(currentResume.id)}
              className="text-xs p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition-all"
              title="Remove this resume"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Selected Resume Details */}
      {currentResume && (
        <div className="mt-4 space-y-4">
          
          {/* Candidate Card Summary */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {getDisplayName(currentResume, resumes.findIndex(r => r.id === currentResume.id))}
                  </h3>
                  {isAnonymized && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium flex items-center gap-1">
                      <EyeOff className="w-3 h-3" /> PII Masked
                    </span>
                  )}
                </div>
                <p className="text-xs text-indigo-300 font-medium mt-0.5">
                  {currentResume.currentRole}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-white font-semibold">{currentResume.totalYearsExperience} Years Total Exp</span>
                </div>
                {!isAnonymized && currentResume.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{currentResume.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Education & Certifications row */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1 mb-1">
                  <GraduationCap className="w-3.5 h-3.5 text-cyan-400" /> Education
                </span>
                {currentResume.education && currentResume.education.length > 0 ? (
                  <div className="space-y-1">
                    {currentResume.education.map((edu, idx) => (
                      <p key={idx} className="text-slate-300">
                        <strong className="text-white">{edu.degree}</strong> in {edu.field}
                        {!isAnonymized && ` — ${edu.institution}`} {edu.year && `(${edu.year})`}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic">No formal degree listed</p>
                )}
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1 mb-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" /> Certifications & Credentials
                </span>
                {currentResume.certifications && currentResume.certifications.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {currentResume.certifications.map((cert, idx) => (
                      <span key={idx} className="text-[11px] bg-slate-800/90 text-amber-200/90 border border-slate-700 px-2 py-0.5 rounded-md">
                        {cert}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic">None specified</p>
                )}
              </div>
            </div>
          </div>

          {/* Extracted Skills with Provenance Evidence Snippets */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Quote className="w-3.5 h-3.5 text-indigo-400" />
                Demonstrated Skills & Evidence Grounding ({currentResume.skills.length} extracted):
              </span>
              <span className="text-[11px] text-slate-400">Hover for verified quote</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {currentResume.skills.map((sk, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-2.5 transition-all group relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {sk.rawName}
                    </span>
                    {sk.yearsOfExperience ? (
                      <span className="text-[10px] text-indigo-400 bg-indigo-950/40 px-1.5 py-0.5 rounded font-mono">
                        {sk.yearsOfExperience}y exp
                      </span>
                    ) : null}
                  </div>

                  {sk.evidenceSnippet && (
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 italic group-hover:line-clamp-none transition-all">
                      "{sk.evidenceSnippet}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Experience Highlights */}
          {currentResume.experiences && currentResume.experiences.length > 0 && (
            <div className="pt-2">
              <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                Work History & Production Deliverables:
              </h4>

              <div className="space-y-2">
                {currentResume.experiences.map((exp, idx) => (
                  <div key={idx} className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3 text-xs">
                    <div className="flex items-center justify-between text-slate-300 font-semibold mb-1">
                      <span className="text-white">
                        {exp.role} {!isAnonymized && `at ${exp.company}`}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {exp.startDate} - {exp.endDate} ({exp.durationYears}y)
                      </span>
                    </div>
                    <ul className="space-y-1 pl-3 list-disc text-slate-400 text-[11px]">
                      {exp.highlights.slice(0, 3).map((hl, hIdx) => (
                        <li key={hIdx}>{hl}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Add Resume Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Upload or Paste Candidate Resume</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-md"
              >
                ✕ Close
              </button>
            </div>

            {/* File dropzone */}
            <div
              className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${
                dragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 bg-slate-950/50'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    setNewResumeText(ev.target?.result as string);
                  };
                  reader.readAsText(file);
                }
              }}
            >
              <Upload className="w-7 h-7 text-indigo-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-300">Drag & Drop Resume text file (.txt, .md)</p>
              <p className="text-[11px] text-slate-500 mt-0.5">or browse your local file</p>
              <input
                type="file"
                id="resume-file-input"
                accept=".txt,.md,.text"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="resume-file-input"
                className="inline-block mt-2 text-xs px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 cursor-pointer font-medium"
              >
                Choose File
              </label>
            </div>

            {/* Textarea */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Or Paste Resume Content directly:
              </label>
              <textarea
                id="new-resume-raw-textarea"
                rows={8}
                value={newResumeText}
                onChange={(e) => setNewResumeText(e.target.value)}
                placeholder="Paste candidate resume text with experience, education, and skills..."
                className="w-full bg-slate-950 text-slate-200 text-xs font-mono p-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-xs px-3 py-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                id="confirm-parse-resume-btn"
                onClick={handleApplyNewResume}
                disabled={isLoading || !newResumeText.trim()}
                className="text-xs px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Extract with Gemini & Add</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
