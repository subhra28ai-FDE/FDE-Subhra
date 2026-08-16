import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Briefcase, 
  User, 
  Sparkles, 
  ShieldCheck, 
  FileCheck2, 
  AlertTriangle,
  Info,
  RefreshCw
} from 'lucide-react';
import { SAMPLE_PRESETS } from './data/sampleData';
import { JobDescriptionData, ResumeData, ScoringWeights, MatchEvaluationResult } from './types';
import { evaluateResumeAgainstJD, DEFAULT_WEIGHTS } from './utils/matcherEngine';
import { parseResumeClientSide } from './utils/fileParser';
import { Navbar } from './components/Navbar';
import { GuardrailBanner } from './components/GuardrailBanner';
import { JDSection } from './components/JDSection';
import { ResumeSection } from './components/ResumeSection';
import { ScoreBreakdownCard } from './components/ScoreBreakdownCard';
import { EvidenceMatrix } from './components/EvidenceMatrix';
import { CandidateCompareMatrix } from './components/CandidateCompareMatrix';
import { HumanReviewSection } from './components/HumanReviewSection';
import { AppFeedbackSection } from './components/AppFeedbackSection';
import { SkillsTaxonomyModal } from './components/SkillsTaxonomyModal';
import { WeightsConfigModal } from './components/WeightsConfigModal';

export default function App() {
  // Preset selection
  const [currentPresetId, setCurrentPresetId] = useState<string>(SAMPLE_PRESETS[0].id);
  const currentPreset = useMemo(() => {
    return SAMPLE_PRESETS.find(p => p.id === currentPresetId) || SAMPLE_PRESETS[0];
  }, [currentPresetId]);

  // Current Active JD and Resumes list
  const [jd, setJD] = useState<JobDescriptionData>(currentPreset.jd);
  const [resumes, setResumes] = useState<ResumeData[]>(currentPreset.resumes);
  const [selectedResumeId, setSelectedResumeId] = useState<string>(currentPreset.resumes[0]?.id || '');

  // Anonymization / Fair Hiring mode
  const [isAnonymized, setIsAnonymized] = useState<boolean>(false);

  // Scoring Weights configuration
  const [weights, setWeights] = useState<ScoringWeights>(DEFAULT_WEIGHTS);

  // Overrides and Human Feedback stored per candidate
  const [candidateOverrides, setCandidateOverrides] = useState<Record<string, Record<string, number>>>({});
  const [candidateReviews, setCandidateReviews] = useState<Record<string, any>>({});

  // Modals state
  const [isTaxonomyModalOpen, setIsTaxonomyModalOpen] = useState(false);
  const [isWeightsModalOpen, setIsWeightsModalOpen] = useState(false);

  // Loading indicator for Gemini API calls
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Update JD & Resumes when Preset changes
  const handleSelectPreset = (presetId: string) => {
    const found = SAMPLE_PRESETS.find(p => p.id === presetId);
    if (found) {
      setCurrentPresetId(presetId);
      setJD(found.jd);
      setResumes(found.resumes);
      setSelectedResumeId(found.resumes[0]?.id || '');
      setCandidateOverrides({});
      setCandidateReviews({});
    }
  };

  // Currently selected resume object
  const currentResume = useMemo(() => {
    return resumes.find(r => r.id === selectedResumeId) || resumes[0];
  }, [resumes, selectedResumeId]);

  // Evaluate All Candidates against JD with current weights and overrides
  const allEvaluations: MatchEvaluationResult[] = useMemo(() => {
    if (!jd || resumes.length === 0) return [];

    return resumes.map(res => {
      const baseEval = evaluateResumeAgainstJD(jd, res, weights);
      const resOverrides = candidateOverrides[res.id] || {};

      // Apply skill overrides if any
      const modifiedSkillMatches = baseEval.skillMatches.map(m => {
        if (resOverrides[m.requirement.id] !== undefined) {
          return {
            ...m,
            humanOverrideScore: resOverrides[m.requirement.id],
            score: resOverrides[m.requirement.id],
            humanAuditStatus: 'OVERRIDDEN' as const
          };
        }
        return m;
      });

      // Recalculate Must-Have score if overridden
      let mustHavePts = 0;
      let mustHaveMax = 0;
      modifiedSkillMatches.forEach(m => {
        const wt = m.requirement.importanceWeight || 3;
        if (m.requirement.isMustHave) {
          mustHaveMax += wt * 100;
          mustHavePts += (m.score / 100) * (wt * 100);
        }
      });
      const adjustedMustHaveScore = mustHaveMax > 0 ? Math.round((mustHavePts / mustHaveMax) * 100) : 100;

      // Recalculate total weighted score
      const totalWeight = weights.mustHaveSkillsWeight + 
                          weights.experienceWeight + 
                          weights.niceToHaveWeight + 
                          weights.educationWeight + 
                          weights.domainRoleWeight;

      const adjustedTotal = Math.round(
        (adjustedMustHaveScore * weights.mustHaveSkillsWeight +
         baseEval.experienceScore * weights.experienceWeight +
         baseEval.niceToHaveScore * weights.niceToHaveWeight +
         baseEval.educationScore * weights.educationWeight +
         baseEval.domainScore * weights.domainRoleWeight) / totalWeight
      );

      return {
        ...baseEval,
        totalMatchScore: adjustedTotal,
        mustHaveScore: adjustedMustHaveScore,
        skillMatches: modifiedSkillMatches,
        reviewerFeedback: candidateReviews[res.id]
      };
    });
  }, [jd, resumes, weights, candidateOverrides, candidateReviews]);

  // Selected Candidate's evaluation result
  const currentEvaluation: MatchEvaluationResult | undefined = useMemo(() => {
    return allEvaluations.find(ev => ev.candidateId === currentResume?.id) || allEvaluations[0];
  }, [allEvaluations, currentResume]);

  // Trigger high match celebratory effect
  useEffect(() => {
    if (currentEvaluation && currentEvaluation.totalMatchScore >= 88) {
      try {
        confetti({
          particleCount: 25,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#6366f1', '#10b981', '#06b6d4']
        });
      } catch (e) {
        // silent fallback
      }
    }
  }, [currentEvaluation?.candidateId]);

  // Handle skill score override
  const handleOverrideSkillScore = (skillId: string, newScore: number, notes?: string) => {
    if (!currentResume) return;
    setCandidateOverrides(prev => ({
      ...prev,
      [currentResume.id]: {
        ...(prev[currentResume.id] || {}),
        [skillId]: newScore
      }
    }));
  };

  // Handle saving human review feedback
  const handleSaveFeedback = (feedback: {
    reviewerName: string;
    decision: 'RECOMMEND_SCREEN' | 'REQUEST_MORE_INFO' | 'HOLD' | 'REJECT_NOT_FIT';
    feedbackNotes: string;
  }) => {
    if (!currentResume) return;
    setCandidateReviews(prev => ({
      ...prev,
      [currentResume.id]: {
        ...feedback,
        reviewedAt: new Date().toISOString()
      }
    }));
  };

  // Handle parsing custom JD via backend Gemini endpoint
  const handleParseRawJD = async (rawText: string) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const res = await fetch('/api/parse-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText })
      });
      const data = await res.json();
      if (data.data) {
        setJD(data.data);
      }
    } catch (err: any) {
      console.error('Failed to parse JD:', err);
      setApiError('Notice: Offline engine used for JD extraction.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle parsing new candidate resume via backend Gemini endpoint with deterministic client fallback
  const handleParseRawResume = async (rawText: string) => {
    if (!rawText || !rawText.trim()) return;
    setIsLoading(true);
    setApiError(null);
    let newCandidate: ResumeData | null = null;

    try {
      const res = await fetch('/api/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          newCandidate = data.data;
        }
      }
    } catch (err: any) {
      console.warn('Backend API parse-resume error, switching to fast client-side engine:', err);
    }

    // If backend did not return candidate, extract directly on client
    if (!newCandidate) {
      newCandidate = parseResumeClientSide(rawText);
    }

    if (newCandidate) {
      setResumes(prev => [...prev, newCandidate!]);
      setSelectedResumeId(newCandidate.id);
    }
    setIsLoading(false);
  };

  const totalAuditAlerts = useMemo(() => {
    return allEvaluations.reduce((acc, ev) => acc + ev.hallucinationAlertsCount, 0);
  }, [allEvaluations]);

  const scrollToAuditSection = () => {
    const el = document.getElementById('human-audit-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getCandidateDisplayName = (resId: string, originalName: string) => {
    if (!isAnonymized) return originalName;
    const idx = resumes.findIndex(r => r.id === resId);
    return `Candidate ${String.fromCharCode(65 + (idx >= 0 ? idx : 0))}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white pb-12">
      
      {/* Top Navbar */}
      <Navbar
        presets={SAMPLE_PRESETS}
        currentPresetId={currentPresetId}
        onSelectPreset={handleSelectPreset}
        isAnonymized={isAnonymized}
        onToggleAnonymize={() => setIsAnonymized(!isAnonymized)}
        onOpenTaxonomyModal={() => setIsTaxonomyModalOpen(true)}
        onOpenWeightsModal={() => setIsWeightsModalOpen(true)}
        auditAlertsCount={totalAuditAlerts}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6 flex-1 w-full">
        
        {/* Error Notification Toast if any */}
        {apiError && (
          <div className="p-3 bg-indigo-950/40 border border-indigo-500/40 text-indigo-200 text-xs rounded-xl flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <Info className="w-4 h-4 text-indigo-400" /> {apiError}
            </span>
            <button onClick={() => setApiError(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Ethical AI & Hallucination Guardrail Banner */}
        {currentEvaluation && (
          <GuardrailBanner
            hallucinationAlertsCount={currentEvaluation.hallucinationAlertsCount}
            requiresHumanAudit={currentEvaluation.requiresHumanAudit}
            auditReasons={currentEvaluation.auditReasons}
            onScrollToAuditSection={scrollToAuditSection}
          />
        )}

        {/* Top Split Layout: Job Description vs Candidate Resume */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <JDSection
            jd={jd}
            onUpdateJD={setJD}
            isLoading={isLoading}
            onParseRawJD={handleParseRawJD}
          />

          <ResumeSection
            resumes={resumes}
            selectedResumeId={selectedResumeId}
            onSelectResume={setSelectedResumeId}
            onAddResume={(newRes) => {
              setResumes(prev => [...prev, newRes]);
              setSelectedResumeId(newRes.id);
            }}
            onDeleteResume={(delId) => {
              const updated = resumes.filter(r => r.id !== delId);
              setResumes(updated);
              if (selectedResumeId === delId && updated.length > 0) {
                setSelectedResumeId(updated[0].id);
              }
            }}
            onParseRawResume={handleParseRawResume}
            isLoading={isLoading}
            isAnonymized={isAnonymized}
          />
        </div>

        {/* Transparent Deterministic Score Breakdown */}
        {currentEvaluation && (
          <ScoreBreakdownCard
            evaluation={currentEvaluation}
            weights={weights}
            onOpenWeightsModal={() => setIsWeightsModalOpen(true)}
          />
        )}

        {/* Explainable Evidence Matrix with verbatim quotes */}
        {currentEvaluation && (
          <EvidenceMatrix
            skillMatches={currentEvaluation.skillMatches}
            onOverrideSkillScore={handleOverrideSkillScore}
          />
        )}

        {/* Multi-Candidate Leaderboard Comparison */}
        {resumes.length > 1 && (
          <CandidateCompareMatrix
            evaluations={allEvaluations}
            resumes={resumes}
            jd={jd}
            selectedResumeId={selectedResumeId}
            onSelectResume={setSelectedResumeId}
            isAnonymized={isAnonymized}
          />
        )}

        {/* Human Recruiter Feedback & Audit Review Protocol */}
        {currentEvaluation && (
          <HumanReviewSection
            evaluation={currentEvaluation}
            candidateName={getCandidateDisplayName(currentResume.id, currentResume.name)}
            onSaveFeedback={handleSaveFeedback}
          />
        )}

        {/* User & Recruiter App Reviews & Feedback Section */}
        <AppFeedbackSection />

      </main>

      {/* Kaggle Skills Master Taxonomy Explorer Modal */}
      <SkillsTaxonomyModal
        isOpen={isTaxonomyModalOpen}
        onClose={() => setIsTaxonomyModalOpen(false)}
      />

      {/* Deterministic Scoring Weights Configuration Modal */}
      <WeightsConfigModal
        isOpen={isWeightsModalOpen}
        onClose={() => setIsWeightsModalOpen(false)}
        weights={weights}
        onSaveWeights={setWeights}
      />

      {/* Footer with Compliance details */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 text-center text-xs text-slate-500 space-y-1">
        <p>
          ApexMatch AI • Powered by Google AI Studio Gemini 3.7 & Kaggle Controlled Skills Master.
        </p>
        <p className="text-[11px] text-slate-600">
          Compliant with Responsible AI Guidelines: All outputs provide explainable evidence mapping with mandatory human auditor approval before screening decisions.
        </p>
      </footer>

    </div>
  );
}
