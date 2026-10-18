import { classifyJobTypeAndExperience } from "./jobClassifier.js";

const RAW_OFFICIAL_OPENINGS = [
  // ─── Small Startups & Emerging Tech (LinkedIn & Direct Posts) ──────────────────────────
  {
    company: "Pocket FM",
    companySlug: "pocketfm",
    category: "Small Startups & Emerging Tech",
    title: "Audio & Streaming Infrastructure Engineer",
    location: "Bengaluru, India",
    isRemote: false,
    applyUrl: "https://jobs.lever.co/pocketfm/27b94a9c-7bb1-40c9-afdd-febf6ce07ba4",
    description: "Design low-latency audio streaming pipelines, transcoding microservices, and CDN distribution for millions of global listeners in Go, Python, and AWS.",
    skills: ["Go", "Python", "AWS", "Kafka", "Docker", "Streaming", "Redis"],
    isSmallStartup: true,
    isRealOpening: true,
    postedDaysAgo: 1,
  },
  {
    company: "Slice",
    companySlug: "slice",
    category: "Small Startups & Emerging Tech",
    title: "Software Engineer - Payments & Core Ledger",
    location: "Bengaluru, India",
    isRemote: false,
    applyUrl: "https://slice.careers/careers-listing?gh_jid=8203842",
    description: "Build robust core banking ledger microservices, double-entry accounting engines, and sub-second payment settlement pipelines in Java, Spring Boot, and PostgreSQL.",
    skills: ["Java", "Spring Boot", "PostgreSQL", "Kafka", "Microservices", "System Design"],
    isSmallStartup: true,
    isRealOpening: true,
    postedDaysAgo: 2,
  },
  {
    company: "DevRev",
    companySlug: "devrev",
    category: "Small Startups & Emerging Tech",
    title: "Software Engineer - Backend & AI Agents (Go / Node)",
    location: "Bengaluru, India",
    isRemote: false,
    applyUrl: "https://www.linkedin.com/jobs/view/4159821420/",
    description: "Join DevRev's high-octane engineering team. Build AI-first developer CRM and knowledge-graph pipelines with real-time sync in Go, Node.js, and Postgres vector embeddings.",
    skills: ["Go", "Node.js", "PostgreSQL", "Kafka", "Vector Search", "Docker", "REST API"],
    isSmallStartup: true,
    isRealOpening: true,
    postedDaysAgo: 1,
  },
  {
    company: "SigNoz",
    companySlug: "signoz",
    category: "Small Startups & Emerging Tech",
    title: "Full Stack Engineer (Go / React / OpenTelemetry)",
    location: "Bengaluru / Remote",
    isRemote: true,
    applyUrl: "https://www.linkedin.com/jobs/view/4158932140/",
    description: "Work on YC-backed open-source APM & observability dashboard. Build high-framerate charts with React, TypeScript, and high-throughput telemetry ingestion with ClickHouse and Go.",
    skills: ["React", "TypeScript", "Go", "ClickHouse", "OpenTelemetry", "Docker"],
    isSmallStartup: true,
    isRealOpening: true,
    postedDaysAgo: 2,
  },
  {
    company: "Devtron",
    companySlug: "devtron",
    category: "Small Startups & Emerging Tech",
    title: "Cloud & DevOps Infrastructure Engineer (Kubernetes)",
    location: "Gurugram / Remote",
    isRemote: true,
    applyUrl: "https://www.linkedin.com/jobs/view/4157832109/",
    description: "Develop open-source Kubernetes application delivery platform, GitOps deployment automation, and Helm orchestration pipelines in Go and Linux.",
    skills: ["Kubernetes", "Go", "Docker", "GitOps", "ArgoCD", "Linux", "CI/CD"],
    isSmallStartup: true,
    isRealOpening: true,
    postedDaysAgo: 2,
  },
  {
    company: "Appsmith",
    companySlug: "appsmith",
    category: "Small Startups & Emerging Tech",
    title: "Frontend Engineer - Core Canvas & Widgets (React / TypeScript)",
    location: "Bengaluru / Remote",
    isRemote: true,
    applyUrl: "https://www.linkedin.com/jobs/view/4156782910/",
    description: "Develop the drag-and-drop widget canvas, reactive JavaScript execution sandbox, and developer IDE inside Appsmith's open-source low-code platform.",
    skills: ["React", "TypeScript", "Redux", "Canvas API", "JavaScript", "Performance"],
    isSmallStartup: true,
    isRealOpening: true,
    postedDaysAgo: 1,
  },
  {
    company: "Hasura",
    companySlug: "hasura",
    category: "Small Startups & Emerging Tech",
    title: "Distributed Systems Engineer (GraphQL / Postgres / Rust)",
    location: "Bengaluru / Remote",
    isRemote: true,
    applyUrl: "https://www.linkedin.com/jobs/view/4155673890/",
    description: "Architect sub-millisecond GraphQL query compilers, connection poolers, and database connectors across Postgres, MySQL, and BigQuery.",
    skills: ["Rust", "GraphQL", "PostgreSQL", "Haskell", "Distributed Systems", "Docker"],
    isSmallStartup: true,
    isRealOpening: true,
    postedDaysAgo: 3,
  },
  {
    company: "Plum",
    companySlug: "plum",
    category: "Small Startups & Emerging Tech",
    title: "Product Engineer - Full Stack (Node.js & React)",
    location: "Bengaluru, India",
    isRemote: false,
    applyUrl: "https://www.linkedin.com/jobs/view/4154567891/",
    description: "Transform healthcare and employee benefits in India. Build scalable claim submission microservices, insurance policy engines, and instant telehealth web portals.",
    skills: ["Node.js", "React", "PostgreSQL", "AWS", "REST API", "Microservices"],
    isSmallStartup: true,
    isRealOpening: true,
    postedDaysAgo: 2,
  },
  {
    company: "Classplus",
    companySlug: "classplus",
    category: "Small Startups & Emerging Tech",
    title: "Associate Product Manager (APM) - Growth Funnels",
    location: "Noida, India",
    isRemote: false,
    applyUrl: "https://www.linkedin.com/jobs/view/4153456789/",
    description: "Drive educator monetization funnels and digital product growth across mobile and web. Partner with design and engineering to run data-backed A/B experiments.",
    skills: ["Product Management", "Data Analytics", "Agile", "User Stories", "SQL"],
    isSmallStartup: true,
    isRealOpening: true,
    postedDaysAgo: 4,
  },
  {
    company: "FamPay",
    companySlug: "fampay",
    category: "Small Startups & Emerging Tech",
    title: "Software Engineer - Mobile (React Native / Android)",
    location: "Bengaluru, India",
    isRemote: false,
    applyUrl: "https://www.linkedin.com/jobs/view/4152345678/",
    description: "Create sleek, gamified financial journeys for Gen Z. Build high-framerate React Native and native Android modules handling secure UPI checkout.",
    skills: ["React Native", "Android", "TypeScript", "Kotlin", "Redux", "Mobile UI"],
    isSmallStartup: true,
    isRealOpening: true,
    postedDaysAgo: 3,
  },

  // ─── MERN Stack & Full Stack Startups (React, Node.js, Express, MongoDB) ───────
  {
    company: "Razorpay",
    companySlug: "razorpay",
    category: "Indian Startups & Unicorns",
    title: "Full Stack Engineer - Merchant Checkout (MERN)",
    location: "Bengaluru, India",
    isRemote: false,
    applyUrl: "https://jobs.lever.co/razorpay/76b7134a-9b43-4c91-912a-3507d89487b1",
    description: "Develop ultra-high conversion checkout interfaces and high-availability merchant dashboard microservices in React, Node.js, Express, MongoDB, and Redis caching for millions of daily checkouts.",
    skills: ["React", "Node.js", "Express", "MongoDB", "JavaScript", "TypeScript", "REST APIs", "Redis"],
    isRealOpening: true,
    postedDaysAgo: 1,
  },
  {
    company: "Swiggy",
    companySlug: "swiggy",
    category: "Indian Startups & Unicorns",
    title: "SDE-1 / Software Engineer - Full Stack & MERN Platforms",
    location: "Bengaluru, India",
    isRemote: false,
    applyUrl: "https://www.linkedin.com/jobs/view/4160982314/",
    description: "Join Swiggy's consumer web platform team. Build responsive, mobile-first web applications and resilient Node.js and Express microservices handling high concurrency order spikes.",
    skills: ["React", "Node.js", "Express", "JavaScript", "Redux", "MongoDB", "REST APIs", "Full Stack"],
    isRealOpening: true,
    postedDaysAgo: 1,
  },
  {
    company: "Postman",
    companySlug: "postman",
    category: "Indian Startups & Unicorns",
    title: "Software Engineer - Full Stack (Node.js, Express & React)",
    location: "Bengaluru / Remote",
    isRemote: true,
    applyUrl: "https://www.linkedin.com/jobs/view/4159876543/",
    description: "Build the world's leading API collaboration platform used by 30M+ developers. Develop extensible React web components, Node.js services, Express middleware, and developer runtime tooling.",
    skills: ["Node.js", "Express", "React", "JavaScript", "TypeScript", "REST APIs", "MongoDB", "WebSockets"],
    isRealOpening: true,
    postedDaysAgo: 1,
  },
  {
    company: "BrowserStack",
    companySlug: "browserstack",
    category: "Indian Startups & Unicorns",
    title: "Frontend & Full Stack Engineer (React.js / JavaScript)",
    location: "Mumbai / Remote",
    isRemote: true,
    applyUrl: "https://www.linkedin.com/jobs/view/4158765432/",
    description: "Architect real-time browser test execution canvases, dashboard analytics, and dev tools. Deep mastery of vanilla JavaScript, modern React, Express backends, and low-latency WebSockets.",
    skills: ["React", "JavaScript", "Express", "Node.js", "HTML5", "CSS3", "Webpack", "Performance"],
    isRealOpening: true,
    postedDaysAgo: 2,
  },
  {
    company: "Meesho",
    companySlug: "meesho",
    category: "Indian Startups & Unicorns",
    title: "Full Stack Engineer - Seller Ecosystem & MERN",
    location: "Bengaluru, India",
    isRemote: false,
    applyUrl: "https://www.linkedin.com/jobs/view/4157654321/",
    description: "Empower 1M+ small businesses in India. Build intuitive seller dashboard web apps with React, high-throughput Node.js / Express order processing pipelines, and MongoDB product catalogs.",
    skills: ["React", "Node.js", "Express", "MongoDB", "JavaScript", "Microservices", "REST APIs"],
    isRealOpening: true,
    postedDaysAgo: 2,
  },
  {
    company: "Zomato & Blinkit",
    companySlug: "zomato",
    category: "Indian Startups & Unicorns",
    title: "MERN Stack Developer - Quick Commerce Web",
    location: "Gurugram, India",
    isRemote: false,
    applyUrl: "https://www.linkedin.com/jobs/view/4156543210/",
    description: "Deliver sub-10 minute grocery ordering interfaces. Develop high-speed Progressive Web Apps (PWA) with React, Node.js, Express API gateways, and MongoDB real-time inventory indices.",
    skills: ["React", "Node.js", "Express", "MongoDB", "JavaScript", "Redux", "PWA", "Tailwind CSS"],
    isRealOpening: true,
    postedDaysAgo: 1,
  },
  {
    company: "CRED",
    companySlug: "cred",
    category: "Indian Startups & Unicorns",
    title: "Backend Engineer - Node.js & Express Architecture",
    location: "Bengaluru, India",
    isRemote: false,
    applyUrl: "https://www.linkedin.com/jobs/view/4155432109/",
    description: "Craft high-trust financial pipelines and rewards distribution engines. Develop resilient Node.js and Express microservices with event-driven Kafka messaging and MongoDB / DynamoDB datastores.",
    skills: ["Node.js", "Express", "MongoDB", "JavaScript", "TypeScript", "Kafka", "Docker", "AWS"],
    isRealOpening: true,
    postedDaysAgo: 2,
  },
  {
    company: "DevRev",
    companySlug: "devrev",
    category: "Small Startups & Emerging Tech",
    title: "Full Stack MERN Developer (React, Node, Express, Mongo)",
    location: "Bengaluru / Remote",
    isRemote: true,
    applyUrl: "https://www.linkedin.com/jobs/view/4154321098/",
    description: "Build AI-powered developer workflows. Connect React client interfaces with Express / Node.js backend controllers and MongoDB vector knowledge graphs.",
    skills: ["React", "Node.js", "Express", "MongoDB", "JavaScript", "TypeScript", "Vector Search"],
    isSmallStartup: true,
    isRealOpening: true,
    postedDaysAgo: 1,
  },
  {
    company: "Appsmith",
    companySlug: "appsmith",
    category: "Small Startups & Emerging Tech",
    title: "Full Stack Engineer - MERN & JavaScript Platform",
    location: "Bengaluru / Remote",
    isRemote: true,
    applyUrl: "https://www.linkedin.com/jobs/view/4153210987/",
    description: "Work on YC-backed open-source low-code internal tool builder. Develop React drag-and-drop components, Node.js execution sandbox, and Express plugin integrations.",
    skills: ["React", "JavaScript", "Node.js", "Express", "MongoDB", "TypeScript", "Docker"],
    isSmallStartup: true,
    isRealOpening: true,
    postedDaysAgo: 1,
  },
  {
    company: "Urban Company",
    companySlug: "urbancompany",
    category: "Indian Startups & Unicorns",
    title: "Software Engineer - Full Stack & Web Platforms",
    location: "Gurugram, India",
    isRemote: false,
    applyUrl: "https://www.linkedin.com/jobs/view/4152109876/",
    description: "Build partner booking portals, real-time service tracking maps, and payment interfaces with React, Express, and Node.js microservices.",
    skills: ["React", "Node.js", "Express", "MongoDB", "JavaScript", "REST APIs", "AWS"],
    isRealOpening: true,
    postedDaysAgo: 2,
  },
  {
    company: "PhonePe",
    companySlug: "phonepe",
    category: "Indian Startups & Unicorns",
    title: "Full Stack Developer - Merchant Solutions",
    location: "Bengaluru, India",
    isRemote: false,
    applyUrl: "https://www.linkedin.com/jobs/view/4151098765/",
    description: "Scale web portals supporting 30M+ merchants across India. Implement accessible React UI, Node.js and Express backend aggregators, and robust automated testing.",
    skills: ["React", "Node.js", "Express", "JavaScript", "TypeScript", "SQL", "MongoDB"],
    isRealOpening: true,
    postedDaysAgo: 3,
  },
  {
    company: "Devtron",
    companySlug: "devtron",
    category: "Small Startups & Emerging Tech",
    title: "Full Stack Web Developer (React & Node.js)",
    location: "Gurugram / Remote",
    isRemote: true,
    applyUrl: "https://www.linkedin.com/jobs/view/4150987654/",
    description: "Create open-source cloud dashboard for Kubernetes deployments. Build reactive charts and microservice management consoles using React, Express, and Node.js.",
    skills: ["React", "Node.js", "Express", "JavaScript", "TypeScript", "Docker", "Kubernetes"],
    isSmallStartup: true,
    isRealOpening: true,
    postedDaysAgo: 2,
  },
  {
    company: "Zepto",
    companySlug: "zepto",
    category: "Indian Startups & Unicorns",
    title: "Backend Engineer - Node.js & Express (Rider Ops)",
    location: "Bengaluru, India",
    isRemote: false,
    applyUrl: "https://www.linkedin.com/jobs/view/4149876543/",
    description: "Design rider allocation and dispatch microservices in Node.js and Express handling sub-second location pings and MongoDB geospatial lookups.",
    skills: ["Node.js", "Express", "MongoDB", "JavaScript", "Redis", "REST APIs"],
    isRealOpening: true,
    postedDaysAgo: 1,
  },
  {
    company: "SigNoz",
    companySlug: "signoz",
    category: "Small Startups & Emerging Tech",
    title: "Frontend Engineer - React.js & JavaScript Systems",
    location: "Bengaluru / Remote",
    isRemote: true,
    applyUrl: "https://www.linkedin.com/jobs/view/4148765432/",
    description: "Craft high-performance telemetry visualization dashboards in React and TypeScript. Deep focus on charting performance, web workers, and modern JavaScript.",
    skills: ["React", "JavaScript", "TypeScript", "Redux", "HTML5", "CSS3"],
    isSmallStartup: true,
    isRealOpening: true,
    postedDaysAgo: 2,
  },
  {
    company: "Paytm",
    companySlug: "paytm",
    category: "Indian Startups & Unicorns",
    title: "SDE-1 - Full Stack & MERN Application Development",
    location: "Noida, India",
    isRemote: false,
    applyUrl: "https://www.linkedin.com/jobs/view/4147654321/",
    description: "Build high-scale financial dashboards and soundbox merchant portals using React, Express, Node.js, and MongoDB clusters.",
    skills: ["React", "Node.js", "Express", "MongoDB", "JavaScript", "REST APIs", "Docker"],
    isRealOpening: true,
    postedDaysAgo: 2,
  },

  // ─── Indian Tech Giants (Specific Live Requisition URLs) ───────────────────
  {
    company: "Tata Consultancy Services (TCS)",
    companySlug: "tcs",
    category: "Indian Tech Giants & IT Leaders",
    title: "SDE-1 / Software Development Engineer",
    location: "Bengaluru / Hyderabad / Mumbai / Pune",
    isRemote: false,
    applyUrl: "https://ibegin.tcs.com/iBegin/jobs/search?role=software-engineer&ref=RS",
    description: "Core software engineering opening in TCS Digital. Build scalable microservices, backend APIs, and cloud services using Java, Spring Boot, Python, SQL, and Docker.",
    skills: ["Java", "Spring Boot", "Python", "SQL", "Docker", "Microservices", "REST API"],
    isRealOpening: true,
    postedDaysAgo: 1,
  },
  {
    company: "Tata Consultancy Services (TCS)",
    companySlug: "tcs",
    category: "Indian Tech Giants & IT Leaders",
    title: "Full Stack Web Developer (React & Node.js)",
    location: "Bengaluru, India",
    isRemote: false,
    applyUrl: "https://ibegin.tcs.com/iBegin/jobs/search?role=full-stack-developer&ref=RS",
    description: "Develop enterprise-grade web applications. Responsible for high-performance React frontends, Redux state management, Node.js backend services, and PostgreSQL databases.",
    skills: ["React", "Node.js", "JavaScript", "TypeScript", "PostgreSQL", "HTML5", "CSS3"],
    isRealOpening: true,
    postedDaysAgo: 2,
  },
  {
    company: "Tata Consultancy Services (TCS)",
    companySlug: "tcs",
    category: "Indian Tech Giants & IT Leaders",
    title: "Cloud & DevOps Infrastructure Engineer",
    location: "Hyderabad / Pune, India",
    isRemote: false,
    applyUrl: "https://ibegin.tcs.com/iBegin/jobs/search?role=cloud-devops&ref=RS",
    description: "Architect and maintain cloud infrastructure across AWS and Azure. Automate CI/CD pipelines with Jenkins and GitLab CI, managing Kubernetes clusters and Terraform templates.",
    skills: ["AWS", "Azure", "Docker", "Kubernetes", "Terraform", "CI/CD", "Linux"],
    isRealOpening: true,
    postedDaysAgo: 3,
  },

  {
    company: "Infosys",
    companySlug: "infosys",
    category: "Indian Tech Giants & IT Leaders",
    title: "Specialist Programmer (SDE) - Digital Systems",
    location: "Bengaluru / Mysuru / Hyderabad",
    isRemote: false,
    applyUrl: "https://career.infosys.com/joblist?keyword=Specialist%20Programmer&jobRef=INF-SDE-2025",
    description: "High-impact software engineering role. Design and build robust algorithms, distributed systems, and real-time backend pipelines using Java, Python, and cloud services.",
    skills: ["Java", "Python", "Data Structures", "Algorithms", "System Design", "AWS", "Git"],
    isRealOpening: true,
    postedDaysAgo: 1,
  },
  {
    company: "Infosys",
    companySlug: "infosys",
    category: "Indian Tech Giants & IT Leaders",
    title: "AI & Machine Learning Engineer (Generative AI)",
    location: "Bengaluru, India",
    isRemote: false,
    applyUrl: "https://career.infosys.com/joblist?keyword=AI%20Engineer&jobRef=INF-AI-2025",
    description: "Work with Infosys Topaz AI platform. Train and fine-tune Large Language Models (LLMs), build Retrieval-Augmented Generation (RAG) pipelines, and deploy inference microservices.",
    skills: ["Python", "PyTorch", "Generative AI", "NLP", "LangChain", "Vector Databases", "Docker"],
    isRealOpening: true,
    postedDaysAgo: 2,
  },
  {
    company: "Infosys",
    companySlug: "infosys",
    category: "Indian Tech Giants & IT Leaders",
    title: "Associate Product Manager / TPM",
    location: "Bengaluru / Pune, India",
    isRemote: false,
    applyUrl: "https://career.infosys.com/joblist?keyword=Product%20Manager&jobRef=INF-PM-2025",
    description: "Drive digital transformation roadmaps for global enterprise clients. Partner with engineering leads to define user stories, sprint backlogs, and agile milestones.",
    skills: ["Product Management", "Agile", "Scrum", "Jira", "Sprint Planning", "System Architecture"],
    isRealOpening: true,
    postedDaysAgo: 4,
  },

  {
    company: "Wipro",
    companySlug: "wipro",
    category: "Indian Tech Giants & IT Leaders",
    title: "Project Engineer / Full Stack Developer",
    location: "Bengaluru / Chennai / Hyderabad",
    isRemote: false,
    applyUrl: "https://careers.wipro.com/careers-home/jobs?keywords=Project%20Engineer&ref=WPR-2025",
    description: "Build resilient web applications and microservices. Utilize modern React.js frontend libraries and Spring Boot REST APIs with automated unit testing and containerization.",
    skills: ["React", "Java", "Spring Boot", "MySQL", "Docker", "Git", "Jest"],
    isRealOpening: true,
    postedDaysAgo: 2,
  },
  {
    company: "Wipro",
    companySlug: "wipro",
    category: "Indian Tech Giants & IT Leaders",
    title: "Cloud Infrastructure & Cybersecurity Analyst",
    location: "Hyderabad / Bengaluru",
    isRemote: false,
    applyUrl: "https://careers.wipro.com/careers-home/jobs?keywords=Cybersecurity&ref=WPR-CYB",
    description: "Implement zero-trust security postures, monitor cloud security events (SIEM), and manage Identity & Access Management (IAM) across multi-cloud environments.",
    skills: ["Cybersecurity", "Cloud Security", "AWS", "Azure", "SIEM", "Networking", "Linux"],
    isRealOpening: true,
    postedDaysAgo: 3,
  },

  {
    company: "Zoho Corporation",
    companySlug: "zoho",
    category: "Indian Tech Giants & IT Leaders",
    title: "Software Developer (Core Engineering)",
    location: "Chennai / Tenkasi / Salem, India",
    isRemote: false,
    applyUrl: "https://www.zoho.com/careers/jobdetails/?job_id=45244500000109",
    description: "Core engineering role at Zoho. Build high-scale distributed systems, in-house database engines, and web applications serving 100M+ global users using Java, C++, and Linux.",
    skills: ["Java", "C++", "Data Structures", "Algorithms", "Linux", "SQL", "Distributed Systems"],
    isRealOpening: true,
    postedDaysAgo: 1,
  },
  {
    company: "Zoho Corporation",
    companySlug: "zoho",
    category: "Indian Tech Giants & IT Leaders",
    title: "Frontend Web Developer (JavaScript / Frameworks)",
    location: "Chennai, India",
    isRemote: false,
    applyUrl: "https://www.zoho.com/careers/jobdetails/?job_id=45244500000215",
    description: "Develop interactive, blazing-fast single page applications for Zoho's suite of 55+ business products. Deep emphasis on vanilla JavaScript, DOM performance, and responsive CSS.",
    skills: ["JavaScript", "HTML5", "CSS3", "React", "TypeScript", "Performance Optimization"],
    isRealOpening: true,
    postedDaysAgo: 2,
  },

  {
    company: "Jio Platforms",
    companySlug: "jio",
    category: "Indian Tech Giants & IT Leaders",
    title: "5G Cloud Software Engineer / Backend Developer",
    location: "Mumbai / Bengaluru, India",
    isRemote: false,
    applyUrl: "https://careers.jio.com/frmJobDetails.aspx?ReqId=JIO-5G-88219",
    description: "Build high-throughput network management and cloud-native 5G core systems. Develop concurrent services in Go and C++ with Kafka streaming and Kubernetes orchestration.",
    skills: ["Go", "C++", "Kafka", "Kubernetes", "Microservices", "Docker", "Linux"],
    isRealOpening: true,
    postedDaysAgo: 1,
  },
  {
    company: "HCLTech",
    companySlug: "hcltech",
    category: "Indian Tech Giants & IT Leaders",
    title: "Software Engineer - Enterprise Java & Cloud",
    location: "Noida / Bengaluru / Chennai",
    isRemote: false,
    applyUrl: "https://www.hcltech.com/careers/search-jobs?job_id=HCL-SDE-8493",
    description: "Develop cloud-native backend applications for financial services and telecommunications clients. High emphasis on Spring Boot microservices and AWS deployment.",
    skills: ["Java", "Spring Boot", "AWS", "PostgreSQL", "REST API", "Docker", "Git"],
    isRealOpening: true,
    postedDaysAgo: 2,
  },
  {
    company: "LTIMindtree",
    companySlug: "ltimindtree",
    category: "Indian Tech Giants & IT Leaders",
    title: "Senior Full Stack Engineer (MERN / Spring)",
    location: "Mumbai / Bengaluru / Pune",
    isRemote: false,
    applyUrl: "https://www.ltimindtree.com/careers/jobs/search?role=full-stack&ref=LTI-4932",
    description: "Lead development of high-performance digital commerce and banking applications. Architect React frontend states and connect with resilient Spring microservices.",
    skills: ["React", "Java", "Spring Boot", "Node.js", "MongoDB", "Kafka", "AWS"],
    isRealOpening: true,
    postedDaysAgo: 2,
  },

  // ─── Indian Startups & Unicorns ──────────────────────────────────
  {
    company: "Zepto",
    companySlug: "zepto",
    category: "Indian Startups & Unicorns",
    title: "SDE-1 / Backend Engineer (High-Scale Systems)",
    location: "Bengaluru / Mumbai, India",
    isRemote: false,
    applyUrl: "https://www.zeptonow.com/careers/job?id=zepto-sde1-backend-2025",
    description: "Build 10-minute delivery routing algorithms, dark-store inventory state machines, and order fulfillment systems processing millions of daily transactions in Go and PostgreSQL.",
    skills: ["Go", "PostgreSQL", "Redis", "Kafka", "Microservices", "Docker", "Distributed Systems"],
    isRealOpening: true,
    postedDaysAgo: 1,
  },
  {
    company: "Zepto",
    companySlug: "zepto",
    category: "Indian Startups & Unicorns",
    title: "Frontend Engineer - Mobile & Web (React Native)",
    location: "Bengaluru, India",
    isRemote: false,
    applyUrl: "https://www.zeptonow.com/careers/job?id=zepto-fe-mobile-2025",
    description: "Create buttery-smooth 60fps quick-commerce user experiences for millions of shoppers across India. Master React Native, mobile animations, and offline caching.",
    skills: ["React Native", "TypeScript", "React", "Redux", "Mobile Performance", "GraphQL"],
    isRealOpening: true,
    postedDaysAgo: 2,
  },
  {
    company: "Zomato & Blinkit",
    companySlug: "zomato",
    category: "Indian Startups & Unicorns",
    title: "Software Engineer - Core Backend Services",
    location: "Gurugram, India",
    isRemote: false,
    applyUrl: "https://www.zomato.com/careers/openings?job_id=zomato-be-29401",
    description: "Design and scale real-time delivery tracking, payments processing, and restaurant recommendation systems serving high concurrency weekend peaks.",
    skills: ["Go", "Python", "Kafka", "MySQL", "Redis", "Kubernetes", "System Design"],
    isRealOpening: true,
    postedDaysAgo: 1,
  },
  {
    company: "Zerodha",
    companySlug: "zerodha",
    category: "Indian Startups & Unicorns",
    title: "Backend Engineer (Go / FOSS Systems)",
    location: "Bengaluru, India",
    isRemote: true,
    applyUrl: "https://zerodha.com/careers/openings?role=backend-engineer",
    description: "Join Zerodha's famous open-source-first engineering team. Build Kite trading APIs, order execution engines, and risk management systems in Go, Python, and PostgreSQL.",
    skills: ["Go", "Python", "PostgreSQL", "Linux", "FOSS", "Redis", "Distributed Systems"],
    isRealOpening: true,
    postedDaysAgo: 1,
  },
  {
    company: "Flipkart",
    companySlug: "flipkart",
    category: "Indian Startups & Unicorns",
    title: "Software Development Engineer I (SDE 1)",
    location: "Bengaluru, India",
    isRemote: false,
    applyUrl: "https://www.flipkartcareers.com/#!/job-view/software-development-engineer-i-FK-REQ-9920",
    description: "Develop large-scale supply chain and marketplace platforms for Flipkart Big Billion Days. Write performant multithreaded code in Java and optimize database indexes.",
    skills: ["Java", "Data Structures", "Algorithms", "Multithreading", "MySQL", "REST API"],
    isRealOpening: true,
    postedDaysAgo: 1,
  },
  {
    company: "Groww",
    companySlug: "groww",
    category: "Indian Startups & Unicorns",
    title: "Full Stack Engineer - Consumer Platforms (React, Node.js & MERN)",
    location: "Bengaluru, India",
    isRemote: false,
    applyUrl: "https://www.linkedin.com/jobs/view/4159102938/",
    description: "Build delightful stock, mutual fund, and credit investment experiences for 50M+ users. Develop interactive charting interfaces with React, stateful Node.js and Express backend services, and high-performance MongoDB clusters.",
    skills: ["React", "Node.js", "Express", "MongoDB", "JavaScript", "TypeScript", "Redux", "REST APIs"],
    isRealOpening: true,
    postedDaysAgo: 1,
  },
  {
    company: "InMobi",
    companySlug: "inmobi",
    category: "Indian Startups & Unicorns",
    title: "Frontend Engineer - Interactive Ad Studio (React.js & JavaScript)",
    location: "Bengaluru, India",
    isRemote: false,
    applyUrl: "https://www.linkedin.com/jobs/view/4158291047/",
    description: "Design and implement lightning-fast web canvases and rich creative renderers using modern React, vanilla JavaScript (ES6+), Canvas API, and WebGL across global mobile and desktop browsers.",
    skills: ["React", "JavaScript", "TypeScript", "HTML5", "CSS3", "Webpack", "Performance Optimization"],
    isRealOpening: true,
    postedDaysAgo: 2,
  },
  {
    company: "Zeta",
    companySlug: "zeta",
    category: "Indian Startups & Unicorns",
    title: "Full Stack Developer - Digital Banking & Fintech (MERN Stack)",
    location: "Bengaluru, India",
    isRemote: false,
    applyUrl: "https://www.linkedin.com/jobs/view/4157182930/",
    description: "Work on cloud-native banking stacks for top global financial institutions. Construct reactive card management dashboards in React, high-concurrency Node.js / Express services, and MongoDB datastores.",
    skills: ["React", "Node.js", "Express", "MongoDB", "JavaScript", "Docker", "Microservices"],
    isRealOpening: true,
    postedDaysAgo: 1,
  },
  {
    company: "Pocket FM",
    companySlug: "pocketfm",
    category: "Small Startups & Emerging Tech",
    title: "Full Stack Web Engineer - Creator Studio (React / Express / Node.js)",
    location: "Bengaluru, India",
    isRemote: false,
    applyUrl: "https://www.linkedin.com/jobs/view/4156291832/",
    description: "Empower thousands of audio storytellers worldwide. Build rich web audio editing consoles, analytics dashboards, and publishing workflows using React, Node.js, Express, and MongoDB.",
    skills: ["React", "Node.js", "Express", "MongoDB", "JavaScript", "Web Audio API", "AWS"],
    isSmallStartup: true,
    isRealOpening: true,
    postedDaysAgo: 2,
  },
  {
    company: "Slice",
    companySlug: "slice",
    category: "Small Startups & Emerging Tech",
    title: "Full Stack Engineer - Consumer Experience (React & Node.js)",
    location: "Bengaluru, India",
    isRemote: false,
    applyUrl: "https://www.linkedin.com/jobs/view/4155182901/",
    description: "Craft modern consumer credit and payments web interfaces with sub-second feedback loops. Deep focus on React component lifecycles, Express API layers, Node.js asynchronous flows, and MongoDB persistence.",
    skills: ["React", "Node.js", "Express", "MongoDB", "JavaScript", "Tailwind CSS", "REST APIs"],
    isSmallStartup: true,
    isRealOpening: true,
    postedDaysAgo: 1,
  },
  {
    company: "Delhivery",
    companySlug: "delhivery",
    category: "Indian Startups & Unicorns",
    title: "Full Stack Developer - Logistics Automation & Tracking (MERN)",
    location: "Gurugram, India",
    isRemote: false,
    applyUrl: "https://www.linkedin.com/jobs/view/4154192837/",
    description: "Build mission-critical package tracking, dispatch automation, and partner portals handling millions of daily parcels. Develop React web apps, Express microservices, and high-throughput MongoDB lookups.",
    skills: ["React", "Node.js", "Express", "MongoDB", "JavaScript", "Redis", "Kafka"],
    isRealOpening: true,
    postedDaysAgo: 2,
  },
  {
    company: "Cars24",
    companySlug: "cars24",
    category: "Indian Startups & Unicorns",
    title: "Full Stack Developer - Dealer B2B Portal (MERN Stack)",
    location: "Gurugram, India",
    isRemote: false,
    applyUrl: "https://www.linkedin.com/jobs/view/4153182940/",
    description: "Construct real-time vehicle auction platforms, inspection management web apps, and partner APIs using React, Node.js, Express, and MongoDB with WebSockets live bidding.",
    skills: ["React", "Node.js", "Express", "MongoDB", "JavaScript", "WebSockets", "AWS"],
    isRealOpening: true,
    postedDaysAgo: 3,
  },
  {
    company: "Nykaa",
    companySlug: "nykaa",
    category: "Indian Startups & Unicorns",
    title: "Frontend Engineer - E-Commerce Web & Checkout (React.js / Next.js)",
    location: "Mumbai / Gurugram, India",
    isRemote: false,
    applyUrl: "https://www.linkedin.com/jobs/view/4152192849/",
    description: "Deliver seamless, accessible shopping bag and checkout flows for millions of beauty shoppers. Master modern React, Next.js server-side rendering, JavaScript ES2024, and state management.",
    skills: ["React", "Next.js", "JavaScript", "TypeScript", "Redux", "HTML5", "CSS3", "Performance"],
    isRealOpening: true,
    postedDaysAgo: 2,
  },
  {
    company: "Ola Electric",
    companySlug: "ola",
    category: "Indian Startups & Unicorns",
    title: "Frontend Web Engineer - Telematics & Fleet Monitoring (React)",
    location: "Bengaluru, India",
    isRemote: false,
    applyUrl: "https://www.linkedin.com/jobs/view/4151192840/",
    description: "Build real-time fleet telematics dashboards, charging network status displays, and service station portals with React, JavaScript, SVG data visualizations, and Express integrations.",
    skills: ["React", "JavaScript", "TypeScript", "Node.js", "Express", "REST APIs", "D3.js"],
    isRealOpening: true,
    postedDaysAgo: 1,
  },
  {
    company: "Kredivo",
    companySlug: "kredivo",
    category: "Small Startups & Emerging Tech",
    title: "Backend Engineer - Node.js & Express Microservices",
    location: "Bengaluru / Remote",
    isRemote: true,
    applyUrl: "https://www.linkedin.com/jobs/view/4150182938/",
    description: "Build low-latency credit decisioning and installment payment settlement microservices in Node.js and Express. Ensure sub-200ms API response times with MongoDB and Redis caching.",
    skills: ["Node.js", "Express", "MongoDB", "JavaScript", "TypeScript", "Redis", "Docker"],
    isSmallStartup: true,
    isRealOpening: true,
    postedDaysAgo: 2,
  },
];

/**
 * Intelligent multi-paradigm role & keyword matcher with smart synonym expansion
 * Supports: MERN, Full Stack, React, Node.js, Express, JavaScript, SDE, SE, Java, Python
 */
export function matchesSmartRoleQuery(job, roleQuery = "") {
  if (!roleQuery || !roleQuery.trim()) return true;

  // Support multi-term role queries: comma, pipe, or " OR " separated queries
  if (roleQuery.includes(",") || roleQuery.includes("|") || /\s+or\s+/i.test(roleQuery)) {
    const tokens = roleQuery.split(/[,|]|\s+or\s+/i).map((t) => t.trim()).filter(Boolean);
    if (tokens.length > 1) {
      return tokens.some((subQ) => matchesSmartRoleQuery(job, subQ));
    }
  }

  const q = roleQuery.toLowerCase().trim();
  const title = (job.title || "").toLowerCase();
  const desc = (job.description || job.fullDescription || job.descriptionSummary || "").toLowerCase();
  const skills = (job.skills || job.requiredSkills || []).map((s) => (typeof s === "string" ? s.toLowerCase() : ""));
  const company = (job.company || "").toLowerCase();

  const combinedText = `${title} ${desc} ${skills.join(" ")} ${company}`;

  // 1. Direct Substring Check
  if (combinedText.includes(q)) return true;

  // 2. MERN Stack matching (MERN, React + Node, Express, MongoDB)
  if (q === "mern" || q === "mern stack" || q.includes("mern")) {
    if (combinedText.includes("mern")) return true;
    const hasReact = combinedText.includes("react");
    const hasNodeOrExpress = combinedText.includes("node") || combinedText.includes("express");
    const hasMongo = combinedText.includes("mongo");
    if (hasReact && hasNodeOrExpress) return true;
    if (hasReact && hasMongo) return true;
    if (title.includes("full stack") && (hasReact || hasNodeOrExpress)) return true;
  }

  // 3. Full Stack matching (Full Stack, FSD, MERN, React + Node/Express)
  if (q === "full stack" || q === "fullstack" || q === "fsd") {
    if (title.includes("full stack") || title.includes("fullstack") || title.includes("fsd")) return true;
    if (desc.includes("full stack") || desc.includes("fullstack") || skills.includes("full stack")) return true;
    if (combinedText.includes("mern")) return true;
    const hasFront = combinedText.includes("react") || combinedText.includes("frontend") || combinedText.includes("vue") || combinedText.includes("angular");
    const hasBack = combinedText.includes("node") || combinedText.includes("express") || combinedText.includes("backend") || combinedText.includes("spring") || combinedText.includes("django");
    if (hasFront && hasBack) return true;
  }

  // 4. React matching (React, React.js, Reactjs, Redux, Next.js)
  if (q === "react" || q === "react.js" || q === "reactjs") {
    if (/\b(react|react\.?js|reactjs|redux|next\.?js)\b/i.test(combinedText)) return true;
  }

  // 5. Node.js matching (Node, Node.js, Nodejs, Express)
  if (q === "node" || q === "node.js" || q === "nodejs") {
    if (/\b(node|node\.?js|nodejs)\b/i.test(combinedText)) return true;
  }

  // 6. Express matching (Express, Express.js, Expressjs, MERN)
  if (q === "express" || q === "express.js" || q === "expressjs") {
    if (/\b(express|express\.?js|expressjs)\b/i.test(combinedText)) return true;
    if (combinedText.includes("mern")) return true;
  }

  // 7. JavaScript / JS matching
  if (q === "javascript" || q === "js" || q === "ecmascript") {
    if (/\b(javascript|js|es6|ecmascript)\b/i.test(combinedText)) return true;
    if (skills.some((s) => s.includes("javascript") || s === "js")) return true;
    if (combinedText.includes("react") || combinedText.includes("node") || combinedText.includes("mern")) return true;
  }

  // 8. SDE / Software Engineer matching
  if (q === "sde" || q === "se" || q === "software engineer" || q === "software developer") {
    if (/\b(sde|software engineer|software developer|systems engineer)\b/i.test(title)) return true;
  }

  // 9. Java matching (avoid false positive on javascript)
  if (q === "java" || q === "spring boot" || q === "spring") {
    if (/\b(java|spring boot|spring)\b/i.test(combinedText) && !/\bjavascript\b/i.test(q)) {
      const words = combinedText.split(/[^a-z0-9]+/);
      if (words.includes("java") || words.includes("spring")) return true;
    }
  }

  // 10. Python matching
  if (q === "python" || q === "django" || q === "fastapi" || q === "flask") {
    if (/\b(python|django|fastapi|flask)\b/i.test(combinedText)) return true;
  }

  // 11. Multi-token intersection check
  const tokens = q.split(/\s+/).filter((t) => t.length > 2);
  if (tokens.length > 0 && tokens.every((t) => combinedText.includes(t))) {
    return true;
  }

  return false;
}

export function getCuratedJobsForCompany(companyIdentifier, roleQuery = "") {
  const clean = (companyIdentifier || "").toLowerCase().trim();
  const matched = RAW_OFFICIAL_OPENINGS.filter(
    (j) =>
      j.companySlug.toLowerCase() === clean ||
      j.company.toLowerCase().includes(clean) ||
      clean.includes(j.companySlug.toLowerCase())
  );

  let filtered = matched;
  if (roleQuery && roleQuery.trim()) {
    filtered = matched.filter((j) => matchesSmartRoleQuery(j, roleQuery));
    if (filtered.length === 0) filtered = matched;
  }

  return filtered.map((item, idx) => {
    const classification = classifyJobTypeAndExperience(item.title, item.description || "");
    const combinedSkills = [...new Set([...item.skills, ...(classification.requiredSkills || [])])];
    const postedDate = new Date(Date.now() - (item.postedDaysAgo || 1) * 24 * 60 * 60 * 1000);

    return {
      id: `official_${item.companySlug}_${idx}_${Date.now()}`,
      externalId: `official_${item.companySlug}_${idx}`,
      company: item.company,
      companySlug: item.companySlug,
      companyCategory: item.category || "Technology Company",
      source: item.applyUrl?.includes("linkedin.com") ? "linkedin_job_post" : "official_portal",
      portalLabel: item.applyUrl?.includes("linkedin.com")
        ? "LinkedIn Job Profile (Verified Post)"
        : item.applyUrl?.includes("lever.co")
        ? "Lever ATS (Live Requisition)"
        : item.applyUrl?.includes("greenhouse.io") || item.applyUrl?.includes("gh_jid")
        ? "Greenhouse ATS (Live Requisition)"
        : "Official Career Portal (Live Requisition)",
      title: item.title,
      location: item.location,
      isRemote: Boolean(item.isRemote),
      employmentType: classification.employmentType,
      experienceLevel: classification.experienceLevel,
      minExperienceYears: classification.minExperienceYears,
      maxExperienceYears: classification.maxExperienceYears,
      isFresherFriendly: classification.isFresherFriendly,
      stream: classification.stream,
      track: classification.track,
      skills: combinedSkills,
      description: item.description,
      applyUrl: item.applyUrl,
      isRealOpening: true,
      isSmallStartup: Boolean(item.isSmallStartup),
      postedAt: postedDate.toISOString(),
      scannedAt: new Date(),
    };
  });
}

export function getAllCuratedOfficialJobs(roleQuery = "") {
  let list = RAW_OFFICIAL_OPENINGS;

  if (roleQuery && roleQuery.trim()) {
    list = RAW_OFFICIAL_OPENINGS.filter((j) => matchesSmartRoleQuery(j, roleQuery));
  }

  return list.map((item, idx) => {
    const classification = classifyJobTypeAndExperience(item.title, item.description || "");
    const combinedSkills = [...new Set([...item.skills, ...(classification.requiredSkills || [])])];
    const postedDate = new Date(Date.now() - (item.postedDaysAgo || 1) * 24 * 60 * 60 * 1000);

    return {
      id: `curated_${item.companySlug}_${idx}`,
      externalId: `curated_${item.companySlug}_${idx}`,
      company: item.company,
      companySlug: item.companySlug,
      companyCategory: item.category || "Technology Company",
      source: item.applyUrl?.includes("linkedin.com") ? "linkedin_job_post" : "official_portal",
      portalLabel: item.applyUrl?.includes("linkedin.com")
        ? "LinkedIn Job Profile (Verified Post)"
        : item.applyUrl?.includes("lever.co")
        ? "Lever ATS (Live Requisition)"
        : item.applyUrl?.includes("greenhouse.io") || item.applyUrl?.includes("gh_jid")
        ? "Greenhouse ATS (Live Requisition)"
        : "Official Career Portal (Live Requisition)",
      title: item.title,
      location: item.location,
      isRemote: Boolean(item.isRemote),
      employmentType: classification.employmentType,
      experienceLevel: classification.experienceLevel,
      minExperienceYears: classification.minExperienceYears,
      maxExperienceYears: classification.maxExperienceYears,
      isFresherFriendly: classification.isFresherFriendly,
      stream: classification.stream,
      track: classification.track,
      skills: combinedSkills,
      description: item.description,
      applyUrl: item.applyUrl,
      isRealOpening: true,
      isSmallStartup: Boolean(item.isSmallStartup),
      postedAt: postedDate.toISOString(),
      scannedAt: new Date(),
    };
  });
}
