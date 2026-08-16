import React from 'react';
import { 
  Users, 
  Trophy, 
  ShieldAlert, 
  CheckCircle2, 
  Download, 
  ArrowRight, 
  FileSpreadsheet,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';
import { MatchEvaluationResult, ResumeData, JobDescriptionData } from '../types';

interface CandidateCompareMatrixProps {
  evaluations: MatchEvaluationResult[];
  resumes: ResumeData[];
  jd: JobDescriptionData;
  selectedResumeId: string;
  onSelectResume: (id: string) => void;
  isAnonymized: boolean;
}

export const CandidateCompareMatrix: React.FC<CandidateCompareMatrixProps> = ({
  evaluations,
  resumes,
  jd,
  selectedResumeId,
  onSelectResume,
  isAnonymized
}) => {
  // Sort evaluations by score descending
  const sortedEvals = [...evaluations].sort((a, b) => b.totalMatchScore - a.totalMatchScore);

  const getCandidateName = (candId: string, originalName: string) => {
    if (!isAnonymized) return originalName;
    const idx = resumes.findIndex(r => r.id === candId);
    return `Candidate ${String.fromCharCode(65 + (idx >= 0 ? idx : 0))}`;
  };

  const handleExportJSON = () => {
    const report = {
      timestamp: new Date().toISOString(),
      jobTitle: jd.title,
      company: jd.company,
      anonymizedMode: isAnonymized,
      candidatesEvaluated: sortedEvals.map(ev => ({
        candidateId: ev.candidateId,
        name: getCandidateName(ev.candidateId, ev.candidateName),
        role: ev.candidateRole,
        totalMatchScore: ev.totalMatchScore,
        mustHaveScore: ev.mustHaveScore,
        experienceScore: ev.experienceScore,
        niceToHaveScore: ev.niceToHaveScore,
        educationScore: ev.educationScore,
        domainScore: ev.domainScore,
        hallucinationFlags: ev.hallucinationAlertsCount,
        requiresHumanAudit: ev.requiresHumanAudit,
        recommendation: ev.summaryRecommendation,
        strengths: ev.strengths,
        gaps: ev.gaps
      }))
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-jd-match-audit-${jd.title.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Candidate Comparison Matrix</h3>
            <p className="text-xs text-slate-400">
              Side-by-side multi-resume leaderboard for {jd.title}
            </p>
          </div>
        </div>

        <button
          id="export-audit-report-btn"
          onClick={handleExportJSON}
          className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-indigo-400" />
          <span>Export Audit Report (JSON)</span>
        </button>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-800">
            <tr>
              <th className="py-3 px-3">Rank & Candidate</th>
              <th className="py-3 px-2 text-center">Total Match</th>
              <th className="py-3 px-2 text-center">Must-Haves (40%)</th>
              <th className="py-3 px-2 text-center">Experience (25%)</th>
              <th className="py-3 px-2 text-center">Nice-to-Have (15%)</th>
              <th className="py-3 px-2 text-center">Domain (10%)</th>
              <th className="py-3 px-2 text-center">Audit Status</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {sortedEvals.map((ev, index) => {
              const isSelected = ev.candidateId === selectedResumeId;
              const displayName = getCandidateName(ev.candidateId, ev.candidateName);

              return (
                <tr
                  key={ev.candidateId}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    isSelected ? 'bg-indigo-950/20' : ''
                  }`}
                >
                  {/* Rank & Name */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        index === 0 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                        index === 1 ? 'bg-slate-700 text-slate-200' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <span className={`font-bold text-sm block ${isSelected ? 'text-indigo-300' : 'text-white'}`}>
                          {displayName}
                        </span>
                        <span className="text-[11px] text-slate-400">{ev.candidateRole}</span>
                      </div>
                    </div>
                  </td>

                  {/* Total Score */}
                  <td className="py-3.5 px-2 text-center">
                    <span className={`inline-block font-extrabold text-sm px-2.5 py-1 rounded-lg font-mono ${
                      ev.totalMatchScore >= 80 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      ev.totalMatchScore >= 65 ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}>
                      {ev.totalMatchScore}%
                    </span>
                  </td>

                  {/* Must-Haves */}
                  <td className="py-3.5 px-2 text-center font-mono text-slate-200">
                    <span className={ev.mustHaveScore >= 80 ? 'text-emerald-400' : 'text-amber-400'}>
                      {ev.mustHaveScore}%
                    </span>
                  </td>

                  {/* Experience */}
                  <td className="py-3.5 px-2 text-center text-slate-300">
                    <span className="font-mono">{ev.experienceCheck.actual}y</span>
                    <span className="text-[10px] text-slate-500 block">({ev.experienceScore}%)</span>
                  </td>

                  {/* Nice to have */}
                  <td className="py-3.5 px-2 text-center font-mono text-slate-300">
                    {ev.niceToHaveScore}%
                  </td>

                  {/* Domain */}
                  <td className="py-3.5 px-2 text-center font-mono text-slate-300">
                    {ev.domainScore}%
                  </td>

                  {/* Audit Flags */}
                  <td className="py-3.5 px-2 text-center">
                    {ev.requiresHumanAudit || ev.hallucinationAlertsCount > 0 ? (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                        <ShieldAlert className="w-3 h-3" /> Audit Req
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3 h-3" /> Grounded
                      </span>
                    )}
                  </td>

                  {/* Select Candidate Action */}
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => onSelectResume(ev.candidateId)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all inline-flex items-center gap-1 ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      <span>{isSelected ? 'Viewing' : 'Inspect'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
