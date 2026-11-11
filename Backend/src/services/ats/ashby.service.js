import { classifyJobTypeAndExperience } from "./jobClassifier.js";

function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Fetches live job requisitions directly from Ashby ATS API
 * @param {string} companySlug - Ashby board slug (e.g. "plane", "signoz")
 * @param {string} companyName - Display company name
 */
export async function fetchAshbyJobs(companySlug, companyName = "") {
  try {
    const url = `https://api.ashbyhq.com/posting-api/job-board/${companySlug}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(6500),
    });

    if (!res.ok) return [];

    const data = await res.json();
    if (!Array.isArray(data.jobs)) return [];

    const resolvedCompanyName = companyName || companySlug;

    return data.jobs.map((job) => {
      const location = job.location || "Multiple Locations / Remote";
      const isRemote =
        Boolean(job.isRemote) ||
        location.toLowerCase().includes("remote") ||
        job.title.toLowerCase().includes("remote");

      const cleanDesc =
        stripHtml(job.descriptionHtml || "") ||
        `${job.title} at ${resolvedCompanyName} (${location}). Apply on official career portal.`;

      const classification = classifyJobTypeAndExperience(job.title, cleanDesc, job.employmentType || "");

      return {
        id: `ashby_${companySlug}_${job.id}`,
        externalId: String(job.id),
        company: resolvedCompanyName,
        companySlug,
        source: "ashby",
        portalLabel: "Official Career Portal",
        title: job.title,
        location,
        isRemote,
        employmentType: classification.employmentType,
        experienceLevel: classification.experienceLevel,
        minExperienceYears: classification.minExperienceYears,
        maxExperienceYears: classification.maxExperienceYears,
        isFresherFriendly: classification.isFresherFriendly,
        requiredSkills: classification.requiredSkills,
        track: classification.track,
        stream: classification.stream,
        departments: [job.department, job.team].filter(Boolean),
        applyUrl: job.applyUrl || job.jobUrl,
        description: cleanDesc,
        descriptionSummary: cleanDesc.slice(0, 400),
        postedAt: job.publishedAt ? new Date(job.publishedAt) : new Date(),
      };
    });
  } catch {
    return [];
  }
}

