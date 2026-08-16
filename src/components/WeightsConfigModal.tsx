import React, { useState } from 'react';
import { SlidersHorizontal, RotateCcw, X, Check, Layers, Clock, GraduationCap, Sparkles } from 'lucide-react';
import { ScoringWeights } from '../types';
import { DEFAULT_WEIGHTS } from '../utils/matcherEngine';

interface WeightsConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  weights: ScoringWeights;
  onSaveWeights: (weights: ScoringWeights) => void;
}

export const WeightsConfigModal: React.FC<WeightsConfigModalProps> = ({
  isOpen,
  onClose,
  weights,
  onSaveWeights
}) => {
  const [localWeights, setLocalWeights] = useState<ScoringWeights>(weights);

  if (!isOpen) return null;

  const total = 
    localWeights.mustHaveSkillsWeight +
    localWeights.experienceWeight +
    localWeights.niceToHaveWeight +
    localWeights.educationWeight +
    localWeights.domainRoleWeight;

  const handleReset = () => {
    setLocalWeights(DEFAULT_WEIGHTS);
  };

  const handleSave = () => {
    onSaveWeights(localWeights);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Scoring Weight Distribution</h3>
              <p className="text-xs text-slate-400">Configure deterministic scoring formula</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sliders List */}
        <div className="space-y-4 text-xs">
          
          {/* Must-Haves */}
          <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between font-semibold text-slate-200">
              <span className="flex items-center gap-1.5 text-emerald-400">
                Must-Have Technical Skills:
              </span>
              <span className="font-mono text-sm font-bold text-emerald-400">{localWeights.mustHaveSkillsWeight}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={70}
              step={5}
              value={localWeights.mustHaveSkillsWeight}
              onChange={(e) => setLocalWeights({ ...localWeights, mustHaveSkillsWeight: Number(e.target.value) })}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">Core hard requirements and prerequisite skills.</p>
          </div>

          {/* Experience */}
          <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between font-semibold text-slate-200">
              <span className="flex items-center gap-1.5 text-indigo-400">
                Experience Years & Seniority:
              </span>
              <span className="font-mono text-sm font-bold text-indigo-400">{localWeights.experienceWeight}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={50}
              step={5}
              value={localWeights.experienceWeight}
              onChange={(e) => setLocalWeights({ ...localWeights, experienceWeight: Number(e.target.value) })}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">Years of verified professional software engineering experience.</p>
          </div>

          {/* Nice-to-Haves */}
          <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between font-semibold text-slate-200">
              <span className="flex items-center gap-1.5 text-blue-400">
                Nice-to-Have / Preferred Stack:
              </span>
              <span className="font-mono text-sm font-bold text-blue-400">{localWeights.niceToHaveWeight}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={30}
              step={5}
              value={localWeights.niceToHaveWeight}
              onChange={(e) => setLocalWeights({ ...localWeights, niceToHaveWeight: Number(e.target.value) })}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">Supplementary framework and tooling bonus points.</p>
          </div>

          {/* Education */}
          <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between font-semibold text-slate-200">
              <span className="flex items-center gap-1.5 text-cyan-400">
                Education & Degree Level:
              </span>
              <span className="font-mono text-sm font-bold text-cyan-400">{localWeights.educationWeight}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={25}
              step={5}
              value={localWeights.educationWeight}
              onChange={(e) => setLocalWeights({ ...localWeights, educationWeight: Number(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">Degree qualification match (B.S., M.S., Ph.D.).</p>
          </div>

          {/* Domain */}
          <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between font-semibold text-slate-200">
              <span className="flex items-center gap-1.5 text-amber-400">
                Domain Alignment & Industry Knowledge:
              </span>
              <span className="font-mono text-sm font-bold text-amber-400">{localWeights.domainRoleWeight}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={30}
              step={5}
              value={localWeights.domainRoleWeight}
              onChange={(e) => setLocalWeights({ ...localWeights, domainRoleWeight: Number(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">Domain keywords, industry specialization, and architecture scope.</p>
          </div>

        </div>

        {/* Sum Indicator & Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className={`text-xs font-mono font-bold ${total === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
              Sum: {total}%
            </span>
            <button
              onClick={handleSave}
              className="text-xs px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-500/20"
            >
              <Check className="w-4 h-4" />
              <span>Apply Weights</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
