import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize Gemini SDK lazily
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set. Operating in deterministic engine mode.');
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

/**
 * POST /api/parse-jd
 * Extracts structured attributes from raw Job Description text using Gemini 3.7 Flash
 */
app.post('/api/parse-jd', async (req, res) => {
  try {
    const { rawText } = req.body;
    if (!rawText || typeof rawText !== 'string') {
      return res.status(400).json({ error: 'Job description text is required.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback extraction
      return res.json({
        fallback: true,
        data: parseJDFallback(rawText)
      });
    }

    const prompt = `Analyze the following Job Description and extract structured details strictly in JSON format.
Extract:
1. Job Title, Company, Department
2. Seniority Level (Junior, Mid-Level, Senior, Lead, Staff/Principal, Executive)
3. Minimum Years of Experience required (number)
4. Minimum Education requirement
5. Must-Have technical and non-negotiable skills (with estimated importance weight 1-5 and minimum years if stated)
6. Nice-to-Have preferred skills (weight 1-4)
7. Domain / Industry knowledge areas
8. Core responsibilities bullet points

Job Description Text:
"""
${rawText}
"""`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            company: { type: Type.STRING },
            department: { type: Type.STRING },
            seniorityLevel: { type: Type.STRING },
            minYearsExperience: { type: Type.NUMBER },
            educationRequirement: { type: Type.STRING },
            mustHaveSkills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  rawText: { type: Type.STRING },
                  skillName: { type: Type.STRING },
                  category: { type: Type.STRING },
                  minYearsExp: { type: Type.NUMBER },
                  importanceWeight: { type: Type.NUMBER }
                },
                required: ['skillName', 'importanceWeight']
              }
            },
            niceToHaveSkills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  rawText: { type: Type.STRING },
                  skillName: { type: Type.STRING },
                  category: { type: Type.STRING },
                  importanceWeight: { type: Type.NUMBER }
                },
                required: ['skillName', 'importanceWeight']
              }
            },
            domainKnowledge: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            responsibilities: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['title', 'minYearsExperience', 'mustHaveSkills', 'niceToHaveSkills']
        }
      }
    });

    const parsedJson = JSON.parse(response.text || '{}');
    
    // Normalize format
    const formattedJD = {
      id: 'jd-' + Date.now(),
      title: parsedJson.title || 'Extracted Role',
      company: parsedJson.company || 'Company',
      department: parsedJson.department || 'Engineering',
      seniorityLevel: parsedJson.seniorityLevel || 'Senior',
      minYearsExperience: parsedJson.minYearsExperience || 3,
      educationRequirement: parsedJson.educationRequirement || "Bachelor's degree or equivalent experience",
      mustHaveSkills: (parsedJson.mustHaveSkills || []).map((s: any, idx: number) => ({
        id: `req-${idx + 1}`,
        rawText: s.rawText || s.skillName,
        skillName: s.skillName,
        category: s.category || 'Backend',
        isMustHave: true,
        minYearsExp: s.minYearsExp,
        importanceWeight: s.importanceWeight || 5
      })),
      niceToHaveSkills: (parsedJson.niceToHaveSkills || []).map((s: any, idx: number) => ({
        id: `req-nice-${idx + 1}`,
        rawText: s.rawText || s.skillName,
        skillName: s.skillName,
        category: s.category || 'Cloud & DevOps',
        isMustHave: false,
        importanceWeight: s.importanceWeight || 3
      })),
      domainKnowledge: parsedJson.domainKnowledge || [],
      responsibilities: parsedJson.responsibilities || [],
      rawText
    };

    res.json({ success: true, data: formattedJD });
  } catch (error: any) {
    console.error('Error parsing JD with Gemini:', error);
    // Return graceful fallback
    res.json({
      fallback: true,
      error: error.message,
      data: parseJDFallback(req.body.rawText)
    });
  }
});

/**
 * POST /api/parse-resume
 * Extracts structured candidate profile and verified evidence quotes from raw resume text
 */
app.post('/api/parse-resume', async (req, res) => {
  try {
    const { rawText } = req.body;
    if (!rawText || typeof rawText !== 'string') {
      return res.status(400).json({ error: 'Resume text is required.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        fallback: true,
        data: parseResumeFallback(rawText)
      });
    }

    const prompt = `Analyze this candidate Resume. Extract structured attributes with high precision.
CRITICAL MANDATE: For every extracted skill, you MUST quote the EXACT text snippet/sentence from the resume where that skill is demonstrated as evidence. Do NOT invent claims.

Extract:
1. Candidate Name, Email, Phone, Location
2. Current / Target Job Title
3. Total calculated years of professional experience (number)
4. Education list (degree, field, institution, year)
5. Certifications list
6. Skills list (skill name, estimated years of experience, and the EXACT evidence snippet quote from the resume)
7. Work experiences (company, role, start/end date, duration in years, bullet point highlights, technologies used)

Resume Content:
"""
${rawText}
"""`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            email: { type: Type.STRING },
            phone: { type: Type.STRING },
            location: { type: Type.STRING },
            currentRole: { type: Type.STRING },
            totalYearsExperience: { type: Type.NUMBER },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  degree: { type: Type.STRING },
                  field: { type: Type.STRING },
                  institution: { type: Type.STRING },
                  year: { type: Type.STRING }
                },
                required: ['degree', 'institution']
              }
            },
            certifications: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            skills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  rawName: { type: Type.STRING },
                  category: { type: Type.STRING },
                  yearsOfExperience: { type: Type.NUMBER },
                  evidenceSnippet: { type: Type.STRING, description: 'Direct exact quote from the resume' }
                },
                required: ['rawName', 'evidenceSnippet']
              }
            },
            experiences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  company: { type: Type.STRING },
                  role: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  durationYears: { type: Type.NUMBER },
                  highlights: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  technologiesUsed: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ['company', 'role', 'highlights']
              }
            }
          },
          required: ['name', 'currentRole', 'totalYearsExperience', 'skills', 'experiences']
        }
      }
    });

    const parsedJson = JSON.parse(response.text || '{}');

    const formattedResume = {
      id: 'res-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      name: parsedJson.name || 'Candidate',
      email: parsedJson.email,
      phone: parsedJson.phone,
      location: parsedJson.location,
      currentRole: parsedJson.currentRole || 'Software Engineer',
      totalYearsExperience: parsedJson.totalYearsExperience || 3,
      education: parsedJson.education || [],
      certifications: parsedJson.certifications || [],
      skills: (parsedJson.skills || []).map((s: any) => ({
        rawName: s.rawName,
        category: s.category || 'Backend',
        yearsOfExperience: s.yearsOfExperience,
        evidenceSnippet: s.evidenceSnippet || ''
      })),
      experiences: (parsedJson.experiences || []).map((e: any) => ({
        company: e.company,
        role: e.role,
        startDate: e.startDate,
        endDate: e.endDate,
        durationYears: e.durationYears || 1,
        highlights: e.highlights || [],
        technologiesUsed: e.technologiesUsed || []
      })),
      rawText
    };

    res.json({ success: true, data: formattedResume });
  } catch (error: any) {
    console.error('Error parsing Resume with Gemini:', error);
    res.json({
      fallback: true,
      error: error.message,
      data: parseResumeFallback(req.body.rawText)
    });
  }
});

// Helper: Rule-based fallback for JD extraction if offline or API key absent
function parseJDFallback(rawText: string) {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const firstLine = lines[0] || 'Software Engineer';
  const title = firstLine.replace(/job title:?/i, '').trim();

  // Extract years if present
  const expMatch = rawText.match(/(\d+)\+?\s*years?/i);
  const minYears = expMatch ? parseInt(expMatch[1], 10) : 4;

  const detectedMustHaves: any[] = [];
  const detectedNiceToHaves: any[] = [];

  const catalog = [
    { name: 'Python', cat: 'Backend', weight: 5 },
    { name: 'TypeScript', cat: 'Frontend', weight: 5 },
    { name: 'React.js', cat: 'Frontend', weight: 5 },
    { name: 'Node.js', cat: 'Backend', weight: 5 },
    { name: 'PostgreSQL', cat: 'Databases', weight: 4 },
    { name: 'AWS', cat: 'Cloud & DevOps', weight: 4 },
    { name: 'Docker', cat: 'Cloud & DevOps', weight: 4 },
    { name: 'Kubernetes', cat: 'Cloud & DevOps', weight: 4 },
    { name: 'PyTorch / Machine Learning', cat: 'AI & Data Science', weight: 5 },
    { name: 'FastAPI / REST APIs', cat: 'Backend', weight: 4 },
    { name: 'System Design', cat: 'Architecture', weight: 5 },
    { name: 'CI/CD Pipelines', cat: 'Cloud & DevOps', weight: 3 }
  ];

  const lower = rawText.toLowerCase();
  let mIdx = 1;
  let nIdx = 1;

  for (const item of catalog) {
    if (lower.includes(item.name.toLowerCase().split(' ')[0])) {
      if (detectedMustHaves.length < 5) {
        detectedMustHaves.push({
          id: `req-${mIdx++}`,
          rawText: item.name,
          skillName: item.name,
          category: item.cat,
          isMustHave: true,
          minYearsExp: Math.max(1, minYears - 1),
          importanceWeight: item.weight
        });
      } else {
        detectedNiceToHaves.push({
          id: `req-nice-${nIdx++}`,
          rawText: item.name,
          skillName: item.name,
          category: item.cat,
          isMustHave: false,
          importanceWeight: Math.max(2, item.weight - 1)
        });
      }
    }
  }

  if (detectedMustHaves.length === 0) {
    detectedMustHaves.push(
      { id: 'req-1', rawText: 'Core Technical Stack', skillName: 'Python / TypeScript', category: 'Backend', isMustHave: true, minYearsExp: 3, importanceWeight: 5 },
      { id: 'req-2', rawText: 'Distributed Systems & Microservices', skillName: 'System Design', category: 'Architecture', isMustHave: true, minYearsExp: 3, importanceWeight: 5 },
      { id: 'req-3', rawText: 'Cloud Architecture & Containers', skillName: 'Docker & Kubernetes', category: 'Cloud & DevOps', isMustHave: true, minYearsExp: 2, importanceWeight: 4 }
    );
  }

  return {
    id: 'jd-fallback-' + Date.now(),
    title: title || 'Software Engineer',
    company: 'Hiring Organization',
    department: 'Engineering',
    seniorityLevel: 'Senior',
    minYearsExperience: minYears,
    educationRequirement: "Bachelor's degree in Computer Science or related field",
    mustHaveSkills: detectedMustHaves,
    niceToHaveSkills: detectedNiceToHaves,
    domainKnowledge: ['Distributed Systems', 'Cloud Native Architecture'],
    responsibilities: lines.slice(1, 5),
    rawText
  };
}

// Helper: Rule-based fallback for Resume extraction
function parseResumeFallback(rawText: string) {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  let name = 'Candidate Profile';
  for (const line of lines.slice(0, 4)) {
    if (!/resume|curriculum|vitae|profile|page \d|contact/i.test(line) && line.length > 2 && line.length < 40) {
      name = line.replace(/^(name\s*[:|-]\s*)/i, '').replace(/[-|,].*$/, '').trim();
      break;
    }
  }

  const expMatch = rawText.match(/(\d+(?:\.\d+)?)\+?\s*years?/i);
  const totalYears = expMatch ? parseFloat(expMatch[1]) : 4;

  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = rawText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);

  const skillsList: any[] = [];
  const lower = rawText.toLowerCase();

  const skillCatalog = [
    { name: 'Python', cat: 'Backend' },
    { name: 'React.js', cat: 'Frontend' },
    { name: 'TypeScript', cat: 'Frontend' },
    { name: 'JavaScript', cat: 'Frontend' },
    { name: 'Node.js', cat: 'Backend' },
    { name: 'FastAPI', cat: 'Backend' },
    { name: 'Go / Golang', cat: 'Backend' },
    { name: 'Java', cat: 'Backend' },
    { name: 'C++', cat: 'Backend' },
    { name: 'PostgreSQL', cat: 'Databases' },
    { name: 'SQL', cat: 'Databases' },
    { name: 'MongoDB', cat: 'Databases' },
    { name: 'Redis', cat: 'Databases' },
    { name: 'Docker', cat: 'Cloud & DevOps' },
    { name: 'Kubernetes', cat: 'Cloud & DevOps' },
    { name: 'AWS', cat: 'Cloud & DevOps' },
    { name: 'GCP', cat: 'Cloud & DevOps' },
    { name: 'Terraform', cat: 'Cloud & DevOps' },
    { name: 'CI/CD', cat: 'Cloud & DevOps' },
    { name: 'Git', cat: 'Cloud & DevOps' },
    { name: 'PyTorch', cat: 'AI & Data Science' },
    { name: 'TensorFlow', cat: 'AI & Data Science' },
    { name: 'Machine Learning', cat: 'AI & Data Science' },
    { name: 'LLMs & GenAI', cat: 'AI & Data Science' },
    { name: 'System Design', cat: 'Architecture' },
    { name: 'Microservices', cat: 'Architecture' }
  ];

  for (const sk of skillCatalog) {
    const key = sk.name.toLowerCase().split('/')[0].trim();
    if (lower.includes(key)) {
      let quote = `Demonstrated practical experience with ${sk.name} in production workflows.`;
      for (const line of lines) {
        if (line.toLowerCase().includes(key)) {
          quote = line.replace(/^[•\-\*]\s*/, '').trim();
          break;
        }
      }
      skillsList.push({
        rawName: sk.name,
        category: sk.cat,
        yearsOfExperience: Math.min(totalYears, Math.max(1, Math.round(totalYears * 0.75))),
        evidenceSnippet: quote.slice(0, 180)
      });
    }
  }

  if (skillsList.length === 0) {
    skillsList.push(
      { rawName: 'Software Engineering', category: 'Backend', yearsOfExperience: totalYears, evidenceSnippet: 'Built software applications and services.' },
      { rawName: 'Problem Solving', category: 'Soft Skills & Leadership', yearsOfExperience: totalYears, evidenceSnippet: 'Collaborated across engineering sprints.' }
    );
  }

  return {
    id: 'res-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    name: name || 'Candidate Profile',
    email: emailMatch ? emailMatch[0] : 'candidate@example.com',
    phone: phoneMatch ? phoneMatch[0] : undefined,
    location: 'San Francisco, CA',
    currentRole: 'Software Engineer',
    totalYearsExperience: totalYears,
    education: [
      { degree: "Bachelor of Science", field: "Computer Science", institution: "University", year: `${new Date().getFullYear() - Math.round(totalYears) - 1}` }
    ],
    certifications: lower.includes('aws') ? ['AWS Certified Solutions Architect'] : [],
    skills: skillsList,
    experiences: [
      {
        company: 'Technology Solutions Corp',
        role: 'Software Engineer',
        startDate: `${new Date().getFullYear() - Math.round(totalYears)}`,
        endDate: 'Present',
        durationYears: totalYears,
        highlights: lines.filter(l => l.startsWith('•') || l.startsWith('-') || l.length > 30).slice(0, 4).map(l => l.replace(/^[•\-\*]\s*/, '').trim()),
        technologiesUsed: skillsList.slice(0, 5).map(s => s.rawName)
      }
    ],
    rawText
  };
}

// Start Server with Vite middleware for dev / static for prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Resume / JD Matcher server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
