import React from 'react';
import { 
  Percent, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  GraduationCap, 
  Sparkles, 
  SlidersHorizontal,
  Layers,
  HelpCircle
} from 'lucide-react';
import { MatchEvaluationResult, ScoringWeights } from '../types';

interface ScoreBreakdownCardProps {
  evaluation: MatchEvaluationResult;
  weights: ScoringWeights;
  onOpenWeightsModal: () => void;
}

export const ScoreBreakdownCard: React.FC<ScoreBreakdownCardProps> = ({
  evaluation,
  weights,
  onOpenWeightsModal
}) => {
  const score = evaluation.totalMatchScore;

  // Determine score color & badge
  const getScoreTheme = (val: number) => {
    if (val >= 82) return { text: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', ring: 'ring-emerald-500/40', badge: 'High Match' };
    if (val >= 70) return { text: 'text-indigo-400', border: 'border-indigo-500/30', bg: 'bg-indigo-500/10', ring: 'ring-indigo-500/40', badge: 'Solid Match' };
    if (val >= 55) return { text: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10', ring: 'ring-amber-500/40', badge: 'Partial Match' };
    return { text: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500/10', ring: 'ring-rose-500/40', badge: 'Low Fit' };
  };

  const theme = getScoreTheme(score);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
      
      {/* Header with Total Score Dial */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-white tracking-tight">Transparent Match Score</h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${theme.bg} ${theme.text} border ${theme.border}`}>
              {theme.badge}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Calculated via deterministic rules + Kaggle Skills Master equivalence
          </p>
        </div>

        {/* Score Ring Display */}
        <div className="flex items-center space-x-3 self-start sm:self-center">
          <div className={`w-16 h-16 rounded-2xl ${theme.bg} border ${theme.border} flex flex-col items-center justify-center shadow-lg ring-1 ${theme.ring}`}>
            <span className={`text-2xl font-extrabold ${theme.text} tracking-tight`}>
              {score}%
            </span>
            <span className="text-[9px] text-slate-400 uppercase font-semibold">Weighted</span>
          </div>

          <button
            id="open-weights-modal-btn-card"
            onClick={onOpenWeightsModal}
            className="text-xs p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 font-medium transition-all"
            title="Adjust deterministic weight distribution"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Adjust Weights</span>
          </button>
        </div>
      </div>

      {/* 5-Dimensional Deterministic Subscores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        
        {/* 1. Must-Have Skills */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Must-Haves
            </span>
            <span className="text-slate-500 font-mono text-[11px]">{weights.mustHaveSkillsWeight}% wt</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold text-white">{evaluation.mustHaveScore}%</span>
            <span className="text-[10px] text-slate-400">Core coverage</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${evaluation.mustHaveScore}%` }} 
            />
          </div>
        </div>

        {/* 2. Experience Check */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" /> Experience
            </span>
            <span className="text-slate-500 font-mono text-[11px]">{weights.experienceWeight}% wt</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold text-white">{evaluation.experienceScore}%</span>
            <span className="text-[10px] text-slate-400">
              {evaluation.experienceCheck.actual}y / {evaluation.experienceCheck.required}y req
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${evaluation.experienceScore}%` }} 
            />
          </div>
        </div>

        {/* 3. Nice-to-Have Skills */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Nice-to-Haves
            </span>
            <span className="text-slate-500 font-mono text-[11px]">{weights.niceToHaveWeight}% wt</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold text-white">{evaluation.niceToHaveScore}%</span>
            <span className="text-[10px] text-slate-400">Bonus stack</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-blue-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${evaluation.niceToHaveScore}%` }} 
            />
          </div>
        </div>

        {/* 4. Education Check */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-cyan-400" /> Education
            </span>
            <span className="text-slate-500 font-mono text-[11px]">{weights.educationWeight}% wt</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold text-white">{evaluation.educationScore}%</span>
            <span className="text-[10px] text-slate-400">Degree parity</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-cyan-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${evaluation.educationScore}%` }} 
            />
          </div>
        </div>

        {/* 5. Domain Alignment */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-amber-400" /> Domain & Role
            </span>
            <span className="text-slate-500 font-mono text-[11px]">{weights.domainRoleWeight}% wt</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold text-white">{evaluation.domainScore}%</span>
            <span className="text-[10px] text-slate-400">Industry fit</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-amber-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${evaluation.domainScore}%` }} 
            />
          </div>
        </div>

      </div>

      {/* Summary Narrative & Verified Strengths / Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        
        {/* Strengths Card */}
        <div className="bg-slate-950/40 border border-emerald-500/20 rounded-xl p-3.5">
          <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Key Strengths ({evaluation.strengths.length}):
          </h4>
          {evaluation.strengths.length > 0 ? (
            <ul className="space-y-1.5 text-xs text-slate-300">
              {evaluation.strengths.map((str, idx) => (
                <li key={idx} className="flex items-start space-x-1.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400 italic">No standout strengths detected</p>
          )}
        </div>

        {/* Gaps & Discrepancies */}
        <div className="bg-slate-950/40 border border-rose-500/20 rounded-xl p-3.5">
          <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <AlertCircle className="w-4 h-4 text-rose-400" /> Gaps & Missing Reqs ({evaluation.gaps.length}):
          </h4>
          {evaluation.gaps.length > 0 ? (
            <ul className="space-y-1.5 text-xs text-slate-300">
              {evaluation.gaps.map((gap, idx) => (
                <li key={idx} className="flex items-start space-x-1.5">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-emerald-300 italic flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> All mandatory requirements satisfied!
            </p>
          )}
        </div>

      </div>

      {/* Explanatory Rule Footer */}
      <div className="text-[11px] text-slate-400 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
          Formula: ({evaluation.mustHaveScore}×{weights.mustHaveSkillsWeight}% + {evaluation.experienceScore}×{weights.experienceWeight}% + {evaluation.niceToHaveScore}×{weights.niceToHaveWeight}% + {evaluation.educationScore}×{weights.educationWeight}% + {evaluation.domainScore}×{weights.domainRoleWeight}%) = <strong className="text-white">{score}%</strong>
        </span>
        <span className="text-slate-500 hidden sm:inline font-mono">Deterministic Engine v2.5</span>
      </div>

    </div>
  );
};
