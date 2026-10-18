import { classifyJobTypeAndExperience } from "./jobClassifier.js";

export async function fetchSmartRecruitersJobs(companySlug, companyName = "") {
  try {
    const url = `https://api.smartrecruiters.com/v1/companies/${companySlug}/postings?limit=100`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(10000), // 10s timeout
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    if (!Array.isArray(data.content)) {
      return [];
    }

    const resolvedCompanyName = companyName || companySlug;

    return data.content.map((job) => {
      const city = job.location?.city || "";
      const region = job.location?.region || "";
      const country = job.location?.country || "";
      const locParts = [city, region, country].filter(Boolean);
      const location = locParts.length > 0 ? locParts.join(", ") : "Multiple Locations / Remote";

      const isRemote =
        Boolean(job.location?.remote) ||
        location.toLowerCase().includes("remote") ||
        (job.name || "").toLowerCase().includes("remote");

      const applyUrl = `https://jobs.smartrecruiters.com/${companySlug}/${job.id}`;
      const desc = `Official job opening at ${resolvedCompanyName} for ${job.name}. Location: ${location}. Department: ${job.department?.label || "Engineering"}.`;

      const classification = classifyJobTypeAndExperience(job.name, desc, job.typeOfEmployment?.label || "");

      return {
        id: `sr_${companySlug}_${job.id}`,
        externalId: String(job.id),
        company: resolvedCompanyName,
        companySlug,
        source: "smartrecruiters",
        portalLabel: "SmartRecruiters ATS",
        title: job.name,
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
        departments: [job.department?.label].filter(Boolean),
        applyUrl,
        description: desc,
        descriptionSummary: `Official career portal posting at ${resolvedCompanyName} (${location}).`,
        postedAt: job.releasedDate ? new Date(job.releasedDate) : new Date(),
      };
    });
  } catch (error) {
    console.error(`[SmartRecruiters] Error fetching jobs for ${companySlug}:`, error.message);
    return [];
  }
}
