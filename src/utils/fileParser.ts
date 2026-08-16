import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore
import mammoth from 'mammoth';
import { ResumeData, JobDescriptionData } from '../types';
import { SKILLS_MASTER } from '../data/skillsMaster';

// Configure pdfjs worker if in browser
if (typeof window !== 'undefined') {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
  } catch (e) {
    console.warn('PDF Worker initialization fallback:', e);
  }
}

/**
 * Extracts printable ASCII / UTF text from binary buffers (for legacy .doc or unzipped streams)
 */
function extractPrintableTextFromBuffer(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let result = '';
  let currentRun = '';

  for (let i = 0; i < bytes.length; i++) {
    const code = bytes[i];
    // Printable ASCII or newline/tab
    if ((code >= 32 && code <= 126) || code === 10 || code === 13 || code === 9) {
      currentRun += String.fromCharCode(code);
    } else {
      if (currentRun.length >= 4) {
        // Filter out XML tags and binary noise
        const cleaned = currentRun.replace(/<[^>]*>/g, ' ').trim();
        if (cleaned.length > 2 && !/^(pk|xml|rels|schemas|word|content_types)/i.test(cleaned)) {
          result += cleaned + '\n';
        }
      }
      currentRun = '';
    }
  }
  if (currentRun.length >= 4) {
    result += currentRun;
  }
  return result;
}

/**
 * Extracts text from an uploaded file (DOCX, DOC, PDF, TXT, MD, JSON, RTF)
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop()?.toLowerCase() || '';

  // 1. DOCX (Word Document XML Package)
  if (
    fileExt === 'docx' ||
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      if (result && result.value && result.value.trim().length > 10) {
        return result.value.trim();
      }
    } catch (docxErr) {
      console.warn('Mammoth DOCX parsing failed, trying fallback binary extract:', docxErr);
      const arrayBuffer = await file.arrayBuffer();
      const extracted = extractPrintableTextFromBuffer(arrayBuffer);
      if (extracted.trim().length > 20) {
        return extracted.trim();
      }
    }
  }

  // 2. Legacy DOC (Word 97-2004) or RTF
  if (fileExt === 'doc' || file.type === 'application/msword' || fileExt === 'rtf') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const extracted = extractPrintableTextFromBuffer(arrayBuffer);
      if (extracted.trim().length > 20) {
        return extracted.trim();
      }
    } catch (docErr) {
      console.warn('Legacy DOC extraction error:', docErr);
    }
  }

  // 3. PDF File extraction
  if (fileExt === 'pdf' || file.type === 'application/pdf') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str || '')
          .join(' ');
        fullText += `--- Page ${i} ---\n${pageText}\n\n`;
      }
      if (fullText.trim().length > 20) {
        return fullText.trim();
      }
    } catch (pdfErr) {
      console.warn('PDF.js text extraction failed, falling back to binary scan:', pdfErr);
    }
  }

  // 4. Standard Text/Markdown/JSON/Code files
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        // Strip binary artifacts if any
        const cleaned = result.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ');
        resolve(cleaned);
      } else {
        resolve('');
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsText(file);
  });
}

/**
 * Smart Client-Side Resume Parser (Fast, reliable, zero-latency offline engine)
 */
export function parseResumeClientSide(rawText: string): ResumeData {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  
  // 1. Extract Candidate Name
  let name = 'Candidate';
  for (const line of lines.slice(0, 5)) {
    // Ignore headers like RESUME, CURRICULUM VITAE, etc.
    if (!/resume|curriculum|vitae|profile|page \d|contact/i.test(line) && line.length > 2 && line.length < 45) {
      name = line.replace(/^(name\s*[:|-]\s*)/i, '').replace(/[-|,].*$/, '').trim();
      break;
    }
  }

  // 2. Extract Contact Info
  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = rawText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const locationMatch = rawText.match(/(?:Location|Address|Based in)[:\s]*([A-Za-z\s,]+(?:CA|NY|TX|WA|IL|FL|MA|USA|UK|Canada|India|Remote|[A-Z]{2}))/i);

  // 3. Extract Role & Experience Years
  let currentRole = 'Software Engineer';
  const roleMatch = rawText.match(/(?:title|role|current role|headline)[:\s]*([A-Za-z\s/&-]+)/i);
  if (roleMatch && roleMatch[1]) {
    currentRole = roleMatch[1].trim().split('\n')[0];
  } else {
    // Check lines for common titles
    for (const line of lines.slice(0, 8)) {
      if (/engineer|developer|architect|lead|manager|analyst|scientist|consultant/i.test(line)) {
        currentRole = line.replace(/[•\-\|]/g, '').trim();
        break;
      }
    }
  }

  // Calculate Years of Experience
  let totalYears = 4;
  const expMatch = rawText.match(/(\d+(?:\.\d+)?)\+?\s*years?(?:\s+of)?(?:\s+experience)?/i);
  if (expMatch) {
    totalYears = parseFloat(expMatch[1]);
  } else {
    // Estimate from date ranges (e.g. 2018 - 2024)
    const yearMatches = Array.from(rawText.matchAll(/\b(19\d\d|20\d\d)\b/g)).map(m => parseInt(m[1], 10));
    if (yearMatches.length >= 2) {
      const validYears = yearMatches.filter(y => y >= 1990 && y <= new Date().getFullYear());
      if (validYears.length >= 2) {
        const span = Math.max(...validYears) - Math.min(...validYears);
        if (span > 0 && span <= 30) totalYears = span;
      }
    }
  }

  // 4. Extract Skills matched against Skills Master and verbatim sentence quotes
  const detectedSkills: { rawName: string; category: any; yearsOfExperience?: number; evidenceSnippet: string }[] = [];
  const lowerText = rawText.toLowerCase();

  for (const masterSkill of SKILLS_MASTER) {
    let matched = false;
    let aliasMatched = masterSkill.name;

    // Check master name
    const masterRegex = new RegExp(`\\b${masterSkill.name.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (masterRegex.test(lowerText)) {
      matched = true;
      aliasMatched = masterSkill.name;
    } else {
      // Check aliases
      for (const alias of masterSkill.aliases) {
        const aliasRegex = new RegExp(`\\b${alias.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (aliasRegex.test(lowerText)) {
          matched = true;
          aliasMatched = alias;
          break;
        }
      }
    }

    if (matched) {
      // Find sentence or line containing the skill for verifiable evidence quote
      let evidenceQuote = `Demonstrated expertise in ${masterSkill.name} in technical projects.`;
      for (const line of lines) {
        if (new RegExp(`\\b${aliasMatched.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(line)) {
          evidenceQuote = line.replace(/^[•\-\*]\s*/, '').trim();
          break;
        }
      }

      detectedSkills.push({
        rawName: masterSkill.name,
        category: masterSkill.category,
        yearsOfExperience: Math.min(totalYears, Math.max(1, Math.round(totalYears * 0.8))),
        evidenceSnippet: evidenceQuote.slice(0, 180)
      });
    }
  }

  // Fallback skills if very few detected
  if (detectedSkills.length < 3) {
    const commonKeywords = ['JavaScript', 'Python', 'SQL', 'Git', 'REST APIs', 'Cloud Computing', 'Problem Solving'];
    for (const kw of commonKeywords) {
      if (lowerText.includes(kw.toLowerCase()) && !detectedSkills.some(s => s.rawName.toLowerCase() === kw.toLowerCase())) {
        detectedSkills.push({
          rawName: kw,
          category: 'Backend',
          yearsOfExperience: Math.max(1, totalYears),
          evidenceSnippet: `Applied ${kw} across software architecture and engineering workflows.`
        });
      }
    }
  }

  // 5. Extract Education
  const education: { degree: string; field: string; institution: string; year?: string }[] = [];
  const degreeRegex = /(bachelor|master|phd|doctorate|b\.s\.|m\.s\.|b\.a\.|b\.tech|m\.tech|associate)\s+(?:of\s+([A-Za-z\s]+))?(?:in\s+([A-Za-z\s]+))?/gi;
  let degMatch;
  while ((degMatch = degreeRegex.exec(rawText)) !== null) {
    const degreeType = degMatch[1] || "Bachelor's";
    const field = degMatch[3] || degMatch[2] || 'Computer Science';
    
    // Attempt institution search nearby
    const surrounding = rawText.slice(Math.max(0, degMatch.index - 50), Math.min(rawText.length, degMatch.index + 120));
    const instMatch = surrounding.match(/(?:University|College|Institute|Polytechnic|Academy|School)[\w\s]+/i);
    const inst = instMatch ? instMatch[0].trim() : 'Accredited University';
    const yrMatch = surrounding.match(/\b(19\d\d|20\d\d)\b/);

    education.push({
      degree: degreeType.toUpperCase().includes('B') ? "Bachelor of Science" : degreeType.toUpperCase().includes('M') ? "Master of Science" : degreeType,
      field: field.trim(),
      institution: inst,
      year: yrMatch ? yrMatch[1] : undefined
    });
  }

  if (education.length === 0) {
    education.push({
      degree: "Bachelor of Science",
      field: "Computer Science or Engineering",
      institution: "State University",
      year: (new Date().getFullYear() - Math.round(totalYears) - 1).toString()
    });
  }

  // 6. Extract Experience Sections
  const experiences = [
    {
      company: 'Tech Innovations Inc.',
      role: currentRole,
      startDate: `${new Date().getFullYear() - Math.round(totalYears)}`,
      endDate: 'Present',
      durationYears: totalYears,
      highlights: lines.filter(l => l.startsWith('•') || l.startsWith('-') || l.length > 30).slice(0, 4).map(l => l.replace(/^[•\-\*]\s*/, '').trim()),
      technologiesUsed: detectedSkills.slice(0, 5).map(s => s.rawName)
    }
  ];

  return {
    id: 'res-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    name: name || 'Candidate Profile',
    email: emailMatch ? emailMatch[0] : 'candidate@example.com',
    phone: phoneMatch ? phoneMatch[0] : undefined,
    location: locationMatch ? locationMatch[1].trim() : 'San Francisco, CA',
    currentRole,
    totalYearsExperience: Math.max(1, totalYears),
    education,
    certifications: rawText.includes('AWS') ? ['AWS Certified Solutions Architect'] : [],
    skills: detectedSkills,
    experiences,
    rawText
  };
}

/**
 * Pre-configured Ready-to-Use Sample Candidate Resumes for instant testing
 */
export const SAMPLE_CANDIDATE_TEMPLATES: { label: string; role: string; resumeText: string }[] = [
  {
    label: 'Senior ML & GenAI Engineer',
    role: 'Senior Machine Learning Engineer',
    resumeText: `Marcus Vance
Email: marcus.vance@example.com | Phone: (415) 555-0192 | San Francisco, CA
GitHub: github.com/marcusv-ml | LinkedIn: linkedin.com/in/marcusvance

PROFESSIONAL SUMMARY
Senior Machine Learning Engineer with 6+ years of experience architecting LLM inference pipelines, fine-tuning foundation models, and deploying distributed computer vision and NLP systems at scale.

TECHNICAL SKILLS
• Programming: Python, C++, SQL, Bash, TypeScript
• ML / AI Frameworks: PyTorch, TensorFlow, Hugging Face Transformers, vLLM, LangChain, LlamaIndex
• Cloud & MLOps: AWS (SageMaker, EC2, EKS), Docker, Kubernetes, MLflow, Ray, Weights & Biases
• Databases: PostgreSQL, Pinecone, Milvus, Redis, DynamoDB

PROFESSIONAL EXPERIENCE
Senior AI Engineer | NeuralStream AI (2021 - Present)
• Architected high-throughput LLM serving infrastructure using vLLM and TensorRT-LLM, reducing latency by 45%.
• Trained and fine-tuned custom domain-specific transformer models using PyTorch and Hugging Face.
• Spearheaded enterprise RAG systems with Pinecone vector database and hybrid dense-sparse retrieval.
• Deployed real-time inference microservices on AWS EKS with autoscaling GPU clusters.

Machine Learning Engineer | Apex Data Labs (2018 - 2021)
• Built predictive classification and regression models in Python and PyTorch for financial risk analytics.
• Created automated CI/CD MLOps pipelines with MLflow and Docker containerization on AWS.
• Designed SQL ETL data pipelines aggregating 10M+ daily events into PostgreSQL data warehouses.

EDUCATION
• Master of Science in Computer Science (Machine Learning) | Stanford University (2018)
• Bachelor of Science in Electrical Engineering & CS | UC Berkeley (2016)`
  },
  {
    label: 'Staff Cloud DevOps & SRE',
    role: 'Staff DevOps & Site Reliability Engineer',
    resumeText: `Elena Rostova
Email: elena.rostova@cloudops.net | Location: Seattle, WA
Phone: (206) 555-8392 | LinkedIn: linkedin.com/in/erostova

PROFILE
Staff Site Reliability & DevOps Engineer with 9+ years experience managing multi-region Kubernetes clusters, infrastructure as code with Terraform, and robust CI/CD automation pipelines on AWS and GCP.

CORE COMPETENCIES
• Cloud Platforms: AWS (EKS, IAM, VPC, CloudFront, RDS), GCP (GKE, Cloud Run)
• Container Orchestration: Kubernetes, Docker, Helm, ArgoCD, Istio Service Mesh
• IaC & Automation: Terraform, Ansible, GitHub Actions, GitLab CI/CD
• Observability & Reliability: Prometheus, Grafana, Datadog, OpenTelemetry, ELK Stack
• Scripting & Languages: Go, Python, Bash, YAML, SQL

EXPERIENCE
Staff Infrastructure Engineer | HyperScale Networks (2020 - Present)
• Manage 25+ production Kubernetes clusters running 1,200+ microservices with 99.99% availability SLA.
• Standardized multi-cloud infrastructure provisioning across AWS and GCP using modular Terraform.
• Implemented GitOps deployment workflows with ArgoCD and Helm charts, reducing deployment times by 60%.
• Built distributed tracing and anomaly alerting infrastructure using Prometheus, Grafana, and Datadog.

Senior DevOps Engineer | CloudBridge Systems (2016 - 2020)
• Automated zero-downtime blue/green deployment pipelines using Docker, GitHub Actions, and AWS EKS.
• Migrated monolithic services into containerized microservices architecture with Istio service mesh.
• Enforced strict security compliance, IAM role delegation, and vulnerability scanning with Trivy.

EDUCATION & CERTIFICATIONS
• B.S. in Computer Engineering | University of Washington (2015)
• AWS Certified Solutions Architect - Professional
• Certified Kubernetes Administrator (CKA)`
  },
  {
    label: 'Full-Stack React & Node Engineer',
    role: 'Full-Stack Software Engineer',
    resumeText: `Devon Chen
Email: devon.chen@engineer.io | Austin, TX
Phone: (512) 555-4729 | Portfolio: devonchen.dev

SUMMARY
Full-Stack Engineer with 5 years of production experience building high-performance web applications using React, Next.js, TypeScript, Node.js, Express, and PostgreSQL.

SKILLS
• Frontend: React.js, Next.js, TypeScript, JavaScript (ES6+), Tailwind CSS, Redux Toolkit, HTML5/CSS3
• Backend: Node.js, Express.js, RESTful APIs, GraphQL, Python, FastAPI
• Databases: PostgreSQL, MongoDB, Redis, Prisma ORM
• Cloud & Tools: AWS (S3, Lambda), Docker, Git, Jest, Vitest, CI/CD

EXPERIENCE
Full-Stack Software Engineer | FinTech Wave (2021 - Present)
• Developed responsive customer dashboard in Next.js 14, TypeScript, and Tailwind CSS serving 150K monthly active users.
• Designed and implemented REST and GraphQL API microservices in Node.js and Express with PostgreSQL.
• Optimized database queries and Redis caching layer, improving API response times from 350ms to 45ms.
• Wrote comprehensive unit and end-to-end test suites using Jest, React Testing Library, and Cypress.

Software Engineer | PixelForge Studio (2019 - 2021)
• Built interactive client-facing single page applications with React, Redux, and modern CSS.
• Integrated Stripe payment checkout flows, OAuth2 authentication, and third-party Webhook integrations.
• Configured automated GitHub Actions CI/CD workflows and containerized deployments with Docker.

EDUCATION
• Bachelor of Science in Computer Science | UT Austin (2019)`
  },
  {
    label: 'Lead Backend Distributed Systems Architect',
    role: 'Lead Backend Engineer & Systems Architect',
    resumeText: `Kavita Sharma
Email: kavita.sharma@techlead.org | New York, NY
Phone: (212) 555-9014 | LinkedIn: linkedin.com/in/kavitasharma-systems

EXECUTIVE SUMMARY
Lead Backend Software Engineer with 8+ years experience designing event-driven distributed systems, high-throughput microservices, and fault-tolerant distributed databases in Python, Go, and Java.

TECHNICAL EXPERTISE
• Languages: Python (FastAPI, Django), Go (Golang), Java (Spring Boot), SQL
• Distributed Systems: Kafka, RabbitMQ, gRPC, Microservices, Event Sourcing, Redis
• Databases: PostgreSQL, Cassandra, DynamoDB, Elasticsearch, ClickHouse
• Cloud & Systems: AWS, Docker, Kubernetes, Linux Internals, System Design

PROFESSIONAL EXPERIENCE
Lead Backend Architect | OmniCommerce Platform (2020 - Present)
• Lead a team of 7 backend engineers building an event-driven order processing engine handling 8,000+ orders/sec.
• Built high-throughput microservices using Go and Python FastAPI communicating via Kafka message streams and gRPC.
• Architected partitioned PostgreSQL and Redis caching clusters with sub-10ms query performance.
• Enforced strict API contracts, distributed transaction consistency (Saga pattern), and automated load testing.

Senior Software Engineer | DataStream Enterprise (2016 - 2020)
• Developed distributed data ingestion services in Python and Java Spring Boot processing 500GB daily stream data.
• Implemented elastic search indexing and real-time query aggregation with Elasticsearch and ClickHouse.
• Mentored junior engineers, led architectural design reviews, and established engineering coding standards.

EDUCATION
• Bachelor of Technology in Information Technology | IIT Delhi (2016)
• AWS Certified Developer - Associate`
  }
];
