import { fetchJobsForCompany, fetchAllCuratedJobs, isRealOpeningUrl } from "./ats/atsDetector.service.js";
import { matchesSmartRoleQuery } from "./ats/curatedOfficialJobs.js";
import { COMPANIES_REGISTRY, findCompanyByIdOrSlug, COMPANY_CATEGORIES } from "./ats/companyRegistry.js";
import { matchesCountry, matchesTechHub, TECH_COUNTRIES } from "./ats/techLocations.js";
import { inferTechStacksAndRoles } from "./ats/techStackInference.service.js";
import {
  cleanHtmlToText,
  extractSkillsFromText,
  detectStreamFromTextAndSkills,
  parseStructuredJD,
  classifyFresherVsProfessional,
  classifyJobTypeAndExperience,
  TECH_STREAMS,
  CAREER_STREAMS,
  DOMAIN_TRACKS,
} from "./ats/jobClassifier.js";
import { crawlJobPostingUrl, identifyPortalProvider } from "./ats/jobVerifier.service.js";
import ResumesCollection from "../models/resumes_collection.model.js";
import ResumeAnalysis from "../models/resume_analysis.model.js";
import DiscoveredCareerJob from "../models/discoveredCareerJob.model.js";
import aiJobMatcherService from "./ats/aiMatcher.service.js";
import linkedInJobSearchService from "./ats/linkedinJobSearch.service.js";
import { fetchSingleGreenhouseJob } from "./ats/greenhouse.service.js";
import { fetchSingleLeverJob } from "./ats/lever.service.js";

// In-memory cache for fast hot responses
const jobsCache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const RE_SCAN_COOLDOWN_MS = 8 * 1000; // 8s anti-spam debounce

export async function clearCareerCache() {
  jobsCache.clear();
  aiJobMatcherService.clearAiCache();
  try {
    // DiscoveredCareerJob preserved in database; cache maps purged
  } catch (e) {
    console.warn("[CareerService] Clear cache warning:", e.message);
  }
  return { cleared: true, timestamp: new Date().toISOString() };
}

export function getSystemPortalHealth() {
  return {
    status: "healthy",
    providers: [
      { name: "Greenhouse ATS", status: "operational", type: "Direct API", responseTime: "< 1.5s" },
      { name: "Lever ATS", status: "operational", type: "Direct API", responseTime: "< 2.5s" },
      { name: "SmartRecruiters ATS", status: "operational", type: "Direct API", responseTime: "< 1.8s" },
      { name: "LinkedIn Requisitions", status: "operational", type: "Direct Company Pages", responseTime: "< 2.0s" },
      { name: "Google Career Grounding", status: "operational", type: "AI Search", responseTime: "< 3.5s" },
    ],
    cachedScopesCount: jobsCache.size,
    lastChecked: new Date().toISOString(),
  };
}

export function classifyPortalSource(job) {
  const s = (job.source || "").toLowerCase().trim();
  const u = (job.applyUrl || "").toLowerCase().trim();

  // 1. LinkedIn jobs
  if (s.includes("linkedin") || u.includes("linkedin.com")) {
    return {
      portalType: "linkedin",
      portalTypeLabel: "LinkedIn Verified Requisition",
    };
  }

  // 2. Third-Party Portals / Aggregators / Web Search / Startup Direct Posts
  if (
    s === "third_party" ||
    s === "startup_direct_post" ||
    s === "ai_search" ||
    s === "external" ||
    s === "aggregator" ||
    u.includes("cutshort") ||
    u.includes("naukri") ||
    u.includes("wellfound") ||
    u.includes("angel.co") ||
    u.includes("indeed") ||
    u.includes("instahyre") ||
    u.includes("hirist") ||
    u.includes("foundit")
  ) {
    return {
      portalType: "third_party",
      portalTypeLabel: "Third-Party Job Portal",
    };
  }

  // 3. Official Career ATS & Direct Company Portals (Greenhouse, Lever, SmartRecruiters, TCS, Workday, etc.)
  return {
    portalType: "official",
    portalTypeLabel: "Official Career ATS",
  };
}


export function analyzeCandidateProfile(resumeText = "", resumeAnalysis = null) {
  if (!resumeText && !resumeAnalysis) {
    return {
      isFresher: false,
      experienceYears: 0,
      experienceLevel: "Fresher / Entry-Level (0-1 yr)",
      skills: [],
      resumeKeywords: [],
      roleKeywords: [],
      inferredStacks: [],
      primaryInferredStack: null,
      derivedRoleTitles: [],
      derivedSearchKeywords: [],
      stackExplanationBullets: [],
      allSearchTerms: [],
      track: DOMAIN_TRACKS.TECH,
      primaryStream: {
        id: "all",
        label: "General / All Roles",
        icon: "🌐",
      },
      secondaryStream: null,
      streamScores: [],
    };
  }

  let isFresher = false;
  let experienceYears = 0;
  let experienceLevel = "Fresher / Entry-Level (0-1 yr)";

  const lower = (resumeText || "").toLowerCase();

  // 1. Check structured experience analysis if present
  if (resumeAnalysis?.experience_analysis && Array.isArray(resumeAnalysis.experience_analysis)) {
    const exps = resumeAnalysis.experience_analysis;
    if (exps.length === 0) {
      isFresher = true;
      experienceYears = 0;
    } else {
      experienceYears = Math.max(1, Math.round(exps.length * 1.5));
    }
  }

  // 2. Regex & keyword heuristics for freshers vs experienced
  const fresherClues = [
    "fresher", "student", "b.tech", "bca", "mca", "b.e", "b.sc", "undergraduate",
    "batch of 2023", "batch of 2024", "batch of 2025", "batch of 2026",
    "graduating in", "intern", "internship", "entry level", "seeking entry level"
  ];

  let fresherCount = 0;
  for (const clue of fresherClues) {
    if (lower.includes(clue)) fresherCount++;
  }

  // Experience year patterns: e.g. "3 years of experience", "2+ years", "4 yrs experience"
  const expMatch = lower.match(/(\d+)\s*(\+|\.5)?\s*(years?|yrs?)\s*(of)?\s*(experience|exp)/i);
  if (expMatch) {
    const yrs = parseInt(expMatch[1], 10);
    if (!isNaN(yrs) && yrs > 0) {
      experienceYears = yrs;
    }
  }

  // Determine final level
  if (experienceYears === 0 || (experienceYears <= 1 && fresherCount >= 1)) {
    isFresher = true;
    experienceYears = 0;
    experienceLevel = "Fresher / Entry-Level (0-1 yr)";
  } else if (experienceYears >= 5) {
    isFresher = false;
    experienceLevel = "Senior (5+ yrs)";
  } else if (experienceYears >= 3) {
    isFresher = false;
    experienceLevel = "Mid-Level (3-5 yrs)";
  } else {
    isFresher = false;
    experienceLevel = "Junior (1-3 yrs)";
  }

  // 3. Extract all keywords from resume analysis and resume text
  const extractedSkills = extractSkillsFromText(resumeText);
  const analysisKeywords = resumeAnalysis?.keyword_analysis?.keywords_found || [];

  const combinedKeywordsSet = new Set();
  analysisKeywords.forEach((k) => {
    if (k && typeof k === "string") combinedKeywordsSet.add(k.trim());
  });
  extractedSkills.forEach((s) => {
    if (s && typeof s === "string") combinedKeywordsSet.add(s.trim());
  });

  const candidateSkills = Array.from(combinedKeywordsSet);

  // 4. Dynamic Tech Stack & Industry Role Inference Engine
  // Infers tech stacks (MERN, MEAN, PERN, Python/Django, Java/Spring Boot, Next.js, etc.)
  // and derives canonical industry roles (e.g. Full Stack Developer, SDE, React Developer)
  // even if not explicitly written on the resume!
  const stackInference = inferTechStacksAndRoles(candidateSkills, resumeText);

  // Combine role keywords from explicit patterns AND derived roles from stack inference
  const roleKeywordsFound = new Set(stackInference.derivedRoleTitles);

  const rolePatterns = [
    { label: "Full Stack", patterns: ["full stack", "fullstack", "fsd", "full stack developer", "full stack engineer"] },
    { label: "MERN Stack", patterns: ["mern", "mern stack", "mean", "mean stack"] },
    { label: "React", patterns: ["react", "react.js", "reactjs", "redux", "next.js", "nextjs"] },
    { label: "Node.js", patterns: ["node.js", "nodejs"] },
    { label: "Express", patterns: ["express", "express.js", "expressjs"] },
    { label: "JavaScript", patterns: ["javascript", "es6", "ecmascript"] },
    { label: "Python", patterns: ["python", "django", "fastapi", "flask", "pytorch"] },
    { label: "Java", patterns: ["spring boot", "spring", "core java", "hibernate", "j2ee"] },
    { label: "Go", patterns: ["golang", "go programming"] },
    { label: "C++", patterns: ["c++", "cpp"] },
    { label: "Backend", patterns: ["backend", "back-end", "server-side"] },
    { label: "Frontend", patterns: ["frontend", "front-end", "client-side"] },
    { label: "DevOps & Cloud", patterns: ["devops", "docker", "kubernetes", "k8s", "aws", "cloud", "ec2", "s3", "terraform"] },
    { label: "Data & AI", patterns: ["data analytics", "data science", "sql", "faiss", "langchain", "vector database", "ai", "machine learning"] },
    { label: "Product Management", patterns: ["product manager", "product management", "prd", "scrum", "agile", "roadmapping"] },
    { label: "SDE", patterns: ["sde", "software development engineer", "sde 1", "sde-1", "sde 2", "sde-2", "sde i", "sde ii", "data structures", "algorithms", "dsa"] },
    { label: "SE", patterns: ["se", "software engineer", "software developer", "associate software engineer", "systems engineer"] },
  ];

  for (const r of rolePatterns) {
    if (
      r.patterns.some((p) => {
        if (p === "sde" || p === "se") {
          return new RegExp(`\\b${p}\\b`, "i").test(lower);
        }
        return lower.includes(p) || candidateSkills.some((k) => k.toLowerCase().includes(p));
      })
    ) {
      roleKeywordsFound.add(r.label);
    }
  }

  // Word boundary check for Java (ensure not javascript)
  if (/\bjava\b/i.test(lower) && !/\bjavascript\b/i.test(lower)) {
    roleKeywordsFound.add("Java");
  }
  // Word boundary check for JS
  if (/\bjs\b/i.test(lower) || lower.includes("javascript")) {
    roleKeywordsFound.add("JavaScript");
  }

  // Only add generic fallback if candidate has skills but no specific role was mentioned:
  if (candidateSkills.length > 0 && !roleKeywordsFound.size) {
    roleKeywordsFound.add("Software Engineer");
  }

  const roleKeywords = Array.from(roleKeywordsFound);
  const resumeKeywords = candidateSkills;

  // 5. Detect candidate's domain track (Tech vs Management) and specialization stream
  const streamInfo = detectStreamFromTextAndSkills(resumeText, resumeKeywords.length > 0 ? resumeKeywords : extractedSkills);

  return {
    isFresher,
    experienceYears,
    experienceLevel,
    skills: resumeKeywords.length > 0 ? resumeKeywords : extractedSkills,
    resumeKeywords: resumeKeywords.length > 0 ? resumeKeywords : extractedSkills,
    roleKeywords,
    inferredStacks: stackInference.inferredStacks,
    primaryInferredStack: stackInference.primaryInferredStack,
    derivedRoleTitles: stackInference.derivedRoleTitles,
    derivedSearchKeywords: stackInference.derivedSearchKeywords,
    stackExplanationBullets: stackInference.explanationBullets,
    allSearchTerms: Array.from(new Set([
      ...stackInference.derivedRoleTitles,
      ...stackInference.derivedSearchKeywords,
      ...roleKeywords,
      ...resumeKeywords.slice(0, 15),
    ])),
    track: streamInfo.track, // DOMAIN_TRACKS.TECH or DOMAIN_TRACKS.MANAGEMENT
    primaryStream: streamInfo.primaryStream,
    secondaryStream: streamInfo.secondaryStream,
    streamScores: streamInfo.streamScores,
  };
}

export function computeJobMatch(job, candidateProfile, resumeText = "") {
  const {
    isFresher,
    experienceYears,
    skills: candidateSkills = [],
    resumeKeywords = [],
    roleKeywords = [],
    inferredStacks = [],
    primaryInferredStack = null,
    derivedRoleTitles = [],
    track: candidateTrack = DOMAIN_TRACKS.TECH,
    primaryStream,
    secondaryStream,
  } = candidateProfile;
  const jobSkills = job.requiredSkills || [];

  // Determine Job Domain Track ("tech" vs "management")
  const jobTrackId = job.stream?.track || (job.track?.id || job.track || "tech");
  const candidateTrackId = candidateTrack?.id || "tech";
  const isTrackMatch = candidateTrackId === jobTrackId;

  // Search pool for candidate resume keywords
  const allCandidateKeywords = resumeKeywords.length > 0 ? resumeKeywords : candidateSkills;

  // Build target job searchable text
  const jobTextForMatching = `${job.title} ${job.description || ""} ${job.descriptionSummary || ""} ${(job.requiredSkills || []).join(" ")} ${(job.structuredJD?.techStack || []).join(" ")}`.toLowerCase();

  // Match resume keywords & roles in this specific job
  const matchedResumeKeywords = [];
  const matchedRolesSet = new Set();

  // 1. Check Role terms (Full Stack, MERN Stack, React, Node.js, Express, JavaScript, SDE, SE, Java, Python, Backend, Frontend, etc.)
  for (const role of roleKeywords) {
    const roleLower = role.toLowerCase();
    if (roleLower === "full stack" || roleLower === "fsd") {
      if (/\b(full\s*stack|fullstack|fsd)\b/i.test(jobTextForMatching)) {
        matchedRolesSet.add("Full Stack");
      }
    } else if (roleLower === "mern stack" || roleLower === "mern") {
      if (
        /\b(mern|mern\s*stack)\b/i.test(jobTextForMatching) ||
        (/\breact\b/i.test(jobTextForMatching) && /\b(node|express|mongo)\b/i.test(jobTextForMatching))
      ) {
        matchedRolesSet.add("MERN Stack");
      }
    } else if (roleLower === "react") {
      if (/\b(react|react\.?js|reactjs|redux|next\.?js)\b/i.test(jobTextForMatching)) {
        matchedRolesSet.add("React");
      }
    } else if (roleLower === "node.js" || roleLower === "node") {
      if (/\b(node|node\.?js|nodejs)\b/i.test(jobTextForMatching)) {
        matchedRolesSet.add("Node.js");
      }
    } else if (roleLower === "express") {
      if (/\b(express|express\.?js|expressjs)\b/i.test(jobTextForMatching)) {
        matchedRolesSet.add("Express");
      }
    } else if (roleLower === "javascript" || roleLower === "js") {
      if (/\b(javascript|js|es6|ecmascript)\b/i.test(jobTextForMatching)) {
        matchedRolesSet.add("JavaScript");
      }
    } else if (roleLower === "sde") {
      if (/\b(sde|software development engineer)\b/i.test(jobTextForMatching)) {
        matchedRolesSet.add("SDE");
      }
    } else if (roleLower === "se") {
      if (/\b(se|software engineer|software developer)\b/i.test(jobTextForMatching)) {
        matchedRolesSet.add("SE");
      }
    } else if (roleLower === "java") {
      if (/\b(java|spring)\b/i.test(jobTextForMatching) && !/\bjavascript\b/i.test(jobTextForMatching)) {
        matchedRolesSet.add("Java");
      }
    } else if (roleLower === "python") {
      if (/\b(python|django|fastapi)\b/i.test(jobTextForMatching)) {
        matchedRolesSet.add("Python");
      }
    } else if (roleLower.includes("backend")) {
      if (/\b(backend|back-end)\b/i.test(jobTextForMatching)) {
        matchedRolesSet.add("Backend");
      }
    } else if (roleLower.includes("frontend")) {
      if (/\b(frontend|front-end)\b/i.test(jobTextForMatching)) {
        matchedRolesSet.add("Frontend");
      }
    } else if (jobTextForMatching.includes(roleLower)) {
      matchedRolesSet.add(role);
    }
  }

  const matchedResumeRoles = Array.from(matchedRolesSet);

  // 2. Check Specific Skills from Resume (Java, Python, React, Node, Docker, AWS, SQL, etc.)
  const seenLower = new Set(matchedResumeRoles.map((r) => r.toLowerCase()));
  for (const kw of allCandidateKeywords) {
    if (!kw || typeof kw !== "string") continue;
    const kwLower = kw.toLowerCase();
    if (seenLower.has(kwLower)) continue;

    const escaped = kw.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");
    if (regex.test(jobTextForMatching)) {
      matchedResumeKeywords.push(kw);
      seenLower.add(kwLower);
    }
  }

  // Combined matched keywords from candidate's resume
  const fullMatchedFromResume = [...matchedResumeRoles, ...matchedResumeKeywords];

  // Build clear resume match reason string
  let resumeMatchReason = "";
  if (fullMatchedFromResume.length > 0) {
    resumeMatchReason = `Matched from your resume: ${fullMatchedFromResume.slice(0, 5).join(", ")}${fullMatchedFromResume.length > 5 ? ` (+${fullMatchedFromResume.length - 5} more)` : ""}`;
  } else if (isTrackMatch) {
    resumeMatchReason = `Aligned with your ${candidateTrack.label} track`;
  }

  // If candidate has no skills / no resume uploaded
  if (!allCandidateKeywords.length && !resumeText) {
    return {
      matchScore: 65,
      matchedSkills: [],
      missingSkills: jobSkills.slice(0, 3),
      matchedResumeKeywords: [],
      matchedResumeRoles: [],
      resumeMatchReason: "",
      keywordMatchCount: 0,
      isFresherMatched: job.isFresherFriendly,
      streamFit: isTrackMatch ? "General Match" : "Adjacent Track",
      isStreamMatch: true,
      isTrackMatch: true,
      recommendation: "Upload your resume in Resume Saathi to calculate personalized ATS score, stream fit & skill gap.",
    };
  }

  // 1. Calculate Skill Overlap
  const candidateSkillsLower = new Set(allCandidateKeywords.map((s) => s.toLowerCase()));
  const matched = [];
  const missing = [];

  for (const skill of jobSkills) {
    if (candidateSkillsLower.has(skill.toLowerCase())) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  }

  const skillCoverageRatio = jobSkills.length > 0 ? matched.length / jobSkills.length : 0.5;

  // 2. Stream Match Detection (Direct vs Adjacent vs Different)
  let streamFit = isTrackMatch ? "General Domain Fit" : "Domain Mismatch";
  let isStreamMatch = false;
  let streamBonus = 0;

  if (job.stream && primaryStream) {
    if (job.stream.id === primaryStream.id) {
      streamFit = `Direct Stream (${primaryStream.label})`;
      isStreamMatch = true;
      streamBonus = 15;
    } else if (secondaryStream && job.stream.id === secondaryStream.id) {
      streamFit = `Secondary Stream (${secondaryStream.label})`;
      isStreamMatch = true;
      streamBonus = 8;
    } else if (isTrackMatch) {
      streamFit = `Adjacent in ${candidateTrack.label}`;
      isStreamMatch = false;
      streamBonus = 2;
    } else {
      streamFit = `Different Domain (${job.stream?.track === "management" ? "Management" : "Engineering"})`;
      isStreamMatch = false;
      streamBonus = -15; // Track mismatch penalty
    }
  }

  // 3. Title & Role alignment (checks explicit keywords, derived roles, and inferred tech stacks)
  const candidateLower = resumeText.toLowerCase();
  const jobTitleLower = job.title.toLowerCase();

  let titleBonus = 0;
  let isDerivedRoleTitleMatched = false;
  let matchedDerivedRoleName = "";

  // Check against candidate's derived roles (e.g. "Full Stack Developer", "MERN Stack Developer", "Django Developer")
  for (const dRole of derivedRoleTitles) {
    if (jobTitleLower.includes(dRole.toLowerCase())) {
      isDerivedRoleTitleMatched = true;
      matchedDerivedRoleName = dRole;
      titleBonus = 15;
      matchedRolesSet.add(dRole);
      break;
    }
  }

  // Check against candidate's primary inferred tech stack (e.g. "MERN Stack", "Python & Django")
  if (!titleBonus && primaryInferredStack) {
    if (jobTitleLower.includes(primaryInferredStack.name.toLowerCase()) || (primaryInferredStack.id === "mern" && jobTitleLower.includes("mern"))) {
      isDerivedRoleTitleMatched = true;
      matchedDerivedRoleName = primaryInferredStack.name;
      titleBonus = 15;
      matchedRolesSet.add(primaryInferredStack.name);
    }
  }

  // Fallback role keyword checks
  if (!titleBonus) {
    if (
      // Management role keywords
      (jobTitleLower.includes("product") && candidateLower.includes("product")) ||
      (jobTitleLower.includes("project") && candidateLower.includes("project")) ||
      (jobTitleLower.includes("scrum") && candidateLower.includes("scrum")) ||
      (jobTitleLower.includes("program") && candidateLower.includes("program")) ||
      (jobTitleLower.includes("analyst") && candidateLower.includes("analyst")) ||
      // Technical role keywords
      (jobTitleLower.includes("full stack") && (candidateLower.includes("full stack") || derivedRoleTitles.some((r) => r.toLowerCase().includes("full stack")))) ||
      (jobTitleLower.includes("frontend") && (candidateLower.includes("frontend") || derivedRoleTitles.some((r) => r.toLowerCase().includes("frontend")))) ||
      (jobTitleLower.includes("backend") && (candidateLower.includes("backend") || derivedRoleTitles.some((r) => r.toLowerCase().includes("backend")))) ||
      (jobTitleLower.includes("software") && candidateLower.includes("software")) ||
      (jobTitleLower.includes("engineer") && candidateLower.includes("engineer")) ||
      (jobTitleLower.includes("developer") && candidateLower.includes("developer"))
    ) {
      titleBonus = 10;
    }
  }

  // Refine resume match reason with inferred stack intelligence
  if (primaryInferredStack && isDerivedRoleTitleMatched) {
    resumeMatchReason = `🎯 Inferred ${primaryInferredStack.name} from your skills (${primaryInferredStack.matchedComponents.join(", ")}). Direct match for this role!`;
  } else if (primaryInferredStack && fullMatchedFromResume.length > 0) {
    resumeMatchReason = `Inferred ${primaryInferredStack.name} (${primaryInferredStack.matchedComponents.slice(0, 3).join(", ")}) • Matched: ${fullMatchedFromResume.slice(0, 4).join(", ")}`;
  }

  // 4. Experience Match & Fresher Scoring
  let finalScore = 60;
  let recommendation = "";
  const isFresherRole = job.isFresherFriendly || job.employmentType === "Internship";

  // CASE A: Candidate is MANAGEMENT (Product Manager / TPM / Leadership / BA)
  if (candidateTrackId === "management") {
    if (!isTrackMatch) {
      // Management candidate looking at pure coding / technical role
      finalScore = Math.min(52, Math.max(28, Math.round(skillCoverageRatio * 35) + 10));
      recommendation = `⚠️ Technical Role. Your resume reflects ${candidateTrack.label} (${primaryStream.label}). For higher interview callbacks, target Product Manager (PM), TPM, or Business Analyst openings.`;
    } else {
      // Management candidate applying to Management role
      const base = Math.round(skillCoverageRatio * 50) + titleBonus + streamBonus + 25;
      finalScore = Math.min(98, Math.max(68, base));

      if (isStreamMatch) {
        recommendation = `🎯 High Management Match (${primaryStream.label})! Your leadership experience and background in ${matched.slice(0, 3).join(", ") || "product delivery"} strongly align with this opening.`;
      } else {
        recommendation = `👔 Strong Domain Fit. Your leadership in ${matched.slice(0, 3).join(", ") || "strategic execution"} provides immediate value for this ${job.stream?.label || "management"} opening.`;
      }
    }
  }
  // CASE B: Candidate is TECH (Software Engineer / SDE / Full Stack / Backend, etc.)
  else {
    if (jobTrackId === "management") {
      // Tech candidate looking at Management role
      if (experienceYears >= 4) {
        finalScore = Math.min(74, Math.max(50, Math.round(skillCoverageRatio * 45) + titleBonus + 15));
        recommendation = `⚡ Leadership Progression Opening. With your ${experienceYears} YOE in software development, this ${job.stream?.label || "management"} role offers an engineering leadership / TPM career transition.`;
      } else {
        finalScore = Math.min(50, Math.max(30, Math.round(skillCoverageRatio * 35) + 10));
        recommendation = `⚠️ Management Role. This requires dedicated stakeholder & people leadership. As an early-career engineer, prioritize SDE-1 / Software Developer openings.`;
      }
    } else {
      // Tech candidate applying to Tech role
      if (isFresher) {
        if (isFresherRole) {
          const baseScore = Math.round(skillCoverageRatio * 50) + 30 + titleBonus + streamBonus;
          finalScore = Math.min(98, Math.max(74, baseScore));
          const matchedList = matched.slice(0, 3).join(", ") || "core fundamentals";
          if (isDerivedRoleTitleMatched && primaryInferredStack) {
            recommendation = `🎯 High Tech Stack Alignment! Your skills in ${primaryInferredStack.matchedComponents.join(", ")} qualify you as a ${primaryInferredStack.name} & Full Stack engineer for this ${job.title} opening.`;
          } else if (isStreamMatch) {
            recommendation = `🎯 Direct Stream Fit (${primaryStream.label}) for Freshers! Your projects in ${matchedList} align with this entry-level opening. Highlight your GitHub repos and live demos.`;
          } else {
            recommendation = `🌟 Outstanding Fresher Opportunity! Foundational skills in ${matchedList} make you a strong candidate. Emphasize hands-on coursework and problem-solving.`;
          }
        } else if (job.experienceLevel === "Senior (5+ yrs)") {
          finalScore = Math.min(50, Math.max(30, Math.round(skillCoverageRatio * 35) + 10));
          recommendation = `⚠️ Senior Role (${job.experienceLevel}). Requires 5+ years of enterprise experience. As a fresher, prioritize SDE-1 or Internship openings for higher callback rates.`;
        } else {
          finalScore = Math.min(68, Math.max(45, Math.round(skillCoverageRatio * 40) + 18 + streamBonus));
          recommendation = `⚡ Stretch Role (${job.experienceLevel}). Apply if you have exceptional portfolio projects demonstrating ${matched.slice(0, 2).join(" & ") || "required skills"}.`;
        }
      } else {
        // Experienced tech candidate
        if (job.experienceLevel === "Senior (5+ yrs)" && experienceYears < 4) {
          finalScore = Math.min(72, Math.max(45, Math.round(skillCoverageRatio * 45) + titleBonus + streamBonus));
          recommendation = `Good skill overlap, but requires ${job.experienceLevel}. Highlight large-scale architectural achievements.`;
        } else {
          const base = Math.round(skillCoverageRatio * 55) + titleBonus + streamBonus + 20;
          finalScore = Math.min(98, Math.max(45, base));
          if (isDerivedRoleTitleMatched && primaryInferredStack) {
            recommendation = `🎯 Strong Tech Stack Match! Your experience in ${primaryInferredStack.matchedComponents.join(", ")} directly aligns with this ${job.title} (${primaryInferredStack.name}) role.`;
          } else if (isStreamMatch) {
            recommendation = `🎯 High ATS Match in your stream (${primaryStream.label})! Your ${experienceYears} years of experience and background in ${matched.slice(0, 3).join(", ") || "core tools"} strongly align with this position.`;
          } else {
            recommendation = `Good Technical Overlap. Your background in ${matched.slice(0, 3).join(", ") || "related tech"} provides transferable value for this ${job.stream?.label || "engineering"} role.`;
          }
        }
      }
    }
  }

  return {
    matchScore: finalScore,
    matchedSkills: matched.slice(0, 8),
    missingSkills: missing.slice(0, 6),
    matchedResumeKeywords: fullMatchedFromResume.slice(0, 10),
    matchedResumeRoles,
    inferredStackMatched: primaryInferredStack ? primaryInferredStack.name : null,
    isDerivedRoleMatched: isDerivedRoleTitleMatched,
    matchedDerivedRoleName,
    resumeMatchReason,
    keywordMatchCount: fullMatchedFromResume.length,
    isFresherMatched: isFresherRole,
    streamFit,
    isStreamMatch,
    isTrackMatch,
    recommendation,
  };
}

export async function getJobsForCandidate(userId, options = {}) {
  const {
    company: companySlug = "",
    role: roleQuery = "",
    location = "All",
    country = "All",
    category = "", // Category filter: "Indian Startups & Unicorns", "Small Startups & Emerging Tech", "Indian Tech Giants & IT Leaders", etc.
    track = "", // "my_track" | "tech" | "management" | "All"
    stream = "",
    employmentType = "",
    experienceLevel = "",
    fresherOnly = false,
    forceRefresh = false,
    useNewResume = false,
    strictAiOnly = false,
    aiDeepMatch = true,
    realOnly = true, // Default to true: only list real verified openings
    portalSource = "All", // "All" | "official" | "linkedin" | "third_party"
  } = options;

  const isBypassCache =
    forceRefresh === true ||
    forceRefresh === "true" ||
    useNewResume === true ||
    useNewResume === "true";

  // 1. Fetch user resume and analysis
  let resumeText = "";
  let resumeAnalysis = null;
  let resumeDoc = null;

  if (userId) {
    try {
      const [resume, analysis] = await Promise.all([
        ResumesCollection.findOne({ user_id: userId }).sort({ updatedAt: -1, createdAt: -1 }),
        ResumeAnalysis.findOne({ user_id: userId }).sort({ updatedAt: -1, createdAt: -1 }),
      ]);

      if (resume) {
        resumeDoc = resume;
        if (resume.parsed_data) {
          resumeText = resume.parsed_data;
        }
      }
      if (analysis) {
        resumeAnalysis = analysis;
      }
    } catch (e) {
      console.warn("[CareerService] Could not load resume context for user:", e.message);
    }
  }

  const hasUserResume = Boolean(resumeText || resumeAnalysis);
  const candidateProfile = analyzeCandidateProfile(resumeText, resumeAnalysis);
  const effectiveTrack = track || (hasUserResume && candidateProfile.track?.id) || "All";

  // 2. Fetch jobs from in-memory cache, MongoDB cache, or live ATS
  const effectiveLocation = location && location !== "All" ? location : (country && country !== "All" ? country : "India");
  const cacheKey = `${companySlug || "ALL"}_${roleQuery || "ALL"}_${country || "ALL"}_${location || "ALL"}`;
  let rawJobs = [];
  let isLiveScan = false;
  let isThrottled = false;
  let scannedAt = new Date();
  const scanStartTime = Date.now();

  const memoryCached = jobsCache.get(cacheKey);

  // Anti-spam debounce: if user repeatedly hits forceRefresh within cooldown window
  if (isBypassCache && memoryCached && (Date.now() - memoryCached.timestamp < RE_SCAN_COOLDOWN_MS)) {
    rawJobs = memoryCached.jobs;
    scannedAt = new Date(memoryCached.timestamp);
    isThrottled = true;
    isLiveScan = false;
  } else if (!isBypassCache) {
    if (memoryCached && Date.now() - memoryCached.timestamp < CACHE_TTL_MS) {
      rawJobs = memoryCached.jobs;
      scannedAt = new Date(memoryCached.timestamp);
    } else {
      // Check MongoDB cache (filter strictly for genuine live openings)
      try {
        const mongoQuery = companySlug ? { companySlug } : {};
        const storedJobs = await DiscoveredCareerJob.find(mongoQuery)
          .sort({ createdAt: -1 })
          .limit(300)
          .lean();

        const validStoredJobs = (storedJobs || []).filter((j) => isRealOpeningUrl(j.applyUrl));
        if (validStoredJobs.length > 0) {
          rawJobs = validStoredJobs;
          scannedAt = validStoredJobs[0].scannedAt || new Date();
          jobsCache.set(cacheKey, { timestamp: scannedAt.getTime(), jobs: rawJobs });
        }
      } catch (dbErr) {
        console.warn("[CareerService] MongoDB cache read error:", dbErr.message);
      }
    }
  }

  // If still empty or forceRefresh requested (and not throttled) -> Fetch Live from ATS connectors
  if (rawJobs.length === 0 || (isBypassCache && !isThrottled)) {
    isLiveScan = true;
    scannedAt = new Date();

    if (companySlug) {
      rawJobs = await fetchJobsForCompany(companySlug, roleQuery, location);
    } else {
      {
      const liveDiscovered = await fetchAllCuratedJobs(30, roleQuery);
      // Merge live discovered jobs with existing stored jobs in database
      const poolMap = new Map();
      for (const j of rawJobs) {
        const k = j.applyUrl || `${j.companySlug || j.company}_${j.externalId || j.id || j.title}`;
        if (k) poolMap.set(k, j);
      }
      for (const j of liveDiscovered) {
        const k = j.applyUrl || `${j.companySlug || j.company}_${j.externalId || j.id || j.title}`;
        if (k) poolMap.set(k, j);
      }
      rawJobs = Array.from(poolMap.values());
      if (rawJobs.length === 0) rawJobs = liveDiscovered;
    }
    }

    // Filter strictly to ensure 100% genuine live requisitions
    rawJobs = (rawJobs || []).filter((j) => isRealOpeningUrl(j.applyUrl));

    // Update in-memory cache
    jobsCache.set(cacheKey, { timestamp: Date.now(), jobs: rawJobs });

    // Persist to MongoDB with TTL in the background
    if (rawJobs.length > 0) {
      const ops = rawJobs.map((job) => ({
        updateOne: {
          filter: {
            companySlug: job.companySlug || "general",
            externalId: job.externalId || job.id,
          },
          update: {
            $set: {
              ...job,
              scannedAt,
            },
          },
          upsert: true,
        },
      }));

      DiscoveredCareerJob.bulkWrite(ops).catch((e) =>
        console.warn("[CareerService] MongoDB bulk write warning:", e.message)
      );
    }
  }

  const scanDurationMs = Date.now() - scanStartTime;

  // Compute total pool counts by portal type
  const portalCounts = {
    all: rawJobs.length,
    official: 0,
    linkedin: 0,
    third_party: 0,
  };
  rawJobs.forEach((j) => {
    const { portalType } = classifyPortalSource(j);
    if (portalType === "linkedin") portalCounts.linkedin++;
    else if (portalType === "third_party") portalCounts.third_party++;
    else portalCounts.official++;
  });

  // 3. Filter by roleQuery if provided (and trigger targeted live search if needed)
  const isAllInferredQuery =
    Boolean(roleQuery) &&
    (roleQuery.toLowerCase().includes("all_inferred") ||
      roleQuery.toLowerCase().includes("all inferred") ||
      roleQuery.toLowerCase().includes("all-inferred"));

  const allInferredTerms = Array.from(
    new Set([
      ...(candidateProfile.inferredStacks || []).map((s) => s.name),
      ...(candidateProfile.derivedRoleTitles || []),
      ...(candidateProfile.derivedSearchKeywords || []),
    ])
  );

  let filteredJobs = rawJobs;
  if (isAllInferredQuery) {
    if (allInferredTerms.length > 0) {
      filteredJobs = rawJobs.filter((j) => {
        return (
          allInferredTerms.some((term) => matchesSmartRoleQuery(j, term)) ||
          j.inferredStackMatched ||
          j.isDerivedRoleMatched ||
          (j.matchedResumeRoles && j.matchedResumeRoles.length > 0)
        );
      });
    }

    // Trigger multi-role live discovery across candidate's top derived roles if pool is small
    if (filteredJobs.length < 5 && candidateProfile.derivedRoleTitles?.length > 0) {
      try {
        const topDerivedRoles = candidateProfile.derivedRoleTitles.slice(0, 3);
        for (const roleTitle of topDerivedRoles) {
          const liveCrawled = await linkedInJobSearchService.searchLinkedInCompanyJobs(
            companySlug || "",
            roleTitle,
            location,
            8
          );
          if (liveCrawled && liveCrawled.length > 0) {
            const existingIds = new Set(filteredJobs.map((j) => j.externalId || j.id || j.applyUrl));
            for (const newJob of liveCrawled) {
              const id = newJob.externalId || newJob.id || newJob.applyUrl;
              if (!existingIds.has(id)) {
                filteredJobs.push(newJob);
                existingIds.add(id);
              }
            }
          }
        }
      } catch (err) {
        // note silenced
      }
    }
  } else if (roleQuery && roleQuery.trim()) {
    filteredJobs = rawJobs.filter((j) => matchesSmartRoleQuery(j, roleQuery));

    // If local cache had very few matches for this role, execute live ATS discovery for this query
    if (filteredJobs.length < 3) {
      try {
        const liveDiscovered = await fetchAllCuratedJobs(25, roleQuery);
        if (liveDiscovered.length > 0) {
          const existingIds = new Set(filteredJobs.map((j) => j.externalId || j.id || j.applyUrl));
          for (const newJob of liveDiscovered) {
            const id = newJob.externalId || newJob.id || newJob.applyUrl;
            if (!existingIds.has(id)) {
              filteredJobs.push(newJob);
              existingIds.add(id);
            }
          }
        }
      } catch (err) {
        // note silenced
      }
    }

    // Concurrently trigger live LinkedIn company jobs search for this role/company query
    try {
      const liveLinkedIn = await linkedInJobSearchService.searchLinkedInCompanyJobs(
        companySlug || "",
        roleQuery,
        location,
        15
      );
      if (liveLinkedIn && liveLinkedIn.length > 0) {
        const existingIds = new Set(filteredJobs.map((j) => j.externalId || j.id || j.applyUrl));
        for (const newJob of liveLinkedIn) {
          const id = newJob.externalId || newJob.id || newJob.applyUrl;
          if (!existingIds.has(id)) {
            filteredJobs.push(newJob);
            existingIds.add(id);
          }
        }
      }
    } catch (liErr) {
      // note silenced
    }
  } else if (!roleQuery && candidateProfile.skills?.length > 0 && isLiveScan) {
    // If user has a resume but didn't type a specific query, dynamically crawl live LinkedIn jobs for candidate's actual resume technologies AND derived roles
    try {
      const topRoleQuery = candidateProfile.derivedRoleTitles?.[0] || "";
      const resumeDiscovered = await linkedInJobSearchService.crawlCandidateJobs(
        candidateProfile.skills,
        topRoleQuery,
        location,
        5,
        candidateProfile.derivedRoleTitles || []
      );
      if (resumeDiscovered && resumeDiscovered.length > 0) {
        const existingIds = new Set(filteredJobs.map((j) => j.externalId || j.id || j.applyUrl));
        for (const newJob of resumeDiscovered) {
          const id = newJob.externalId || newJob.id || newJob.applyUrl;
          if (!existingIds.has(id)) {
            filteredJobs.push(newJob);
            existingIds.add(id);
          }
        }
      }
    } catch (crawlErr) {
      // note silenced
    }
  }

  // 3.6 Location-targeted live discovery if user requested a specific tech hub/city with few matches
  if (location && location !== "All" && location !== "all" && location !== "any") {
    const currentLocMatches = filteredJobs.filter((j) => matchesTechHub(j.location || j.country || "", location, country));
    if (currentLocMatches.length < 4) {
      try {
        const queryTerm = roleQuery || candidateProfile.derivedRoleTitles?.[0] || (candidateProfile.skills?.length > 0 ? candidateProfile.skills.slice(0, 3).join(" ") : "Software Engineer");
        const locJobs = await linkedInJobSearchService.crawlCandidateJobs(
          candidateProfile.skills || ["Software Engineer"],
          queryTerm,
          location,
          8,
          candidateProfile.derivedRoleTitles || []
        );
        if (locJobs && locJobs.length > 0) {
          const existingIds = new Set(filteredJobs.map((j) => j.externalId || j.id || j.applyUrl));
          for (const newJob of locJobs) {
            const id = newJob.externalId || newJob.id || newJob.applyUrl;
            if (!existingIds.has(id)) {
              filteredJobs.push(newJob);
              existingIds.add(id);
            }
          }
        }
      } catch (locCrawlErr) {
        // note silenced
      }
    }
  }

  // 3.5 Real Openings Filter: Strictly require genuine verified opening URLs
  const isRealOnlyActive = realOnly === true || realOnly === "true";
  if (isRealOnlyActive) {
    filteredJobs = filteredJobs.filter((j) => isRealOpeningUrl(j.applyUrl));
  }

  // 4. Domain Track Filter (Tech vs Management) - ONLY filter if user EXPLICITLY requested a specific track (not "All", not default)
  if (track && track !== "All" && track !== "all" && track !== "my_track") {
    const trackLower = track.toLowerCase().trim();
    const trackMatches = filteredJobs.filter((j) => {
      const jobTrack = (j.track?.id || j.track || j.stream?.track || "tech").toLowerCase();
      return jobTrack === trackLower;
    });
    // Loose coupling: if matches exist, filter to them; otherwise keep all and let ranker prioritize
    if (trackMatches.length > 0) {
      filteredJobs = trackMatches;
    }
  }

  // 5. Filter by Stream (Full Stack, Product Management, AI/ML, Backend, etc.) - Soft/flexible match
  if (stream && stream !== "All" && stream !== "all" && stream !== "my_stream") {
    const streamMatches = filteredJobs.filter((j) => {
      if (j.stream?.id === stream) return true;
      const title = (j.title || "").toLowerCase();
      const desc = (j.description || "").toLowerCase();
      return title.includes(stream.toLowerCase()) || desc.includes(stream.toLowerCase());
    });
    if (streamMatches.length > 0) {
      filteredJobs = streamMatches;
    }
  }

  // 6. Filter by Employment Type (Internship vs Full-time)
  if (employmentType && employmentType !== "All" && employmentType !== "all") {
    const empLower = employmentType.toLowerCase().trim();
    const empMatches = filteredJobs.filter((j) => {
      const jEmp = (j.employmentType || "Full-time").toLowerCase();
      const jTitle = (j.title || "").toLowerCase();
      if (empLower === "internship") return jEmp.includes("intern") || jTitle.includes("intern");
      if (empLower === "full-time") return jEmp.includes("full") || (!jEmp.includes("intern") && !jTitle.includes("intern"));
      return jEmp.includes(empLower) || jTitle.includes(empLower);
    });
    if (empMatches.length > 0) {
      filteredJobs = empMatches;
    }
  }

  // 7. Filter by Experience Level or Fresher Only - Flexible matching
  if (fresherOnly === true || fresherOnly === "true") {
    const fresherMatches = filteredJobs.filter(
      (j) =>
        j.isFresherFriendly ||
        j.employmentType === "Internship" ||
        (j.experienceLevel && j.experienceLevel.toLowerCase().includes("fresher")) ||
        (typeof j.minExperienceYears === "number" && j.minExperienceYears <= 2) ||
        (j.title && /fresher|intern|trainee|graduate|junior|associate|sde 1|sde-1|entry/i.test(j.title))
    );
    if (fresherMatches.length > 0) {
      filteredJobs = fresherMatches;
    }
  }

  if (experienceLevel && experienceLevel !== "All" && experienceLevel !== "all") {
    const levelLower = experienceLevel.toLowerCase();
    const expMatches = filteredJobs.filter((j) => {
      const jLevel = (j.experienceLevel || "").toLowerCase();
      const jTitle = (j.title || "").toLowerCase();
      const minYears = typeof j.minExperienceYears === "number" ? j.minExperienceYears : -1;

      if (levelLower.includes("fresher")) {
        return (
          j.isFresherFriendly ||
          j.employmentType === "Internship" ||
          jLevel.includes("fresher") ||
          jLevel.includes("0-1") ||
          (minYears >= 0 && minYears <= 2) ||
          /fresher|intern|graduate|trainee|entry/i.test(jTitle)
        );
      }
      if (levelLower.includes("junior")) {
        return (
          jLevel.includes("junior") ||
          jLevel.includes("1-3") ||
          (minYears >= 0 && minYears <= 3) ||
          /junior|sde 1|sde-1|sde i|associate|engineer/i.test(jTitle)
        );
      }
      if (levelLower.includes("mid")) {
        return (
          jLevel.includes("mid") ||
          jLevel.includes("3-5") ||
          (minYears >= 2 && minYears <= 5) ||
          /mid|sde 2|sde-2|sde ii/i.test(jTitle)
        );
      }
      if (levelLower.includes("senior")) {
        return (
          jLevel.includes("senior") ||
          jLevel.includes("5+") ||
          minYears >= 4 ||
          /senior|lead|staff|principal|architect/i.test(jTitle)
        );
      }
      return true;
    });
    if (expMatches.length > 0) {
      filteredJobs = expMatches;
    }
  }

  // 7.5 Filter by Company Category (Flexible, loose match)
  if (category && category !== "All" && category !== "all") {
    const catLower = category.toLowerCase().trim();
    const catMatches = filteredJobs.filter((j) => {
      const reg = findCompanyByIdOrSlug(j.companySlug || j.company);
      const cat = (reg?.category || j.companyCategory || "").toLowerCase();
      if (catLower.includes("small startup") || catLower.includes("emerging")) {
        return (
          cat.includes("small") ||
          cat.includes("emerging") ||
          Boolean(j.isSmallStartup) ||
          [
            "pocketfm", "slice", "devrev", "signoz", "devtron", "appsmith",
            "hasura", "plum", "kula", "classplus", "fampay", "jar", "sprinto"
          ].includes((reg?.id || j.companySlug || "").toLowerCase())
        );
      }
      if (catLower.includes("unicorn") || catLower.includes("startup")) {
        return (
          cat.includes("startup") ||
          cat.includes("unicorn") ||
          [
            "razorpay", "swiggy", "meesho", "paytm", "cred", "groww", "zeta",
            "inmobi", "zomato", "zepto", "postman", "browserstack", "flipkart",
            "phonepe", "zerodha", "urbancompany", "ola", "physicswallah"
          ].includes((reg?.id || j.companySlug || "").toLowerCase())
        );
      }
      if (catLower.includes("giant") || catLower.includes("it leader") || catLower.includes("leader") || catLower.includes("mnc")) {
        return (
          cat.includes("giant") ||
          cat.includes("leader") ||
          cat.includes("mnc") ||
          [
            "tcs", "infosys", "wipro", "hcltech", "zoho", "jio",
            "ltimindtree", "techmahindra", "persistent", "tataelxsi",
            "google", "microsoft", "amazon", "cognizant", "capgemini", "accenture"
          ].includes((reg?.id || j.companySlug || "").toLowerCase())
        );
      }
      return cat.includes(catLower) || catLower.includes(cat);
    });
    if (catMatches.length > 0) {
      filteredJobs = catMatches;
    }
  }

  // 7.6 Filter by Country & Tech Hub Sector
  if (country && country !== "All" && country !== "all") {
    const countryMatches = filteredJobs.filter((j) => matchesCountry(j.location || j.country || "", country));
    if (countryMatches.length > 0) {
      filteredJobs = countryMatches;
    }
  }

  if (location && location !== "All" && location !== "all" && location !== "any") {
    const hubMatches = filteredJobs.filter((j) => matchesTechHub(j.location || j.country || "", location, country));
    if (hubMatches.length > 0) {
      filteredJobs = hubMatches;
    } else {
      const textMatches = filteredJobs.filter((j) => (j.location || "").toLowerCase().includes(location.toLowerCase()));
      filteredJobs = textMatches;
    }
  }

  // 7.7 Filter by Portal Source (Official Career Portal vs LinkedIn vs Third-Party)
  if (portalSource && portalSource !== "All" && portalSource !== "all") {
    const psLower = portalSource.toLowerCase().trim();
    const psMatches = filteredJobs.filter((j) => {
      const { portalType } = classifyPortalSource(j);
      if (psLower === "linkedin") return portalType === "linkedin";
      if (psLower === "official" || psLower === "real" || psLower === "ats") return portalType === "official";
      if (psLower === "third_party" || psLower === "third-party" || psLower === "external") return portalType === "third_party";
      return true;
    });
    if (psMatches.length > 0) {
      filteredJobs = psMatches;
    }
  }

  // Final Guard: If tight filters wiped out all results, restore rawJobs (filtered strictly for real openings)
  if (filteredJobs.length === 0 && rawJobs.length > 0) {
    filteredJobs = rawJobs.filter((j) => isRealOpeningUrl(j.applyUrl));
  }

  if (isRealOnlyActive) {
    filteredJobs = filteredJobs.filter((j) => isRealOpeningUrl(j.applyUrl));
  }

  // Deduplicate jobs by unique requisition key (applyUrl or company + title)
  const uniqueFilteredJobs = [];
  const seenJobKeys = new Set();
  for (const job of filteredJobs) {
    const key = (job.applyUrl && job.applyUrl.toLowerCase().trim()) ||
      `${(job.company || "").toLowerCase().trim()}::${(job.title || "").toLowerCase().trim()}`;
    if (!seenJobKeys.has(key)) {
      seenJobKeys.add(key);
      uniqueFilteredJobs.push(job);
    }
  }

  // 8. Compute Base Match Scores for each job & enrich with Official Portal Metadata & Structured JD
  const scoredJobs = uniqueFilteredJobs.map((job) => {
    const regCompany = findCompanyByIdOrSlug(job.companySlug || job.company);
    const rawDesc = job.fullDescription || (job.description && job.description.length > 200 ? job.description : "");
    const fullDescText = cleanHtmlToText(rawDesc);
    const isFullJdReady = Boolean(job.hasFullJD || (fullDescText && fullDescText.length > 400));
    const isDirtyJD =
      !job.structuredJD?.fullText ||
      job.structuredJD.fullText.length < 50 ||
      (job.structuredJD?.summary && (job.structuredJD.summary.includes("<") || job.structuredJD.summary.includes("&lt;"))) ||
      (Array.isArray(job.structuredJD?.keyResponsibilities) &&
        job.structuredJD.keyResponsibilities.some(
          (r) => typeof r === "string" && (r.includes("<") || /^(ul\d*|li\d*|p\d*|\d+)$/i.test(r.trim()))
        ));

    const structuredJD = !isDirtyJD
      ? job.structuredJD
      : parseStructuredJD(
          job.title,
          fullDescText || cleanHtmlToText(job.description || job.descriptionSummary || job.title),
          job.fullDescriptionHtml || ""
        );
    const fresherInfo = structuredJD.experienceRequirement;
    const isDirectReal = isRealOpeningUrl(job.applyUrl);
    const isSmall = Boolean(
      job.isSmallStartup ||
      regCompany?.category === "Small Startups & Emerging Tech" ||
      job.companyCategory === "Small Startups & Emerging Tech"
    );

    // Classify into exact source origin
    const { portalType, portalTypeLabel } = classifyPortalSource(job);

    const enriched = {
      ...job,
      id: job._id ? String(job._id) : job.id || job.externalId,
      fullDescription: fullDescText,
      hasFullJD: isFullJdReady,
      companyCategory: regCompany?.category || job.companyCategory || (isSmall ? "Small Startups & Emerging Tech" : "Tech & Innovation Leader"),
      companyLogo:
        regCompany?.logo ||
        job.logo ||
        `https://${(job.companySlug || "company").replace(/[^a-z0-9]/g, "")}.com/favicon.ico`,
      officialPortalUrl: regCompany?.officialPortalUrl || regCompany?.website || job.applyUrl,
      sourcePortal: regCompany?.officialPortalUrl
        ? "Official Career Portal"
        : job.portalLabel || (job.applyUrl?.includes("linkedin.com") ? "LinkedIn Job Profile" : "Direct ATS Portal"),
      isRealOpening: isDirectReal,
      isSmallStartup: isSmall,
      portalType,
      portalTypeLabel,
      structuredJD,
      candidateType: fresherInfo.candidateType,
      eligibilityVerdict: fresherInfo.eligibilityVerdict,
      fresherEligibilityReason: fresherInfo.fresherEligibilityReason,
      isFresherFriendly: fresherInfo.isFresher,
      experienceLevel: fresherInfo.isFresher
        ? "Fresher / Entry-Level (0-1 yr)"
        : fresherInfo.candidateType,
      minExperienceYears: fresherInfo.minYears,
      maxExperienceYears: fresherInfo.maxYears,
    };
    const matchAnalysis = computeJobMatch(enriched, candidateProfile, resumeText);
    let finalScore = matchAnalysis.matchScore || 65;

    // Relevance booster when user specifically filtered or searched for a role/stack
    if (roleQuery && roleQuery.trim()) {
      const q = roleQuery.toLowerCase().trim();
      const titleLower = (enriched.title || "").toLowerCase();
      const rolesLower = (matchAnalysis.matchedResumeRoles || []).map((r) => r.toLowerCase());
      if (titleLower.includes(q)) {
        finalScore = Math.max(finalScore, 92);
      } else if (rolesLower.some((r) => r.includes(q) || q.includes(r))) {
        finalScore = Math.max(finalScore, 86);
      }
    }

    return {
      ...enriched,
      ...matchAnalysis,
      matchScore: finalScore,
    };
  });

  // 9. Deep AI Evaluation (Gemini 3.1 Flash / LLM) for Strict Resume Relevance
  let finalJobs = scoredJobs;
  const isStrict = strictAiOnly === true || strictAiOnly === "true";
  const isAiEnabled = aiDeepMatch !== false && aiDeepMatch !== "false";

  if (isAiEnabled && hasUserResume && scoredJobs.length > 0) {
    // Run Gemini AI deep evaluation across candidate openings
    finalJobs = await aiJobMatcherService.evaluateJobsBatch(
      candidateProfile,
      resumeText,
      scoredJobs,
      { strictAiOnly: isStrict, minAiScore: 60 }
    );
  }

  // 10. Precision Sort: Prioritize role query matches, direct track match, AI score, then base ATS score
  finalJobs.sort((a, b) => {
    // 0. Direct Role Query Match
    if (isAllInferredQuery) {
      const aInferred = Boolean(
        a.inferredStackMatched ||
        a.isDerivedRoleMatched ||
        (a.matchedResumeRoles && a.matchedResumeRoles.length > 0)
      );
      const bInferred = Boolean(
        b.inferredStackMatched ||
        b.isDerivedRoleMatched ||
        (b.matchedResumeRoles && b.matchedResumeRoles.length > 0)
      );
      if (aInferred && !bInferred) return -1;
      if (!aInferred && bInferred) return 1;
    } else if (roleQuery && roleQuery.trim()) {
      const q = roleQuery.toLowerCase().trim();
      const aDirect =
        (a.title || "").toLowerCase().includes(q) ||
        (a.matchedResumeRoles || []).some((r) => r.toLowerCase().includes(q) || q.includes(r.toLowerCase()));
      const bDirect =
        (b.title || "").toLowerCase().includes(q) ||
        (b.matchedResumeRoles || []).some((r) => r.toLowerCase().includes(q) || q.includes(r.toLowerCase()));
      if (aDirect && !bDirect) return -1;
      if (!aDirect && bDirect) return 1;
    }

    // 1. Direct Track Match (Management candidate gets Management roles first, Tech gets Tech roles)
    if (a.isTrackMatch && !b.isTrackMatch) return -1;
    if (!a.isTrackMatch && b.isTrackMatch) return 1;

    // 2. AI Precision Match Score if available
    const scoreA = a.aiMatch?.aiScore ?? a.matchScore ?? 0;
    const scoreB = b.aiMatch?.aiScore ?? b.matchScore ?? 0;
    if (scoreB !== scoreA) return scoreB - scoreA;

    // 3. Direct Stream Match within track
    if (a.isStreamMatch && !b.isStreamMatch) return -1;
    if (!a.isStreamMatch && b.isStreamMatch) return 1;

    // 4. Base ATS Match Score
    return (b.matchScore || 0) - (a.matchScore || 0);
  });

  return {
    totalJobs: finalJobs.length,
    portalCounts,
    scannedAt: scannedAt.toISOString(),
    isLiveScan,
    isThrottled,
    isAiDeepMatched: isAiEnabled && hasUserResume,
    strictAiOnlyActive: isStrict,
    scanTelemetry: {
      scannedPortals: companySlug ? 1 : 14,
      providers: ["Greenhouse", "Lever", "SmartRecruiters"],
      totalJobsDiscovered: rawJobs.length,
      filteredJobsCount: finalJobs.length,
      scanDurationMs,
      isLiveScan,
      isThrottled,
      isAiEvaluated: isAiEnabled && hasUserResume,
      scannedAt: scannedAt.toISOString(),
    },
    candidateProfile: {
      isFresher: candidateProfile.isFresher,
      experienceYears: candidateProfile.experienceYears,
      experienceLevel: candidateProfile.experienceLevel,
      track: candidateProfile.track,
      primaryStream: candidateProfile.primaryStream,
      secondaryStream: candidateProfile.secondaryStream,
      streamScores: candidateProfile.streamScores,
      skillsCount: candidateProfile.skills.length,
      skills: candidateProfile.skills.slice(0, 25),
      resumeKeywords: candidateProfile.resumeKeywords || [],
      roleKeywords: candidateProfile.roleKeywords || [],
      allSearchTerms: candidateProfile.allSearchTerms || [],
      inferredStacks: candidateProfile.inferredStacks || [],
      primaryInferredStack: candidateProfile.primaryInferredStack || null,
      derivedRoleTitles: candidateProfile.derivedRoleTitles || [],
      derivedSearchKeywords: candidateProfile.derivedSearchKeywords || [],
      stackExplanationBullets: candidateProfile.stackExplanationBullets || [],
      resumeId: resumeDoc?._id || null,
      resumeUpdatedAt: resumeDoc?.updatedAt ? new Date(resumeDoc.updatedAt).toISOString() : null,
      isNewResumeEvaluated: Boolean(useNewResume || isBypassCache),
    },
    isAllInferredSearch: isAllInferredQuery,
    allInferredSearchTerms: allInferredTerms,
    activeTrack: effectiveTrack || "All",
    activeCountry: country || "All",
    activeLocation: location || "All",
    availableCountries: TECH_COUNTRIES,
    isAutoDomainMatched: Boolean(hasUserResume && candidateProfile.track?.id && effectiveTrack === candidateProfile.track.id),
    availableTracks: Object.values(DOMAIN_TRACKS),
    availableStreams: Object.values(CAREER_STREAMS),
    hasResume: Boolean(resumeText || resumeAnalysis),
    jobs: finalJobs,
  };
}

export async function scanCompanyOriginalPortal(companyIdentifier, roleQuery = "", location = "India", userId = null) {
  const company = findCompanyByIdOrSlug(companyIdentifier) || {
    id: companyIdentifier.toLowerCase().replace(/[^a-z0-9]/g, ""),
    name: companyIdentifier,
    slug: companyIdentifier.toLowerCase().replace(/[^a-z0-9]/g, "-"),
    provider: "ai_search",
    category: "Tech & Innovation Leader",
    officialPortalUrl: `https://${companyIdentifier.toLowerCase().replace(/[^a-z0-9]/g, "")}.com/careers`,
    website: `https://${companyIdentifier.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
    logo: `https://${companyIdentifier.toLowerCase().replace(/[^a-z0-9]/g, "")}.com/favicon.ico`,
    headquarters: "India",
    description: `${companyIdentifier} technology career opportunities.`,
  };

  // 1. Fetch user resume if available for personalized scoring
  let resumeText = "";
  let resumeAnalysis = null;
  if (userId) {
    try {
      const [resume, analysis] = await Promise.all([
        ResumesCollection.findOne({ user_id: userId }),
        ResumeAnalysis.findOne({ user_id: userId }),
      ]);
      if (resume?.parsed_data) resumeText = resume.parsed_data;
      if (analysis) resumeAnalysis = analysis;
    } catch (e) {
      console.warn("[CareerService] Scan portal resume load warning:", e.message);
    }
  }

  const candidateProfile = analyzeCandidateProfile(resumeText, resumeAnalysis);

  // 2. Scan directly from official portal / ATS
  const rawJobs = await fetchJobsForCompany(company.slug || company.id || company.name, roleQuery, location);

  // 3. Enrich & score
  const scoredJobs = rawJobs.map((job) => {
    const enriched = {
      ...job,
      company: company.name,
      companySlug: company.slug,
      companyCategory: company.category,
      companyLogo: company.logo,
      officialPortalUrl: company.officialPortalUrl || job.applyUrl,
      sourcePortal: "Official Company Career Portal",
    };
    const matchAnalysis = computeJobMatch(enriched, candidateProfile, resumeText);
    return {
      ...enriched,
      ...matchAnalysis,
    };
  });

  // Sort by match score
  scoredJobs.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  // Persist discovered jobs to Mongo in background
  if (scoredJobs.length > 0) {
    const ops = scoredJobs.map((job) => ({
      updateOne: {
        filter: {
          companySlug: job.companySlug || "general",
          externalId: job.externalId || job.id,
        },
        update: {
          $set: {
            ...job,
            scannedAt: new Date(),
          },
        },
        upsert: true,
      },
    }));
    DiscoveredCareerJob.bulkWrite(ops).catch(() => {});
  }

  return {
    company,
    officialPortalUrl: company.officialPortalUrl,
    portalLabel: `${company.name} Official Careers Portal`,
    totalJobs: scoredJobs.length,
    scannedAt: new Date().toISOString(),
    jobs: scoredJobs,
  };
}

/**
 * Allows users/recruiters to post or import any small startup job profile (e.g. from LinkedIn or direct link)
 */
export async function postStartupJobProfile(jobPayload = {}, userId = null) {
  const {
    applyUrl = "",
    company = "",
    title = "",
    location = "India / Remote",
    description = "",
    skills = [],
    employmentType = "Full-time",
    isFresherFriendly = false,
  } = jobPayload;

  if (!applyUrl && !title) {
    throw new Error("Job title and/or link are required to post a job profile");
  }

  // 1. If an external URL is provided (LinkedIn, startup link, ATS link), crawl & auto-enrich
  let crawledData = null;
  if (applyUrl) {
    try {
      crawledData = await crawlJobPostingUrl(applyUrl);
    } catch (e) {
      console.warn("[CareerService] Post job crawl warning:", e.message);
    }
  }

  const resolvedCompany = company || crawledData?.company || "Emerging Tech Startup";
  const resolvedTitle = title || crawledData?.title || "Software Engineer";
  const resolvedDesc = description || crawledData?.cleanText || `${resolvedTitle} opportunity at ${resolvedCompany}.`;
  const resolvedLocation = location || crawledData?.location || "India / Remote";

  // 2. Structured JD Extraction & Classification
  const structuredJD = crawledData?.structuredJD || parseStructuredJD(resolvedTitle, resolvedDesc);
  const fresherInfo = structuredJD.experienceRequirement;
  const extractedSkills = extractSkillsFromText(`${resolvedTitle} ${resolvedDesc}`);
  const combinedSkills = [
    ...new Set([
      ...(Array.isArray(skills) ? skills : []),
      ...(structuredJD.techStack || []),
      ...extractedSkills,
    ]),
  ];

  const streamInfo = detectStreamFromTextAndSkills(resolvedTitle, combinedSkills);
  const classified = classifyJobTypeAndExperience(resolvedTitle, resolvedDesc);

  const portalInfo = applyUrl ? identifyPortalProvider(applyUrl) : null;
  const isLinkedIn = (applyUrl || "").toLowerCase().includes("linkedin.com");
  const resolvedSlug = resolvedCompany.toLowerCase().replace(/[^a-z0-9]/g, "-");
  const externalId = `startup_post_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  const newJob = {
    id: externalId,
    externalId,
    company: resolvedCompany,
    companySlug: resolvedSlug,
    companyCategory: "Small Startups & Emerging Tech",
    source: isLinkedIn ? "linkedin_job_post" : (portalInfo?.providerId || "startup_direct_post"),
    sourcePortal: isLinkedIn ? "LinkedIn Job Post" : (portalInfo?.label || "Startup Job Profile"),
    portalLabel: isLinkedIn ? "LinkedIn Job Profile (Verified Post)" : "Direct Startup Post",
    title: resolvedTitle,
    location: resolvedLocation,
    isRemote: Boolean(resolvedLocation.toLowerCase().includes("remote") || jobPayload.isRemote),
    employmentType: employmentType || classified.employmentType,
    experienceLevel: fresherInfo.isFresher ? "Fresher / Entry-Level (0-1 yr)" : (classified.experienceLevel || "Junior (1-3 yrs)"),
    minExperienceYears: fresherInfo.minYears || 0,
    maxExperienceYears: fresherInfo.maxYears || 3,
    isFresherFriendly: Boolean(isFresherFriendly || fresherInfo.isFresher || classified.isFresherFriendly),
    candidateType: fresherInfo.candidateType,
    eligibilityVerdict: fresherInfo.eligibilityVerdict,
    fresherEligibilityReason: fresherInfo.fresherEligibilityReason,
    requiredSkills: combinedSkills.length > 0 ? combinedSkills : ["Problem Solving", "JavaScript", "React"],
    stream: streamInfo.primaryStream,
    track: streamInfo.track,
    departments: ["Engineering / Product"],
    applyUrl: applyUrl || `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(resolvedCompany + " " + resolvedTitle)}`,
    isRealOpening: Boolean(applyUrl ? isRealOpeningUrl(applyUrl) : true),
    isSmallStartup: true,
    description: resolvedDesc,
    descriptionSummary: resolvedDesc.slice(0, 400),
    structuredJD,
    postedAt: new Date(),
    scannedAt: new Date(),
  };

  // 3. Persist to MongoDB
  try {
    await DiscoveredCareerJob.findOneAndUpdate(
      { companySlug: newJob.companySlug, externalId: newJob.externalId },
      { $set: newJob },
      { upsert: true, new: true }
    );
  } catch (dbErr) {
    console.warn("[CareerService] Error saving posted job:", dbErr.message);
  }

  // 4. Invalidate memory cache so newly posted job appears immediately
  jobsCache.clear();

  // 5. Score against candidate profile if resume present
  let resumeText = "";
  let resumeAnalysis = null;
  if (userId) {
    try {
      const [resume, analysis] = await Promise.all([
        ResumesCollection.findOne({ user_id: userId }),
        ResumeAnalysis.findOne({ user_id: userId }),
      ]);
      if (resume?.parsed_data) resumeText = resume.parsed_data;
      if (analysis) resumeAnalysis = analysis;
    } catch {}
  }

  const candidateProfile = analyzeCandidateProfile(resumeText, resumeAnalysis);
  const matchResult = computeJobMatch(newJob, candidateProfile, resumeText);

  return {
    ...newJob,
    ...matchResult,
    success: true,
    message: "Startup job profile successfully posted and added to career listings!",
  };
}

export async function getJobDetailsFull(payload = {}, userId = null) {
  const targetUrl = payload.url || payload.job?.applyUrl;
  const baseJob = payload.job || {};
  let liveProbe = null;
  let fullDetails = {};
  if (targetUrl) {
    try {
      const probeRes = await crawlJobPostingUrl(targetUrl);
      liveProbe = probeRes?.probe || null;
      fullDetails = probeRes?.job || {};
    } catch (e) {
      console.warn("[CareerService] Probe in getJobDetailsFull warning:", e.message);
    }
  }
  const resolvedTitle = fullDetails.title || baseJob.title || "Software Engineer";
  const resolvedCompany = fullDetails.company || baseJob.company || "Company";
  const resolvedLocation = fullDetails.location || baseJob.location || "India";
  const resolvedLogo = fullDetails.companyLogo || baseJob.companyLogo || baseJob.logo || `https://${resolvedCompany.toLowerCase().replace(/[^a-z0-9]/g, "")}.com/favicon.ico`;
  const resolvedDesc = fullDetails.description || fullDetails.cleanText || baseJob.description || "";
  const resolvedStructuredJD = fullDetails.structuredJD || parseStructuredJD(resolvedTitle, resolvedDesc);
  let resumeText = "";
  let resumeAnalysis = null;
  if (userId) {
    try {
      const [resume, analysis] = await Promise.all([
        ResumesCollection.findOne({ user_id: userId }),
        ResumeAnalysis.findOne({ user_id: userId }),
      ]);
      if (resume?.parsed_data) resumeText = resume.parsed_data;
      if (analysis) resumeAnalysis = analysis;
    } catch {}
  }

  const candidateProfile = analyzeCandidateProfile(resumeText, resumeAnalysis);
  const enrichedJob = {
    ...baseJob,
    ...fullDetails,
    title: resolvedTitle,
    company: resolvedCompany,
    location: resolvedLocation,
    companyLogo: resolvedLogo,
    description: resolvedDesc,
    cleanText: resolvedDesc,
    structuredJD: resolvedStructuredJD,
    applyUrl: targetUrl,
  };

  const matchAnalysis = computeJobMatch(enrichedJob, candidateProfile, resumeText);

  // Separate matched and missing skills
  const jobSkills = [
    ...new Set([
      ...(enrichedJob.requiredSkills || []),
      ...(resolvedStructuredJD.technicalSkills || []),
    ]),
  ];
  const candidateSkillsSet = new Set((candidateProfile.skills || []).map((s) => s.toLowerCase()));

  const matchedSkills = [];
  const missingSkills = [];

  for (const skill of jobSkills) {
    if (candidateSkillsSet.has(skill.toLowerCase())) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }

  return {
    success: true,
    job: {
      ...enrichedJob,
      ...matchAnalysis,
      matchedSkills,
      missingSkills,
      liveProbe,
      isRealOpening: isRealOpeningUrl(targetUrl),
    },
  };
}

/**
 * Capture full job description on demand from ATS / LinkedIn / Career Portals
 * @param {Object} params
 */
export async function captureFullJobDescription({
  jobId,
  applyUrl,
  source = "",
  companySlug = "",
  externalId = "",
  company = "",
  title = "",
}) {
  let existingDbJob = null;
  if (jobId) {
    try {
      existingDbJob = await DiscoveredCareerJob.findById(jobId).lean();
    } catch {
      // not a mongo ObjectId, ignore
    }
  }
  if (!existingDbJob && applyUrl) {
    try {
      existingDbJob = await DiscoveredCareerJob.findOne({ applyUrl }).lean();
    } catch {}
  }

  // If already captured with full length > 400 chars, return immediately
  const rawCached = existingDbJob?.fullDescription || existingDbJob?.description || "";
  const cachedFullText = cleanHtmlToText(rawCached);
  if ((existingDbJob?.hasFullJD || cachedFullText?.length > 400) && cachedFullText?.length > 400) {
    const jobTitle = existingDbJob?.title || title || "Role";
    const isDirtyCachedJD =
      !existingDbJob?.structuredJD?.fullText ||
      existingDbJob.structuredJD.fullText.length < 100 ||
      (existingDbJob.structuredJD?.summary && (existingDbJob.structuredJD.summary.includes("<") || existingDbJob.structuredJD.summary.includes("&lt;"))) ||
      (Array.isArray(existingDbJob.structuredJD?.keyResponsibilities) &&
        existingDbJob.structuredJD.keyResponsibilities.some(
          (r) => typeof r === "string" && (r.includes("<") || /^(ul\d*|li\d*|p\d*|\d+)$/i.test(r.trim()))
        ));

    const resolvedStructuredJD = !isDirtyCachedJD
      ? existingDbJob.structuredJD
      : parseStructuredJD(jobTitle, cachedFullText, existingDbJob?.fullDescriptionHtml || "");

    return {
      success: true,
      fromCache: true,
      jobId: existingDbJob._id || jobId,
      fullDescription: cachedFullText,
      fullDescriptionHtml: existingDbJob?.fullDescriptionHtml || "",
      structuredJD: resolvedStructuredJD,
      criteria: existingDbJob?.criteria || {},
      hasFullJD: true,
      requiredSkills: resolvedStructuredJD?.technicalSkills || existingDbJob?.requiredSkills || [],
    };
  }

  const cleanUrl = (applyUrl || existingDbJob?.applyUrl || "").trim();
  const cleanSource = (source || existingDbJob?.source || "").toLowerCase().trim();
  const cleanExtId = String(externalId || existingDbJob?.externalId || "").trim();
  const cleanSlug = (companySlug || existingDbJob?.companySlug || "").trim();

  let capturedText = "";
  let capturedHtml = "";
  let capturedCriteria = {};

  // 1. Check LinkedIn
  const isLinkedIn =
    cleanSource.includes("linkedin") ||
    cleanUrl.includes("linkedin.com") ||
    (cleanExtId.length >= 8 && /^\d+$/.test(cleanExtId));

  if (isLinkedIn) {
    const liResult = await linkedInJobSearchService.fetchLinkedInJobDescription(cleanExtId || cleanUrl);
    if (liResult && liResult.cleanText) {
      capturedText = liResult.cleanText;
      capturedHtml = liResult.rawHtml || "";
      capturedCriteria = liResult.criteria || {};
    }
  }

  // 2. Check Greenhouse
  if (!capturedText && (cleanSource.includes("greenhouse") || cleanUrl.includes("greenhouse.io"))) {
    let ghSlug = cleanSlug;
    let ghJobId = cleanExtId;
    if (!ghSlug || !ghJobId) {
      const match = cleanUrl.match(/greenhouse\.io\/(?:v1\/boards\/)?([^/]+)\/jobs\/(\d+)/i);
      if (match) {
        ghSlug = ghSlug || match[1];
        ghJobId = ghJobId || match[2];
      }
    }
    if (ghSlug && ghJobId) {
      const ghResult = await fetchSingleGreenhouseJob(ghSlug, ghJobId);
      if (ghResult && ghResult.cleanText) {
        capturedText = ghResult.cleanText;
        capturedHtml = ghResult.rawHtml || "";
      }
    }
  }

  // 3. Check Lever
  if (!capturedText && (cleanSource.includes("lever") || cleanUrl.includes("lever.co"))) {
    let levSlug = cleanSlug;
    let levJobId = cleanExtId;
    if (!levSlug || !levJobId) {
      const match = cleanUrl.match(/jobs\.lever\.co\/([^/]+)\/([a-zA-Z0-9-]+)/i);
      if (match) {
        levSlug = levSlug || match[1];
        levJobId = levJobId || match[2];
      }
    }
    if (levSlug && levJobId) {
      const levResult = await fetchSingleLeverJob(levSlug, levJobId);
      if (levResult && levResult.cleanText) {
        capturedText = levResult.cleanText;
        capturedHtml = levResult.rawHtml || "";
      }
    }
  }

  // 4. Fallback to Crawler
  if (!capturedText && cleanUrl && cleanUrl.startsWith("http")) {
    try {
      const crawlResult = await crawlJobPostingUrl(cleanUrl);
      if (crawlResult && crawlResult.fullText && crawlResult.fullText.length > 200) {
        capturedText = crawlResult.fullText;
        capturedHtml = crawlResult.rawHtml || "";
      }
    } catch (err) {
      console.warn("[CareerService] Crawler fallback warning:", err.message);
    }
  }

  // If still not captured, use existing description
  if (!capturedText) {
    capturedText = existingDbJob?.description || "Description preview not available for this role.";
  }

  const jobTitle = title || existingDbJob?.title || "Role";
  const structuredJD = parseStructuredJD(jobTitle, capturedText, capturedHtml);
  const requiredSkills = structuredJD.technicalSkills?.length
    ? structuredJD.technicalSkills
    : extractSkillsFromText(capturedText);

  // Update in MongoDB
  try {
    const updatePayload = {
      description: capturedText,
      fullDescription: capturedText,
      fullDescriptionHtml: capturedHtml,
      structuredJD,
      hasFullJD: true,
      criteria: capturedCriteria,
      requiredSkills,
      descriptionSummary: capturedText.slice(0, 450),
    };

    if (existingDbJob?._id) {
      await DiscoveredCareerJob.findByIdAndUpdate(existingDbJob._id, updatePayload);
    } else if (cleanUrl) {
      await DiscoveredCareerJob.findOneAndUpdate({ applyUrl: cleanUrl }, updatePayload, { upsert: false });
    }
  } catch (err) {
    console.warn("[CareerService] Failed updating DB with full description:", err.message);
  }

  return {
    success: true,
    jobId: existingDbJob?._id || jobId,
    fullDescription: capturedText,
    fullDescriptionHtml: capturedHtml,
    structuredJD,
    criteria: capturedCriteria,
    hasFullJD: true,
    requiredSkills,
  };
}

