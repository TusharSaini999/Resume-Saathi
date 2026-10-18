import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { COMPANIES_REGISTRY, COMPANY_CATEGORIES } from "../services/ats/companyRegistry.js";
import { TECH_COUNTRIES } from "../services/ats/techLocations.js";
import {
  getJobsForCandidate,
  clearCareerCache,
  getSystemPortalHealth,
  scanCompanyOriginalPortal,
  postStartupJobProfile,
  captureFullJobDescription,
} from "../services/careerService.js";
import JobApplicationTracker from "../models/jobApplicationTracker.model.js";

export const getHealth = asyncHandler(async (req, res) => {
  const health = getSystemPortalHealth();
  res.status(200).json(new ApiResponse(true, 200, "Portal status retrieved successfully", health));
});

export const purgeCache = asyncHandler(async (req, res) => {
  const result = await clearCareerCache();
  res.status(200).json(new ApiResponse(true, 200, "Career cache purged successfully", result));
});

export const getCompanies = asyncHandler(async (req, res) => {
  res.status(200).json(
    new ApiResponse(true, 200, "Companies registry retrieved successfully", {
      categories: [...new Set(Object.values(COMPANY_CATEGORIES))],
      companies: COMPANIES_REGISTRY,
    })
  );
});

export const getCompanyProfile = asyncHandler(async (req, res) => {
  const { slug = "" } = req.params;
  const cleanSlug = slug.toLowerCase().trim();
  const company = COMPANIES_REGISTRY.find(
    (c) => c.slug.toLowerCase() === cleanSlug || c.id.toLowerCase() === cleanSlug || c.name.toLowerCase() === cleanSlug
  );

  if (!company) {
    const resolvedName = cleanSlug.charAt(0).toUpperCase() + cleanSlug.slice(1);
    return res.status(200).json(
      new ApiResponse(true, 200, "Dynamic company profile", {
        id: cleanSlug,
        name: resolvedName,
        slug: cleanSlug,
        provider: "ai_search",
        category: "Tech & Innovation Leader",
        logo: `https://${cleanSlug}.com/favicon.ico`,
        website: `https://${cleanSlug}.com`,
        officialPortalUrl: `https://${cleanSlug}.com/careers`,
        headquarters: "India / Global",
        description: `${resolvedName} is an innovative organization actively expanding its technical, product, and leadership teams.`,
        tags: ["Tech", "India"],
      })
    );
  }

  res.status(200).json(new ApiResponse(true, 200, "Company profile retrieved", company));
});

import { inspectJobSystem, identifyPortalProvider } from "../services/ats/jobVerifier.service.js";

export const verifyJobOnline = asyncHandler(async (req, res) => {
  const payload = { ...req.query, ...req.body };
  const targetUrl = payload.url || payload.job?.applyUrl;

  if (!targetUrl) {
    throw new ApiError(400, "URL or job object is required to verify job status online");
  }

  const userId = req.user?._id;
  const report = await inspectJobSystem(payload, userId);

  res.status(200).json(
    new ApiResponse(
      true,
      200,
      report.probe.isOnline ? "Job verified active online" : "Job posting may be closed",
      {
        online: report.probe.isOnline,
        statusCode: report.probe.statusCode,
        responseTimeMs: report.probe.responseTimeMs,
        portalType: report.probe.portalProvider,
        verifiedAt: report.probe.verifiedAt,
        url: targetUrl,
        ...report,
      }
    )
  );
});

export const postJobProfile = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const payload = req.body;
  const result = await postStartupJobProfile(payload, userId);
  res.status(201).json(new ApiResponse(true, 201, result.message, result));
});

export const getCareerJobs = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const {
    company = "",
    role = "",
    location = "All",
    country = "All",
    category = "",
    minScore = 0,
    track = "",
    employmentType = "",
    experienceLevel = "",
    stream = "",
    fresherOnly = false,
    forceRefresh = false,
    useNewResume = false,
    strictAiOnly = false,
    aiDeepMatch = true,
    realOnly = true,
    portalSource = "All",
  } = req.query;

  const results = await getJobsForCandidate(userId, {
    company,
    role,
    location,
    country,
    category,
    track,
    employmentType,
    experienceLevel,
    stream,
    fresherOnly,
    forceRefresh,
    useNewResume,
    strictAiOnly,
    aiDeepMatch,
    realOnly,
    portalSource,
  });

  results.availableCountries = TECH_COUNTRIES;
  results.activeCountry = country;

  // Filter by minScore if specified
  if (minScore > 0) {
    results.jobs = results.jobs.filter((j) => j.matchScore >= Number(minScore));
    results.totalJobs = results.jobs.length;
  }

  res.status(200).json(
    new ApiResponse(true, 200, "Career portal jobs retrieved successfully", results)
  );
});

export const scanCompanyPortal = asyncHandler(async (req, res) => {
  const {
    company = "",
    companySlug = "",
    companyName = "",
    roleQuery = "",
    location = "India",
  } = {
    ...req.query,
    ...req.body,
  };
  const targetCompany = (company || companySlug || companyName).trim();
  const userId = req.user?._id;

  if (!targetCompany) {
    throw new ApiError(400, "Company identifier or slug is required to scan original portal");
  }

  const result = await scanCompanyOriginalPortal(targetCompany, roleQuery, location, userId);
  res.status(200).json(
    new ApiResponse(
      true,
      200,
      `Live openings retrieved from ${result.company?.name || targetCompany} official portal`,
      result
    )
  );
});

export const trackJob = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const {
    company_name,
    title,
    location,
    apply_url,
    source,
    source_portal,
    source_url,
    source_domain,
    portal_type,
    employment_type = "Full-time",
    experience_level = "Junior (1-3 yrs)",
    match_score = 0,
    matched_skills = [],
    missing_skills = [],
    status = "saved",
    notes = "",
  } = req.body;

  if (!company_name || !title || !apply_url) {
    throw new ApiError(400, "Company name, title, and apply URL are required");
  }

  // Detect and resolve source where the job was discovered
  let detectedDomain = "";
  try {
    detectedDomain = new URL(apply_url).hostname;
  } catch {
    detectedDomain = "";
  }
  const portalInfo = identifyPortalProvider(apply_url);
  const resolvedSource = source || portalInfo.providerId || "official_career_portal";
  const resolvedSourcePortal = source_portal || portalInfo.label || "Official Career Portal";
  const resolvedSourceDomain = source_domain || detectedDomain;
  const resolvedPortalType = portal_type || portalInfo.type || "Official Company Portal";

  const tracked = await JobApplicationTracker.findOneAndUpdate(
    { user_id: userId, apply_url },
    {
      user_id: userId,
      company_name,
      title,
      location,
      apply_url,
      source: resolvedSource,
      source_portal: resolvedSourcePortal,
      source_url: source_url || apply_url,
      source_domain: resolvedSourceDomain,
      portal_type: resolvedPortalType,
      employment_type,
      experience_level,
      match_score,
      matched_skills,
      missing_skills,
      status,
      notes,
      applied_at: status === "applied" ? new Date() : undefined,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.status(200).json(
    new ApiResponse(true, 200, "Job tracked successfully in pipeline with discovery source", tracked)
  );
});

export const getTrackedJobs = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const tracked = await JobApplicationTracker.find({ user_id: userId }).sort({ updatedAt: -1 });

  res.status(200).json(
    new ApiResponse(true, 200, "Tracked jobs retrieved successfully", tracked)
  );
});

export const updateTrackedStatus = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;
  const { status, notes } = req.body;

  const validStatuses = ["saved", "applied", "interviewing", "offered", "rejected"];
  if (status && !validStatuses.includes(status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(", ")}`);
  }

  const updateFields = {};
  if (status) {
    updateFields.status = status;
    if (status === "applied") {
      updateFields.applied_at = new Date();
    }
  }
  if (typeof notes === "string") {
    updateFields.notes = notes;
  }

  const updated = await JobApplicationTracker.findOneAndUpdate(
    { _id: id, user_id: userId },
    { $set: updateFields },
    { new: true }
  );

  if (!updated) {
    throw new ApiError(404, "Tracked job not found");
  }

  res.status(200).json(
    new ApiResponse(true, 200, "Job status updated successfully", updated)
  );
});

export const deleteTrackedJob = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  const deleted = await JobApplicationTracker.findOneAndDelete({ _id: id, user_id: userId });
  if (!deleted) {
    throw new ApiError(404, "Tracked job not found");
  }

  res.status(200).json(
    new ApiResponse(true, 200, "Tracked job removed successfully", { id })
  );
});

export const getFullJobDescription = asyncHandler(async (req, res) => {
  const { jobId, applyUrl, source, companySlug, externalId, company, title } = {
    ...req.query,
    ...req.body,
  };

  const result = await captureFullJobDescription({
    jobId,
    applyUrl,
    source,
    companySlug,
    externalId,
    company,
    title,
  });

  res.status(200).json(
    new ApiResponse(true, 200, "Full job description retrieved successfully", result)
  );
});
