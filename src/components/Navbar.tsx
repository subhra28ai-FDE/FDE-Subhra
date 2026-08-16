import React from 'react';
import { 
  Briefcase, 
  ShieldCheck, 
  Sparkles, 
  EyeOff, 
  Eye, 
  Database, 
  SlidersHorizontal,
  FileCheck,
  MessageSquareHeart
} from 'lucide-react';
import { SamplePreset } from '../types';

interface NavbarProps {
  presets: SamplePreset[];
  currentPresetId: string;
  onSelectPreset: (presetId: string) => void;
  isAnonymized: boolean;
  onToggleAnonymize: () => void;
  onOpenTaxonomyModal: () => void;
  onOpenWeightsModal: () => void;
  auditAlertsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  presets,
  currentPresetId,
  onSelectPreset,
  isAnonymized,
  onToggleAnonymize,
  onOpenTaxonomyModal,
  onOpenWeightsModal,
  auditAlertsCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">ApexMatch</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Gemini 3.7
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Explainable Resume & JD Matching Engine</p>
            </div>
          </div>

          {/* Preset Selector */}
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" /> Presets:
            </span>
            <select
              id="preset-selector-select"
              value={currentPresetId}
              onChange={(e) => onSelectPreset(e.target.value)}
              className="text-xs bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer font-medium"
            >
              {presets.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.title}
                </option>
              ))}
            </select>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-2.5">
            {/* Anonymization Toggle for Fair Hiring */}
            <button
              id="bias-mitigation-toggle-btn"
              onClick={onToggleAnonymize}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-all shadow-sm ${
                isAnonymized
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              title="Mask candidate names, gender cues, and contact details to mitigate bias in initial evaluation."
            >
              {isAnonymized ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
              <span>{isAnonymized ? 'Anonymized Mode' : 'Blind Review'}</span>
            </button>

            {/* Kaggle Skills Master Taxonomy Explorer */}
            <button
              id="open-skills-taxonomy-btn"
              onClick={onOpenTaxonomyModal}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-medium flex items-center gap-1.5 transition-all"
              title="Inspect Kaggle Skills Master taxonomy and equivalence mappings."
            >
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Skills Master</span>
            </button>

            {/* Weights Configuration */}
            <button
              id="open-weights-config-btn"
              onClick={onOpenWeightsModal}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-medium flex items-center gap-1.5 transition-all"
              title="Customize deterministic scoring weights."
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Weights</span>
            </button>

            {/* Recruiter & User Feedback Link */}
            <button
              id="nav-user-feedback-link"
              onClick={() => {
                const el = document.getElementById('app-user-reviews-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border border-slate-700 font-medium flex items-center gap-1.5 transition-all cursor-pointer"
              title="Read or leave user & recruiter reviews for this app"
            >
              <MessageSquareHeart className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">App Reviews</span>
            </button>

            {/* Human Audit Badge / Quick Review Link */}
            <button
              id="nav-human-review-link"
              onClick={() => {
                const el = document.getElementById('human-audit-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                auditAlertsCount > 0
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 hover:bg-rose-500/30 animate-pulse'
                  : 'bg-indigo-600/20 border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30'
              }`}
              title="Jump to Human Recruiter Review & Feedback Protocol section"
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${auditAlertsCount > 0 ? 'text-rose-400' : 'text-indigo-400'}`} />
              <span>{auditAlertsCount > 0 ? `${auditAlertsCount} Audit Flag${auditAlertsCount > 1 ? 's' : ''}` : 'Review & Audit'}</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
