import { classifyJobTypeAndExperience } from "./jobClassifier.js";

export async function fetchLeverJobs(companySlug, companyName = "") {
  try {
    const url = `https://api.lever.co/v0/postings/${companySlug}?mode=json&limit=40`;
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(6500), // 6.5s timeout
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    if (!Array.isArray(data)) {
      return [];
    }

    const resolvedCompanyName = companyName || companySlug;

    return data.map((job) => {
      const location = job.categories?.location || "Multiple Locations / Remote";
      const isRemote =
        location.toLowerCase().includes("remote") ||
        (job.categories?.workplaceType || "").toLowerCase().includes("remote") ||
        (job.text || "").toLowerCase().includes("remote");

      const cleanDesc = job.descriptionPlain || job.description || "";
      const rawCommitment = job.categories?.commitment || "";

      const classification = classifyJobTypeAndExperience(job.text, cleanDesc, rawCommitment);

      return {
        id: `lever_${companySlug}_${job.id}`,
        externalId: String(job.id),
        company: resolvedCompanyName,
        companySlug,
        source: "lever",
        portalLabel: "Lever ATS",
        title: job.text,
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
        departments: [job.categories?.department, job.categories?.team].filter(Boolean),
        applyUrl: job.hostedUrl || job.applyUrl,
        description: cleanDesc,
        descriptionSummary: cleanDesc.slice(0, 400),
        postedAt: job.createdAt ? new Date(job.createdAt) : new Date(),
      };
    });
  } catch (error) {
    console.error(`[Lever] Error fetching jobs for ${companySlug}:`, error.message);
    return [];
  }
}

export async function fetchSingleLeverJob(companySlug, jobId) {
  try {
    const url = `https://api.lever.co/v0/postings/${companySlug}/${jobId}`;
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    let fullHtml = data.description || "";
    if (Array.isArray(data.lists)) {
      for (const item of data.lists) {
        fullHtml += `\n<h3>${item.text}</h3>\n${item.content || ""}`;
      }
    }
    if (data.additional) {
      fullHtml += `\n<p>${data.additional}</p>`;
    }
    const cleanDesc =
      data.descriptionPlain ||
      fullHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return {
      success: true,
      jobId: String(data.id || jobId),
      title: data.text,
      cleanText: cleanDesc,
      rawHtml: fullHtml,
      location: data.categories?.location || "India / Remote",
      hostedUrl: data.hostedUrl || data.applyUrl,
    };
  } catch (err) {
    console.warn(`[Lever] Error fetching single job ${jobId}:`, err.message);
    return null;
  }
}

