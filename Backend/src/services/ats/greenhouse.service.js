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

export async function fetchGreenhouseJobs(companySlug, companyName = "") {
  try {
    // Fetch lightweight job list (without ?content=true) to prevent payload timeouts on large boards (Stripe, Databricks)
    const url = `https://boards-api.greenhouse.io/v1/boards/${companySlug}/jobs`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(8000), // 8s timeout
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    if (!Array.isArray(data.jobs)) {
      return [];
    }

    const resolvedCompanyName = companyName || companySlug;

    return data.jobs.map((job) => {
      const locationName = job.location?.name || "Multiple Locations / Remote";
      const isRemote =
        locationName.toLowerCase().includes("remote") ||
        job.title.toLowerCase().includes("remote");
      const cleanDesc =
        stripHtml(job.content || "") ||
        `${job.title} opportunity at ${resolvedCompanyName} (${locationName}). Apply directly on the official ${resolvedCompanyName} career portal.`;

      const classification = classifyJobTypeAndExperience(job.title, cleanDesc);

      return {
        id: `gh_${companySlug}_${job.id}`,
        externalId: String(job.id),
        company: resolvedCompanyName,
        companySlug,
        source: "greenhouse",
        portalLabel: "Greenhouse ATS",
        title: job.title,
        location: locationName,
        isRemote,
        employmentType: classification.employmentType,
        experienceLevel: classification.experienceLevel,
        minExperienceYears: classification.minExperienceYears,
        maxExperienceYears: classification.maxExperienceYears,
        isFresherFriendly: classification.isFresherFriendly,
        requiredSkills: classification.requiredSkills,
        track: classification.track,
        stream: classification.stream,
        departments: (job.departments || []).map((d) => d.name),
        applyUrl: job.absolute_url,
        description: cleanDesc,
        descriptionSummary: cleanDesc.slice(0, 400),
        postedAt: job.updated_at ? new Date(job.updated_at) : new Date(),
      };
    });
  } catch (error) {
    console.error(`[Greenhouse] Error fetching jobs for ${companySlug}:`, error.message);
    return [];
  }
}

export async function fetchSingleGreenhouseJob(companySlug, jobId) {
  try {
    const url = `https://boards-api.greenhouse.io/v1/boards/${companySlug}/jobs/${jobId}`;
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const cleanDesc = stripHtml(data.content || "");
    return {
      success: true,
      jobId: String(data.id || jobId),
      title: data.title,
      cleanText: cleanDesc,
      rawHtml: data.content || "",
      location: data.location?.name || "India / Remote",
      departments: (data.departments || []).map((d) => d.name),
      absoluteUrl: data.absolute_url,
    };
  } catch (err) {
    console.warn(`[Greenhouse] Error fetching single job ${jobId}:`, err.message);
    return null;
  }
}

