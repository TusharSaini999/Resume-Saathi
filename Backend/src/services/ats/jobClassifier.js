// Domain Tracks
export const DOMAIN_TRACKS = {
  TECH: {
    id: "tech",
    label: "Tech & Engineering",
    icon: "💻",
    description: "Software engineering, cloud infrastructure, AI/ML systems, and data platforms.",
  },
  MANAGEMENT: {
    id: "management",
    label: "Management & Product",
    icon: "👔",
    description: "Product management, technical program leadership, agile delivery, and business analytics.",
  },
};

export const ALL_TECH_SKILLS = [
  // Programming Languages
  "javascript", "typescript", "python", "java", "c++", "c#", ".net", "golang", "go",
  "rust", "php", "ruby", "swift", "kotlin", "dart", "sql", "r", "scala", "shell", "bash",

  // Frontend & UI
  "react", "react.js", "next.js", "vue", "vue.js", "angular", "svelte", "redux", "redux toolkit",
  "tailwind", "tailwind css", "bootstrap", "html", "html5", "css", "css3", "sass", "less",
  "webpack", "vite", "material ui", "chakra ui",

  // Backend & APIs
  "node.js", "nodejs", "express", "express.js", "nest.js", "nestjs", "spring boot", "django",
  "fastapi", "flask", "ruby on rails", "asp.net", "graphql", "rest api", "restful api",
  "grpc", "microservices", "websockets", "socket.io",

  // Databases & Storage
  "mongodb", "postgresql", "postgres", "mysql", "redis", "dynamodb", "cassandra",
  "elasticsearch", "sqlite", "prisma", "mongoose", "sequelize", "oracle db",

  // Cloud & DevOps
  "aws", "amazon web services", "azure", "gcp", "google cloud", "docker", "kubernetes",
  "k8s", "ci/cd", "github actions", "gitlab ci", "jenkins", "terraform", "ansible",
  "linux", "nginx", "apache", "serverless", "cloud computing",

  // Messaging & Streaming
  "kafka", "rabbitmq", "sqs", "sns",

  // AI, ML & Data
  "machine learning", "deep learning", "nlp", "llm", "generative ai", "langchain",
  "pytorch", "tensorflow", "keras", "pandas", "numpy", "scikit-learn", "data analysis",
  "computer vision",

  // Quality, Testing & Architecture
  "jest", "mocha", "cypress", "playwright", "selenium", "unit testing", "system design",
  "dsa", "data structures", "algorithms", "oop", "git", "github"
];

export const ALL_MANAGEMENT_SKILLS = [
  // Product Management & Strategy
  "product management", "product strategy", "roadmapping", "roadmap", "prd", "user stories",
  "wireframing", "a/b testing", "user research", "customer discovery", "kpis & okrs", "kpis",
  "okrs", "go-to-market", "gtm", "product analytics", "market analysis", "product owner",

  // Project & Program Management
  "project management", "program management", "tpm", "technical program management",
  "agile", "scrum", "scrum master", "jira", "confluence", "sprint planning",
  "agile coach", "delivery management", "risk management", "budgeting", "resource allocation",
  "pmp", "pmp certified", "milestone tracking", "scope management", "kanban",

  // Engineering & Tech Leadership
  "engineering management", "people management", "tech leadership", "hiring",
  "mentorship", "1-on-1s", "performance reviews", "team building", "cross-functional leadership",
  "stakeholder management", "stakeholder communication", "vendor management",

  // Business Analysis & Operations
  "business analysis", "requirement gathering", "brd", "process modeling", "workflow optimization",
  "gap analysis", "user acceptance testing", "uat", "operations management", "strategic planning",
  "cost reduction", "p&l", "excel modeling", "tableau", "power bi"
];

export const ALL_CAREER_SKILLS = [...ALL_TECH_SKILLS, ...ALL_MANAGEMENT_SKILLS];

export const CAREER_STREAMS = {
  // ─── TECH & ENGINEERING STREAMS ──────────────────────────────────
  FULL_STACK: {
    id: "full_stack",
    track: "tech",
    label: "Full Stack Development",
    icon: "🌐",
    description: "End-to-end web & software development covering both client and server architectures.",
    titleKeywords: ["full stack", "fullstack", "full stack developer", "full stack engineer", "fsd", "mern stack", "mean stack", "web developer"],
    skills: ["React", "Next.js", "Node.js", "Express", "MongoDB", "PostgreSQL", "MySQL", "JavaScript", "TypeScript", "HTML5", "CSS3", "Tailwind CSS", "REST APIs", "GraphQL"],
  },
  FRONTEND: {
    id: "frontend",
    track: "tech",
    label: "Frontend Development",
    icon: "🎨",
    description: "Modern user interfaces, responsive web apps, and rich browser interactions.",
    titleKeywords: ["frontend", "front-end", "front end", "ui developer", "react developer", "angular developer", "vue developer", "web designer"],
    skills: ["React", "Next.js", "Vue.js", "Angular", "JavaScript", "TypeScript", "HTML5", "CSS3", "Tailwind CSS", "Redux", "Redux Toolkit", "Webpack", "Vite", "Sass"],
  },
  BACKEND: {
    id: "backend",
    track: "tech",
    label: "Backend Engineering",
    icon: "⚙️",
    description: "High-throughput server architectures, microservices, databases, and core APIs.",
    titleKeywords: ["backend", "back-end", "back end", "systems engineer", "api engineer", "server", "core engineer", "backend developer", "backend engineer", "python developer", "java developer", "golang developer", "c++ developer", "node developer", "database engineer"],
    skills: ["Node.js", "Express", "Nest.js", "Spring Boot", "Java", "Python", "FastAPI", "Django", "Golang", "C++", "C#", ".NET", "Microservices", "MongoDB", "PostgreSQL", "MySQL", "Redis", "Kafka", "REST APIs", "GraphQL", "gRPC", "System Design"],
  },
  AI_ML: {
    id: "ai_ml",
    track: "tech",
    label: "AI, ML & Generative AI",
    icon: "🤖",
    description: "Artificial intelligence, deep learning, NLP, LLMs, LangChain, and predictive algorithms.",
    titleKeywords: ["ai", "machine learning", "ml engineer", "deep learning", "nlp", "llm", "generative ai", "computer vision", "artificial intelligence", "data scientist"],
    skills: ["Python", "PyTorch", "TensorFlow", "Keras", "Machine Learning", "Deep Learning", "NLP", "LLM", "Generative AI", "LangChain", "Scikit-Learn", "Pandas", "NumPy"],
  },
  DATA_SCIENCE: {
    id: "data_science",
    track: "tech",
    label: "Data Science & Analytics",
    icon: "📊",
    description: "Data intelligence, statistical modeling, data pipelines, and analytics visualization.",
    titleKeywords: ["data analyst", "data engineer", "bi engineer", "analytics", "business intelligence", "big data"],
    skills: ["Python", "SQL", "Pandas", "NumPy", "R", "Tableau", "Power BI", "Data Analysis", "Snowflake", "Spark", "PostgreSQL", "MySQL"],
  },
  DEVOPS_CLOUD: {
    id: "devops_cloud",
    track: "tech",
    label: "DevOps & Cloud Infrastructure",
    icon: "☁️",
    description: "Cloud systems, container orchestration, automated CI/CD pipelines, and infrastructure.",
    titleKeywords: ["devops", "cloud engineer", "sre", "site reliability", "platform engineer", "infrastructure", "systems admin"],
    skills: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Terraform", "Ansible", "Linux", "Jenkins", "GitHub Actions", "Nginx", "Shell", "Bash"],
  },
  MOBILE: {
    id: "mobile",
    track: "tech",
    label: "Mobile App Development",
    icon: "📱",
    description: "Cross-platform and native iOS/Android mobile applications.",
    titleKeywords: ["mobile", "android", "ios", "react native", "flutter", "app developer"],
    skills: ["React Native", "Flutter", "Dart", "Kotlin", "Swift", "Android", "iOS"],
  },

  // ─── MANAGEMENT & LEADERSHIP STREAMS ─────────────────────────────
  PRODUCT_MANAGEMENT: {
    id: "product_management",
    track: "management",
    label: "Product Management (PM)",
    icon: "📋",
    description: "Product strategy, user discovery, PRDs, feature roadmaps, metrics, and cross-functional leadership.",
    titleKeywords: [
      "product manager", "pm", "apm", "associate product manager", "senior product manager",
      "sr. product manager", "group product manager", "gpm", "principal product manager",
      "director of product", "head of product", "vp product", "product lead", "product owner"
    ],
    skills: [
      "Product Management", "Product Strategy", "Roadmapping", "PRD", "User Stories",
      "Wireframing", "A/B Testing", "Agile", "Scrum", "Jira", "User Research",
      "Customer Discovery", "KPIs & OKRs", "Go-To-Market (GTM)", "Stakeholder Management",
      "Product Analytics", "Market Analysis"
    ],
  },
  PROJECT_MANAGEMENT: {
    id: "project_management",
    track: "management",
    label: "Project & Program Management (TPM)",
    icon: "⏱️",
    description: "Technical program management, agile delivery, sprint cadence, risk mitigation, and milestone delivery.",
    titleKeywords: [
      "project manager", "technical project manager", "program manager", "technical program manager",
      "tpm", "scrum master", "agile coach", "delivery manager", "release manager", "project lead"
    ],
    skills: [
      "Project Management", "Technical Program Management", "Scrum Master", "Agile",
      "Sprint Planning", "Jira", "Confluence", "Risk Management", "Cross-functional Leadership",
      "Budgeting", "Resource Allocation", "PMP", "Milestone Tracking", "Scope Management"
    ],
  },
  ENGINEERING_MANAGEMENT: {
    id: "engineering_management",
    track: "management",
    label: "Engineering Leadership & EM",
    icon: "👔",
    description: "Leading software engineering teams, people mentorship, architecture governance, and engineering execution.",
    titleKeywords: [
      "engineering manager", "em", "tech lead manager", "tlm", "director of engineering",
      "vp engineering", "head of engineering", "engineering lead", "development manager"
    ],
    skills: [
      "Engineering Management", "People Management", "Tech Leadership", "Hiring & Mentorship",
      "System Architecture", "1-on-1 Coaching", "Performance Reviews", "Agile Execution",
      "Sprint Delivery", "Stakeholder Alignment", "Tech Strategy"
    ],
  },
  BUSINESS_ANALYST: {
    id: "business_analyst",
    track: "management",
    label: "Business & Product Analysis",
    icon: "📈",
    description: "Translating business goals into functional requirements, process modeling, and data-driven optimization.",
    titleKeywords: [
      "business analyst", "ba", "product analyst", "business systems analyst",
      "strategy analyst", "operations analyst", "functional consultant"
    ],
    skills: [
      "Business Analysis", "Requirement Gathering", "BRD", "Process Modeling",
      "Data Analysis", "SQL", "Tableau", "Excel", "User Acceptance Testing (UAT)",
      "Gap Analysis", "Stakeholder Communication", "Workflow Optimization"
    ],
  },
  OPERATIONS_MANAGEMENT: {
    id: "operations_management",
    track: "management",
    label: "Operations & General Management",
    icon: "🏢",
    description: "Operational excellence, supply chain execution, growth management, and vendor relations.",
    titleKeywords: [
      "operations manager", "general manager", "operations lead", "chief of staff",
      "growth manager", "business operations", "bizops", "category manager"
    ],
    skills: [
      "Operations Management", "Process Optimization", "Vendor Management", "Cost Reduction",
      "Supply Chain", "Cross-functional Execution", "Strategic Planning", "Team Leadership",
      "KPI Tracking"
    ],
  },
};

// Aliased export for compatibility
export const TECH_STREAMS = CAREER_STREAMS;

export function extractSkillsFromText(text) {
  if (!text) return [];
  const lower = text.toLowerCase();
  const found = new Set();

  for (const skill of ALL_CAREER_SKILLS) {
    const escaped = skill.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");
    if (regex.test(lower)) {
      if (skill === "nodejs" || skill === "node.js") found.add("Node.js");
      else if (skill === "react" || skill === "react.js") found.add("React");
      else if (skill === "next.js") found.add("Next.js");
      else if (skill === "vue" || skill === "vue.js") found.add("Vue.js");
      else if (skill === "express" || skill === "express.js") found.add("Express");
      else if (skill === "tailwind" || skill === "tailwind css") found.add("Tailwind CSS");
      else if (skill === "html" || skill === "html5") found.add("HTML5");
      else if (skill === "css" || skill === "css3") found.add("CSS3");
      else if (skill === "postgres" || skill === "postgresql") found.add("PostgreSQL");
      else if (skill === "restful api" || skill === "rest api") found.add("REST APIs");
      else if (skill === "golang" || skill === "go") found.add("Golang");
      else if (skill === "prd") found.add("PRD");
      else if (skill === "brd") found.add("BRD");
      else if (skill === "tpm") found.add("TPM");
      else if (skill === "pmp" || skill === "pmp certified") found.add("PMP");
      else if (skill === "uat") found.add("UAT");
      else if (skill === "kpis" || skill === "okrs" || skill === "kpis & okrs") found.add("KPIs & OKRs");
      else if (skill === "gtm" || skill === "go-to-market") found.add("Go-To-Market (GTM)");
      else {
        const formatted = skill
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
        found.add(formatted);
      }
    }
  }

  return Array.from(found);
}

export function detectStreamFromTextAndSkills(text = "", skills = []) {
  const lower = (text || "").toLowerCase();
  const skillsSet = new Set(skills.map((s) => s.toLowerCase()));

  const streamScores = [];
  let techScore = 0;
  let managementScore = 0;

  for (const key of Object.keys(CAREER_STREAMS)) {
    const stream = CAREER_STREAMS[key];
    let score = 0;

    // Check title keywords (weighted high: 10 pts)
    for (const kw of stream.titleKeywords) {
      if (lower.includes(kw)) {
        score += 10;
      }
    }

    // Check skill overlap (3 pts per skill)
    for (const skill of stream.skills) {
      if (skillsSet.has(skill.toLowerCase())) {
        score += 3;
      }
    }

    if (stream.track === "management") {
      managementScore += score;
    } else {
      techScore += score;
    }

    streamScores.push({ stream, score });
  }

  streamScores.sort((a, b) => b.score - a.score);

  // Detect Track (Tech vs Management)
  const hasMgmtTitle =
    lower.includes("product manager") ||
    lower.includes("project manager") ||
    lower.includes("program manager") ||
    lower.includes("scrum master") ||
    lower.includes("engineering manager") ||
    lower.includes("business analyst") ||
    lower.includes("operations manager") ||
    lower.includes("chief of staff");

  const hasTechTitle =
    lower.includes("software engineer") ||
    lower.includes("developer") ||
    lower.includes("sde") ||
    lower.includes("frontend") ||
    lower.includes("backend") ||
    lower.includes("full stack") ||
    lower.includes("devops");

  let detectedTrack = DOMAIN_TRACKS.TECH;
  if (hasMgmtTitle && !hasTechTitle) {
    detectedTrack = DOMAIN_TRACKS.MANAGEMENT;
  } else if (managementScore > techScore) {
    detectedTrack = DOMAIN_TRACKS.MANAGEMENT;
  } else {
    detectedTrack = DOMAIN_TRACKS.TECH;
  }

  const primary = streamScores[0]?.score > 0
    ? streamScores[0].stream
    : {
        id: "all",
        track: detectedTrack.id,
        label: detectedTrack.id === "management" ? "Management & Business" : "Technology & Engineering",
        icon: detectedTrack.id === "management" ? "👔" : "💻",
        description: "General profile across all domain opportunities",
      };

  const secondary =
    streamScores[1]?.score > 0 && streamScores[1].stream.id !== primary.id
      ? streamScores[1].stream
      : null;

  return {
    track: detectedTrack,
    primaryStream: primary,
    secondaryStream: secondary,
    streamScores: streamScores.slice(0, 4).map((s) => ({
      id: s.stream.id,
      track: s.stream.track,
      label: s.stream.label,
      icon: s.stream.icon,
      score: s.score,
    })),
  };
}

export function cleanHtmlToText(rawHtml = "") {
  if (!rawHtml) return "";

  let str = String(rawHtml);

  // If encoded entities exist (&lt;, &gt;, etc.), unescape them first so hidden tags are exposed to stripping
  if (str.includes("&lt;") || str.includes("&gt;")) {
    str = str
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&amp;/gi, "&");
  }

  return str
    // Remove scripts, styles, noscript, svg, nav, footer
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, " ")
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, " ")
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, " ")
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, " ")
    // Convert list items to bullet points
    .replace(/<li[^>]*>/gi, "\n• ")
    .replace(/<\/li>/gi, "\n")
    // Convert block elements to double newlines
    .replace(/<\/(h[1-6]|p|div|section|article)>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    // Strip remaining tags
    .replace(/<[^>]+>/g, " ")
    // Decode HTML entities
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    // Final pass to ensure no unescaped or residual HTML tags remain
    .replace(/<[^>]+>/g, " ")
    // Normalize newlines and whitespace
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n\s*\n+/g, "\n\n")
    .trim();
}

/**
 * Deep classification of candidate experience requirements: Fresher vs Professional
 */
export function classifyFresherVsProfessional(title = "", description = "", rawCommitment = "") {
  const t = (title || "").toLowerCase();
  const d = (description || "").toLowerCase();
  const c = (rawCommitment || "").toLowerCase();
  const combined = `${t} \n ${d} \n ${c}`;

  let isFresher = false;
  let candidateType = "Junior Professional (1-3 yrs)";
  let minYears = 1;
  let maxYears = 3;
  let eligibilityVerdict = "💼 Professional (1-3 yrs)";
  let fresherEligibilityReason = "";
  let matchedExperienceSnippet = "";

  // 1. Detect explicit years of experience patterns
  const rangeMatch = combined.match(/(\d+)\s*(?:-|to)\s*(\d+)\s*(?:\+)?\s*(?:years?|yrs?)(?:\s*(?:of)?\s*(?:experience|exp))?/i);
  const plusMatch = combined.match(/(\d+)\s*\+\s*(?:years?|yrs?)(?:\s*(?:of)?\s*(?:experience|exp))?/i);
  const singleYearMatch = combined.match(/(?:minimum|min|at least)?\s*(\d+)\s*(?:years?|yrs?)(?:\s*(?:of)?\s*(?:experience|exp))/i);

  if (rangeMatch) {
    minYears = parseInt(rangeMatch[1], 10);
    maxYears = parseInt(rangeMatch[2], 10);
    matchedExperienceSnippet = rangeMatch[0];
  } else if (plusMatch) {
    minYears = parseInt(plusMatch[1], 10);
    maxYears = minYears + 3;
    matchedExperienceSnippet = plusMatch[0];
  } else if (singleYearMatch) {
    minYears = parseInt(singleYearMatch[1], 10);
    maxYears = minYears + 2;
    matchedExperienceSnippet = singleYearMatch[0];
  }

  // 2. Identify Fresher Indicators
  const isInternship =
    t.includes("intern") ||
    t.includes("internship") ||
    t.includes("trainee") ||
    t.includes("apprentice") ||
    c.includes("intern");

  const fresherPhrases = [
    "fresher", "freshers", "freshers can apply", "freshers welcome", "entry level", "entry-level",
    "campus recruit", "campus placement", "college graduate", "university graduate", "recent graduate",
    "no prior experience", "no experience required", "intern", "internship", "trainee", "apprentice",
    "batch of 2024", "batch of 2025", "batch of 2026", "2024 passout", "2025 passout", "2026 passout",
    "graduating in 202", "associate software engineer", "sde 1", "sde i", "sde-1", "sde-i", "se 1",
    "0-1 year", "0 to 1 year", "0-1 yr", "0-2 years", "0 to 2 years"
  ];

  let detectedFresherClue = null;
  for (const phrase of fresherPhrases) {
    if (combined.includes(phrase)) {
      detectedFresherClue = phrase;
      break;
    }
  }

  // 3. Identify Senior / Lead / Principal Indicators
  const seniorTitles = [
    "senior", "sr.", "sr ", "lead", "principal", "staff", "architect",
    "director", "head", "group product manager", "engineering manager",
    "sde 3", "sde iii", "sde-3", "sde-iii"
  ];
  const isSeniorTitle = seniorTitles.some((s) => t.includes(s));

  if (minYears >= 5 || isSeniorTitle) {
    isFresher = false;
    candidateType = minYears >= 8 ? "Lead / Staff Professional (8+ yrs)" : "Senior Professional (5+ yrs)";
    minYears = Math.max(minYears, 5);
    maxYears = Math.max(maxYears, minYears + 3);
    eligibilityVerdict = `💼 Experienced Professional (${minYears}+ yrs)`;
    fresherEligibilityReason = `Requires established commercial track record (${matchedExperienceSnippet || `${minYears}+ years experience`}). Not suitable for freshers.`;
  } else if (
    minYears >= 3 ||
    t.includes("sde 2") ||
    t.includes("sde ii") ||
    t.includes("sde-2") ||
    t.includes("sde-ii") ||
    t.includes("mid-level")
  ) {
    isFresher = false;
    candidateType = "Mid-Level Professional (3-5 yrs)";
    minYears = Math.max(minYears, 3);
    maxYears = Math.max(maxYears, 5);
    eligibilityVerdict = `💼 Mid-Level Professional (${minYears}-${maxYears} yrs)`;
    fresherEligibilityReason = `Requires ${matchedExperienceSnippet || "3-5 years"} of professional commercial experience in software development.`;
  } else if (isInternship || detectedFresherClue || minYears === 0 || (minYears <= 1 && maxYears <= 2)) {
    isFresher = true;
    candidateType = "Fresher / Entry-Level (0-1 yr)";
    minYears = 0;
    maxYears = Math.min(maxYears, 1);
    eligibilityVerdict = "🌱 Fresher Friendly (0-1 yr)";
    fresherEligibilityReason = isInternship
      ? "Internship opening: Open to college students, recent graduates, and entry-level applicants."
      : detectedFresherClue
      ? `Explicitly open to freshers & entry-level candidates ("${detectedFresherClue}"). Academic projects, hands-on coursework, or personal portfolio are eligible.`
      : "Open to 0-1 years of experience, campus graduates, and entry-level talent.";
  } else {
    isFresher = false;
    candidateType = "Junior Professional (1-3 yrs)";
    minYears = Math.max(minYears, 1);
    maxYears = Math.max(maxYears, 3);
    eligibilityVerdict = `💼 Junior Professional (${minYears}-${maxYears} yrs)`;
    fresherEligibilityReason = `Requires ${matchedExperienceSnippet || "1-3 years"} of prior hands-on industry experience or production internships.`;
  }

  return {
    isFresher,
    candidateType,
    minYears,
    maxYears,
    eligibilityVerdict,
    fresherEligibilityReason,
    experienceQuote: matchedExperienceSnippet,
  };
}

/**
 * Parse any raw job description (HTML or text) into a rich, structured JD schema
 */
export function parseStructuredJD(title = "", description = "", rawHtml = "") {
  const cleanBody = rawHtml ? cleanHtmlToText(rawHtml) : cleanHtmlToText(description);
  const text = cleanBody || description || "";

  // 1. Classify Fresher vs Professional
  const experienceRequirement = classifyFresherVsProfessional(title, text);

  // 2. Identify Work Mode
  const lowerText = text.toLowerCase();
  let workMode = "Flexible / Hybrid";
  if (
    lowerText.includes("100% remote") ||
    lowerText.includes("remote first") ||
    lowerText.includes("work from home") ||
    lowerText.includes("wfh") ||
    title.toLowerCase().includes("remote")
  ) {
    workMode = "Remote";
  } else if (lowerText.includes("hybrid") || lowerText.includes("days in office")) {
    workMode = "Hybrid";
  } else if (lowerText.includes("on-site") || lowerText.includes("onsite") || lowerText.includes("in-office")) {
    workMode = "On-site";
  }

  // 3. Extract sections by headings & bullet points
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  const sections = {
    summary: [],
    responsibilities: [],
    qualifications: [],
    preferred: [],
    education: [],
  };

  let currentSection = "summary";

  // Prioritize specific keywords first (preferred BEFORE qualifications)
  const headerKeywords = [
    {
      type: "preferred",
      patterns: ["preferred", "nice to have", "bonus points", "bonus qualifications", "good to have", "desired skills"],
    },
    {
      type: "education",
      patterns: ["education", "academic background", "degree requirement", "educational qualification"],
    },
    {
      type: "responsibilities",
      patterns: ["responsibilit", "what you'll do", "what you will do", "role overview", "duties", "your mission", "day to day", "what you'll be doing"],
    },
    {
      type: "qualifications",
      patterns: ["requirements", "what we're looking for", "who you are", "qualifications", "what you bring", "must have", "basic qualifications", "minimum qualifications", "skills required"],
    },
  ];

  for (const rawLine of lines) {
    let line = rawLine
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/^[•\-\*\d\.\)]\s*/, "")
      .replace(/[ \t]+/g, " ")
      .trim();

    // Discard empty lines or lines that are just numbers/tag leftovers (like "ul1", "li1", "p1", "1", "2")
    if (!line || line.length < 3 || /^(ul\d*|li\d*|p\d*|\d+)$/i.test(line)) continue;

    const lowerLine = line.toLowerCase();

    // Check if line looks like a section header
    let matchedHeader = null;
    if (line.length < 65) {
      for (const h of headerKeywords) {
        if (h.patterns.some((p) => lowerLine.includes(p))) {
          matchedHeader = h.type;
          break;
        }
      }
    }

    if (matchedHeader) {
      currentSection = matchedHeader;
      continue;
    }

    // Add line to appropriate section
    if (currentSection === "responsibilities") {
      sections.responsibilities.push(line);
    } else if (currentSection === "qualifications") {
      if (
        lowerLine.includes("b.tech") ||
        lowerLine.includes("bachelor") ||
        lowerLine.includes("mca") ||
        lowerLine.includes("degree in computer science") ||
        lowerLine.includes("b.e.")
      ) {
        sections.education.push(line);
      } else {
        sections.qualifications.push(line);
      }
    } else if (currentSection === "preferred") {
      sections.preferred.push(line);
    } else if (currentSection === "education") {
      sections.education.push(line);
    } else {
      if (sections.summary.length < 3) {
        sections.summary.push(line);
      }
    }
  }

  // 4. Extract tech stack & tools (filter out generic HR terms like 'Hiring' for tech roles)
  const rawSkills = extractSkillsFromText(`${title} ${text}`);
  const nonTechFilterWords = new Set(["hiring", "job", "team", "work", "responsibilities"]);
  const extractedSkills = rawSkills.filter((s) => !nonTechFilterWords.has(s.toLowerCase()));

  // Fallbacks if sections were sparse
  if (sections.responsibilities.length === 0) {
    sections.responsibilities = [
      `Design, build, and deploy production-ready software solutions for ${title}.`,
      "Write clean, maintainable, modular, and thoroughly tested code.",
      "Collaborate cross-functionally with product managers, designers, and engineering peers.",
      "Identify bottlenecks, resolve bugs, and optimize application throughput and reliability.",
    ];
  }

  if (sections.qualifications.length === 0) {
    sections.qualifications = [
      `Proven experience with core engineering principles: ${extractedSkills.slice(0, 5).join(", ") || "software design and modern tools"}.`,
      experienceRequirement.isFresher
        ? "0-1 years of experience or strong academic portfolio of full-stack / software projects."
        : `Minimum ${experienceRequirement.minYears}+ years of commercial software engineering experience.`,
      "Solid foundation in data structures, algorithms, and modular system design.",
    ];
  }

  if (sections.education.length === 0) {
    const eduMatch = text.match(/(?:\b(?:b\.?tech|b\.?e|m\.?c\.?a|b\.?c\.?a|b\.?s|master'?s|bachelor'?s)\b)[^.\n]*/i);
    if (eduMatch && !/\b(?:believe|benefit|better|between|before)\b/i.test(eduMatch[0])) {
      sections.education.push(eduMatch[0].trim());
    } else {
      sections.education.push("Bachelor's or Master's degree in Computer Science, Engineering, IT, or equivalent practical experience.");
    }
  }

  return {
    roleTitle: title,
    experienceRequirement,
    summary:
      sections.summary.join(" ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() ||
      `${title} opening. See responsibilities, qualification criteria, and tech stack details below.`,
    keyResponsibilities: sections.responsibilities.slice(0, 8),
    requiredQualifications: sections.qualifications.slice(0, 8),
    preferredQualifications: sections.preferred.slice(0, 6),
    educationRequirements: sections.education.slice(0, 3),
    techStack: extractedSkills,
    workMode,
    fullText: text,
  };
}

export function classifyJobTypeAndExperience(title = "", description = "", rawCommitment = "") {
  const t = (title || "").toLowerCase();
  const d = (description || "").toLowerCase();
  const c = (rawCommitment || "").toLowerCase();
  const combined = `${t} ${d} ${c}`;

  // 1. Employment Type Classification
  let employmentType = "Full-time";
  if (
    t.includes("intern") ||
    t.includes("internship") ||
    t.includes("trainee") ||
    t.includes("apprentice") ||
    t.includes("co-op") ||
    t.includes("fellowship") ||
    c.includes("intern") ||
    d.includes("internship opportunity") ||
    d.includes("summer intern")
  ) {
    employmentType = "Internship";
  } else if (
    t.includes("contract") ||
    t.includes("freelance") ||
    t.includes("temporary") ||
    t.includes("part-time") ||
    t.includes("part time") ||
    c.includes("contract") ||
    c.includes("part-time")
  ) {
    employmentType = "Contract";
  }

  // 2. Comprehensive Fresher vs Professional Classification
  const fresherClassification = classifyFresherVsProfessional(title, description, rawCommitment);

  // 3. Required Skill extraction
  const requiredSkills = extractSkillsFromText(combined);

  // 4. Stream detection for this specific job
  const streamInfo = detectStreamFromTextAndSkills(title, requiredSkills);

  // 5. Pre-generate structured JD
  const structuredJD = parseStructuredJD(title, description);

  return {
    employmentType,
    experienceLevel: fresherClassification.isFresher
      ? "Fresher / Entry-Level (0-1 yr)"
      : fresherClassification.candidateType,
    minExperienceYears: fresherClassification.minYears,
    maxExperienceYears: fresherClassification.maxYears,
    isFresherFriendly: fresherClassification.isFresher,
    candidateType: fresherClassification.candidateType,
    eligibilityVerdict: fresherClassification.eligibilityVerdict,
    fresherEligibilityReason: fresherEligibilityReasonToString(fresherClassification),
    structuredJD,
    requiredSkills,
    track: streamInfo.track,
    stream: streamInfo.primaryStream,
  };
}

function fresherEligibilityReasonToString(fc) {
  return fc.fresherEligibilityReason || (fc.isFresher ? "Open to Freshers (0-1 yr)" : `Requires ${fc.minYears}+ yrs experience`);
}

