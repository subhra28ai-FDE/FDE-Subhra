import { SamplePreset } from '../types';

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'ai-ml-platform-engineer',
    title: 'Senior AI / ML Platform Engineer',
    description: 'Enterprise Generative AI & MLOps Platform Role (PyTorch, RAG, Kubernetes, Python, AWS)',
    jd: {
      id: 'jd-ai-01',
      title: 'Senior AI / ML Platform Engineer',
      company: 'Apex Intelligence Labs',
      department: 'Core Machine Learning Platform',
      seniorityLevel: 'Senior',
      minYearsExperience: 5,
      educationRequirement: "Bachelor's or Master's in Computer Science, Data Science, or related STEM field",
      mustHaveSkills: [
        { id: 'req-1', rawText: 'Python', normalizedSkillId: 'python', skillName: 'Python', category: 'Backend', isMustHave: true, minYearsExp: 4, importanceWeight: 5 },
        { id: 'req-2', rawText: 'PyTorch or TensorFlow', normalizedSkillId: 'pytorch', skillName: 'PyTorch', category: 'Data & AI', isMustHave: true, minYearsExp: 3, importanceWeight: 5 },
        { id: 'req-3', rawText: 'LLM & Generative AI Systems (RAG architectures, fine-tuning)', normalizedSkillId: 'llm_engineering', skillName: 'LLM & Generative AI Engineering', category: 'Data & AI', isMustHave: true, minYearsExp: 2, importanceWeight: 5 },
        { id: 'req-4', rawText: 'Vector Databases (Pinecone, Chroma, pgvector, or Weaviate)', normalizedSkillId: 'vector_databases', skillName: 'Vector Databases', category: 'Data & AI', isMustHave: true, minYearsExp: 1, importanceWeight: 4 },
        { id: 'req-5', rawText: 'Kubernetes & Docker container deployment', normalizedSkillId: 'kubernetes', skillName: 'Kubernetes (K8s)', category: 'Cloud & DevOps', isMustHave: true, minYearsExp: 3, importanceWeight: 4 },
        { id: 'req-6', rawText: 'FastAPI / High-throughput model serving', normalizedSkillId: 'fastapi', skillName: 'FastAPI', category: 'Backend', isMustHave: true, minYearsExp: 2, importanceWeight: 4 }
      ],
      niceToHaveSkills: [
        { id: 'req-7', rawText: 'LangChain or LlamaIndex orchestration', normalizedSkillId: 'langchain', skillName: 'LangChain / LlamaIndex', category: 'Data & AI', isMustHave: false, importanceWeight: 3 },
        { id: 'req-8', rawText: 'AWS infrastructure (EKS, S3, SageMaker, Lambda)', normalizedSkillId: 'aws', skillName: 'AWS (Amazon Web Services)', category: 'Cloud & DevOps', isMustHave: false, importanceWeight: 3 },
        { id: 'req-9', rawText: 'CI/CD pipeline automation', normalizedSkillId: 'cicd', skillName: 'CI/CD Pipelines', category: 'Cloud & DevOps', isMustHave: false, importanceWeight: 2 },
        { id: 'req-10', rawText: 'Technical leadership and code reviews', normalizedSkillId: 'tech_leadership', skillName: 'Technical Leadership & Mentorship', category: 'Soft Skills & Leadership', isMustHave: false, importanceWeight: 3 }
      ],
      domainKnowledge: ['Enterprise Generative AI', 'High-Throughput Model Serving', 'Distributed Systems'],
      responsibilities: [
        'Architect and scale the internal Generative AI inference engine supporting 10M+ daily tokens.',
        'Design hybrid RAG pipelines integrating vector search with structured relational data stores.',
        'Manage GPU cluster scheduling and microservice deployments on Kubernetes.',
        'Collaborate with research scientists to package and deploy PyTorch models via FastAPI.'
      ],
      rawText: `Job Title: Senior AI / ML Platform Engineer
Company: Apex Intelligence Labs
Department: Core Machine Learning Platform
Experience Required: 5+ years of production software engineering experience with at least 3 years in AI/ML infrastructure.
Education: BS/MS in Computer Science, Data Science, or related technical discipline.

Responsibilities:
- Architect and scale internal Generative AI inference engines handling multi-tenant RAG workloads.
- Design real-time model inference pipelines using FastAPI and PyTorch on GPU Kubernetes clusters.
- Integrate high-dimensional vector search solutions (Pinecone/Weaviate/pgvector) for semantic retrieval.
- Build automated CI/CD and deployment pipelines for ML artifacts.

Requirements (Must-Have):
- Strong proficiency in Python (4+ years) and modern asynchronous paradigms.
- Deep expertise in PyTorch or TensorFlow for deep learning inference & optimization.
- Proven track record building LLM & RAG systems in production.
- Experience with Vector Databases (Pinecone, Chroma, Weaviate, or pgvector).
- Hands-on experience with Docker and Kubernetes for containerized microservice orchestration.
- Production experience with FastAPI or similar async Python frameworks.

Nice-to-Have:
- Experience with LangChain, LlamaIndex, or agentic frameworks.
- AWS cloud infrastructure (EKS, S3, SageMaker).
- Mentorship and technical leadership background.`
    },
    resumes: [
      {
        id: 'res-ai-01',
        name: 'Dr. Elena Rostova',
        email: 'elena.rostova.ai@gmail.com',
        phone: '+1 (555) 234-8901',
        location: 'San Francisco, CA',
        currentRole: 'Lead Machine Learning Engineer',
        totalYearsExperience: 6.5,
        education: [
          { degree: "Master of Science", field: "Computer Science (AI Specialization)", institution: "Stanford University", year: "2019" },
          { degree: "Bachelor of Science", field: "Computer Engineering", institution: "UC Berkeley", year: "2017" }
        ],
        certifications: ['AWS Certified Machine Learning - Specialty', 'CKA: Certified Kubernetes Administrator'],
        skills: [
          { rawName: 'Python', normalizedSkillId: 'python', category: 'Backend', yearsOfExperience: 6, evidenceSnippet: 'Architected async Python 3.11 microservices serving 4,000 requests/sec with FastAPI.' },
          { rawName: 'PyTorch', normalizedSkillId: 'pytorch', category: 'Data & AI', yearsOfExperience: 5, evidenceSnippet: 'Fine-tuned open-source LLMs (LLaMA-3, Mistral) using PyTorch, LoRA, and DeepSpeed.' },
          { rawName: 'LLM & RAG Systems', normalizedSkillId: 'llm_engineering', category: 'Data & AI', yearsOfExperience: 3, evidenceSnippet: 'Built enterprise RAG pipeline indexing 5M+ corporate documents with hybrid semantic and keyword retrieval.' },
          { rawName: 'Pinecone / Vector DBs', normalizedSkillId: 'vector_databases', category: 'Data & AI', yearsOfExperience: 2.5, evidenceSnippet: 'Deployed multi-tenant Pinecone vector clusters with dynamic filtering and sub-50ms query latency.' },
          { rawName: 'Kubernetes (K8s)', normalizedSkillId: 'kubernetes', category: 'Cloud & DevOps', yearsOfExperience: 4, evidenceSnippet: 'Configured GPU auto-scaling on AWS EKS (Kubernetes) reducing compute costs by 34%.' },
          { rawName: 'FastAPI', normalizedSkillId: 'fastapi', category: 'Backend', yearsOfExperience: 4, evidenceSnippet: 'Developed production REST APIs with FastAPI, Pydantic, and gRPC endpoints.' },
          { rawName: 'LangChain', normalizedSkillId: 'langchain', category: 'Data & AI', yearsOfExperience: 2, evidenceSnippet: 'Integrated LangChain for multi-step agent tool calling and document chunking.' },
          { rawName: 'AWS', normalizedSkillId: 'aws', category: 'Cloud & DevOps', yearsOfExperience: 5, evidenceSnippet: 'Utilized AWS EKS, S3, CloudWatch, and Lambda for serverless inference orchestration.' },
          { rawName: 'Technical Leadership', normalizedSkillId: 'tech_leadership', category: 'Soft Skills & Leadership', yearsOfExperience: 3, evidenceSnippet: 'Led a team of 6 ML platform engineers, conducted weekly architecture reviews and hiring interviews.' }
        ],
        experiences: [
          {
            company: 'Synthetix AI',
            role: 'Lead ML Platform Engineer',
            startDate: '2022',
            endDate: 'Present',
            durationYears: 3.5,
            highlights: [
              'Architected enterprise RAG platform integrating Pinecone, PyTorch, and FastAPI on AWS EKS.',
              'Spearheaded transition from single-node GPUs to distributed Kubernetes Triton inference servers.',
              'Mentored 5 junior engineers and established engineering standards for model observability.'
            ],
            technologiesUsed: ['Python', 'PyTorch', 'FastAPI', 'Kubernetes', 'Pinecone', 'AWS', 'Docker']
          },
          {
            company: 'DataScale Systems',
            role: 'Senior Software Engineer (ML Infrastructure)',
            startDate: '2019',
            endDate: '2022',
            durationYears: 3.0,
            highlights: [
              'Developed real-time anomaly detection pipelines using Python and Docker.',
              'Implemented automated CI/CD deployment pipelines using GitHub Actions and Helm charts.'
            ],
            technologiesUsed: ['Python', 'Docker', 'Kubernetes', 'CI/CD', 'Linux']
          }
        ],
        rawText: `Dr. Elena Rostova - Lead Machine Learning Engineer
Email: elena.rostova.ai@gmail.com | Location: San Francisco, CA | Experience: 6.5 Years
Education: M.S. Computer Science (Stanford University, 2019), B.S. Computer Engineering (UC Berkeley)
Certifications: AWS Certified Machine Learning Specialty, CKA (Certified Kubernetes Administrator)

SUMMARY:
Senior ML Platform Engineer with 6.5+ years experience building large-scale LLM, RAG, and deep learning infrastructure using PyTorch, Python, FastAPI, and Kubernetes on AWS.

PROFESSIONAL EXPERIENCE:
Synthetix AI (2022 - Present) - Lead ML Platform Engineer
- Architected enterprise RAG pipeline indexing 5M+ corporate documents with hybrid semantic retrieval and Pinecone vector database.
- Built async Python 3.11 microservices serving 4,000 requests/sec with FastAPI and gRPC.
- Fine-tuned open-source foundation models (LLaMA-3, Mistral) using PyTorch, LoRA, and DeepSpeed.
- Configured GPU auto-scaling on AWS EKS (Kubernetes) reducing compute costs by 34%.
- Led a team of 6 ML platform engineers, conducted weekly architecture reviews and code quality gates.

DataScale Systems (2019 - 2022) - Senior Software Engineer (ML Infrastructure)
- Built distributed streaming inference pipelines with Python, Docker, and Kubernetes.
- Set up automated CI/CD release workflows with GitHub Actions and Terraform.`
      },
      {
        id: 'res-ai-02',
        name: 'Marcus Chen',
        email: 'marcus.chen.dev@outlook.com',
        phone: '+1 (555) 345-6789',
        location: 'Seattle, WA',
        currentRole: 'Senior Backend & Cloud Engineer',
        totalYearsExperience: 5.0,
        education: [
          { degree: "Bachelor of Science", field: "Software Engineering", institution: "University of Washington", year: "2019" }
        ],
        certifications: ['Google Cloud Professional Cloud Architect'],
        skills: [
          { rawName: 'Python', normalizedSkillId: 'python', category: 'Backend', yearsOfExperience: 5, evidenceSnippet: '5 years developing backend services and data workflows in Python.' },
          { rawName: 'TensorFlow', normalizedSkillId: 'tensorflow', category: 'Data & AI', yearsOfExperience: 2, evidenceSnippet: 'Trained and deployed convolutional neural networks and NLP classifiers in TensorFlow.' },
          { rawName: 'Docker & Kubernetes', normalizedSkillId: 'kubernetes', category: 'Cloud & DevOps', yearsOfExperience: 3.5, evidenceSnippet: 'Managed production GKE (Google Kubernetes Engine) microservices and Helm deployments.' },
          { rawName: 'GCP (Google Cloud)', normalizedSkillId: 'gcp', category: 'Cloud & DevOps', yearsOfExperience: 4, evidenceSnippet: 'Architected cloud services on GCP (Cloud Run, GKE, BigQuery, Vertex AI).' },
          { rawName: 'FastAPI & Django', normalizedSkillId: 'fastapi', category: 'Backend', yearsOfExperience: 3, evidenceSnippet: 'Engineered RESTful microservices with FastAPI and Django REST Framework.' },
          { rawName: 'PostgreSQL & pgvector', normalizedSkillId: 'postgresql', category: 'Databases', yearsOfExperience: 4, evidenceSnippet: 'Set up pgvector extension in PostgreSQL for document similarity search.' }
        ],
        experiences: [
          {
            company: 'CloudVista Technologies',
            role: 'Senior Backend & Cloud Engineer',
            startDate: '2021',
            endDate: 'Present',
            durationYears: 3.5,
            highlights: [
              'Built scalable microservices in Python (FastAPI) deployed to GKE Kubernetes clusters.',
              'Implemented semantic search using pgvector on Google Cloud Platform.',
              'Collaborated on basic GenAI integration using Vertex AI models.'
            ],
            technologiesUsed: ['Python', 'FastAPI', 'GCP', 'Kubernetes', 'Docker', 'PostgreSQL']
          }
        ],
        rawText: `Marcus Chen - Senior Backend & Cloud Engineer
Email: marcus.chen.dev@outlook.com | Experience: 5.0 Years | Location: Seattle, WA
Education: B.S. Software Engineering, University of Washington (2019)
Certifications: Google Cloud Professional Cloud Architect

EXPERIENCE:
CloudVista Technologies (2021 - Present) - Senior Backend Engineer
- 5 years developing high-throughput backend services in Python and FastAPI.
- Managed containerized workloads on Kubernetes (GKE) and Docker.
- Implemented similarity search using PostgreSQL with pgvector extension.
- Deployed machine learning models using TensorFlow on GCP Vertex AI.
- Note: High cloud experience on GCP (equivalent to AWS requirements).`
      },
      {
        id: 'res-ai-03',
        name: 'Jordan Taylor',
        email: 'jtaylor.code@gmail.com',
        phone: '+1 (555) 789-0123',
        location: 'Austin, TX',
        currentRole: 'Junior Python Developer',
        totalYearsExperience: 1.5,
        education: [
          { degree: "Bachelor of Arts", field: "Economics", institution: "UT Austin", year: "2023" }
        ],
        certifications: [],
        skills: [
          { rawName: 'Python', normalizedSkillId: 'python', category: 'Backend', yearsOfExperience: 1.5, evidenceSnippet: 'Built internal automation scripts and basic web scrapers using Python.' },
          { rawName: 'Flask', normalizedSkillId: 'fastapi', category: 'Backend', yearsOfExperience: 1, evidenceSnippet: 'Created simple REST endpoints using Flask.' },
          { rawName: 'Docker', normalizedSkillId: 'docker', category: 'Cloud & DevOps', yearsOfExperience: 1, evidenceSnippet: 'Built single-container Dockerfiles for local testing.' },
          { rawName: 'SQL', normalizedSkillId: 'sql', category: 'Databases', yearsOfExperience: 1, evidenceSnippet: 'Wrote basic SQL queries for reporting.' }
        ],
        experiences: [
          {
            company: 'NextWave Digital',
            role: 'Junior Software Developer',
            startDate: '2023',
            endDate: 'Present',
            durationYears: 1.5,
            highlights: [
              'Developed internal Python utility scripts.',
              'Assisted senior engineers with bug fixes and test writing.'
            ],
            technologiesUsed: ['Python', 'Flask', 'Docker', 'SQLite']
          }
        ],
        rawText: `Jordan Taylor - Junior Python Developer
Email: jtaylor.code@gmail.com | Experience: 1.5 Years | Location: Austin, TX
Education: B.A. Economics, UT Austin (2023)

EXPERIENCE:
NextWave Digital (2023 - Present) - Junior Developer
- Written Python scripts for data extraction and automated spreadsheet parsing.
- Created small REST APIs in Flask.
- Minimal exposure to cloud and containers (local Docker only).
- Looking to transition into AI/ML engineering.`
      }
    ]
  },
  {
    id: 'fullstack-cloud-architect',
    title: 'Lead Full-Stack TypeScript / Cloud Architect',
    description: 'Modern Web & Distributed Systems Role (React, Next.js, Node.js/TypeScript, AWS/Terraform, System Design)',
    jd: {
      id: 'jd-fs-02',
      title: 'Lead Full-Stack TypeScript / Cloud Architect',
      company: 'PulseScale Enterprise',
      department: 'Digital Platform Architecture',
      seniorityLevel: 'Lead',
      minYearsExperience: 6,
      educationRequirement: "Bachelor's degree in Computer Science or equivalent practical experience",
      mustHaveSkills: [
        { id: 'req-fs-1', rawText: 'React / Next.js', normalizedSkillId: 'react', skillName: 'React.js', category: 'Frontend', isMustHave: true, minYearsExp: 5, importanceWeight: 5 },
        { id: 'req-fs-2', rawText: 'TypeScript', normalizedSkillId: 'typescript', skillName: 'TypeScript', category: 'Frontend', isMustHave: true, minYearsExp: 4, importanceWeight: 5 },
        { id: 'req-fs-3', rawText: 'Node.js backend services', normalizedSkillId: 'nodejs', skillName: 'Node.js', category: 'Backend', isMustHave: true, minYearsExp: 5, importanceWeight: 5 },
        { id: 'req-fs-4', rawText: 'System Design & High-Availability Architecture', normalizedSkillId: 'system_design', skillName: 'System Design & High Availability', category: 'Architecture', isMustHave: true, minYearsExp: 4, importanceWeight: 5 },
        { id: 'req-fs-5', rawText: 'PostgreSQL / SQL data modeling', normalizedSkillId: 'postgresql', skillName: 'PostgreSQL', category: 'Databases', isMustHave: true, minYearsExp: 4, importanceWeight: 4 }
      ],
      niceToHaveSkills: [
        { id: 'req-fs-6', rawText: 'AWS Cloud & Terraform IaC', normalizedSkillId: 'aws', skillName: 'AWS (Amazon Web Services)', category: 'Cloud & DevOps', isMustHave: false, importanceWeight: 4 },
        { id: 'req-fs-7', rawText: 'GraphQL or tRPC', normalizedSkillId: 'graphql', skillName: 'GraphQL', category: 'Backend', isMustHave: false, importanceWeight: 3 },
        { id: 'req-fs-8', rawText: 'Tailwind CSS', normalizedSkillId: 'tailwind', skillName: 'Tailwind CSS', category: 'Frontend', isMustHave: false, importanceWeight: 2 }
      ],
      domainKnowledge: ['SaaS Platforms', 'Micro-frontends', 'Multi-tenant Architecture'],
      responsibilities: [
        'Lead architectural standards across 4 frontend and backend product squads.',
        'Design modular Next.js and TypeScript micro-frontends with high Lighthouse performance scores.',
        'Maintain zero-downtime PostgreSQL migrations and distributed cache layers with Redis.'
      ],
      rawText: `Job Title: Lead Full-Stack TypeScript / Cloud Architect
Company: PulseScale Enterprise
Required Experience: 6+ years in full-stack web engineering with proven leadership experience.

Must-Haves:
- Expert-level TypeScript and React / Next.js ecosystem (5+ years).
- Robust Node.js microservices and asynchronous backend design.
- Deep understanding of System Design, concurrency, and high availability.
- PostgreSQL schema modeling, indexing, and query tuning.

Nice-to-Haves:
- AWS Cloud & Terraform IaC.
- GraphQL, tRPC, and modern API standards.
- Tailwind CSS and modern UI component systems.`
    },
    resumes: [
      {
        id: 'res-fs-01',
        name: 'Sarah Jenkins',
        email: 'sarah.jenkins.tech@gmail.com',
        phone: '+1 (555) 901-2345',
        location: 'New York, NY',
        currentRole: 'Staff Full-Stack Architect',
        totalYearsExperience: 7.5,
        education: [
          { degree: "Bachelor of Science", field: "Computer Science", institution: "Cornell University", year: "2017" }
        ],
        certifications: ['AWS Certified Solutions Architect - Professional'],
        skills: [
          { rawName: 'React & Next.js', normalizedSkillId: 'react', category: 'Frontend', yearsOfExperience: 7, evidenceSnippet: 'Architected enterprise Next.js 14 applications serving 2M MAU with 99.99% uptime.' },
          { rawName: 'TypeScript', normalizedSkillId: 'typescript', category: 'Frontend', yearsOfExperience: 6, evidenceSnippet: 'Enforced strict TypeScript codebase across 40+ packages in an enterprise monorepo.' },
          { rawName: 'Node.js', normalizedSkillId: 'nodejs', category: 'Backend', yearsOfExperience: 7, evidenceSnippet: 'Built high-throughput Node.js microservices processing $50M in daily transaction volume.' },
          { rawName: 'System Design', normalizedSkillId: 'system_design', category: 'Architecture', yearsOfExperience: 5, evidenceSnippet: 'Designed fault-tolerant multi-region failover architecture on AWS with distributed Redis caching.' },
          { rawName: 'PostgreSQL', normalizedSkillId: 'postgresql', category: 'Databases', yearsOfExperience: 6, evidenceSnippet: 'Optimized complex PostgreSQL relational schemas and partitioned tables handling 100M+ records.' },
          { rawName: 'Terraform & AWS', normalizedSkillId: 'aws', category: 'Cloud & DevOps', yearsOfExperience: 5, evidenceSnippet: 'Authored Terraform modules provisioning AWS ECS, Aurora PostgreSQL, and CloudFront.' }
        ],
        experiences: [
          {
            company: 'FinPulse Systems',
            role: 'Staff Full-Stack Architect',
            startDate: '2021',
            endDate: 'Present',
            durationYears: 4.0,
            highlights: [
              'Led technical vision for flagship web applications built on Next.js, TypeScript, and Node.js.',
              'Mentored 14 engineers across frontend and backend disciplines.',
              'Designed distributed caching architecture reducing P99 latency by 60%.'
            ],
            technologiesUsed: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Terraform']
          }
        ],
        rawText: `Sarah Jenkins - Staff Full-Stack Architect
Email: sarah.jenkins.tech@gmail.com | Experience: 7.5 Years | Location: New York, NY
Education: B.S. Computer Science, Cornell University (2017)
Certifications: AWS Certified Solutions Architect Professional

SUMMARY:
Seasoned Full-Stack Architect with 7.5+ years specializing in TypeScript, Next.js, Node.js, and scalable cloud systems.

EXPERIENCE:
FinPulse Systems (2021 - Present) - Staff Full-Stack Architect
- Architected enterprise Next.js 14 applications serving 2M MAU with strict TypeScript type safety.
- Built high-throughput Node.js microservices processing $50M daily transactions.
- Designed fault-tolerant AWS multi-region infrastructure with Terraform and Aurora PostgreSQL.
- Mentored senior engineers and led architectural review committees.`
      }
    ]
  }
];
