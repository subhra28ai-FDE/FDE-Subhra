import { MasterSkill, SkillCategory } from '../types';

export const SKILLS_MASTER: MasterSkill[] = [
  // --- FRONTEND ---
  {
    id: 'react',
    name: 'React.js',
    category: 'Frontend',
    aliases: ['react', 'reactjs', 'react.js', 'react native web'],
    difficultyTier: 'Core',
    description: 'Component-based UI library by Meta',
    equivalents: [
      { skillId: 'nextjs', similarity: 0.95, rationale: 'Next.js is a full-stack framework built on top of React' },
      { skillId: 'vue', similarity: 0.8, rationale: 'Vue shares reactive component paradigms with React' },
      { skillId: 'angular', similarity: 0.75, rationale: 'Angular is a full SPA framework with component-based architecture' },
      { skillId: 'svelte', similarity: 0.75, rationale: 'Svelte compiles reactive component architectures' }
    ]
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    category: 'Frontend',
    aliases: ['next.js', 'nextjs', 'next js', 'next 14', 'next 15'],
    difficultyTier: 'Advanced',
    description: 'React Framework for SSR, SSG, Server Components and API routing',
    equivalents: [
      { skillId: 'react', similarity: 0.95, rationale: 'Next.js uses React as its core rendering engine' },
      { skillId: 'remix', similarity: 0.9, rationale: 'Remix is an alternative modern SSR React framework' }
    ]
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'Frontend',
    aliases: ['typescript', 'ts', 'type-script'],
    difficultyTier: 'Core',
    description: 'Typed superset of JavaScript',
    equivalents: [
      { skillId: 'javascript', similarity: 0.9, rationale: 'TypeScript builds on JavaScript with static typing' }
    ]
  },
  {
    id: 'javascript',
    name: 'JavaScript (ES6+)',
    category: 'Frontend',
    aliases: ['javascript', 'js', 'es6', 'ecmascript', 'es2022'],
    difficultyTier: 'Foundational',
    description: 'Core web programming language',
    equivalents: [
      { skillId: 'typescript', similarity: 0.85, rationale: 'TypeScript is typed JavaScript' }
    ]
  },
  {
    id: 'vue',
    name: 'Vue.js',
    category: 'Frontend',
    aliases: ['vue', 'vuejs', 'vue.js', 'vue3', 'nuxt'],
    difficultyTier: 'Core',
    description: 'Progressive JavaScript framework for building user interfaces',
    equivalents: [
      { skillId: 'react', similarity: 0.8, rationale: 'Component-based reactive framework' },
      { skillId: 'svelte', similarity: 0.8, rationale: 'Reactive UI framework' }
    ]
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'Frontend',
    aliases: ['tailwind', 'tailwindcss', 'tailwind css', 'utility css'],
    difficultyTier: 'Core',
    description: 'Utility-first CSS framework',
    equivalents: [
      { skillId: 'css', similarity: 0.85, rationale: 'Built directly on modern CSS specifications' },
      { skillId: 'bootstrap', similarity: 0.7, rationale: 'CSS styling framework alternative' }
    ]
  },
  {
    id: 'css',
    name: 'CSS3 / SASS / SCSS',
    category: 'Frontend',
    aliases: ['css', 'css3', 'sass', 'scss', 'styled-components'],
    difficultyTier: 'Foundational',
    description: 'Modern styling, layouts (Flexbox, Grid), responsive design',
    equivalents: [
      { skillId: 'tailwind', similarity: 0.85, rationale: 'Tailwind compiles directly to CSS' }
    ]
  },

  // --- BACKEND & APIS ---
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'Backend',
    aliases: ['node', 'nodejs', 'node.js', 'express', 'express.js', 'nestjs', 'fastify'],
    difficultyTier: 'Core',
    description: 'Asynchronous event-driven JavaScript runtime',
    equivalents: [
      { skillId: 'bun', similarity: 0.9, rationale: 'Bun is a modern fast JS runtime compatible with Node APIs' },
      { skillId: 'deno', similarity: 0.88, rationale: 'Deno is a modern secure TypeScript/JS runtime' },
      { skillId: 'python', similarity: 0.75, rationale: 'Widely used general-purpose backend service language' }
    ]
  },
  {
    id: 'python',
    name: 'Python',
    category: 'Backend',
    aliases: ['python', 'python3', 'py', 'cpython'],
    difficultyTier: 'Core',
    description: 'High-level programming language for backend, data, and AI',
    equivalents: [
      { skillId: 'fastapi', similarity: 0.9, rationale: 'FastAPI is modern Python web framework' },
      { skillId: 'django', similarity: 0.9, rationale: 'Django is the standard enterprise Python web framework' }
    ]
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    category: 'Backend',
    aliases: ['fastapi', 'fast-api', 'fast api'],
    difficultyTier: 'Core',
    description: 'Modern, fast (high-performance) web framework for building APIs with Python',
    equivalents: [
      { skillId: 'flask', similarity: 0.85, rationale: 'Python micro-framework alternative' },
      { skillId: 'django', similarity: 0.85, rationale: 'Python web framework' },
      { skillId: 'nodejs', similarity: 0.8, rationale: 'Asynchronous REST API framework' }
    ]
  },
  {
    id: 'django',
    name: 'Django / DRF',
    category: 'Backend',
    aliases: ['django', 'django rest framework', 'drf'],
    difficultyTier: 'Core',
    description: 'Batteries-included web framework for Python',
    equivalents: [
      { skillId: 'fastapi', similarity: 0.85, rationale: 'Python web framework' },
      { skillId: 'flask', similarity: 0.8, rationale: 'Python web framework' },
      { skillId: 'spring_boot', similarity: 0.75, rationale: 'Enterprise MVC backend framework' }
    ]
  },
  {
    id: 'golang',
    name: 'Go (Golang)',
    category: 'Backend',
    aliases: ['go', 'golang', 'go-lang'],
    difficultyTier: 'Advanced',
    description: 'Statically typed, compiled language engineered for high concurrency and microservices',
    equivalents: [
      { skillId: 'rust', similarity: 0.75, rationale: 'Compiled high-performance systems language' },
      { skillId: 'java', similarity: 0.7, rationale: 'Backend enterprise services language' }
    ]
  },
  {
    id: 'java',
    name: 'Java',
    category: 'Backend',
    aliases: ['java', 'java 17', 'java 21', 'jdk', 'jvm'],
    difficultyTier: 'Core',
    description: 'Object-oriented language for enterprise applications',
    equivalents: [
      { skillId: 'spring_boot', similarity: 0.9, rationale: 'Spring Boot is the standard Java web framework' },
      { skillId: 'csharp', similarity: 0.85, rationale: 'C# / .NET shares OOP and enterprise runtime architecture' },
      { skillId: 'kotlin', similarity: 0.9, rationale: 'Kotlin runs on JVM with seamless Java interoperability' }
    ]
  },
  {
    id: 'spring_boot',
    name: 'Spring Boot',
    category: 'Backend',
    aliases: ['spring boot', 'spring', 'spring framework', 'spring mvc', 'spring data'],
    difficultyTier: 'Core',
    description: 'Enterprise Java application framework',
    equivalents: [
      { skillId: 'java', similarity: 0.95, rationale: 'Spring Boot is the foundational Java framework' },
      { skillId: 'dotnet', similarity: 0.8, rationale: 'Microsoft enterprise backend counterpart' }
    ]
  },
  {
    id: 'csharp',
    name: 'C# / .NET',
    category: 'Backend',
    aliases: ['c#', 'csharp', '.net', '.net core', 'dotnet', 'asp.net'],
    difficultyTier: 'Core',
    description: 'Modern, cross-platform enterprise development platform',
    equivalents: [
      { skillId: 'java', similarity: 0.85, rationale: 'Comparable enterprise language structure and ecosystem' }
    ]
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    category: 'Backend',
    aliases: ['graphql', 'apollo', 'apollo graphql', 'relay'],
    difficultyTier: 'Advanced',
    description: 'Query language for APIs and runtime for fulfilling those queries',
    equivalents: [
      { skillId: 'rest_api', similarity: 0.8, rationale: 'API interface design and client-server communication' },
      { skillId: 'grpc', similarity: 0.75, rationale: 'Alternative structured API protocol' }
    ]
  },
  {
    id: 'rest_api',
    name: 'RESTful APIs & OpenAPI',
    category: 'Backend',
    aliases: ['rest', 'rest api', 'restful', 'openapi', 'swagger', 'json api'],
    difficultyTier: 'Foundational',
    description: 'Representational State Transfer API architecture',
    equivalents: [
      { skillId: 'graphql', similarity: 0.8, rationale: 'Modern API design paradigm' }
    ]
  },

  // --- DATA & AI / ML ---
  {
    id: 'pytorch',
    name: 'PyTorch',
    category: 'Data & AI',
    aliases: ['pytorch', 'torch', 'libtorch', 'torchvision'],
    difficultyTier: 'Advanced',
    description: 'Open source machine learning framework based on the Torch library',
    equivalents: [
      { skillId: 'tensorflow', similarity: 0.88, rationale: 'Deep learning framework equivalence' },
      { skillId: 'jax', similarity: 0.82, rationale: 'Autograd and accelerator-oriented deep learning' },
      { skillId: 'scikit_learn', similarity: 0.75, rationale: 'Foundational ML framework' }
    ]
  },
  {
    id: 'tensorflow',
    name: 'TensorFlow / Keras',
    category: 'Data & AI',
    aliases: ['tensorflow', 'tf', 'keras', 'tf2', 'tensorflow lite'],
    difficultyTier: 'Advanced',
    description: 'End-to-end open source platform for machine learning by Google',
    equivalents: [
      { skillId: 'pytorch', similarity: 0.88, rationale: 'Deep learning framework equivalence' },
      { skillId: 'scikit_learn', similarity: 0.75, rationale: 'Machine learning framework' }
    ]
  },
  {
    id: 'llm_engineering',
    name: 'LLM & Generative AI Engineering',
    category: 'Data & AI',
    aliases: ['llm', 'llms', 'generative ai', 'genai', 'large language models', 'prompt engineering', 'fine-tuning', 'lora', 'peft'],
    difficultyTier: 'Advanced',
    description: 'Building, prompt engineering, tuning and deploying foundation models (Gemini, GPT, Claude, LLaMA)',
    equivalents: [
      { skillId: 'rag_systems', similarity: 0.9, rationale: 'RAG is a core architecture for production LLM systems' },
      { skillId: 'langchain', similarity: 0.85, rationale: 'Framework for orchestrating LLM chains and agents' }
    ]
  },
  {
    id: 'rag_systems',
    name: 'RAG (Retrieval-Augmented Generation)',
    category: 'Data & AI',
    aliases: ['rag', 'retrieval augmented generation', 'retrieval-augmented generation', 'vector search', 'semantic search'],
    difficultyTier: 'Advanced',
    description: 'Architecture combining vector retrieval with LLMs for factual generation',
    equivalents: [
      { skillId: 'vector_databases', similarity: 0.92, rationale: 'Vector databases are the storage backbone of RAG' },
      { skillId: 'llm_engineering', similarity: 0.9, rationale: 'Core GenAI design pattern' }
    ]
  },
  {
    id: 'vector_databases',
    name: 'Vector Databases (Chroma, Pinecone, Qdrant, Weaviate, pgvector)',
    category: 'Data & AI',
    aliases: ['vector db', 'vector databases', 'pinecone', 'chroma', 'chromadb', 'weaviate', 'qdrant', 'pgvector', 'milvus', 'faiss'],
    difficultyTier: 'Advanced',
    description: 'Databases optimized for high-dimensional vector embeddings and approximate nearest neighbors (ANN)',
    equivalents: [
      { skillId: 'rag_systems', similarity: 0.9, rationale: 'Primary persistence layer for RAG' },
      { skillId: 'elasticsearch', similarity: 0.75, rationale: 'Search and similarity indexing engine' }
    ]
  },
  {
    id: 'langchain',
    name: 'LangChain / LlamaIndex',
    category: 'Data & AI',
    aliases: ['langchain', 'llamaindex', 'llama-index', 'langgraph', 'crewai', 'autogen'],
    difficultyTier: 'Advanced',
    description: 'Frameworks for developing applications powered by language models and agentic workflows',
    equivalents: [
      { skillId: 'llm_engineering', similarity: 0.88, rationale: 'Orchestration tooling for GenAI' }
    ]
  },
  {
    id: 'scikit_learn',
    name: 'Scikit-Learn & Classical ML',
    category: 'Data & AI',
    aliases: ['scikit-learn', 'sklearn', 'scikit learn', 'random forest', 'xgboost', 'lightgbm', 'regression', 'clustering'],
    difficultyTier: 'Core',
    description: 'Machine learning library in Python for classical algorithms',
    equivalents: [
      { skillId: 'pytorch', similarity: 0.75, rationale: 'Machine learning algorithms and data prep' },
      { skillId: 'pandas', similarity: 0.85, rationale: 'Core scientific Python data manipulation stack' }
    ]
  },
  {
    id: 'pandas',
    name: 'Pandas & NumPy',
    category: 'Data & AI',
    aliases: ['pandas', 'numpy', 'scipy', 'polars'],
    difficultyTier: 'Foundational',
    description: 'Data manipulation, dataframe transformations, and scientific computing',
    equivalents: [
      { skillId: 'pyspark', similarity: 0.8, rationale: 'Distributed dataframe processing counterpart' },
      { skillId: 'sql', similarity: 0.85, rationale: 'Tabular data query and transformation logic' }
    ]
  },
  {
    id: 'pyspark',
    name: 'Apache Spark / PySpark',
    category: 'Data & AI',
    aliases: ['spark', 'pyspark', 'apache spark', 'spark sql', 'databricks'],
    difficultyTier: 'Advanced',
    description: 'Unified analytics engine for large-scale distributed data processing',
    equivalents: [
      { skillId: 'pandas', similarity: 0.8, rationale: 'Dataframe processing' },
      { skillId: 'hadoop', similarity: 0.75, rationale: 'Big data batch compute infrastructure' }
    ]
  },
  {
    id: 'airflow',
    name: 'Apache Airflow / Data Orchestration',
    category: 'Data & AI',
    aliases: ['airflow', 'apache airflow', 'prefect', 'dagster', 'data pipelines', 'etl', 'elt'],
    difficultyTier: 'Core',
    description: 'Platform to programmatically author, schedule and monitor workflows',
    equivalents: [
      { skillId: 'dbt', similarity: 0.8, rationale: 'Modern data transformation and pipeline orchestration' }
    ]
  },
  {
    id: 'dbt',
    name: 'dbt (data build tool)',
    category: 'Data & AI',
    aliases: ['dbt', 'dbt-core', 'dbt cloud', 'data modeling'],
    difficultyTier: 'Core',
    description: 'Data transformation tool that enables data analysts and engineers to transform data in their warehouse',
    equivalents: [
      { skillId: 'sql', similarity: 0.9, rationale: 'dbt is built on SQL models' },
      { skillId: 'airflow', similarity: 0.8, rationale: 'Data pipeline transformation workflow' }
    ]
  },

  // --- CLOUD & DEVOPS ---
  {
    id: 'aws',
    name: 'AWS (Amazon Web Services)',
    category: 'Cloud & DevOps',
    aliases: ['aws', 'amazon web services', 'ec2', 's3', 'lambda', 'ecs', 'eks', 'iam', 'cloudwatch', 'sqs', 'sns', 'fargate'],
    difficultyTier: 'Core',
    description: 'Comprehensive cloud computing platform provided by Amazon',
    equivalents: [
      { skillId: 'gcp', similarity: 0.85, rationale: 'Direct cloud provider equivalent (Lambda~Cloud Functions, S3~GCS, EKS~GKE)' },
      { skillId: 'azure', similarity: 0.85, rationale: 'Direct enterprise cloud provider equivalent' }
    ]
  },
  {
    id: 'gcp',
    name: 'Google Cloud Platform (GCP)',
    category: 'Cloud & DevOps',
    aliases: ['gcp', 'google cloud', 'google cloud platform', 'cloud run', 'gke', 'bigquery', 'vertex ai', 'cloud storage'],
    difficultyTier: 'Core',
    description: 'Suite of cloud computing services that runs on Google infrastructure',
    equivalents: [
      { skillId: 'aws', similarity: 0.85, rationale: 'Cloud platform parity across compute, storage, and IAM' },
      { skillId: 'azure', similarity: 0.82, rationale: 'Hyperscaler cloud platform parity' }
    ]
  },
  {
    id: 'azure',
    name: 'Microsoft Azure',
    category: 'Cloud & DevOps',
    aliases: ['azure', 'microsoft azure', 'azure devops', 'azure functions', 'aks', 'azure blob'],
    difficultyTier: 'Core',
    description: 'Cloud computing platform operated by Microsoft',
    equivalents: [
      { skillId: 'aws', similarity: 0.85, rationale: 'Enterprise cloud provider parity' },
      { skillId: 'gcp', similarity: 0.82, rationale: 'Cloud provider parity' }
    ]
  },
  {
    id: 'docker',
    name: 'Docker & Containerization',
    category: 'Cloud & DevOps',
    aliases: ['docker', 'containers', 'containerization', 'dockerfile', 'docker-compose', 'podman', 'containerd'],
    difficultyTier: 'Core',
    description: 'Platform designed to build, share, and run container applications',
    equivalents: [
      { skillId: 'kubernetes', similarity: 0.85, rationale: 'Kubernetes orchestrates Docker containers' }
    ]
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes (K8s)',
    category: 'Cloud & DevOps',
    aliases: ['kubernetes', 'k8s', 'helm', 'kubectl', 'k9s', 'ingress', 'istio'],
    difficultyTier: 'Advanced',
    description: 'Automated container deployment, scaling, and management',
    equivalents: [
      { skillId: 'docker', similarity: 0.85, rationale: 'Container orchestration standard' },
      { skillId: 'terraform', similarity: 0.75, rationale: 'Cloud infrastructure deployment paradigm' }
    ]
  },
  {
    id: 'terraform',
    name: 'Terraform & Infrastructure as Code (IaC)',
    category: 'Cloud & DevOps',
    aliases: ['terraform', 'iac', 'infrastructure as code', 'opentofu', 'terragrunt', 'pulumi', 'cloudformation'],
    difficultyTier: 'Advanced',
    description: 'Infrastructure as Code tool to build, change, and version cloud infrastructure safely',
    equivalents: [
      { skillId: 'pulumi', similarity: 0.85, rationale: 'Modern programmatic IaC tool' },
      { skillId: 'aws', similarity: 0.75, rationale: 'Cloud resource provisioning' }
    ]
  },
  {
    id: 'cicd',
    name: 'CI/CD Pipelines (GitHub Actions, GitLab CI, Jenkins)',
    category: 'Cloud & DevOps',
    aliases: ['ci/cd', 'cicd', 'github actions', 'gitlab ci', 'jenkins', 'circleci', 'argo cd', 'continuous integration', 'continuous deployment'],
    difficultyTier: 'Core',
    description: 'Automated build, test, and release delivery pipelines',
    equivalents: [
      { skillId: 'git', similarity: 0.8, rationale: 'Version control integrated release workflows' }
    ]
  },
  {
    id: 'linux',
    name: 'Linux / Shell Scripting / Bash',
    category: 'Cloud & DevOps',
    aliases: ['linux', 'bash', 'shell', 'ubuntu', 'centos', 'debian', 'zsh', 'unix'],
    difficultyTier: 'Foundational',
    description: 'Operating system CLI, process management, networking, and scripting',
    equivalents: []
  },

  // --- DATABASES & STORAGE ---
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'Databases',
    aliases: ['postgres', 'postgresql', 'psql', 'pg'],
    difficultyTier: 'Core',
    description: 'Powerful, open source object-relational database system',
    equivalents: [
      { skillId: 'mysql', similarity: 0.9, rationale: 'Relational SQL database parity' },
      { skillId: 'sql', similarity: 0.98, rationale: 'ANSI SQL standard compliance' }
    ]
  },
  {
    id: 'mysql',
    name: 'MySQL / MariaDB',
    category: 'Databases',
    aliases: ['mysql', 'mariadb'],
    difficultyTier: 'Core',
    description: 'Open-source relational database management system',
    equivalents: [
      { skillId: 'postgresql', similarity: 0.9, rationale: 'Relational SQL engine parity' },
      { skillId: 'sql', similarity: 0.98, rationale: 'Relational SQL queries' }
    ]
  },
  {
    id: 'sql',
    name: 'SQL & Database Design',
    category: 'Databases',
    aliases: ['sql', 'rdbms', 'relational database', 'database indexing', 'query optimization', 'joins', 'stored procedures'],
    difficultyTier: 'Foundational',
    description: 'Structured Query Language and schema modeling for relational data',
    equivalents: [
      { skillId: 'postgresql', similarity: 0.95, rationale: 'Standard PostgreSQL dialect' },
      { skillId: 'mysql', similarity: 0.95, rationale: 'Standard MySQL dialect' }
    ]
  },
  {
    id: 'mongodb',
    name: 'MongoDB / NoSQL Document Stores',
    category: 'Databases',
    aliases: ['mongodb', 'mongo', 'nosql', 'documentdb', 'couchdb'],
    difficultyTier: 'Core',
    description: 'Document-oriented NoSQL database system',
    equivalents: [
      { skillId: 'dynamodb', similarity: 0.8, rationale: 'NoSQL key-document cloud database' },
      { skillId: 'redis', similarity: 0.75, rationale: 'Non-relational in-memory store' }
    ]
  },
  {
    id: 'redis',
    name: 'Redis / In-Memory Caching',
    category: 'Databases',
    aliases: ['redis', 'caching', 'in-memory', 'memcached', 'pubsub', 'key-value'],
    difficultyTier: 'Core',
    description: 'In-memory data structure store, used as database, cache, message broker',
    equivalents: [
      { skillId: 'kafka', similarity: 0.7, rationale: 'Fast distributed messaging and streams' }
    ]
  },
  {
    id: 'kafka',
    name: 'Apache Kafka / Event Streaming',
    category: 'Databases',
    aliases: ['kafka', 'apache kafka', 'event streaming', 'event-driven', 'rabbitmq', 'pulsar', 'message queue', 'sqs'],
    difficultyTier: 'Advanced',
    description: 'Distributed event store and stream-processing platform',
    equivalents: [
      { skillId: 'redis', similarity: 0.7, rationale: 'Pub/sub streaming message transport' }
    ]
  },
  {
    id: 'snowflake',
    name: 'Snowflake / BigQuery / Cloud Data Warehousing',
    category: 'Databases',
    aliases: ['snowflake', 'bigquery', 'redshift', 'data warehouse', 'cloud data warehouse', 'olap'],
    difficultyTier: 'Advanced',
    description: 'Cloud-native columnar analytical data warehouses',
    equivalents: [
      { skillId: 'sql', similarity: 0.9, rationale: 'SQL analytical queries (OLAP)' },
      { skillId: 'dbt', similarity: 0.85, rationale: 'Transforms in Snowflake and BigQuery' }
    ]
  },

  // --- ARCHITECTURE & SYSTEM DESIGN ---
  {
    id: 'system_design',
    name: 'System Design & High Availability',
    category: 'Architecture',
    aliases: ['system design', 'high availability', 'scalability', 'distributed systems', 'load balancing', 'fault tolerance', 'horizontal scaling'],
    difficultyTier: 'Advanced',
    description: 'Designing scalable, resilient, distributed software architectures',
    equivalents: [
      { skillId: 'microservices', similarity: 0.9, rationale: 'Microservices architecture pattern' }
    ]
  },
  {
    id: 'microservices',
    name: 'Microservices Architecture',
    category: 'Architecture',
    aliases: ['microservices', 'service-oriented', 'soa', 'distributed architecture', 'api gateway'],
    difficultyTier: 'Advanced',
    description: 'Architectural approach where a single application is composed of small loosely coupled services',
    equivalents: [
      { skillId: 'system_design', similarity: 0.9, rationale: 'Core distributed system design pattern' },
      { skillId: 'docker', similarity: 0.8, rationale: 'Containerized deployment unit for microservices' }
    ]
  },
  {
    id: 'security_owasp',
    name: 'Application Security & OWASP',
    category: 'Architecture',
    aliases: ['security', 'appsec', 'owasp', 'oauth2', 'jwt', 'encryption', 'tls', 'rbac', 'sso'],
    difficultyTier: 'Advanced',
    description: 'Identity management, OAuth 2.0, cryptography, threat modeling, and secure coding practices',
    equivalents: []
  },

  // --- TESTING & QA ---
  {
    id: 'unit_testing',
    name: 'Automated Testing (Jest, Vitest, PyTest, JUnit)',
    category: 'Testing & QA',
    aliases: ['testing', 'unit testing', 'jest', 'vitest', 'pytest', 'junit', 'tdd', 'test driven development', 'mocking'],
    difficultyTier: 'Core',
    description: 'Automated unit, integration, and regression testing practices',
    equivalents: [
      { skillId: 'e2e_testing', similarity: 0.8, rationale: 'Software verification suite' }
    ]
  },
  {
    id: 'e2e_testing',
    name: 'End-to-End Testing (Cypress, Playwright, Selenium)',
    category: 'Testing & QA',
    aliases: ['e2e', 'playwright', 'cypress', 'selenium', 'browser testing', 'integration testing'],
    difficultyTier: 'Core',
    description: 'Simulating real user browser workflows and validating system integrations',
    equivalents: [
      { skillId: 'unit_testing', similarity: 0.8, rationale: 'Automated quality verification' }
    ]
  },

  // --- PRODUCT & LEADERSHIP ---
  {
    id: 'agile_scrum',
    name: 'Agile / Scrum / Kanban',
    category: 'Product & Agile',
    aliases: ['agile', 'scrum', 'kanban', 'sprints', 'jira', 'confluence', 'sprint planning', 'standups'],
    difficultyTier: 'Core',
    description: 'Iterative project management and software delivery methodologies',
    equivalents: []
  },
  {
    id: 'tech_leadership',
    name: 'Technical Leadership & Mentorship',
    category: 'Soft Skills & Leadership',
    aliases: ['leadership', 'tech lead', 'mentorship', 'team lead', 'code reviews', 'hiring', 'architecture review', 'engineering strategy'],
    difficultyTier: 'Advanced',
    description: 'Guiding engineering teams, conducting code reviews, mentoring junior engineers, driving roadmap',
    equivalents: []
  },
  {
    id: 'cross_functional',
    name: 'Cross-Functional Stakeholder Collaboration',
    category: 'Soft Skills & Leadership',
    aliases: ['communication', 'cross-functional', 'stakeholder management', 'collaboration', 'product partnership', 'technical writing', 'documentation'],
    difficultyTier: 'Foundational',
    description: 'Effective written/verbal communication with product managers, designers, executives, and clients',
    equivalents: []
  }
];

/**
 * Normalizes a raw skill text string against the Kaggle-derived Skills Master.
 * Performs exact match, alias matching, and returns the canonical master skill.
 */
export function normalizeSkill(rawText: string): {
  normalizedSkill?: MasterSkill;
  canonicalName: string;
  confidence: number;
} {
  if (!rawText || !rawText.trim()) {
    return { canonicalName: '', confidence: 0 };
  }

  const clean = rawText.trim().toLowerCase();
  
  // 1. Direct ID match
  const directId = SKILLS_MASTER.find(s => s.id === clean || s.name.toLowerCase() === clean);
  if (directId) {
    return { normalizedSkill: directId, canonicalName: directId.name, confidence: 1.0 };
  }

  // 2. Alias match
  for (const master of SKILLS_MASTER) {
    if (master.aliases.some(alias => alias.toLowerCase() === clean)) {
      return { normalizedSkill: master, canonicalName: master.name, confidence: 0.98 };
    }
  }

  // 3. Substring / Token match
  for (const master of SKILLS_MASTER) {
    for (const alias of master.aliases) {
      if (clean.includes(alias.toLowerCase()) || alias.toLowerCase().includes(clean)) {
        if (alias.length >= 3) {
          return { normalizedSkill: master, canonicalName: master.name, confidence: 0.85 };
        }
      }
    }
  }

  // Fallback: title-case raw text
  const titleCased = rawText.charAt(0).toUpperCase() + rawText.slice(1);
  return { canonicalName: titleCased, confidence: 0.4 };
}

/**
 * Checks for semantic or equivalent skill match between a requirement and a candidate's skill.
 */
export function evaluateSkillEquivalence(
  reqSkillId?: string,
  candidateSkillId?: string
): {
  isEquivalent: boolean;
  similarity: number;
  rationale?: string;
} {
  if (!reqSkillId || !candidateSkillId) {
    return { isEquivalent: false, similarity: 0 };
  }

  if (reqSkillId === candidateSkillId) {
    return { isEquivalent: true, similarity: 1.0, rationale: 'Exact canonical skill match' };
  }

  const reqMaster = SKILLS_MASTER.find(s => s.id === reqSkillId);
  if (!reqMaster) {
    return { isEquivalent: false, similarity: 0 };
  }

  // Check if candidate skill is in req's equivalents list
  const eqFound = reqMaster.equivalents?.find(e => e.skillId === candidateSkillId);
  if (eqFound) {
    return {
      isEquivalent: true,
      similarity: eqFound.similarity,
      rationale: eqFound.rationale
    };
  }

  // Check reverse equivalence
  const candMaster = SKILLS_MASTER.find(s => s.id === candidateSkillId);
  const reverseEq = candMaster?.equivalents?.find(e => e.skillId === reqSkillId);
  if (reverseEq) {
    return {
      isEquivalent: true,
      similarity: reverseEq.similarity,
      rationale: reverseEq.rationale
    };
  }

  return { isEquivalent: false, similarity: 0 };
}
