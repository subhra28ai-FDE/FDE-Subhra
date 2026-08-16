import React, { useState } from 'react';
import { 
  UserCheck, 
  CheckCircle2, 
  HelpCircle, 
  XCircle, 
  Clock, 
  MessageSquare, 
  Save, 
  ShieldCheck,
  Send,
  AlertCircle
} from 'lucide-react';
import { MatchEvaluationResult } from '../types';

interface HumanReviewSectionProps {
  evaluation: MatchEvaluationResult;
  candidateName: string;
  onSaveFeedback: (feedback: {
    reviewerName: string;
    decision: 'RECOMMEND_SCREEN' | 'REQUEST_MORE_INFO' | 'HOLD' | 'REJECT_NOT_FIT';
    feedbackNotes: string;
  }) => void;
}

export const HumanReviewSection: React.FC<HumanReviewSectionProps> = ({
  evaluation,
  candidateName,
  onSaveFeedback
}) => {
  const [reviewerName, setReviewerName] = useState(evaluation.reviewerFeedback?.reviewerName || '');
  const [decision, setDecision] = useState<'RECOMMEND_SCREEN' | 'REQUEST_MORE_INFO' | 'HOLD' | 'REJECT_NOT_FIT'>(
    evaluation.reviewerFeedback?.decision || 'RECOMMEND_SCREEN'
  );
  const [feedbackNotes, setFeedbackNotes] = useState(evaluation.reviewerFeedback?.feedbackNotes || '');
  const [isSaved, setIsSaved] = useState(!!evaluation.reviewerFeedback);

  const handleSave = () => {
    onSaveFeedback({
      reviewerName: reviewerName.trim() || 'Hiring Manager',
      decision,
      feedbackNotes
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div id="human-audit-section" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Human Recruiter Review & Audit Protocol</h3>
            <p className="text-xs text-slate-400">
              Mandatory human verification and screening decision for <strong className="text-white">{candidateName}</strong>
            </p>
          </div>
        </div>

        {evaluation.reviewerFeedback && (
          <div className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center gap-1.5 self-start sm:self-auto">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Human Review Recorded</span>
          </div>
        )}
      </div>

      {/* Review Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Left 1: Reviewer Info & Decision */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Reviewer / Auditor Name:
            </label>
            <input
              type="text"
              id="reviewer-name-input"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="e.g. Sarah Connor (Tech Recruiter)"
              className="w-full text-xs bg-slate-950 text-slate-200 px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Screening Recommendation:
            </label>
            <select
              id="screening-decision-select"
              value={decision}
              onChange={(e) => setDecision(e.target.value as any)}
              className="w-full text-xs bg-slate-950 text-slate-200 px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="RECOMMEND_SCREEN">✅ Recommend for Technical Screen</option>
              <option value="REQUEST_MORE_INFO">❓ Request Clarification / Portfolio</option>
              <option value="HOLD">⏸️ Hold for Batch Review</option>
              <option value="REJECT_NOT_FIT">❌ Reject — Experience / Core Gap</option>
            </select>
          </div>
        </div>

        {/* Center & Right: Feedback Notes & Suggested Interview Probes */}
        <div className="md:col-span-2 space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between mb-1">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                Audit Notes & Human Interview Probing Areas:
              </span>
              <span className="text-[11px] text-slate-500">Documented in hiring record</span>
            </label>
            <textarea
              id="reviewer-feedback-notes-textarea"
              rows={4}
              value={feedbackNotes}
              onChange={(e) => setFeedbackNotes(e.target.value)}
              placeholder="Add recruiter notes, verification observations, or questions to probe in the technical screening (e.g. verify depth in PyTorch vs TensorFlow equivalence, clarify AWS cluster scale)..."
              className="w-full text-xs bg-slate-950 text-slate-200 p-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Final hiring decisions require human confirmation per EU AI Act & EEOC guidelines.</span>
            </div>

            <button
              id="save-human-review-btn"
              onClick={handleSave}
              className="text-xs px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold flex items-center gap-2 transition-all shadow-md shadow-indigo-500/20"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaved ? 'Saved!' : 'Save Review Decision'}</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
