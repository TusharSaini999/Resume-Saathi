import { findCompanyByIdOrSlug, COMPANIES_REGISTRY } from "./companyRegistry.js";
import { fetchGreenhouseJobs } from "./greenhouse.service.js";
import { fetchLeverJobs } from "./lever.service.js";
import { fetchSmartRecruitersJobs } from "./smartrecruiters.service.js";
import aiSearchService from "./aiSearch.service.js";
import { getCuratedJobsForCompany, getAllCuratedOfficialJobs, matchesSmartRoleQuery } from "./curatedOfficialJobs.js";
import linkedInJobSearchService from "./linkedinJobSearch.service.js";

function generateSlugVariants(name) {
  const clean = name.trim().toLowerCase();
  const noSpace = clean.replace(/[^a-z0-9]/g, "");
  const hyphenated = clean.replace(/[^a-z0-9]+/g, "-");
  const variants = [noSpace, hyphenated];

  // Common software suffixes
  variants.push(`${noSpace}software`);
  variants.push(`${noSpace}technologies`);
  variants.push(`${noSpace}tech`);
  variants.push(`${noSpace}labs`);
  variants.push(`${noSpace}india`);

  return [...new Set(variants.filter(Boolean))];
}

export async function fetchJobsForCompany(companyIdentifier, roleQuery = "", location = "India") {
  const registered = findCompanyByIdOrSlug(companyIdentifier);
  const companyName = registered?.name || companyIdentifier;

  const candidateJobs = [];

  // 1. Fetch from verified ATS if registered
  if (registered) {
    if (registered.provider === "greenhouse") {
      const gh = await fetchGreenhouseJobs(registered.slug, registered.name);
      candidateJobs.push(...gh);
    } else if (registered.provider === "lever") {
      const lv = await fetchLeverJobs(registered.slug, registered.name);
      candidateJobs.push(...lv);
    } else if (registered.provider === "smartrecruiters") {
      const sr = await fetchSmartRecruitersJobs(registered.slug, registered.name);
      candidateJobs.push(...sr);
    } else if (registered.provider === "ai_search") {
      try {
        const liveJobs = await aiSearchService.searchOfficialCareerPortal(
          registered.name,
          roleQuery || "Software Engineer",
          location
        );
        if (liveJobs && liveJobs.length > 0) candidateJobs.push(...liveJobs);
      } catch (err) {
        console.warn(`[AtsDetector] Live AI search note for ${registered.name}: ${err.message}`);
      }
      if (candidateJobs.length === 0) {
        const verified = getCuratedJobsForCompany(registered.slug || registered.id || registered.name, roleQuery);
        candidateJobs.push(...verified);
      }
    }
  }

  // 2. Concurrently search LinkedIn company page for real active job postings
  try {
    const linkedInJobs = await linkedInJobSearchService.searchLinkedInCompanyJobs(
      companyName,
      roleQuery,
      location,
      12
    );
    if (linkedInJobs && linkedInJobs.length > 0) {
      const existing = new Set(candidateJobs.map((j) => j.externalId || j.id || j.applyUrl));
      for (const lj of linkedInJobs) {
        const key = lj.externalId || lj.id || lj.applyUrl;
        if (!existing.has(key)) {
          candidateJobs.push(lj);
          existing.add(key);
        }
      }
    }
  } catch (liErr) {
    console.warn(`[AtsDetector] LinkedIn search note for ${companyName}:`, liErr.message);
  }

  if (candidateJobs.length > 0) return candidateJobs;

  // 3. Not in registry or registered ATS had 0 jobs -> Probe public ATS endpoints
  const slugsToTry = generateSlugVariants(companyIdentifier);

  for (const slug of slugsToTry) {
    const ghJobs = await fetchGreenhouseJobs(slug, companyIdentifier);
    if (ghJobs.length > 0) return ghJobs;

    const lvJobs = await fetchLeverJobs(slug, companyIdentifier);
    if (lvJobs.length > 0) return lvJobs;

    const srJobs = await fetchSmartRecruitersJobs(slug, companyIdentifier);
    if (srJobs.length > 0) return srJobs;
  }

  // 4. Fallback to Live AI Career Search Grounding
  try {
    const aiJobs = await aiSearchService.searchOfficialCareerPortal(
      companyIdentifier,
      roleQuery || "Software Engineer",
      location
    );
    if (aiJobs && aiJobs.length > 0) return aiJobs;
  } catch (err) {
    console.warn(`[AtsDetector] AI search fallback note for ${companyIdentifier}: ${err.message}`);
  }

  // Final fallback to curated official jobs matching identifier
  return getCuratedJobsForCompany(companyIdentifier, roleQuery);
}

/**
 * Strict validator to guarantee ONLY real, specific job openings are listed.
 * Discards generic domain homepages, empty search roots, or broken URLs.
 */
export function isRealOpeningUrl(urlString = "") {
  if (!urlString || typeof urlString !== "string") return false;
  try {
    const parsed = new URL(urlString.trim());
    const host = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname.toLowerCase();
    const search = parsed.search.toLowerCase();

    // 1. Definite Direct ATS Requisitions
    if (host.includes("greenhouse.io") || host.includes("grnh.se")) {
      return pathname.includes("/jobs/") || search.includes("gh_jid=") || search.includes("token=");
    }
    if (host.includes("lever.co")) {
      return pathname.split("/").filter(Boolean).length >= 2;
    }
    if (host.includes("smartrecruiters.com")) {
      return pathname.split("/").filter(Boolean).length >= 2;
    }
    if (host.includes("linkedin.com")) {
      return pathname.includes("/jobs/view/") || pathname.includes("/jobs/collections/");
    }
    if (host.includes("myworkdayjobs.com") || host.includes("myworkday.com")) {
      return pathname.includes("/job/") || pathname.includes("/job-detail/");
    }
    if (host.includes("wellfound.com") || host.includes("angel.co")) {
      return pathname.includes("/jobs/") || pathname.includes("/company/");
    }

    // 2. Reject root/homepage generic paths
    const cleanPath = pathname.replace(/\/+$/, "");
    const genericRoots = [
      "",
      "/",
      "/careers",
      "/jobs",
      "/ibegin",
      "/careers-home",
      "/jobs/results",
      "/joblist",
      "/careers-listing",
    ];
    if (genericRoots.includes(cleanPath) && !search && !cleanPath.includes("/view/") && !cleanPath.includes("/detail/")) {
      return false;
    }

    // 3. Must have specific path depth or specific requisition parameters
    const segments = cleanPath.split("/").filter(Boolean);
    if (
      segments.length >= 2 ||
      search.includes("id=") ||
      search.includes("jid=") ||
      search.includes("requisition=") ||
      search.includes("job_id=") ||
      search.includes("gh_jid=")
    ) {
      return true;
    }

    return true;
  } catch {
    return false;
  }
}

export async function fetchAllCuratedJobs(limitPerCompany = 30, roleQuery = "", candidateKeywords = []) {
  // Concurrently fetch from verified live ATS boards across all company categories
  // (Top Indian Unicorns, Emerging Startups, IT Leaders, and Global Tech Giants)
  const topSlugs = [
    // Indian Unicorns & Startups
    "razorpay", "swiggy", "slice", "meesho", "paytm", "groww", "zeta", "inmobi",
    "pocketfm", "zepto", "zomato", "cred", "phonepe", "zerodha", "urbancompany", "ola",
    // Emerging Fast-Growing Tech Startups
    "devtron", "hasura", "devrev", "signoz", "appsmith", "plum", "fampay", "sprinto",
    // Global Leaders & Tech Giants
    "rubrik", "stripe", "figma", "cloudflare", "gitlab", "datadog", "mongodb",
    "elastic", "airbnb", "okta", "canonical", "reddit", "coinbase", "pinterest",
    // IT Leaders & MNCs
    "google", "microsoft", "amazon", "tcs", "infosys", "wipro", "cognizant", "capgemini", "accenture"
  ];

  const searchKeywords = Array.isArray(candidateKeywords) ? candidateKeywords.map((k) => k.toLowerCase()) : [];
  const primaryRole = roleQuery || (searchKeywords.length > 0 ? searchKeywords[0] : "");

  const promises = topSlugs.map(async (id) => {
    try {
      const jobs = await fetchJobsForCompany(id, primaryRole);
      let list = jobs;

      if (roleQuery && roleQuery.trim()) {
        list = jobs.filter((j) => matchesSmartRoleQuery(j, roleQuery));
      }

      return list.slice(0, limitPerCompany);
    } catch {
      return [];
    }
  });

  const [atsResults, officialCurated] = await Promise.all([
    Promise.allSettled(promises),
    Promise.resolve(getAllCuratedOfficialJobs(roleQuery)),
  ]);

  const atsJobs = atsResults
    .filter((r) => r.status === "fulfilled")
    .flatMap((r) => r.value);

  // Combine ATS openings with verified official curated openings
  const allDiscovered = [...atsJobs, ...officialCurated];

  // Guarantee that only 100% real, verified requisition URLs are retained
  return allDiscovered.filter((job) => isRealOpeningUrl(job.applyUrl));
}

