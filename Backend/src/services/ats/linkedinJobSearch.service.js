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
  }

  /**
   * Search LinkedIn public guest jobs endpoint for a specific company or role query
   * @param {string} companyName - Target company name (e.g. "Swiggy", "Razorpay", "Google")
   * @param {string} roleQuery - Optional role/title keywords (e.g. "Software Engineer", "Backend")
   * @param {string} location - Target location (default "India")
   * @param {number} limit - Maximum jobs to return (default 15)
   */
  async searchLinkedInCompanyJobs(companyName = "", roleQuery = "", location = "India", limit = 15) {
    const cleanCompany = (companyName || "").trim();
    const cleanRole = (roleQuery || "").trim();
    const cleanLoc = (location || "India").trim();

    const queryTerms = [cleanCompany, cleanRole].filter(Boolean).join(" ");
    if (!queryTerms) return [];

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
        signal: AbortSignal.timeout(9000),
      });

      if (!response.ok) {
        console.warn(`[LinkedInService] HTTP ${response.status} fetching LinkedIn jobs for: ${queryTerms}`);
        return [];
      }

      const html = await response.text();
      const jobs = this.parseLinkedInHtml(html, cleanCompany);

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
      console.warn(`[LinkedInService] Note fetching LinkedIn jobs for ${queryTerms}:`, err.message);
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
        console.warn(`[LinkedInService] Dynamic crawl note for "${role}":`, err.message);
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
        signal: AbortSignal.timeout(9000),
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
      console.warn(`[LinkedInService] Failed fetching full JD for ${jobId}:`, err.message);
      return null;
    }
  }

  /**
   * Parse HTML returned by LinkedIn guest job search API
   */
  parseLinkedInHtml(html, fallbackCompany = "") {
    if (!html || typeof html !== "string") return [];

    const jobs = [];
    // Split into individual card chunks by job-search-card or base-card
    const cardChunks = html.split(/<li[^>]*>[\s\S]*?<div class="[^"]*job-search-card/i);

    // If split didn't yield chunks, fallback to regex matchAll across full document
    const titleRegex = /<h3 class="base-search-card__title">([\s\S]*?)<\/h3>/g;
    const companyRegex = /<h4 class="base-search-card__subtitle">[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/g;
    const locationRegex = /<span class="job-search-card__location">([\s\S]*?)<\/span>/g;
    const linkRegex = /<a class="base-card__full-link[^"]*"[^>]*href="([^"]+)"/g;
    const logoRegex = /<img[^>]*data-delayed-url="([^"]+)"/g;
    const urnRegex = /data-entity-urn="urn:li:jobPosting:(\d+)"/g;
    const timeRegex = /<time[^>]*datetime="([^"]+)"/g;

    const titles = [...html.matchAll(titleRegex)].map((m) => m[1].replace(/<[^>]+>/g, "").trim());
    const companies = [...html.matchAll(companyRegex)].map((m) => m[1].replace(/<[^>]+>/g, "").trim());
    const locations = [...html.matchAll(locationRegex)].map((m) => m[1].replace(/<[^>]+>/g, "").trim());
    const links = [...html.matchAll(linkRegex)].map((m) => m[1].trim());
    const logos = [...html.matchAll(logoRegex)].map((m) => m[1].trim());
    const urns = [...html.matchAll(urnRegex)].map((m) => m[1].trim());
    const times = [...html.matchAll(timeRegex)].map((m) => m[1].trim());

    const total = Math.min(titles.length, links.length);

    for (let i = 0; i < total; i++) {
      const title = titles[i];
      if (!title) continue;

      const company = companies[i] || fallbackCompany || "Tech Company";
      const location = locations[i] || "India";
      let applyUrl = links[i] || "";
      // Strip tracking query params from applyUrl for clean direct access
      if (applyUrl.includes("?")) {
        applyUrl = applyUrl.split("?")[0];
      }

      const externalId = urns[i] || (applyUrl.match(/view\/([a-zA-Z0-9-]+)/) ? RegExp.$1 : `li-${Date.now()}-${i}`);
      const logo = logos[i] || `https://${company.toLowerCase().replace(/[^a-z0-9]/g, "")}.com/favicon.ico`;
      const postedAt = times[i] ? new Date(times[i]).toISOString() : new Date().toISOString();

      const structuredJD = parseStructuredJD(title, `${title} at ${company} in ${location}. Verified direct job requisition on LinkedIn.`);
      const streamInfo = detectStreamFromTextAndSkills(title, [], title);
      const expClassification = classifyJobTypeAndExperience(title, `${title} ${location}`);

      jobs.push({
        id: `linkedin-${externalId}`,
        externalId: String(externalId),
        title,
        company,
        companySlug: company.toLowerCase().replace(/[^a-z0-9]/g, ""),
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
        sourcePortal: "LinkedIn Company Jobs",
        portalLabel: "LinkedIn Verified Requisition",
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
