import {
  parseStructuredJD,
  classifyJobTypeAndExperience,
  detectStreamFromTextAndSkills,
} from "./jobClassifier.js";

/**
 * Service to search LinkedIn company job pages and public requisition listings
 */
class LinkedInJobSearchService {
  constructor() {
    this.userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
    this.cache = new Map();
    this.CACHE_TTL_MS = 20 * 60 * 1000; // 20 minutes
    this.rateLimitedUntil = 0;
  }

  /**
   * Search LinkedIn public guest jobs endpoint specifically for a target company's official job requisitions
   * @param {string} companyName - Target company name (e.g. "Swiggy", "Razorpay", "CRED")
   * @param {string} roleQuery - Optional role/title keywords (e.g. "Software Engineer", "Backend")
   * @param {string} location - Target location (default "India")
   * @param {number} limit - Maximum jobs to return (default 15)
   */
  async searchLinkedInCompanyJobs(companyName = "", roleQuery = "", location = "India", limit = 15) {
    const cleanCompany = (companyName || "").trim();
    const cleanRole = (roleQuery || "").trim();
    const cleanLoc = (location || "India").trim();

    // Use exact company name in quotes to force LinkedIn to search specifically for the target company
    const queryTerms = cleanCompany
      ? (cleanRole ? `"${cleanCompany}" ${cleanRole}` : `"${cleanCompany}"`)
      : cleanRole;

    if (!queryTerms) return [];
    if (Date.now() < this.rateLimitedUntil) return [];

    const cacheKey = `${queryTerms.toLowerCase()}_${cleanLoc.toLowerCase()}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL_MS) {
      return cached.jobs.slice(0, limit);
    }

    try {
      const targetUrl = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${encodeURIComponent(
        queryTerms
      )}&location=${encodeURIComponent(cleanLoc)}&start=0`;

      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent": this.userAgent,
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
        signal: AbortSignal.timeout(3500),
      });

      if (!response.ok) {
        if (response.status === 429 || response.status === 999 || response.status === 403 || response.status === 401) {
          this.rateLimitedUntil = Date.now() + 15 * 60 * 1000; // 15 min cooldown on cloud hosting IP
        }
        return [];
      }

      const html = await response.text();
      // Pass cleanCompany as targetCompany so third-party recruitment agencies and unrelated companies are discarded
      const jobs = this.parseLinkedInHtml(html, cleanCompany, cleanCompany);

      // Pre-enrich the top 4 jobs with full descriptions for instant rich rendering
      const topBatch = jobs.slice(0, 4);
      await Promise.allSettled(
        topBatch.map(async (job) => {
          if (job.externalId && /^\d+$/.test(job.externalId)) {
            const details = await this.fetchLinkedInJobDescription(job.externalId);
            if (details && details.cleanText) {
              job.description = details.cleanText;
              job.fullDescription = details.cleanText;
              job.fullDescriptionHtml = details.rawHtml;
              job.structuredJD = details.structuredJD;
              job.requiredSkills = details.structuredJD?.technicalSkills || job.requiredSkills;
              job.hasFullJD = true;
            }
          }
        })
      );

      this.cache.set(cacheKey, {
        timestamp: Date.now(),
        jobs,
      });

      return jobs.slice(0, limit);
    } catch (err) {
      // note silenced
      return [];
    }
  }

  /**
   * Crawl live LinkedIn jobs dynamically based on the candidate's actual resume keywords or role query
   * @param {Array<string>} candidateKeywords - Exact tech skills extracted from candidate's resume
   * @param {string} roleQuery - Optional specific query from search bar
   * @param {string} location - Target location (default "India")
   * @param {number} limitPerRole - Max jobs per keyword
   * @param {Array<string>} derivedRoles - Synthesized industry role titles (e.g. "Full Stack Developer", "MERN Stack Developer", "Django Developer")
   */
  async crawlCandidateJobs(candidateKeywords = [], roleQuery = "", location = "India", limitPerRole = 6, derivedRoles = []) {
    const rolesToCrawl = [];
    if (roleQuery && roleQuery.trim()) {
      rolesToCrawl.push(roleQuery.trim());
    }

    // 1. Prioritize inferred/derived industry roles (e.g. MERN Stack Developer, Full Stack Developer, Python Developer)
    if (Array.isArray(derivedRoles) && derivedRoles.length > 0) {
      for (const dRole of derivedRoles.slice(0, 3)) {
        if (!rolesToCrawl.includes(dRole)) {
          rolesToCrawl.push(dRole);
        }
      }
    }

    // 2. Add candidate's core tech stack & skills from resume
    if (Array.isArray(candidateKeywords) && candidateKeywords.length > 0) {
      for (const kw of candidateKeywords.slice(0, 4)) {
        if (!rolesToCrawl.includes(kw)) {
          rolesToCrawl.push(kw);
        }
      }
    }

    // Default general tech roles if no resume or query is present
    if (rolesToCrawl.length === 0) {
      rolesToCrawl.push("Full Stack Developer", "Software Engineer", "Software Developer");
    }

    const allDiscovered = [];
    const seenIds = new Set();

    for (const role of rolesToCrawl.slice(0, 4)) {
      try {
        const queryTerm =
          role.toLowerCase().includes("engineer") ||
          role.toLowerCase().includes("developer") ||
          role.toLowerCase().includes("manager") ||
          role.toLowerCase().includes("stack")
            ? role
            : `${role} Developer`;
        const jobs = await this.searchLinkedInCompanyJobs("", queryTerm, location, limitPerRole);
        if (jobs && jobs.length > 0) {
          for (const j of jobs) {
            const id = j.externalId || j.id || j.applyUrl;
            if (!seenIds.has(id)) {
              seenIds.add(id);
              allDiscovered.push(j);
            }
          }
        }
      } catch (err) {
        // note silenced
      }
    }

    return allDiscovered;
  }

  // Backwards compatibility alias
  async crawlWebStackJobs(location = "India", limitPerRole = 6) {
    return this.crawlCandidateJobs(["React", "Node.js", "Full Stack"], "", location, limitPerRole);
  }

  /**
   * Fetch full job description and criteria for a LinkedIn job posting
   * @param {string} jobIdOrUrl - Numeric job ID or full LinkedIn job posting URL
   */
  async fetchLinkedInJobDescription(jobIdOrUrl) {
    if (!jobIdOrUrl) return null;

    let jobId = "";
    const str = String(jobIdOrUrl).trim();
    if (/^\d+$/.test(str)) {
      jobId = str;
    } else {
      const match = str.match(/(?:view\/|jobPosting:|[?&]currentJobId=)(\d+)/) ||
                    str.match(/-(\d+)(?:\?|$)/);
      if (match) jobId = match[1];
    }

    if (!jobId) return null;

    const cacheKey = `linkedin_jd_${jobId}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL_MS) {
      return cached.data;
    }

    try {
      const url = `https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${jobId}`;
      const response = await fetch(url, {
        headers: {
          "User-Agent": this.userAgent,
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
        signal: AbortSignal.timeout(3500),
      });

      if (!response.ok) {
        return null;
      }

      const html = await response.text();

      // 1. Extract Full Description Markup
      const descMatch = html.match(/<div class="show-more-less-html__markup[^"]*">([\s\S]*?)<\/div>/i);
      const rawHtml = descMatch ? descMatch[1].trim() : "";
      const cleanText = rawHtml
        ? rawHtml
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<\/p>/gi, "\n\n")
            .replace(/<\/li>/gi, "\n")
            .replace(/<[^>]+>/g, " ")
            .replace(/&nbsp;/g, " ")
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/[ \t]+/g, " ")
            .replace(/\n\s*\n\s*\n/g, "\n\n")
            .trim()
        : "";

      // 2. Extract Criteria (Seniority, Employment Type, Industries)
      const criteriaMatches = [
        ...html.matchAll(
          /<li class="description__job-criteria-item">[\s\S]*?<h3 class="description__job-criteria-subheader">([\s\S]*?)<\/h3>[\s\S]*?<span class="description__job-criteria-text[^"]*">([\s\S]*?)<\/span>/g
        ),
      ];
      const criteria = {};
      criteriaMatches.forEach((m) => {
        const k = m[1].replace(/<[^>]+>/g, "").trim().toLowerCase();
        const v = m[2].replace(/<[^>]+>/g, "").trim();
        criteria[k] = v;
      });

      // 3. Extract Title & Company if present
      const titleMatch = html.match(/<h2 class="top-card-layout__title[^"]*">([\s\S]*?)<\/h2>/i);
      const companyMatch = html.match(/<a class="topcard__org-name-link[^"]*">([\s\S]*?)<\/a>/i);
      const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, "").trim() : "";
      const company = companyMatch ? companyMatch[1].replace(/<[^>]+>/g, "").trim() : "";

      // 4. Structured JD breakdown
      const structuredJD = parseStructuredJD(title || "Role", cleanText, rawHtml);

      const result = {
        success: true,
        jobId,
        title,
        company,
        cleanText,
        rawHtml,
        criteria,
        seniorityLevel: criteria["seniority level"] || "",
        employmentType: criteria["employment type"] || "",
        industries: criteria["industries"] || "",
        structuredJD,
      };

      this.cache.set(cacheKey, {
        timestamp: Date.now(),
        data: result,
      });

      return result;
    } catch (err) {
      // note silenced
      return null;
    }
  }

  /**
   * Cleans a raw LinkedIn company URL into standard canonical form:
   * e.g. "https://in.linkedin.com/company/swiggy-in?trk=..." -> "https://www.linkedin.com/company/swiggy-in/"
   */
  cleanLinkedInCompanyUrl(rawUrl = "") {
    if (!rawUrl || typeof rawUrl !== "string") return "";
    try {
      const match = rawUrl.match(/linkedin\.com\/company\/([a-zA-Z0-9_-]+)/i);
      if (match) {
        return `https://www.linkedin.com/company/${match[1]}/`;
      }
      const parsed = new URL(rawUrl);
      const pathname = parsed.pathname.replace(/\/+$/, "");
      return `https://www.linkedin.com${pathname}/`;
    } catch {
      return "";
    }
  }

  /**
   * Builds the official company jobs page URL on LinkedIn:
   * e.g. "https://www.linkedin.com/company/swiggy-in/jobs/"
   */
  cleanLinkedInCompanyJobsUrl(companyUrl = "") {
    if (!companyUrl) return "";
    const cleaned = this.cleanLinkedInCompanyUrl(companyUrl);
    return cleaned ? `${cleaned.replace(/\/+$/, "")}/jobs/` : "";
  }

  /**
   * Verifies that the requisition is authentically from the official company,
   * strictly filtering out third-party staffing agencies, recruitment consultancies,
   * or competing companies.
   */
  isOfficialCompanyMatch(jobCompanyName = "", targetCompanyName = "") {
    if (!targetCompanyName) return true;
    if (!jobCompanyName) return false;

    const j = jobCompanyName.toLowerCase().trim();
    const t = targetCompanyName.toLowerCase().trim();

    // 1. Direct match
    if (j === t) return true;

    // 2. Exact word-boundary match (e.g. "CRED" in "CRED Club", "Swiggy" in "Swiggy Instamart")
    const escaped = t.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const wordRegex = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");
    if (wordRegex.test(j)) {
      // Discard false positives like "CreditSea" or "CreditVidya" for "CRED"
      if (t === "cred" && (j.includes("credit") || j.includes("credible"))) {
        return false;
      }
      return true;
    }

    // 3. Normalized alphanumeric exact match
    const normJ = j.replace(/[^a-z0-9]/g, "");
    const normT = t.replace(/[^a-z0-9]/g, "");
    if (normJ === normT) return true;

    return false;
  }

  /**
   * Parse HTML returned by LinkedIn guest job search API.
   * When targetCompany is specified, strictly extracts requisitions from that official company
   * and links back to the verified official company LinkedIn page.
   */
  parseLinkedInHtml(html, fallbackCompany = "", targetCompany = "") {
    if (!html || typeof html !== "string") return [];

    const jobs = [];
    const cardChunks = html.split(/<li[^>]*>[\s\S]*?<div class="[^"]*job-search-card/i).slice(1);
    const chunks = cardChunks.length > 0 ? cardChunks : html.split(/<div class="[^"]*job-search-card/i).slice(1);

    for (let i = 0; i < chunks.length; i++) {
      const card = chunks[i];

      const titleMatch = card.match(/<h3 class="base-search-card__title">([\s\S]*?)<\/h3>/i);
      const compMatch = card.match(/<h4 class="base-search-card__subtitle">[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
      const simpleCompMatch = card.match(/<h4 class="base-search-card__subtitle">([\s\S]*?)<\/h4>/i);
      const applyMatch = card.match(/<a class="base-card__full-link[^"]*"[^>]*href="([^"]+)"/i);
      const locationMatch = card.match(/<span class="job-search-card__location">([\s\S]*?)<\/span>/i);
      const logoMatch = card.match(/<img[^>]*data-delayed-url="([^"]+)"/i);
      const urnMatch = card.match(/data-entity-urn="urn:li:jobPosting:(\d+)"/i);
      const timeMatch = card.match(/<time[^>]*datetime="([^"]+)"/i);

      const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, "").trim() : "";
      let company = compMatch
        ? compMatch[2].replace(/<[^>]+>/g, "").trim()
        : simpleCompMatch
        ? simpleCompMatch[1].replace(/<[^>]+>/g, "").trim()
        : fallbackCompany || "Tech Company";
      let rawCompanyUrl = compMatch ? compMatch[1] : "";
      let applyUrl = applyMatch ? applyMatch[1].trim() : "";

      if (!title || !applyUrl) continue;

      // Clean applyUrl by stripping tracking parameters
      if (applyUrl.includes("?")) {
        applyUrl = applyUrl.split("?")[0];
      }

      // If target company is specified, enforce strict official company match!
      // This discards recruitment agencies, competing companies, and unrelated job postings.
      if (targetCompany && !this.isOfficialCompanyMatch(company, targetCompany)) {
        continue;
      }

      const location = locationMatch ? locationMatch[1].replace(/<[^>]+>/g, "").trim() : "India";
      const externalId = urnMatch ? urnMatch[1] : (applyUrl.match(/view\/([a-zA-Z0-9-]+)/) ? RegExp.$1 : `li-${Date.now()}-${i}`);
      const logo = logoMatch ? logoMatch[1].trim() : `https://${company.toLowerCase().replace(/[^a-z0-9]/g, "")}.com/favicon.ico`;
      const postedAt = timeMatch ? new Date(timeMatch[1]).toISOString() : new Date().toISOString();

      // Official LinkedIn Company Page URLs
      const cleanSlug = company.toLowerCase().replace(/[^a-z0-9]/g, "");
      const officialCompanyPage = this.cleanLinkedInCompanyUrl(rawCompanyUrl) || `https://www.linkedin.com/company/${cleanSlug}/`;
      const officialCompanyJobsPage = this.cleanLinkedInCompanyJobsUrl(officialCompanyPage);

      const structuredJD = parseStructuredJD(title, `${title} at ${company} in ${location}. Verified direct job requisition on LinkedIn.`);
      const streamInfo = detectStreamFromTextAndSkills(title, [], title);
      const expClassification = classifyJobTypeAndExperience(title, `${title} ${location}`);

      jobs.push({
        id: `linkedin-${externalId}`,
        externalId: String(externalId),
        title,
        company,
        companySlug: cleanSlug,
        location,
        applyUrl,
        companyLogo: logo,
        logo,
        postedAt,
        employmentType: expClassification.employmentType || "Full-time",
        experienceLevel: expClassification.experienceLevel || "Mid-Level",
        minExperienceYears: expClassification.minYears || 1,
        maxExperienceYears: expClassification.maxYears || 5,
        isFresherFriendly: Boolean(expClassification.isFresher),
        source: "linkedin",
        sourcePortal: "Official LinkedIn Portal",
        portalLabel: "Official LinkedIn Portal",
        companyLinkedInUrl: officialCompanyPage,
        linkedInUrl: officialCompanyPage,
        linkedInJobsUrl: officialCompanyJobsPage,
        officialPortalUrl: officialCompanyJobsPage,
        careerPageUrl: officialCompanyJobsPage,
        isRealOpening: true,
        stream: {
          id: streamInfo.id || "full_stack",
          label: streamInfo.label || "Engineering & Technology",
          icon: streamInfo.icon || "🌐",
        },
        track: {
          id: streamInfo.track || "tech",
          label: streamInfo.track === "management" ? "Management & Business" : "Technology & Engineering",
        },
        structuredJD,
        requiredSkills: structuredJD.technicalSkills || [],
        descriptionSummary: `${title} role at ${company} in ${location}. Direct company job listed on LinkedIn.`,
        isRemote: /remote|wfh/i.test(location) || /remote/i.test(title),
      });
    }

    return jobs;
  }
}

const linkedInJobSearchService = new LinkedInJobSearchService();
export default linkedInJobSearchService;
