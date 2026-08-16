import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, ChevronDown, ChevronUp, UserCheck, CheckCircle2 } from 'lucide-react';

interface GuardrailBannerProps {
  hallucinationAlertsCount: number;
  requiresHumanAudit: boolean;
  auditReasons: string[];
  onScrollToAuditSection?: () => void;
}

export const GuardrailBanner: React.FC<GuardrailBannerProps> = ({
  hallucinationAlertsCount,
  requiresHumanAudit,
  auditReasons,
  onScrollToAuditSection
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full">
      {/* Primary Guardrail Card */}
      <div className={`rounded-xl p-4 border transition-all ${
        requiresHumanAudit || hallucinationAlertsCount > 0
          ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
          : 'bg-slate-900/60 border-slate-700/60 text-slate-300'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg mt-0.5 shrink-0 ${
              requiresHumanAudit || hallucinationAlertsCount > 0
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
            }`}>
              {requiresHumanAudit || hallucinationAlertsCount > 0 ? (
                <ShieldAlert className="w-5 h-5" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm text-white">
                  {requiresHumanAudit || hallucinationAlertsCount > 0 
                    ? 'Human-in-the-Loop Audit Protocol Triggered' 
                    : 'Responsible AI & Audit Guardrails Active'}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  requiresHumanAudit || hallucinationAlertsCount > 0
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {requiresHumanAudit || hallucinationAlertsCount > 0 ? 'Action Required' : 'Verified'}
                </span>
              </div>
              
              <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
                <strong className="text-white">Strict Non-Automated Hiring Policy:</strong> This system provides explainable evidence-grounded advisory scoring. AI recommendations must never serve as sole justification for hiring or rejection decisions.
                {hallucinationAlertsCount > 0 && (
                  <span className="text-amber-300 font-semibold block mt-0.5">
                    ⚠️ {hallucinationAlertsCount} skill claim(s) require manual verification against resume text.
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
            {auditReasons.length > 0 && (
              <button
                id="toggle-audit-reasons-btn"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 flex items-center gap-1 font-medium transition-all"
              >
                <span>{isExpanded ? 'Hide Reasons' : `View Flags (${auditReasons.length})`}</span>
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}

            {onScrollToAuditSection && (
              <button
                id="jump-to-audit-btn"
                onClick={onScrollToAuditSection}
                className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Audit & Review</span>
              </button>
            )}
          </div>

        </div>

        {/* Collapsible reasons list */}
        {isExpanded && auditReasons.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-700/60 text-xs">
            <h5 className="font-semibold text-white mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Reasons Triggering Human Audit Protocol:
            </h5>
            <ul className="space-y-1.5 pl-2">
              {auditReasons.map((reason, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-amber-200/90">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
