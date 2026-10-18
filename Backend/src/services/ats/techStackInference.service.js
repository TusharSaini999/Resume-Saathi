/**
 * Tech Stack Inference & Role Derivation Service
 * 
 * Dynamically infers tech stacks (MERN, MEAN, PERN, Python/Django, Java/Spring,
 * Next.js, Golang Cloud, .NET, DevOps, AI/GenAI, Mobile, QA, Product, etc.)
 * from candidate resume skills and text.
 * 
 * Even if "MERN" or "Full Stack" is NOT literally mentioned, if the resume
 * contains React, Node.js, Express, and MongoDB, this service detects the MERN stack
 * and derives high-value industry roles:
 * - Full Stack Developer
 * - MERN Stack Developer
 * - React Developer
 * - Node.js Backend Developer
 * - Software Development Engineer (SDE)
 */

export const TECH_STACK_DEFINITIONS = [
  {
    id: "mern",
    name: "MERN Stack",
    category: "Full Stack Web",
    icon: "⚛️",
    badgeColor: "cyan",
    mandatoryComponents: ["Frontend (React)"],
    requiredComponents: [
      { name: "Frontend (React)", aliases: ["react", "react.js", "reactjs", "next.js", "nextjs"] },
      { name: "Runtime (Node.js)", aliases: ["node", "node.js", "nodejs"] },
      { name: "Framework (Express)", aliases: ["express", "express.js", "expressjs"] },
      { name: "Database (MongoDB)", aliases: ["mongo", "mongodb", "mongoose"] },
    ],
    minComponentsRequired: 3, // At least 3 of 4 required
    derivedRoles: [
      "MERN Stack Developer",
      "Full Stack Developer",
      "Full Stack Engineer",
      "React Developer",
      "Node.js Backend Developer",
      "Frontend Developer",
      "Backend Developer",
      "JavaScript Developer",
      "Software Development Engineer (SDE)",
    ],
    searchKeywords: [
      "Full Stack Developer",
      "MERN Stack Developer",
      "React Developer",
      "Node.js Backend Developer",
      "Full Stack Engineer",
    ],
  },
  {
    id: "mean",
    name: "MEAN Stack",
    category: "Full Stack Web",
    icon: "🅰️",
    badgeColor: "red",
    mandatoryComponents: ["Frontend (Angular)"],
    requiredComponents: [
      { name: "Frontend (Angular)", aliases: ["angular", "angular.js", "angularjs"] },
      { name: "Runtime (Node.js)", aliases: ["node", "node.js", "nodejs"] },
      { name: "Framework (Express)", aliases: ["express", "express.js", "expressjs"] },
      { name: "Database (MongoDB)", aliases: ["mongo", "mongodb", "mongoose"] },
    ],
    minComponentsRequired: 3,
    derivedRoles: [
      "MEAN Stack Developer",
      "Full Stack Developer",
      "Angular Developer",
      "Node.js Backend Developer",
      "Full Stack Engineer",
      "Software Development Engineer (SDE)",
    ],
    searchKeywords: ["MEAN Stack Developer", "Full Stack Developer", "Angular Developer"],
  },
  {
    id: "mevn",
    name: "MEVN Stack",
    category: "Full Stack Web",
    icon: "💚",
    badgeColor: "emerald",
    mandatoryComponents: ["Frontend (Vue)"],
    requiredComponents: [
      { name: "Frontend (Vue)", aliases: ["vue", "vue.js", "vuejs", "nuxt", "nuxt.js"] },
      { name: "Runtime (Node.js)", aliases: ["node", "node.js", "nodejs"] },
      { name: "Framework (Express)", aliases: ["express", "express.js", "expressjs"] },
      { name: "Database (MongoDB)", aliases: ["mongo", "mongodb", "mongoose"] },
    ],
    minComponentsRequired: 3,
    derivedRoles: [
      "MEVN Stack Developer",
      "Full Stack Developer",
      "Vue.js Developer",
      "Node.js Backend Developer",
      "Software Development Engineer (SDE)",
    ],
    searchKeywords: ["Full Stack Developer", "Vue.js Developer", "Node.js Developer"],
  },
  {
    id: "pern",
    name: "PERN Stack",
    category: "Full Stack Web",
    icon: "🐘",
    badgeColor: "blue",
    mandatoryComponents: ["Database (PostgreSQL)", "Frontend (React)"],
    requiredComponents: [
      { name: "Database (PostgreSQL)", aliases: ["postgres", "postgresql", "psql"] },
      { name: "Framework (Express)", aliases: ["express", "express.js", "expressjs"] },
      { name: "Frontend (React)", aliases: ["react", "react.js", "reactjs", "next.js"] },
      { name: "Runtime (Node.js)", aliases: ["node", "node.js", "nodejs"] },
    ],
    minComponentsRequired: 3,
    derivedRoles: [
      "PERN Stack Developer",
      "Full Stack Developer",
      "PostgreSQL Backend Developer",
      "React Developer",
      "Full Stack Engineer",
      "Software Development Engineer (SDE)",
    ],
    searchKeywords: ["Full Stack Developer", "React Developer", "PostgreSQL Developer"],
  },
  {
    id: "nextjs_fullstack",
    name: "Next.js Modern Full Stack",
    category: "Modern Web",
    icon: "▲",
    badgeColor: "slate",
    mandatoryComponents: ["Framework (Next.js)"],
    requiredComponents: [
      { name: "Framework (Next.js)", aliases: ["next.js", "nextjs"] },
      { name: "Language (TypeScript/JS)", aliases: ["typescript", "ts", "javascript"] },
      { name: "Ecosystem (Tailwind/Prisma)", aliases: ["tailwind", "tailwind css", "prisma", "trpc", "supabase", "drizzle", "graphql"] },
    ],
    minComponentsRequired: 2,
    derivedRoles: [
      "Next.js Full Stack Developer",
      "Full Stack Engineer",
      "Frontend Engineer",
      "TypeScript Developer",
      "React Developer",
      "Software Development Engineer (SDE)",
    ],
    searchKeywords: ["Next.js Developer", "Full Stack Developer", "TypeScript Engineer"],
  },
  {
    id: "python_django",
    name: "Python & Django Full Stack",
    category: "Python Web Ecosystem",
    icon: "🐍",
    badgeColor: "green",
    mandatoryComponents: ["Framework (Django)"],
    requiredComponents: [
      { name: "Language (Python)", aliases: ["python", "python3"] },
      { name: "Framework (Django)", aliases: ["django", "django rest framework", "drf"] },
      { name: "Database", aliases: ["postgresql", "postgres", "mysql", "sqlite", "mongodb"] },
    ],
    minComponentsRequired: 2, // Python + Django
    derivedRoles: [
      "Python Full Stack Developer",
      "Django Developer",
      "Python Backend Engineer",
      "Full Stack Developer",
      "Backend Developer",
      "Python Developer",
      "Software Development Engineer (SDE)",
    ],
    searchKeywords: [
      "Python Full Stack Developer",
      "Django Developer",
      "Python Developer",
      "Python Backend Engineer",
    ],
  },
  {
    id: "python_fastapi",
    name: "Python & FastAPI / Modern APIs",
    category: "Python API Ecosystem",
    icon: "⚡",
    badgeColor: "teal",
    mandatoryComponents: ["API Framework"],
    requiredComponents: [
      { name: "Language (Python)", aliases: ["python", "python3"] },
      { name: "API Framework", aliases: ["fastapi", "flask", "pydantic", "sqlalchemy", "celery", "asyncio"] },
      { name: "Database/Cache", aliases: ["redis", "postgresql", "postgres", "mongodb", "mysql"] },
    ],
    minComponentsRequired: 2,
    derivedRoles: [
      "FastAPI Backend Developer",
      "Python Backend Engineer",
      "Python Developer",
      "Microservices Engineer",
      "Backend Developer",
      "Software Development Engineer (SDE)",
    ],
    searchKeywords: ["FastAPI Developer", "Python Backend Engineer", "Python Developer"],
  },
  {
    id: "java_spring",
    name: "Java & Spring Boot Full Stack",
    category: "Enterprise Java",
    icon: "☕",
    badgeColor: "orange",
    mandatoryComponents: ["Framework (Spring Boot)"],
    requiredComponents: [
      { name: "Language (Java)", aliases: ["java", "core java", "j2ee"] },
      { name: "Framework (Spring Boot)", aliases: ["spring boot", "spring", "spring mvc", "hibernate", "jpa", "spring cloud"] },
      { name: "Database/Enterprise", aliases: ["mysql", "postgresql", "oracle db", "kafka", "microservices", "redis"] },
    ],
    minComponentsRequired: 2, // Java + Spring
    derivedRoles: [
      "Java Full Stack Developer",
      "Spring Boot Developer",
      "Java Backend Engineer",
      "Java Developer",
      "Full Stack Developer",
      "Software Development Engineer (SDE)",
    ],
    searchKeywords: [
      "Java Full Stack Developer",
      "Spring Boot Developer",
      "Java Developer",
      "Java Backend Engineer",
    ],
  },
  {
    id: "dotnet_csharp",
    name: ".NET & C# Full Stack",
    category: "Microsoft Ecosystem",
    icon: "🔷",
    badgeColor: "violet",
    mandatoryComponents: ["Language (C#)"],
    requiredComponents: [
      { name: "Language (C#)", aliases: ["c#", "csharp"] },
      { name: "Framework (.NET)", aliases: [".net", ".net core", "asp.net", "asp.net core", "entity framework"] },
      { name: "Database/Cloud", aliases: ["sql server", "mssql", "azure", "postgresql"] },
    ],
    minComponentsRequired: 2,
    derivedRoles: [
      ".NET Full Stack Developer",
      "C# .NET Developer",
      "ASP.NET Core Engineer",
      "Full Stack Developer",
      "Backend Developer",
      "Software Development Engineer (SDE)",
    ],
    searchKeywords: [".NET Developer", "C# Developer", "Full Stack Developer"],
  },
  {
    id: "golang_cloud",
    name: "Golang Cloud & Systems",
    category: "Systems & Cloud Native",
    icon: "🐹",
    badgeColor: "sky",
    mandatoryComponents: ["Language (Golang)"],
    requiredComponents: [
      { name: "Language (Golang)", aliases: ["golang", "go programming", "go developer", "go engineer"] },
      { name: "Cloud/Systems", aliases: ["docker", "kubernetes", "k8s", "microservices", "grpc", "kafka", "redis", "postgres"] },
    ],
    minComponentsRequired: 2,
    derivedRoles: [
      "Golang Developer",
      "Go Backend Engineer",
      "Cloud Native Engineer",
      "Systems Engineer",
      "Backend Developer",
      "Software Development Engineer (SDE)",
    ],
    searchKeywords: ["Golang Developer", "Go Backend Engineer", "Systems Engineer"],
  },
  {
    id: "php_laravel",
    name: "PHP & Laravel Full Stack",
    category: "PHP Ecosystem",
    icon: "🐘",
    badgeColor: "rose",
    mandatoryComponents: ["Framework (Laravel)"],
    requiredComponents: [
      { name: "Language (PHP)", aliases: ["php"] },
      { name: "Framework (Laravel)", aliases: ["laravel", "symfony", "codeigniter"] },
      { name: "Database", aliases: ["mysql", "mariadb", "postgresql"] },
    ],
    minComponentsRequired: 2,
    derivedRoles: [
      "Laravel Developer",
      "PHP Full Stack Developer",
      "PHP Developer",
      "Full Stack Developer",
      "Backend Developer",
      "Software Development Engineer (SDE)",
    ],
    searchKeywords: ["Laravel Developer", "PHP Developer", "Full Stack Developer"],
  },
  {
    id: "ai_genai",
    name: "Generative AI & LLM Systems",
    category: "AI & Data",
    icon: "🧠",
    badgeColor: "purple",
    mandatoryComponents: ["AI/LLM Core"],
    requiredComponents: [
      { name: "AI/LLM Core", aliases: ["langchain", "llm", "generative ai", "genai", "rag", "vector database", "faiss", "openai", "huggingface", "llama"] },
      { name: "Language (Python)", aliases: ["python", "python3"] },
    ],
    minComponentsRequired: 2,
    derivedRoles: [
      "Generative AI Engineer",
      "AI / Machine Learning Engineer",
      "LLM Solutions Engineer",
      "Python AI Developer",
      "Software Development Engineer (SDE)",
    ],
    searchKeywords: ["Generative AI Engineer", "AI Engineer", "Machine Learning Engineer"],
  },
  {
    id: "ml_datascience",
    name: "Machine Learning & Data Science",
    category: "AI & Data",
    icon: "🤖",
    badgeColor: "indigo",
    mandatoryComponents: ["ML Libraries"],
    requiredComponents: [
      { name: "ML Libraries", aliases: ["pytorch", "tensorflow", "scikit-learn", "deep learning", "machine learning", "nlp", "computer vision"] },
      { name: "Data Analytics", aliases: ["pandas", "numpy", "matplotlib", "seaborn", "sql"] },
      { name: "Language", aliases: ["python", "r"] },
    ],
    minComponentsRequired: 2,
    derivedRoles: [
      "Machine Learning Engineer",
      "Data Scientist",
      "Data Analyst",
      "AI Engineer",
      "Python Developer",
      "Software Development Engineer (SDE)",
    ],
    searchKeywords: ["Machine Learning Engineer", "Data Scientist", "AI Engineer"],
  },
  {
    id: "data_engineering",
    name: "Data Engineering & Big Data",
    category: "Data Platforms",
    icon: "📊",
    badgeColor: "amber",
    mandatoryComponents: ["Big Data / ETL"],
    requiredComponents: [
      { name: "Big Data / ETL", aliases: ["spark", "pyspark", "kafka", "airflow", "hadoop", "dbt", "etl", "snowflake"] },
      { name: "Data Stores", aliases: ["sql", "postgresql", "bigquery", "redshift", "hive"] },
    ],
    minComponentsRequired: 2,
    derivedRoles: [
      "Data Engineer",
      "Big Data Engineer",
      "ETL Developer",
      "Data Platform Engineer",
      "Software Development Engineer (SDE)",
    ],
    searchKeywords: ["Data Engineer", "Big Data Developer", "ETL Engineer"],
  },
  {
    id: "devops_sre",
    name: "DevOps & Cloud Infrastructure",
    category: "Cloud & Infrastructure",
    icon: "☁️",
    badgeColor: "cyan",
    mandatoryComponents: ["Containers/K8s"],
    requiredComponents: [
      { name: "Containers/K8s", aliases: ["docker", "kubernetes", "k8s"] },
      { name: "Cloud Provider", aliases: ["aws", "azure", "gcp", "cloud", "amazon web services"] },
      { name: "IaC / CI-CD", aliases: ["terraform", "ci/cd", "jenkins", "github actions", "ansible", "linux"] },
    ],
    minComponentsRequired: 2,
    derivedRoles: [
      "DevOps Engineer",
      "Cloud Infrastructure Engineer",
      "Site Reliability Engineer (SRE)",
      "Platform Engineer",
      "Systems Engineer",
    ],
    searchKeywords: ["DevOps Engineer", "Cloud Engineer", "SRE", "Platform Engineer"],
  },
  {
    id: "mobile_dev",
    name: "Mobile App Development",
    category: "Mobile",
    icon: "📱",
    badgeColor: "pink",
    mandatoryComponents: ["Mobile Tech"],
    requiredComponents: [
      { name: "Mobile Tech", aliases: ["react native", "flutter", "dart", "swift", "kotlin", "android app", "ios app"] },
    ],
    minComponentsRequired: 1,
    derivedRoles: [
      "Mobile App Developer",
      "React Native Developer",
      "Flutter Developer",
      "Mobile Software Engineer",
      "Software Development Engineer (SDE)",
    ],
    searchKeywords: ["Mobile App Developer", "React Native Developer", "Flutter Developer"],
  },
  {
    id: "qa_sdet",
    name: "QA Automation & SDET",
    category: "Testing & Quality",
    icon: "🧪",
    badgeColor: "emerald",
    mandatoryComponents: ["Testing Tech"],
    requiredComponents: [
      { name: "Testing Tech", aliases: ["selenium", "cypress", "playwright", "jest", "junit", "postman", "automation testing", "test automation"] },
    ],
    minComponentsRequired: 1,
    derivedRoles: [
      "Software Development Engineer in Test (SDET)",
      "QA Automation Engineer",
      "Test Automation Engineer",
      "Quality Assurance Engineer",
    ],
    searchKeywords: ["SDET", "QA Automation Engineer", "Test Engineer"],
  },
  {
    id: "product_management",
    name: "Product & Program Management",
    category: "Product & Leadership",
    icon: "📋",
    badgeColor: "amber",
    mandatoryComponents: ["PM Skills"],
    requiredComponents: [
      { name: "PM Skills", aliases: ["product management", "prd", "roadmapping", "roadmap", "user stories", "agile", "scrum", "jira", "a/b testing", "product strategy"] },
    ],
    minComponentsRequired: 2,
    derivedRoles: [
      "Product Manager",
      "Associate Product Manager (APM)",
      "Technical Product Manager",
      "Product Owner",
      "Scrum Master",
    ],
    searchKeywords: ["Product Manager", "Associate Product Manager", "Technical Product Manager"],
  },
];

// Architectural Layer Definitions for Generic Inference
const ARCH_LAYERS = {
  FRONTEND: [
    "react", "react.js", "next.js", "vue", "vue.js", "angular", "svelte", "javascript",
    "typescript", "html", "html5", "css", "css3", "tailwind", "tailwind css", "bootstrap", "redux"
  ],
  BACKEND: [
    "node.js", "nodejs", "express", "express.js", "python", "django", "fastapi", "flask",
    "java", "spring boot", "spring", "golang", "c#", ".net", "asp.net", "php", "laravel",
    "ruby", "rails", "microservices", "rest api", "graphql", "grpc"
  ],
  DATABASE: [
    "mongodb", "postgresql", "postgres", "mysql", "redis", "dynamodb", "sql", "sqlite",
    "cassandra", "elasticsearch", "prisma", "mongoose", "sequelize"
  ],
  DEV_OPS: [
    "docker", "kubernetes", "k8s", "aws", "azure", "gcp", "terraform", "ci/cd", "jenkins", "linux"
  ],
  CORE_CODING: [
    "javascript", "typescript", "python", "java", "c++", "c#", "golang",
    "data structures", "algorithms", "dsa", "system design", "oop"
  ],
};

/**
 * Infer all applicable tech stacks, derived roles, and search terms from candidate skills and resume text
 * @param {Array<string>} candidateSkills - Explicit skills extracted from resume
 * @param {string} resumeText - Full parsed resume raw text
 * @returns {Object} Comprehensive stack inference and derived roles
 */
export function inferTechStacksAndRoles(candidateSkills = [], resumeText = "") {
  const normalizedText = (resumeText || "").toLowerCase();
  const normalizedSkillsSet = new Set(
    (candidateSkills || []).map((s) => (s || "").toLowerCase().trim()).filter(Boolean)
  );

  // Helper: check if alias is present in candidate skills or text with precise boundary handling
  const hasSkill = (alias) => {
    const a = alias.toLowerCase().trim();
    if (normalizedSkillsSet.has(a)) return true;

    const escaped = a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");

    // Check if any item in candidate's skills contains this alias as a bounded word
    for (const s of normalizedSkillsSet) {
      if (s === a || regex.test(s)) return true;
    }

    // Text match with strict word boundary
    return regex.test(normalizedText);
  };

  const detectedStacks = [];
  const derivedRolesSet = new Set();
  const derivedSearchKeywordsSet = new Set();
  const explanationBullets = [];

  // 1. Evaluate Named Tech Stacks
  for (const stack of TECH_STACK_DEFINITIONS) {
    const matchedComponents = [];
    for (const comp of stack.requiredComponents) {
      const isMatched = comp.aliases.some((alias) => hasSkill(alias));
      if (isMatched) {
        matchedComponents.push(comp.name);
      }
    }

    // Verify mandatory components if defined
    const hasAllMandatory = !stack.mandatoryComponents || stack.mandatoryComponents.every(
      (mComp) => matchedComponents.includes(mComp)
    );

    if (hasAllMandatory && matchedComponents.length >= stack.minComponentsRequired) {
      const confidence = Math.min(
        100,
        Math.round((matchedComponents.length / stack.requiredComponents.length) * 100)
      );

      detectedStacks.push({
        id: stack.id,
        name: stack.name,
        category: stack.category,
        icon: stack.icon,
        badgeColor: stack.badgeColor,
        confidence,
        matchedComponents,
        totalComponents: stack.requiredComponents.length,
        derivedRoles: stack.derivedRoles,
      });

      // Add all derived roles from this stack
      stack.derivedRoles.forEach((role) => derivedRolesSet.add(role));
      stack.searchKeywords.forEach((kw) => derivedSearchKeywordsSet.add(kw));

      explanationBullets.push(
        `Inferred ${stack.name} from: ${matchedComponents.join(" + ")}`
      );
    }
  }

  // 2. Generic Architectural Inference (Full Stack / Frontend / Backend / SDE)
  const hasFrontend = ARCH_LAYERS.FRONTEND.some((alias) => hasSkill(alias));
  const hasBackend = ARCH_LAYERS.BACKEND.some((alias) => hasSkill(alias));
  const hasDatabase = ARCH_LAYERS.DATABASE.some((alias) => hasSkill(alias));
  const hasCoreCoding = ARCH_LAYERS.CORE_CODING.some((alias) => hasSkill(alias));

  const hasFullStackCapabilities = hasFrontend && hasBackend && hasDatabase;

  if (hasFullStackCapabilities && !detectedStacks.some((s) => s.category === "Full Stack Web")) {
    detectedStacks.unshift({
      id: "general_full_stack",
      name: "Full Stack Web Development",
      category: "Full Stack Web",
      icon: "🌐",
      badgeColor: "purple",
      confidence: 90,
      matchedComponents: ["Frontend Layer", "Backend Server Layer", "Database Layer"],
      totalComponents: 3,
      derivedRoles: [
        "Full Stack Developer",
        "Full Stack Engineer",
        "Software Development Engineer (SDE)",
      ],
    });
    derivedRolesSet.add("Full Stack Developer");
    derivedRolesSet.add("Full Stack Engineer");
    derivedSearchKeywordsSet.add("Full Stack Developer");
  } else if (hasFullStackCapabilities) {
    derivedRolesSet.add("Full Stack Developer");
    derivedRolesSet.add("Full Stack Engineer");
    derivedSearchKeywordsSet.add("Full Stack Developer");
  }

  if (hasFrontend) {
    derivedRolesSet.add("Frontend Developer");
    derivedSearchKeywordsSet.add("Frontend Developer");
  }

  if (hasBackend) {
    derivedRolesSet.add("Backend Developer");
    derivedRolesSet.add("Backend Engineer");
    derivedSearchKeywordsSet.add("Backend Developer");
  }

  if (hasCoreCoding) {
    derivedRolesSet.add("Software Development Engineer (SDE)");
    derivedRolesSet.add("Software Engineer (SE)");
    derivedSearchKeywordsSet.add("Software Engineer");
  }

  // Sort detected stacks by confidence descending
  detectedStacks.sort((a, b) => b.confidence - a.confidence);

  const derivedRoleTitles = Array.from(derivedRolesSet);
  const derivedSearchKeywords = Array.from(derivedSearchKeywordsSet);

  return {
    inferredStacks: detectedStacks,
    primaryInferredStack: detectedStacks[0] || null,
    derivedRoleTitles,
    derivedSearchKeywords,
    explanationBullets,
    summary:
      detectedStacks.length > 0
        ? `Detected ${detectedStacks.map((s) => s.name).join(", ")} & derived ${derivedRoleTitles.length} matching roles.`
        : "General Software Engineering Profile.",
  };
}
