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
  Check,
  FileCode,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ResumeData } from '../types';
import { extractTextFromFile, SAMPLE_CANDIDATE_TEMPLATES } from '../utils/fileParser';

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
  const [modalMode, setModalMode] = useState<'text_upload' | 'manual_form'>('text_upload');
  const [newResumeText, setNewResumeText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [fileStatus, setFileStatus] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  // Manual Form State
  const [manualName, setManualName] = useState('');
  const [manualRole, setManualRole] = useState('');
  const [manualYears, setManualYears] = useState(4);
  const [manualSkills, setManualSkills] = useState('Python, PostgreSQL, Docker, React.js, AWS');
  const [manualEducation, setManualEducation] = useState("B.S. in Computer Science");
  const [manualCompany, setManualCompany] = useState('Tech Solutions Corp');

  const currentResume = resumes.find(r => r.id === selectedResumeId) || resumes[0];

  const handleApplyNewResume = async () => {
    if (!newResumeText.trim()) return;
    setIsExtracting(true);
    try {
      await onParseRawResume(newResumeText);
      setNewResumeText('');
      setFileStatus(null);
      setIsAddModalOpen(false);
    } catch (e) {
      console.error('Error applying resume:', e);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleApplyManualCandidate = () => {
    if (!manualName.trim()) return;
    const skillsList = manualSkills
      .split(/[,|\n]/)
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => ({
        rawName: s,
        category: 'Backend' as any,
        yearsOfExperience: Math.max(1, manualYears),
        evidenceSnippet: `Demonstrated technical competency with ${s} in professional projects.`
      }));

    const newCandidate: ResumeData = {
      id: 'res-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      name: manualName.trim(),
      email: `${manualName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      currentRole: manualRole.trim() || 'Software Engineer',
      totalYearsExperience: Number(manualYears) || 3,
      education: [
        {
          degree: manualEducation.includes('Master') ? 'Master of Science' : 'Bachelor of Science',
          field: 'Computer Science & Engineering',
          institution: 'Accredited University',
          year: `${new Date().getFullYear() - Number(manualYears) - 1}`
        }
      ],
      certifications: [],
      skills: skillsList,
      experiences: [
        {
          company: manualCompany.trim() || 'Enterprise Tech Corp',
          role: manualRole.trim() || 'Software Engineer',
          startDate: `${new Date().getFullYear() - Number(manualYears)}`,
          endDate: 'Present',
          durationYears: Number(manualYears) || 3,
          highlights: [
            `Built scalable services and client-facing features utilizing ${manualSkills.slice(0, 40)}.`,
            'Collaborated with cross-functional product and infrastructure teams.'
          ],
          technologiesUsed: skillsList.map(s => s.rawName)
        }
      ],
      rawText: `${manualName} - ${manualRole}\nExperience: ${manualYears} years\nSkills: ${manualSkills}\nEducation: ${manualEducation}`
    };

    onAddResume(newCandidate);
    onSelectResume(newCandidate.id);
    setManualName('');
    setIsAddModalOpen(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileStatus(`Reading ${file.name}...`);
    try {
      const text = await extractTextFromFile(file);
      if (text) {
        setNewResumeText(text);
        setFileStatus(`✓ Loaded ${file.name} (${text.length.toLocaleString()} characters)`);
      } else {
        setFileStatus('Could not extract text. Please paste text directly.');
      }
    } catch (err: any) {
      console.error(err);
      setFileStatus(`Error loading file: ${err.message}`);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFileStatus(`Reading ${file.name}...`);
      try {
        const text = await extractTextFromFile(file);
        if (text) {
          setNewResumeText(text);
          setFileStatus(`✓ Loaded ${file.name} (${text.length.toLocaleString()} characters)`);
        }
      } catch (err: any) {
        console.error(err);
        setFileStatus('Failed to read dropped file.');
      }
    }
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
            onClick={() => {
              setFileStatus(null);
              setIsAddModalOpen(true);
            }}
            className="text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Resume</span>
          </button>

          {resumes.length > 1 && currentResume && (
            <button
              id="delete-current-resume-btn"
              onClick={() => onDeleteResume(currentResume.id)}
              className="text-xs p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition-all cursor-pointer"
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
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{currentResume.totalYearsExperience} Years Exp</span>
                </div>
                {currentResume.location && (
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{isAnonymized ? 'United States' : currentResume.location}</span>
                  </div>
                )}
                {currentResume.email && !isAnonymized && (
                  <span className="text-slate-500 text-[11px]">
                    {currentResume.email}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Education & Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            
            {/* Education */}
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-3.5">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300 mb-2">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span>Education Background</span>
              </div>
              <div className="space-y-2">
                {currentResume.education.map((edu, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="font-medium text-slate-200">{edu.degree} in {edu.field}</div>
                    <div className="text-[11px] text-slate-400 flex items-center justify-between">
                      <span>{isAnonymized ? 'Accredited Institution' : edu.institution}</span>
                      {edu.year && <span>{edu.year}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-3.5">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300 mb-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Certifications & Credentials</span>
              </div>
              {currentResume.certifications.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {currentResume.certifications.map((cert, idx) => (
                    <span key={idx} className="text-[11px] px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-md">
                      {cert}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No formal certifications listed</p>
              )}
            </div>

          </div>

          {/* Extracted Skills & Verifiable Evidence Snippets */}
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-indigo-400" />
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Extracted Skills & Verified Evidence Quotes ({currentResume.skills.length})
                </h4>
              </div>
              <span className="text-[10px] text-slate-500">
                Ground-truth sentences extracted directly from resume text
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
              {currentResume.skills.map((skill, sIdx) => (
                <div 
                  key={sIdx} 
                  className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 text-xs hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-200">{skill.rawName}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                      {skill.category}
                    </span>
                  </div>

                  {skill.evidenceSnippet ? (
                    <div className="text-[11px] text-slate-400 italic bg-slate-950/60 p-1.5 rounded border border-slate-800/60 flex items-start gap-1.5 mt-1">
                      <Quote className="w-3 h-3 text-indigo-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">"{skill.evidenceSnippet}"</span>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-500 italic">Mentioned in skills summary list</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Work Experience */}
          {currentResume.experiences.length > 0 && (
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300 mb-3">
                <Briefcase className="w-4 h-4 text-blue-400" />
                <span>Work Experience & Roles</span>
              </div>
              <div className="space-y-3">
                {currentResume.experiences.map((exp, eIdx) => (
                  <div key={eIdx} className="border-l-2 border-indigo-500/40 pl-3 py-0.5">
                    <div className="flex flex-wrap items-center justify-between text-xs gap-1">
                      <span className="font-bold text-slate-200">{exp.role}</span>
                      <span className="text-[11px] text-slate-400">{exp.startDate} – {exp.endDate} ({exp.durationYears}y)</span>
                    </div>
                    <p className="text-[11px] text-indigo-300 font-medium">{isAnonymized ? 'Enterprise Software Organization' : exp.company}</p>
                    <ul className="mt-1.5 list-disc list-inside text-[11px] text-slate-400 space-y-1">
                      {exp.highlights.map((hl, hIdx) => (
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
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Add Candidate Resume</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setModalMode('text_upload')}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  modalMode === 'text_upload'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload or Paste Resume</span>
              </button>
              <button
                onClick={() => setModalMode('manual_form')}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  modalMode === 'manual_form'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Manual Candidate Form</span>
              </button>
            </div>

            {/* Quick Sample Candidates Picker */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                ⚡ Quick Load Sample Candidate Template:
              </label>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_CANDIDATE_TEMPLATES.map((tpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setNewResumeText(tpl.resumeText);
                      setFileStatus(`✓ Loaded template: ${tpl.label}`);
                      setModalMode('text_upload');
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>{tpl.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {modalMode === 'text_upload' ? (
              <>
                {/* File dropzone */}
                <div
                  className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${
                    dragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 bg-slate-950/50'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                >
                  <Upload className="w-7 h-7 text-indigo-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-200">
                    Drag & Drop Resume (.pdf, .docx, .txt, .md, .rtf)
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    or click below to choose a file from your computer
                  </p>
                  <input
                    type="file"
                    id="resume-file-input"
                    accept=".pdf,.txt,.md,.text,.doc,.docx,.rtf,.json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="resume-file-input"
                    className="inline-block mt-2 text-xs px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer font-medium shadow-sm transition-all"
                  >
                    Browse Local File
                  </label>
                  {fileStatus && (
                    <div className="mt-2 text-xs font-medium text-emerald-400 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{fileStatus}</span>
                    </div>
                  )}
                </div>

                {/* Textarea */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Or Paste Resume Content directly:
                    </label>
                    <span className="text-[10px] text-slate-500">
                      {newResumeText.length} characters
                    </span>
                  </div>
                  <textarea
                    id="new-resume-raw-textarea"
                    rows={8}
                    value={newResumeText}
                    onChange={(e) => setNewResumeText(e.target.value)}
                    placeholder="Paste candidate resume text with experience, education, skills, and projects..."
                    className="w-full bg-slate-950 text-slate-200 text-xs font-mono p-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="text-xs px-3 py-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    id="confirm-parse-resume-btn"
                    onClick={handleApplyNewResume}
                    disabled={isExtracting || isLoading || !newResumeText.trim()}
                    className="text-xs px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-md shadow-indigo-500/20"
                  >
                    {isExtracting || isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Extracting & Matching...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Extract with Gemini & Add</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              /* Manual Candidate Entry Form */
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Candidate Name *</label>
                    <input
                      type="text"
                      value={manualName}
                      onChange={(e) => setManualName(e.target.value)}
                      placeholder="e.g. Jordan Lee"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Current Job Title</label>
                    <input
                      type="text"
                      value={manualRole}
                      onChange={(e) => setManualRole(e.target.value)}
                      placeholder="e.g. Senior Backend Engineer"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Years of Experience</label>
                    <input
                      type="number"
                      min={0}
                      max={35}
                      value={manualYears}
                      onChange={(e) => setManualYears(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Current / Previous Company</label>
                    <input
                      type="text"
                      value={manualCompany}
                      onChange={(e) => setManualCompany(e.target.value)}
                      placeholder="e.g. Acme Cloud Corp"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Key Technical & Professional Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    value={manualSkills}
                    onChange={(e) => setManualSkills(e.target.value)}
                    placeholder="e.g. Python, Docker, Kubernetes, AWS, PostgreSQL, FastAPI"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Education Degree</label>
                  <input
                    type="text"
                    value={manualEducation}
                    onChange={(e) => setManualEducation(e.target.value)}
                    placeholder="e.g. B.S. in Computer Science"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="text-xs px-3 py-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApplyManualCandidate}
                    disabled={!manualName.trim()}
                    className="text-xs px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-md"
                  >
                    <Check className="w-4 h-4" />
                    <span>Create & Add Candidate</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
