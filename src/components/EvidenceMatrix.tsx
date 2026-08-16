import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  AlertTriangle, 
  XCircle, 
  Quote, 
  ShieldAlert, 
  Edit, 
  Check, 
  Filter, 
  ExternalLink,
  HelpCircle,
  Search
} from 'lucide-react';
import { SkillMatchResult, MatchStatus } from '../types';

interface EvidenceMatrixProps {
  skillMatches: SkillMatchResult[];
  onOverrideSkillScore: (skillId: string, newScore: number, notes?: string) => void;
}

export const EvidenceMatrix: React.FC<EvidenceMatrixProps> = ({
  skillMatches,
  onOverrideSkillScore
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [overrideScoreInput, setOverrideScoreInput] = useState<number>(100);
  const [overrideNotesInput, setOverrideNotesInput] = useState<string>('');

  const getStatusBadge = (status: MatchStatus, isRisk: boolean) => {
    if (isRisk) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          Unverified Claim
        </span>
      );
    }

    switch (status) {
      case 'EXACT_MATCH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Exact Match (100%)
          </span>
        );
      case 'EQUIVALENT_MATCH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Equivalent Match
          </span>
        );
      case 'PARTIAL_MATCH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Partial Match
          </span>
        );
      case 'MISSING':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
            <XCircle className="w-3.5 h-3.5 text-slate-500" />
            Missing (0%)
          </span>
        );
    }
  };

  const filteredMatches = skillMatches.filter(item => {
    if (filterStatus !== 'ALL' && item.matchStatus !== filterStatus) {
      if (filterStatus === 'RISK' && !item.isHallucinationRisk) return false;
      if (filterStatus !== 'RISK') return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.requirement.skillName.toLowerCase().includes(q);
      const candSkill = item.matchedSkillName?.toLowerCase().includes(q);
      const evidence = item.evidenceSnippet?.toLowerCase().includes(q);
      if (!matchName && !candSkill && !evidence) return false;
    }
    return true;
  });

  const handleSaveOverride = (skillId: string) => {
    onOverrideSkillScore(skillId, overrideScoreInput, overrideNotesInput);
    setEditingSkillId(null);
    setOverrideNotesInput('');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      
      {/* Header with Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-white tracking-tight">Explainable Evidence Matrix</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700">
              {skillMatches.length} Requirements Mapped
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Every match is directly anchored to verifiable verbatim quotes extracted from candidate resume
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search skill or quote..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs bg-slate-950 text-slate-200 pl-8 pr-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-44"
            />
          </div>

          {/* Status Tabs */}
          <div className="bg-slate-800/80 p-1 rounded-lg border border-slate-700 flex space-x-1 text-xs">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-2 py-1 rounded-md font-medium transition-all ${
                filterStatus === 'ALL' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({skillMatches.length})
            </button>
            <button
              onClick={() => setFilterStatus('EXACT_MATCH')}
              className={`px-2 py-1 rounded-md font-medium transition-all ${
                filterStatus === 'EXACT_MATCH' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Exact
            </button>
            <button
              onClick={() => setFilterStatus('EQUIVALENT_MATCH')}
              className={`px-2 py-1 rounded-md font-medium transition-all ${
                filterStatus === 'EQUIVALENT_MATCH' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Equivalent
            </button>
            <button
              onClick={() => setFilterStatus('MISSING')}
              className={`px-2 py-1 rounded-md font-medium transition-all ${
                filterStatus === 'MISSING' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Missing
            </button>
          </div>
        </div>
      </div>

      {/* Evidence Cards List */}
      <div className="space-y-3">
        {filteredMatches.length === 0 ? (
          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-400">
            No requirements match the selected filter.
          </div>
        ) : (
          filteredMatches.map((item) => {
            const req = item.requirement;
            const isEditing = editingSkillId === req.id;

            return (
              <div
                key={req.id}
                className={`bg-slate-950/60 border rounded-xl p-4 transition-all ${
                  item.isHallucinationRisk
                    ? 'border-rose-500/50 bg-rose-950/10'
                    : item.matchStatus === 'EXACT_MATCH'
                    ? 'border-slate-800 hover:border-emerald-500/40'
                    : item.matchStatus === 'EQUIVALENT_MATCH'
                    ? 'border-slate-800 hover:border-indigo-500/40'
                    : 'border-slate-800/80'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                  
                  {/* Left: Requirement Details */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-white tracking-tight">
                        {req.skillName}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        req.isMustHave 
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30' 
                          : 'bg-blue-950/80 text-blue-300 border border-blue-500/30'
                      }`}>
                        {req.isMustHave ? 'MUST-HAVE' : 'PREFERRED'}
                      </span>
                      <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded font-mono">
                        Weight: {req.importanceWeight}/5
                      </span>
                      {req.minYearsExp && (
                        <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded font-mono">
                          {req.minYearsExp}y+ Req
                        </span>
                      )}
                    </div>

                    {/* Matched Candidate Skill & Equivalence Rationale */}
                    {item.matchedSkillName && (
                      <p className="text-xs text-slate-300">
                        <strong className="text-indigo-300">Resume Match:</strong> {item.matchedSkillName}
                        {item.equivalenceExplanation && (
                          <span className="text-slate-400 block mt-0.5 text-[11px] italic">
                            ↳ {item.equivalenceExplanation}
                          </span>
                        )}
                      </p>
                    )}

                    {/* Verbatim Evidence Quote */}
                    {item.evidenceSnippet ? (
                      <div className="mt-2 bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 relative group">
                        <div className="flex items-start space-x-2">
                          <Quote className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <p className="italic text-slate-200">
                              "{item.evidenceSnippet}"
                            </p>
                            {item.evidenceSource && (
                              <p className="text-[10px] text-slate-400 font-mono">
                                Source: {item.evidenceSource}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : item.matchStatus === 'MISSING' ? (
                      <p className="text-xs text-slate-400 italic pt-1">
                        No direct or equivalent demonstration of this skill found in candidate resume.
                      </p>
                    ) : null}

                    {/* Hallucination / Audit Warning */}
                    {item.isHallucinationRisk && (
                      <div className="mt-2 p-2 rounded-lg bg-rose-950/40 border border-rose-500/40 text-xs text-rose-200 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-semibold">
                          <ShieldAlert className="w-4 h-4 text-rose-400" />
                          Audit Trigger: Claim is unverified against resume text. Reviewer audit required.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right: Match Status & Override Action */}
                  <div className="flex flex-row lg:flex-col items-end justify-between lg:justify-start gap-2 shrink-0">
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(item.matchStatus, item.isHallucinationRisk)}
                      <span className="text-sm font-bold text-white font-mono bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                        {item.humanOverrideScore !== undefined ? item.humanOverrideScore : item.score}%
                      </span>
                    </div>

                    {/* Reviewer Override Button */}
                    <button
                      id={`override-skill-btn-${req.id}`}
                      onClick={() => {
                        setEditingSkillId(isEditing ? null : req.id);
                        setOverrideScoreInput(item.score);
                      }}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1 transition-all"
                    >
                      <Edit className="w-3 h-3 text-indigo-400" />
                      <span>{isEditing ? 'Cancel' : 'Audit Rating'}</span>
                    </button>
                  </div>

                </div>

                {/* Inline Human Audit Override Editor */}
                {isEditing && (
                  <div className="mt-3 pt-3 border-t border-slate-800 bg-slate-900/60 p-3 rounded-lg space-y-2">
                    <h5 className="text-xs font-bold text-indigo-300">
                      Human Reviewer Score Override:
                    </h5>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center space-x-2">
                        <label className="text-xs text-slate-300">Adjust Score:</label>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          step={5}
                          value={overrideScoreInput}
                          onChange={(e) => setOverrideScoreInput(Number(e.target.value))}
                          className="w-32 accent-indigo-500"
                        />
                        <span className="text-xs font-bold text-white font-mono">{overrideScoreInput}%</span>
                      </div>

                      <div className="flex-1 min-w-[200px]">
                        <input
                          type="text"
                          placeholder="Audit rationale / reviewer justification notes..."
                          value={overrideNotesInput}
                          onChange={(e) => setOverrideNotesInput(e.target.value)}
                          className="w-full text-xs bg-slate-950 text-slate-200 px-3 py-1 rounded-lg border border-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      <button
                        onClick={() => handleSaveOverride(req.id)}
                        className="text-xs px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1 transition-all"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Override</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
