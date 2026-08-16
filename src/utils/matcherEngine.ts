import { 
  JobDescriptionData, 
  ResumeData, 
  MatchEvaluationResult, 
  ScoringWeights, 
  SkillMatchResult, 
  ExtractedRequirement 
} from '../types';
import { normalizeSkill, evaluateSkillEquivalence } from '../data/skillsMaster';

export const DEFAULT_WEIGHTS: ScoringWeights = {
  mustHaveSkillsWeight: 40,
  experienceWeight: 25,
  niceToHaveWeight: 15,
  educationWeight: 10,
  domainRoleWeight: 10
};

/**
 * Deterministic & semantic matching engine.
 * Calculates transparent, explainable scores backed by verified quotes from resume text.
 */
export function evaluateResumeAgainstJD(
  jd: JobDescriptionData,
  resume: ResumeData,
  weights: ScoringWeights = DEFAULT_WEIGHTS
): MatchEvaluationResult {
  const auditReasons: string[] = [];
  let hallucinationAlertsCount = 0;

  // 1. MUST-HAVE SKILLS EVALUATION
  const allRequirements: ExtractedRequirement[] = [
    ...jd.mustHaveSkills,
    ...jd.niceToHaveSkills
  ];

  const skillMatches: SkillMatchResult[] = [];
  let mustHaveEarnedPoints = 0;
  let mustHaveTotalMaxPoints = 0;

  let niceToHaveEarnedPoints = 0;
  let niceToHaveTotalMaxPoints = 0;

  const strengths: string[] = [];
  const gaps: string[] = [];

  allRequirements.forEach(req => {
    const isMustHave = req.isMustHave;
    const reqNormalized = req.normalizedSkillId || normalizeSkill(req.skillName || req.rawText).normalizedSkill?.id;
    const weight = req.importanceWeight || 3;

    if (isMustHave) {
      mustHaveTotalMaxPoints += weight * 100;
    } else {
      niceToHaveTotalMaxPoints += weight * 100;
    }

    // Find best match in resume skills
    let bestScore = 0;
    let bestStatus: 'EXACT_MATCH' | 'EQUIVALENT_MATCH' | 'PARTIAL_MATCH' | 'MISSING' = 'MISSING';
    let matchedSkillName: string | undefined = undefined;
    let evidenceSnippet: string | undefined = undefined;
    let evidenceSource: string | undefined = undefined;
    let equivalenceExplanation: string | undefined = undefined;
    let isHallucinationRisk = false;

    // Search in resume structured skills
    for (const candSkill of resume.skills) {
      const candNormalized = candSkill.normalizedSkillId || normalizeSkill(candSkill.rawName).normalizedSkill?.id;

      // Exact match
      if (reqNormalized && candNormalized && reqNormalized === candNormalized) {
        bestScore = 100;
        bestStatus = 'EXACT_MATCH';
        matchedSkillName = candSkill.rawName;
        evidenceSnippet = candSkill.evidenceSnippet || findSnippetInResumeText(resume.rawText, candSkill.rawName);
        break;
      }

      // Check name string match
      const reqNameClean = req.skillName.toLowerCase();
      const candNameClean = candSkill.rawName.toLowerCase();
      if (reqNameClean === candNameClean || candNameClean.includes(reqNameClean) || reqNameClean.includes(candNameClean)) {
        bestScore = 100;
        bestStatus = 'EXACT_MATCH';
        matchedSkillName = candSkill.rawName;
        evidenceSnippet = candSkill.evidenceSnippet || findSnippetInResumeText(resume.rawText, candSkill.rawName);
        break;
      }

      // Semantic / Equivalence match via Skills Master
      const eqResult = evaluateSkillEquivalence(reqNormalized, candNormalized);
      if (eqResult.isEquivalent && eqResult.similarity > 0.6) {
        const potentialScore = Math.round(eqResult.similarity * 100);
        if (potentialScore > bestScore) {
          bestScore = potentialScore;
          bestStatus = 'EQUIVALENT_MATCH';
          matchedSkillName = candSkill.rawName;
          evidenceSnippet = candSkill.evidenceSnippet || findSnippetInResumeText(resume.rawText, candSkill.rawName);
          equivalenceExplanation = `Equivalent to ${req.skillName} (${Math.round(eqResult.similarity * 100)}% similarity). ${eqResult.rationale || ''}`;
        }
      }
    }

    // If still not matched, search raw text for mentions
    if (bestScore === 0) {
      const directSnippet = findSnippetInResumeText(resume.rawText, req.skillName);
      if (directSnippet) {
        bestScore = 80;
        bestStatus = 'PARTIAL_MATCH';
        matchedSkillName = req.skillName;
        evidenceSnippet = directSnippet;
        equivalenceExplanation = `Mentioned in resume context: "${directSnippet.slice(0, 80)}..."`;
      }
    }

    // Experience year check for this individual skill if specified
    if (bestScore > 0 && req.minYearsExp && req.minYearsExp > 0) {
      // Find candidate's years in this skill if available
      const matchedCandSkill = resume.skills.find(s => s.rawName.toLowerCase() === matchedSkillName?.toLowerCase());
      if (matchedCandSkill?.yearsOfExperience && matchedCandSkill.yearsOfExperience < req.minYearsExp) {
        bestScore = Math.round(bestScore * 0.85); // Minor penalty for fewer years in specific skill
      }
    }

    // Locate source of evidence in experiences if not specified
    if (evidenceSnippet) {
      const matchingExp = resume.experiences.find(exp => 
        exp.highlights.some(h => h.includes(evidenceSnippet!) || (matchedSkillName && h.toLowerCase().includes(matchedSkillName.toLowerCase()))) ||
        exp.technologiesUsed.some(t => matchedSkillName && t.toLowerCase().includes(matchedSkillName.toLowerCase()))
      );
      if (matchingExp) {
        evidenceSource = `${matchingExp.role} at ${matchingExp.company} (${matchingExp.startDate || ''}-${matchingExp.endDate || ''})`;
      }
    }

    // GUARDRAIL CHECK: Hallucination / Evidence verification
    // If score > 0, verify that the evidence actually exists in the resume raw text
    if (bestScore > 0) {
      if (!evidenceSnippet || !isSnippetGroundedInResume(resume.rawText, evidenceSnippet, matchedSkillName)) {
        isHallucinationRisk = true;
        hallucinationAlertsCount++;
        auditReasons.push(`Unverified Evidence: Claim for "${req.skillName}" cannot be directly verified in resume raw text.`);
      }
    }

    if (isMustHave) {
      mustHaveEarnedPoints += (bestScore / 100) * (weight * 100);
      if (bestScore >= 80) {
        strengths.push(`Strong coverage in core requirement: ${req.skillName}`);
      } else if (bestScore === 0) {
        gaps.push(`Missing mandatory requirement: ${req.skillName}`);
      } else {
        gaps.push(`Partial / Equivalent coverage for mandatory requirement: ${req.skillName} (${bestScore}%)`);
      }
    } else {
      niceToHaveEarnedPoints += (bestScore / 100) * (weight * 100);
      if (bestScore >= 80) {
        strengths.push(`Bonus match in preferred skill: ${req.skillName}`);
      }
    }

    skillMatches.push({
      requirement: req,
      matchStatus: bestStatus,
      matchedSkillName,
      score: bestScore,
      evidenceSnippet,
      evidenceSource,
      equivalenceExplanation,
      isHallucinationRisk
    });
  });

  // Calculate percentage subscores (0 - 100)
  const mustHaveScore = mustHaveTotalMaxPoints > 0 
    ? Math.round((mustHaveEarnedPoints / mustHaveTotalMaxPoints) * 100) 
    : 100;

  const niceToHaveScore = niceToHaveTotalMaxPoints > 0 
    ? Math.round((niceToHaveEarnedPoints / niceToHaveTotalMaxPoints) * 100) 
    : 100;

  // 2. DETERMINISTIC EXPERIENCE CHECK
  const reqExp = jd.minYearsExperience || 0;
  const actualExp = resume.totalYearsExperience || 0;
  let experienceScore = 100;
  let expPassed = true;
  let expExplanation = '';

  if (reqExp > 0) {
    if (actualExp >= reqExp) {
      const surplus = actualExp - reqExp;
      experienceScore = Math.min(100, 90 + Math.min(10, Math.round(surplus * 2.5)));
      expPassed = true;
      expExplanation = `Meets experience requirement (${actualExp} years actual vs ${reqExp} years required).`;
    } else {
      const deficit = reqExp - actualExp;
      // Linear penalty based on gap
      const penalty = Math.min(60, Math.round(deficit * 20));
      experienceScore = Math.max(20, 100 - penalty);
      expPassed = actualExp >= reqExp * 0.8;
      expExplanation = `Below required years of experience (${actualExp} years actual vs ${reqExp} years required). Deficit: -${deficit.toFixed(1)} yrs.`;
      gaps.push(`Experience deficit: ${actualExp} yrs vs ${reqExp} yrs required.`);
    }
  } else {
    expExplanation = 'No minimum experience years specified in job description.';
  }

  // 3. EDUCATION CHECK
  let educationScore = 85;
  let eduPassed = true;
  let eduExplanation = '';

  const highestDegree = resume.education && resume.education.length > 0 
    ? `${resume.education[0].degree} in ${resume.education[0].field} from ${resume.education[0].institution}`
    : 'Not explicitly listed';

  if (jd.educationRequirement) {
    const reqEduLower = jd.educationRequirement.toLowerCase();
    const hasMaster = resume.education?.some(e => e.degree.toLowerCase().includes('master') || e.degree.toLowerCase().includes('ms') || e.degree.toLowerCase().includes('phd') || e.degree.toLowerCase().includes('doctor'));
    const hasBachelor = resume.education?.some(e => e.degree.toLowerCase().includes('bachelor') || e.degree.toLowerCase().includes('bs') || e.degree.toLowerCase().includes('b.tech') || e.degree.toLowerCase().includes('b.e.'));

    if (reqEduLower.includes('master') || reqEduLower.includes('phd')) {
      if (hasMaster) {
        educationScore = 100;
        eduPassed = true;
        eduExplanation = `Exceeds/Meets advanced degree requirement with Master's/PhD (${highestDegree}).`;
      } else if (hasBachelor) {
        educationScore = 80;
        eduPassed = true;
        eduExplanation = `Holds Bachelor's degree (${highestDegree}). Meets practical baseline.`;
      } else {
        educationScore = 50;
        eduPassed = false;
        eduExplanation = 'Advanced degree specified; candidate credentials need verification.';
      }
    } else if (reqEduLower.includes('bachelor') || reqEduLower.includes('degree')) {
      if (hasBachelor || hasMaster) {
        educationScore = 100;
        eduPassed = true;
        eduExplanation = `Meets degree requirement (${highestDegree}).`;
      } else {
        educationScore = 65;
        eduPassed = false;
        eduExplanation = 'Bachelor degree required; non-traditional or unlisted credential.';
      }
    } else {
      educationScore = 90;
      eduExplanation = `Relevant education: ${highestDegree}`;
    }
  } else {
    educationScore = 90;
    eduExplanation = `Education verified: ${highestDegree}`;
  }

  // 4. DOMAIN & ROLE ALIGNMENT
  let domainScore = 80;
  const identifiedDomains: string[] = [];
  let alignmentNotes = '';

  if (jd.domainKnowledge && jd.domainKnowledge.length > 0) {
    let matchedDomainsCount = 0;
    jd.domainKnowledge.forEach(domain => {
      const dClean = domain.toLowerCase();
      if (resume.rawText.toLowerCase().includes(dClean) || 
          resume.skills.some(s => s.rawName.toLowerCase().includes(dClean)) ||
          resume.experiences.some(e => e.highlights.some(h => h.toLowerCase().includes(dClean)))) {
        identifiedDomains.push(domain);
        matchedDomainsCount++;
      }
    });

    if (matchedDomainsCount === jd.domainKnowledge.length) {
      domainScore = 100;
      alignmentNotes = `Direct domain overlap identified across all target areas: ${identifiedDomains.join(', ')}.`;
    } else if (matchedDomainsCount > 0) {
      domainScore = 75 + Math.round((matchedDomainsCount / jd.domainKnowledge.length) * 25);
      alignmentNotes = `Partial domain match in: ${identifiedDomains.join(', ')}.`;
    } else {
      domainScore = 60;
      alignmentNotes = 'Generalist profile; no explicit domain terms identified in resume text.';
    }
  } else {
    domainScore = 90;
    alignmentNotes = 'Role titles and technical scope show strong alignment.';
  }

  // 5. CALCULATE TOTAL WEIGHTED SCORE
  const totalWeight = weights.mustHaveSkillsWeight + 
                      weights.experienceWeight + 
                      weights.niceToHaveWeight + 
                      weights.educationWeight + 
                      weights.domainRoleWeight;

  const totalMatchScore = Math.round(
    (mustHaveScore * weights.mustHaveSkillsWeight +
     experienceScore * weights.experienceWeight +
     niceToHaveScore * weights.niceToHaveWeight +
     educationScore * weights.educationWeight +
     domainScore * weights.domainRoleWeight) / totalWeight
  );

  // 6. HUMAN-IN-THE-LOOP AUDIT PROTOCOL EVALUATION
  let requiresHumanAudit = false;
  
  if (hallucinationAlertsCount > 0) {
    requiresHumanAudit = true;
  }
  
  if (mustHaveScore < 60 && totalMatchScore > 70) {
    requiresHumanAudit = true;
    auditReasons.push('Borderline evaluation: Candidate scored high overall but lacks critical mandatory core skills.');
  }

  if (totalMatchScore >= 85 && !expPassed) {
    requiresHumanAudit = true;
    auditReasons.push('Experience threshold waiver required: Strong technical skill score despite experience year gap.');
  }

  // Summary recommendation
  let summaryRecommendation = '';
  if (totalMatchScore >= 82 && mustHaveScore >= 80) {
    summaryRecommendation = 'Strong Match: Candidate demonstrates direct alignment with mandatory technical requirements and domain depth.';
  } else if (totalMatchScore >= 70) {
    summaryRecommendation = 'Promising Match with Equivalencies: Candidate possesses strong transferable skills with minor gaps in specific tooling.';
  } else if (totalMatchScore >= 55) {
    summaryRecommendation = 'Moderate / Partial Match: Candidate meets baseline foundational requirements but lacks significant core components.';
  } else {
    summaryRecommendation = 'Low Match: Key required competencies and experience levels are missing from current profile.';
  }

  return {
    candidateId: resume.id,
    candidateName: resume.name,
    candidateRole: resume.currentRole,
    totalMatchScore,
    mustHaveScore,
    niceToHaveScore,
    experienceScore,
    educationScore,
    domainScore,
    skillMatches,
    experienceCheck: {
      required: reqExp,
      actual: actualExp,
      passed: expPassed,
      explanation: expExplanation
    },
    educationCheck: {
      required: jd.educationRequirement,
      actual: highestDegree,
      passed: eduPassed,
      explanation: eduExplanation
    },
    domainAlignment: {
      identifiedDomains,
      alignmentNotes,
      score: domainScore
    },
    hallucinationAlertsCount,
    requiresHumanAudit,
    auditReasons,
    summaryRecommendation,
    strengths,
    gaps
  };
}

/**
 * Searches raw text for a sentence or bullet containing the skill keyword.
 */
function findSnippetInResumeText(rawText: string, keyword: string): string | undefined {
  if (!rawText || !keyword) return undefined;
  const lines = rawText.split('\n');
  const kwLower = keyword.toLowerCase();

  for (const line of lines) {
    if (line.toLowerCase().includes(kwLower)) {
      const cleanLine = line.replace(/^[-*•\s]+/, '').trim();
      if (cleanLine.length >= 10) {
        return cleanLine;
      }
    }
  }
  return undefined;
}

/**
 * Checks whether an extracted snippet actually appears in the original resume text.
 * Prevents AI hallucinated evidence.
 */
function isSnippetGroundedInResume(rawText: string, snippet: string, skillName?: string): boolean {
  if (!rawText) return false;
  if (!snippet && !skillName) return false;

  const rawLower = rawText.toLowerCase();

  if (snippet) {
    // Check if substantial words of the snippet are in the resume
    const snippetWords = snippet.toLowerCase().split(/\s+/).filter(w => w.length > 4);
    if (snippetWords.length > 0) {
      const matchedWords = snippetWords.filter(w => rawLower.includes(w));
      if (matchedWords.length / snippetWords.length >= 0.6) {
        return true;
      }
    }
  }

  if (skillName && rawLower.includes(skillName.toLowerCase())) {
    return true;
  }

  return false;
}
