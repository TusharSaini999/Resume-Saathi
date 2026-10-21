import { classifyJobTypeAndExperience } from "./jobClassifier.js";

// RAW_OFFICIAL_OPENINGS: cleared of fabricated dummy listings.
// The system now queries verified, 100% live direct ATS endpoints (Greenhouse, Lever, SmartRecruiters).
export const RAW_OFFICIAL_OPENINGS = [];

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
  return [];
}

export function getAllCuratedOfficialJobs(roleQuery = "") {
  return [];
}
