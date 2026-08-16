export type SkillCategory = 
  | 'Frontend'
  | 'Backend'
  | 'Data & AI'
  | 'Cloud & DevOps'
  | 'Databases'
  | 'Mobile & Systems'
  | 'Testing & QA'
  | 'Architecture'
  | 'Product & Agile'
  | 'Soft Skills & Leadership';

export type MatchStatus = 'EXACT_MATCH' | 'EQUIVALENT_MATCH' | 'PARTIAL_MATCH' | 'MISSING';

export interface MasterSkill {
  id: string;
  name: string;
  category: SkillCategory;
  aliases: string[];
  equivalents: {
    skillId: string;
    similarity: number; // 0.0 - 1.0 (e.g. Next.js to React is 0.95, AWS to GCP is 0.75)
    rationale: string;
  }[];
  description?: string;
  difficultyTier?: 'Foundational' | 'Core' | 'Advanced' | 'Expert';
}

export interface ExtractedRequirement {
  id: string;
  rawText: string;
  normalizedSkillId?: string;
  skillName: string;
  category: SkillCategory;
  isMustHave: boolean; // Must have vs Nice to have
  minYearsExp?: number;
  importanceWeight: number; // 1 to 5
}

export interface JobDescriptionData {
  id: string;
  title: string;
  company?: string;
  department?: string;
  seniorityLevel: 'Junior' | 'Mid-Level' | 'Senior' | 'Lead' | 'Staff/Principal' | 'Executive';
  minYearsExperience: number;
  educationRequirement: string;
  mustHaveSkills: ExtractedRequirement[];
  niceToHaveSkills: ExtractedRequirement[];
  domainKnowledge: string[];
  responsibilities: string[];
  rawText: string;
}

export interface ExtractedExperience {
  company: string;
  role: string;
  startDate?: string;
  endDate?: string;
  durationYears: number;
  highlights: string[];
  technologiesUsed: string[];
}

export interface ExtractedEducation {
  degree: string;
  field: string;
  institution: string;
  year?: string;
}

export interface ResumeData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  currentRole: string;
  totalYearsExperience: number;
  education: ExtractedEducation[];
  certifications: string[];
  skills: {
    rawName: string;
    normalizedSkillId?: string;
    category: SkillCategory;
    yearsOfExperience?: number;
    evidenceSnippet: string; // Exact quote from resume
  }[];
  experiences: ExtractedExperience[];
  rawText: string;
  isAnonymized?: boolean;
}

export interface SkillMatchResult {
  requirement: ExtractedRequirement;
  matchStatus: MatchStatus;
  matchedSkillName?: string;
  score: number; // 0 to 100
  evidenceSnippet?: string; // Exact quote from candidate resume
  evidenceSource?: string; // e.g. "Work Experience at Acme Corp (2022-2024)"
  equivalenceExplanation?: string;
  isHallucinationRisk: boolean; // Flagged if AI claim lacks exact text evidence in resume
  humanAuditStatus?: 'APPROVED' | 'OVERRIDDEN' | 'DISPUTED' | 'UNREVIEWED';
  humanNotes?: string;
  humanOverrideScore?: number;
}

export interface ScoringWeights {
  mustHaveSkillsWeight: number; // e.g. 40%
  experienceWeight: number;     // e.g. 25%
  niceToHaveWeight: number;     // e.g. 15%
  educationWeight: number;      // e.g. 10%
  domainRoleWeight: number;     // e.g. 10%
}

export interface MatchEvaluationResult {
  candidateId: string;
  candidateName: string;
  candidateRole: string;
  totalMatchScore: number; // 0 to 100
  
  // Categorical breakdown
  mustHaveScore: number;
  niceToHaveScore: number;
  experienceScore: number;
  educationScore: number;
  domainScore: number;
  
  // Detailed lists
  skillMatches: SkillMatchResult[];
  
  // Deterministic checks
  experienceCheck: {
    required: number;
    actual: number;
    passed: boolean;
    explanation: string;
  };
  educationCheck: {
    required: string;
    actual: string;
    passed: boolean;
    explanation: string;
  };
  domainAlignment: {
    identifiedDomains: string[];
    alignmentNotes: string;
    score: number;
  };
  
  // Guardrails & Audit
  hallucinationAlertsCount: number;
  requiresHumanAudit: boolean;
  auditReasons: string[];
  summaryRecommendation: string;
  strengths: string[];
  gaps: string[];
  
  // Reviewer audit feedback
  reviewerFeedback?: {
    reviewerName?: string;
    decision: 'RECOMMEND_SCREEN' | 'REQUEST_MORE_INFO' | 'HOLD' | 'REJECT_NOT_FIT';
    feedbackNotes: string;
    skillOverrides: Record<string, number>;
    reviewedAt: string;
  };
}

export interface SamplePreset {
  id: string;
  title: string;
  description: string;
  jd: JobDescriptionData;
  resumes: ResumeData[];
}
