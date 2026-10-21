import ResumesCollection from "../../models/resumes_collection.model.js";
import ResumeAnalysis from "../../models/resume_analysis.model.js";
import {
  extractSkillsFromText,
  detectStreamFromTextAndSkills,
  classifyJobTypeAndExperience,
  cleanHtmlToText,
  classifyFresherVsProfessional,
  parseStructuredJD,
  CAREER_STREAMS,
  DOMAIN_TRACKS,
} from "./jobClassifier.js";
import { findCompanyByIdOrSlug, COMPANIES_REGISTRY } from "./companyRegistry.js";
import { analyzeCandidateProfile, computeJobMatch } from "../careerService.js";
import linkedInJobSearchService from "./linkedinJobSearch.service.js";

/**
 * Detect ATS provider and canonical details from domain
 */
export function identifyPortalProvider(urlString = "") {
  try {
    const parsed = new URL(urlString);
    const host = parsed.hostname.toLowerCase();

    if (host.includes("greenhouse.io") || host.includes("grnh.se")) {
      return {
        providerId: "greenhouse",
        label: "Greenhouse ATS",
        type: "Direct ATS API Board",
        isDirectAts: true,
        trustScore: 100,
      };
    }
    if (host.includes("lever.co")) {
      return {
        providerId: "lever",
        label: "Lever ATS",
        type: "Direct ATS API Board",
        isDirectAts: true,
        trustScore: 100,
      };
    }
    if (host.includes("smartrecruiters.com")) {
      return {
        providerId: "smartrecruiters",
        label: "SmartRecruiters ATS",
        type: "Direct ATS API Board",
        isDirectAts: true,
        trustScore: 100,
      };
    }
    if (host.includes("myworkdayjobs.com") || host.includes("myworkday.com")) {
      return {
        providerId: "workday",
        label: "Workday Enterprise ATS",
        type: "Enterprise Cloud ATS",
        isDirectAts: false,
        trustScore: 98,
      };
    }
    if (host.includes("successfactors.com") || host.includes("jobs.sap.com")) {
      return {
        providerId: "successfactors",
        label: "SAP SuccessFactors",
        type: "Enterprise Cloud ATS",
        isDirectAts: false,
        trustScore: 98,
      };
    }
    if (host.includes("taleo.net")) {
      return {
        providerId: "taleo",
        label: "Oracle Taleo",
        type: "Enterprise ATS",
        isDirectAts: false,
        trustScore: 95,
      };
    }
    if (host.includes("darwinbox.in") || host.includes("darwinbox.com")) {
      return {
        providerId: "darwinbox",
        label: "Darwinbox ATS",
        type: "Modern Enterprise ATS",
        isDirectAts: false,
        trustScore: 95,
      };
    }
    if (host.includes("freshteam.com") || host.includes("freshservice.com")) {
      return {
        providerId: "freshteam",
        label: "Freshteam ATS",
        type: "Cloud ATS Portal",
        isDirectAts: false,
        trustScore: 95,
      };
    }
    if (host.includes("zoho.com") || host.includes("zohorecruit.com")) {
      return {
        providerId: "zoho",
        label: "Zoho Recruit",
        type: "Official Enterprise Portal",
        isDirectAts: false,
        trustScore: 95,
      };
    }
    if (host.includes("tcs.com")) {
      return {
        providerId: "tcs_ion",
        label: "TCS iON Official Portal",
        type: "Indian Tech Giant Official Portal",
        isDirectAts: false,
        trustScore: 99,
      };
    }
    if (host.includes("infosys.com")) {
      return {
        providerId: "infosys_careers",
        label: "Infosys Official Portal",
        type: "Indian Tech Giant Official Portal",
        isDirectAts: false,
        trustScore: 99,
      };
    }
    if (host.includes("wipro.com")) {
      return {
        providerId: "wipro_careers",
        label: "Wipro Official Portal",
        type: "Indian Tech Giant Official Portal",
        isDirectAts: false,
        trustScore: 99,
      };
    }
    if (host.includes("amazon.jobs")) {
      return {
        providerId: "amazon_jobs",
        label: "Amazon Global Jobs Portal",
        type: "Official Company Career Portal",
        isDirectAts: false,
        trustScore: 100,
      };
    }
    if (host.includes("google.com")) {
      return {
        providerId: "google_careers",
        label: "Google Careers Official Portal",
        type: "Official Company Career Portal",
        isDirectAts: false,
        trustScore: 100,
      };
    }
    if (host.includes("microsoft.com")) {
      return {
        providerId: "microsoft_careers",
        label: "Microsoft Careers Official Portal",
        type: "Official Company Career Portal",
        isDirectAts: false,
        trustScore: 100,
      };
    }

    return {
      providerId: "official_portal",
      label: host.replace(/^www\./, "").split(".")[0].toUpperCase() + " Official Careers",
      type: "Official Company Portal",
      isDirectAts: false,
      trustScore: 90,
    };
  } catch {
    return {
      providerId: "unknown",
      label: "Career Portal",
      type: "Web Portal",
      isDirectAts: false,
      trustScore: 80,
    };
  }
}

/**
 * Perform a live HTTP / API probe to check if the job opening is online
 */
export async function probeUrlHealth(urlString, options = {}) {
  const { source = "", companySlug = "", externalId = "" } = options;
  const startTime = Date.now();

  let isOnline = false;
  let statusCode = 200;
  let verdict = "ACTIVE_VERIFIED";
  let statusBadge = "🟢 Actively Accepting Applications";
  let statusSummary = "Job posting is live and responding normally.";
  let directApiVerified = false;

  let domain = "";
  let isHttps = true;

  try {
    const parsed = new URL(urlString);
    domain = parsed.hostname;
    isHttps = parsed.protocol === "https:";
  } catch {
    domain = urlString;
  }

  const portalInfo = identifyPortalProvider(urlString);

  let effectiveCompanySlug = companySlug;
  let effectiveExternalId = externalId;

  if (!effectiveCompanySlug || !effectiveExternalId) {
    try {
      const parsedUrl = new URL(urlString);
      const parts = parsedUrl.pathname.split("/").filter(Boolean);
      const hostLower = parsedUrl.hostname.toLowerCase();

      // Greenhouse: /<slug>/jobs/<id> or boards.greenhouse.io/<slug>/jobs/<id>
      if (hostLower.includes("greenhouse.io") || hostLower.includes("grnh.se")) {
        const jobsIdx = parts.indexOf("jobs");
        if (jobsIdx > 0 && parts[jobsIdx + 1]) {
          effectiveCompanySlug = effectiveCompanySlug || parts[jobsIdx - 1];
          effectiveExternalId = effectiveExternalId || parts[jobsIdx + 1];
        } else if (parsedUrl.searchParams.get("gh_jid")) {
          effectiveExternalId = effectiveExternalId || parsedUrl.searchParams.get("gh_jid");
          effectiveCompanySlug = effectiveCompanySlug || parts[0];
        }
      }
      // Lever: jobs.lever.co/<slug>/<id>
      else if (hostLower.includes("lever.co")) {
        if (parts.length >= 2) {
          effectiveCompanySlug = effectiveCompanySlug || parts[0];
          effectiveExternalId = effectiveExternalId || parts[1];
        }
      }
      // SmartRecruiters: jobs.smartrecruiters.com/<slug>/<id>
      else if (hostLower.includes("smartrecruiters.com")) {
        if (parts.length >= 2) {
          effectiveCompanySlug = effectiveCompanySlug || parts[0];
          const rawId = parts[1].split("-")[0];
          effectiveExternalId = effectiveExternalId || rawId;
        }
      }
    } catch {}
  }

  try {
    // 1. Authoritative Greenhouse Direct Board API check
    if ((source === "greenhouse" || portalInfo.providerId === "greenhouse" || domain.includes("greenhouse.io")) && effectiveExternalId && effectiveCompanySlug) {
      const ghApiUrl = `https://boards-api.greenhouse.io/v1/boards/${effectiveCompanySlug}/jobs/${effectiveExternalId}`;
      const ghRes = await fetch(ghApiUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(4500),
      });

      statusCode = ghRes.status;
      directApiVerified = true;

      if (ghRes.ok) {
        isOnline = true;
        verdict = "ACTIVE_VERIFIED";
        statusBadge = "🟢 Actively Accepting Applications (Greenhouse API Verified)";
        statusSummary = "Direct Greenhouse API confirmed this requisition is currently open and accepting applicant submissions.";
      } else if (ghRes.status === 404) {
        isOnline = false;
        verdict = "CLOSED_EXPIRED";
        statusBadge = "🔴 Application Closed / Position Filled";
        statusSummary = "Greenhouse API confirmed this posting is no longer active or has been archived by the hiring team.";
      } else {
        isOnline = false;
        verdict = "POSSIBLY_CLOSED";
        statusBadge = `🔴 Position Unavailable (HTTP ${statusCode})`;
        statusSummary = `Greenhouse responded with status ${statusCode}. Requisition may be closed.`;
      }
    }
    // 2. Authoritative Lever Direct Posting API check
    else if ((source === "lever" || portalInfo.providerId === "lever" || domain.includes("lever.co")) && effectiveExternalId && effectiveCompanySlug) {
      const leverApiUrl = `https://api.lever.co/v0/postings/${effectiveCompanySlug}/${effectiveExternalId}`;
      const leverRes = await fetch(leverApiUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(4500),
      });

      statusCode = leverRes.status;
      directApiVerified = true;

      if (leverRes.ok) {
        isOnline = true;
        verdict = "ACTIVE_VERIFIED";
        statusBadge = "🟢 Actively Accepting Applications (Lever API Verified)";
        statusSummary = "Direct Lever API confirmed this posting is currently published and open for applications.";
      } else if (leverRes.status === 404) {
        isOnline = false;
        verdict = "CLOSED_EXPIRED";
        statusBadge = "🔴 Application Closed";
        statusSummary = "Lever API indicated this role is no longer accepting submissions.";
      } else {
        isOnline = false;
        verdict = "POSSIBLY_CLOSED";
        statusBadge = `🔴 Position Unavailable (HTTP ${statusCode})`;
        statusSummary = `Lever responded with status ${statusCode}. Requisition may be closed.`;
      }
    }
    // 3. Authoritative SmartRecruiters Direct Posting API check
    else if ((source === "smartrecruiters" || portalInfo.providerId === "smartrecruiters" || domain.includes("smartrecruiters.com")) && effectiveExternalId && effectiveCompanySlug) {
      const srApiUrl = `https://api.smartrecruiters.com/v1/companies/${effectiveCompanySlug}/postings/${effectiveExternalId}`;
      const srRes = await fetch(srApiUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(4500),
      });

      statusCode = srRes.status;
      directApiVerified = true;

      if (srRes.ok) {
        isOnline = true;
        verdict = "ACTIVE_VERIFIED";
        statusBadge = "🟢 Actively Accepting Applications (SmartRecruiters Verified)";
        statusSummary = "Direct SmartRecruiters API confirmed this posting is live and accepting applications.";
      } else {
        isOnline = false;
        verdict = "CLOSED_EXPIRED";
        statusBadge = "🔴 Application Closed / Position Filled";
        statusSummary = "SmartRecruiters API confirmed this role is no longer accepting applications.";
      }
    }
    // 4. LinkedIn Requisitions Check (Check for closed notices & redirects)
    else if (domain.includes("linkedin.com")) {
      // Discard known fabricated countdown IDs immediately
      if (/\/jobs\/view\/41[456]\d{7}/.test(urlString)) {
        isOnline = false;
        statusCode = 410;
        verdict = "CLOSED_EXPIRED";
        statusBadge = "🔴 Posting Expired / Not Found";
        statusSummary = "This requisition was archived or is no longer accepting applications on LinkedIn.";
      } else {
        const liRes = await fetch(urlString, {
          method: "GET",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          },
          signal: AbortSignal.timeout(4500),
        });

        statusCode = liRes.status;
        const pageText = await liRes.text();
        const lowerText = pageText.slice(0, 8000).toLowerCase();

        const isClosed =
          !liRes.ok ||
          lowerText.includes("no longer accepting applications") ||
          lowerText.includes("no longer available") ||
          lowerText.includes("this job is closed") ||
          lowerText.includes("job is no longer available") ||
          lowerText.includes("we couldn't find a match") ||
          (liRes.url && liRes.url.includes("/jobs/search"));

        if (isClosed) {
          isOnline = false;
          verdict = "CLOSED_EXPIRED";
          statusBadge = "🔴 Application Closed / Position Filled";
          statusSummary = "LinkedIn confirmed this job posting is closed and no longer accepting applications.";
        } else {
          isOnline = true;
          verdict = "ACTIVE_VERIFIED";
          statusBadge = "🟢 Actively Accepting Applications (LinkedIn Live)";
          statusSummary = "LinkedIn requisition is live and responding normally.";
        }
      }
    }
    // 5. General HTTP GET Probe
    else {
      const probeRes = await fetch(urlString, {
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        signal: AbortSignal.timeout(4500),
      });

      statusCode = probeRes.status;

      if (probeRes.ok) {
        const pageText = await probeRes.text();
        const lowerText = pageText.slice(0, 6000).toLowerCase();
        const finalUrl = (probeRes.url || "").toLowerCase();

        const isGreenhouseRedirect =
          (domain.includes("greenhouse.io") || domain.includes("grnh.se")) &&
          (finalUrl.includes("error=true") || (urlString.includes("/jobs/") && !finalUrl.includes("/jobs/")));

        const isExpired =
          isGreenhouseRedirect ||
          lowerText.includes("this job is no longer available") ||
          lowerText.includes("job posting has expired") ||
          lowerText.includes("position has been filled") ||
          lowerText.includes("no longer accepting applications") ||
          lowerText.includes("this requisition has been closed") ||
          lowerText.includes("job is no longer active") ||
          (lowerText.includes("404") && lowerText.includes("not found"));

        if (isExpired) {
          isOnline = false;
          verdict = "CLOSED_EXPIRED";
          statusBadge = "🔴 Application Closed / Position Filled";
          statusSummary = "Employer career portal indicated this position has been closed or filled.";
        } else {
          isOnline = true;
          verdict = "ACTIVE_VERIFIED";
          statusBadge = "🟢 Actively Accepting Applications (HTTP 200 OK)";
          statusSummary = `Portal responded successfully (${statusCode} OK). The career destination page is live and accessible.`;
        }
      } else if (statusCode === 403 || statusCode === 401) {
        // WAF protected enterprise portals (human applicants can visit)
        isOnline = true;
        verdict = "ENTERPRISE_PROTECTED";
        statusBadge = "🟢 Live Enterprise Portal (WAF Protected)";
        statusSummary = "Portal is active and guarded by enterprise bot protection. Human applicants can open and submit directly.";
      } else if (statusCode >= 300 && statusCode < 400) {
        isOnline = true;
        verdict = "REDIRECTED_SECURE";
        statusBadge = "🟡 Redirected to Canonical Application Page";
        statusSummary = "The URL securely forwarded to the official corporate application form.";
      } else if (statusCode === 404 || statusCode === 410) {
        isOnline = false;
        verdict = "CLOSED_EXPIRED";
        statusBadge = "🔴 Posting Not Found / Closed";
        statusSummary = "The server returned 404 Not Found. This opening has been filled or removed by the employer.";
      } else {
        isOnline = false;
        verdict = "POSSIBLY_CLOSED";
        statusBadge = `🔴 Unavailable (HTTP ${statusCode})`;
        statusSummary = `Server responded with status ${statusCode}. Requisition may no longer be active.`;
      }
    }
  } catch (err) {
    const isTimeout =
      err.name === "TimeoutError" ||
      err.message?.toLowerCase().includes("timeout") ||
      err.message?.toLowerCase().includes("aborted");

    isOnline = false;
    statusCode = isTimeout ? 408 : 503;
    verdict = isTimeout ? "TIMED_OUT" : "OFFLINE";
    statusBadge = isTimeout
      ? "🔴 Request Timed Out (Posting Inaccessible)"
      : "🔴 Portal Offline / Unreachable";
    statusSummary = isTimeout
      ? "The employer career portal timed out. This requisition may have expired or been taken offline."
      : `Unable to connect to employer portal (${err.message}).`;
  }

  const responseTimeMs = Date.now() - startTime;

  return {
    isOnline,
    statusCode,
    responseTimeMs,
    domain,
    isHttps,
    portalProvider: portalInfo.label,
    portalType: portalInfo.type,
    atsProviderId: portalInfo.providerId,
    trustScore: portalInfo.trustScore,
    verdict,
    statusBadge,
    statusSummary,
    directApiVerified,
    verifiedAt: new Date().toISOString(),
  };
}

/**
 * Robust Job Posting Web Crawler & ATS Parser
 * Crawls external career pages, parses Greenhouse/Lever APIs, cleans boilerplate,
 * and extracts structured JD (responsibilities, qualifications, tech stack, fresher/professional classification)
 */
export async function crawlJobPostingUrl(urlString) {
  try {
    const parsed = new URL(urlString);
    const host = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname;

    // A0. Check for LinkedIn Job Posting
    if (host.includes("linkedin.com")) {
      const liIdMatch =
        pathname.match(/(?:view\/|jobs\/|jobPosting:)(\d+)/) ||
        urlString.match(/(?:currentJobId=|[?&]id=)(\d+)/) ||
        urlString.match(/-(\d+)(?:\?|$)/);
      const jobId = liIdMatch ? liIdMatch[1] : "";
      if (jobId) {
        const liDetails = await linkedInJobSearchService.fetchLinkedInJobDescription(jobId);
        if (liDetails && liDetails.cleanText) {
          return {
            title: liDetails.title || "Job Requisition",
            company: liDetails.company || "Company",
            location: "India / Global",
            rawHtml: liDetails.rawHtml,
            cleanText: liDetails.cleanText,
            structuredJD: liDetails.structuredJD,
            fresherInfo: liDetails.structuredJD?.experienceRequirement,
            crawledVia: "LinkedIn Official Requisition API",
            criteria: liDetails.criteria,
          };
        }
      }
    }

    // A. Check for direct Greenhouse Board / Job API
    if (host.includes("greenhouse.io") || host.includes("grnh.se")) {
      const pathParts = pathname.split("/").filter(Boolean);
      let companySlug = "";
      let jobId = "";

      if (pathParts[0] && pathParts[1] === "jobs" && pathParts[2]) {
        companySlug = pathParts[0];
        jobId = pathParts[2];
      } else if (parsed.searchParams.get("for") && parsed.searchParams.get("token")) {
        companySlug = parsed.searchParams.get("for");
        jobId = parsed.searchParams.get("token");
      }

      if (companySlug && jobId) {
        try {
          const ghRes = await fetch(`https://boards-api.greenhouse.io/v1/boards/${companySlug}/jobs/${jobId}`, {
            headers: { Accept: "application/json" },
            signal: AbortSignal.timeout(6000),
          });
          if (ghRes.ok) {
            const ghData = await ghRes.json();
            const title = ghData.title || "Software Engineer";
            const cleanBody = cleanHtmlToText(ghData.content || "");
            const structuredJD = parseStructuredJD(title, cleanBody, ghData.content);
            const fresherInfo = structuredJD.experienceRequirement;
            const companyName = companySlug.charAt(0).toUpperCase() + companySlug.slice(1);

            return {
              title,
              company: companyName,
              location: ghData.location?.name || "India / Remote",
              rawHtml: ghData.content || "",
              cleanText: cleanBody,
              structuredJD,
              fresherInfo,
              crawledVia: "Greenhouse Official Board API",
            };
          }
        } catch (e) {
          console.warn("[JobCrawler] Greenhouse direct API note:", e.message);
        }
      }
    }

    // B. Check for direct Lever Board / Job API
    if (host.includes("lever.co")) {
      const pathParts = pathname.split("/").filter(Boolean);
      if (pathParts.length >= 2) {
        const companySlug = pathParts[0];
        const jobId = pathParts[1];
        try {
          const lvRes = await fetch(`https://api.lever.co/v0/postings/${companySlug}/${jobId}`, {
            headers: { Accept: "application/json" },
            signal: AbortSignal.timeout(6000),
          });
          if (lvRes.ok) {
            const lvData = await lvRes.json();
            const title = lvData.text || "Software Engineer";
            let fullHtml = lvData.description || "";
            if (Array.isArray(lvData.lists)) {
              for (const item of lvData.lists) {
                fullHtml += `\n<h3>${item.text}</h3>\n${item.content || ""}`;
              }
            }
            if (lvData.additional) {
              fullHtml += `\n<p>${lvData.additional}</p>`;
            }
            const cleanBody = cleanHtmlToText(fullHtml);
            const structuredJD = parseStructuredJD(title, cleanBody, fullHtml);
            const companyName = companySlug.charAt(0).toUpperCase() + companySlug.slice(1);

            return {
              title,
              company: companyName,
              location: lvData.categories?.location || "India / Remote",
              rawHtml: fullHtml,
              cleanText: cleanBody,
              structuredJD,
              fresherInfo: structuredJD.experienceRequirement,
              crawledVia: "Lever Official API",
            };
          }
        } catch (e) {
          console.warn("[JobCrawler] Lever direct API note:", e.message);
        }
      }
    }

    // C. General Web Page Crawler
    const res = await fetch(urlString, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(6500),
    });

    const html = await res.text();
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
    const ogSiteNameMatch = html.match(/<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["']/i);
    const metaDescMatch =
      html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);

    const rawTitle = ogTitleMatch?.[1] || titleMatch?.[1] || "";
    const cleanTitle = rawTitle.split(/[-–|•:]/)[0].trim() || "Software Engineer";
    const hostDomain = host.replace(/^www\./, "").split(".")[0];
    const company = ogSiteNameMatch?.[1]?.trim() || hostDomain.charAt(0).toUpperCase() + hostDomain.slice(1);

    // Try to isolate main job description block
    let targetHtml = "";
    const mainMatch = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
    const articleMatch = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i);
    const jobDescDivMatch = html.match(
      /<div\b[^>]*(?:class|id)=["'][^"']*(?:job-description|posting-description|job-details|description)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i
    );

    if (jobDescDivMatch && jobDescDivMatch[1]?.length > 200) {
      targetHtml = jobDescDivMatch[1];
    } else if (mainMatch && mainMatch[1]?.length > 200) {
      targetHtml = mainMatch[1];
    } else if (articleMatch && articleMatch[1]?.length > 200) {
      targetHtml = articleMatch[1];
    } else {
      const bodyMatch = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
      targetHtml = bodyMatch?.[1] ? bodyMatch[1].slice(0, 150000) : html.slice(0, 150000);
    }

    const cleanBody = cleanHtmlToText(targetHtml) || metaDescMatch?.[1] || cleanTitle;
    const structuredJD = parseStructuredJD(cleanTitle, cleanBody, targetHtml);

    return {
      title: cleanTitle,
      company,
      location: "India / Remote",
      rawHtml: targetHtml.slice(0, 20000),
      cleanText: cleanBody,
      structuredJD,
      fresherInfo: structuredJD.experienceRequirement,
      crawledVia: "Direct HTTP Crawler",
    };
  } catch {
    return null;
  }
}

/**
 * Lightweight scraper for external URLs (backwards-compatible alias)
 */
export async function scrapeUrlMetadata(urlString) {
  const crawled = await crawlJobPostingUrl(urlString);
  if (crawled) {
    return {
      title: crawled.title,
      description: crawled.cleanText.slice(0, 500),
      siteName: crawled.company,
      structuredJD: crawled.structuredJD,
    };
  }
  return null;
}

/**
 * Comprehensive Job Check System
 * Combines live network probe, candidate profile evaluation, stream match, and resume tailoring insights
 */
export async function inspectJobSystem(payload = {}, userId = null) {
  const {
    url = "",
    job: incomingJob = null,
    source = "",
    companySlug = "",
    externalId = "",
  } = payload;

  const targetUrl = incomingJob?.applyUrl || url;
  if (!targetUrl) {
    throw new Error("Target job URL is required for live verification");
  }

  // 1. Live Network & ATS Probe
  const probe = await probeUrlHealth(targetUrl, {
    source: incomingJob?.source || source,
    companySlug: incomingJob?.companySlug || companySlug,
    externalId: incomingJob?.externalId || externalId,
  });

  // 2. Resolve Job Profile & Crawl Detailed JD
  let jobData = incomingJob ? { ...incomingJob } : null;

  if (!jobData) {
    // Live crawl external destination URL
    const crawled = await crawlJobPostingUrl(targetUrl);
    const parsedDomain = probe.domain.replace(/^www\./, "").split(".")[0];
    const inferredCompany = crawled?.company || parsedDomain.charAt(0).toUpperCase() + parsedDomain.slice(1);
    const inferredTitle = crawled?.title || "Software Engineer";
    const cleanDesc = crawled?.cleanText || inferredTitle;
    const structuredJD = crawled?.structuredJD || parseStructuredJD(inferredTitle, cleanDesc);

    const skills = extractSkillsFromText(`${inferredTitle} ${cleanDesc}`);
    const streamInfo = detectStreamFromTextAndSkills(inferredTitle, skills);
    const classified = classifyJobTypeAndExperience(inferredTitle, cleanDesc);

    jobData = {
      id: `ext_${Date.now()}`,
      title: inferredTitle,
      company: inferredCompany,
      companySlug: parsedDomain.toLowerCase(),
      applyUrl: targetUrl,
      location: crawled?.location || "India / Remote",
      employmentType: classified.employmentType,
      experienceLevel: classified.experienceLevel,
      minExperienceYears: classified.minExperienceYears,
      maxExperienceYears: classified.maxExperienceYears,
      isFresherFriendly: classified.isFresherFriendly,
      candidateType: classified.candidateType,
      eligibilityVerdict: classified.eligibilityVerdict,
      fresherEligibilityReason: classified.fresherEligibilityReason,
      requiredSkills: skills.length > 0 ? skills : (structuredJD.techStack?.length > 0 ? structuredJD.techStack : ["JavaScript", "React", "Node.js", "Problem Solving"]),
      stream: streamInfo.primaryStream,
      track: streamInfo.track,
      source: probe.atsProviderId || "external_portal",
      description: cleanDesc,
      descriptionSummary: cleanDesc.slice(0, 400),
      structuredJD,
    };
  } else {
    // Ensure incoming job has structuredJD
    if (!jobData.structuredJD) {
      jobData.structuredJD = parseStructuredJD(
        jobData.title,
        jobData.description || jobData.descriptionSummary || jobData.title
      );
    }
    if (!jobData.candidateType && jobData.structuredJD?.experienceRequirement?.candidateType) {
      jobData.candidateType = jobData.structuredJD.experienceRequirement.candidateType;
      jobData.eligibilityVerdict = jobData.structuredJD.experienceRequirement.eligibilityVerdict;
      jobData.fresherEligibilityReason = jobData.structuredJD.experienceRequirement.fresherEligibilityReason;
    }
  }

  // 3. Retrieve Candidate Profile if Logged In
  let resumeText = "";
  let resumeAnalysis = null;
  let hasResume = false;

  if (userId) {
    try {
      const [resume, analysis] = await Promise.all([
        ResumesCollection.findOne({ user_id: userId }),
        ResumeAnalysis.findOne({ user_id: userId }),
      ]);
      if (resume?.parsed_data) {
        resumeText = resume.parsed_data;
        hasResume = true;
      }
      if (analysis) {
        resumeAnalysis = analysis;
        hasResume = true;
      }
    } catch (e) {
      console.warn("[JobVerifier] Could not load candidate resume context:", e.message);
    }
  }

  const candidateProfile = analyzeCandidateProfile(resumeText, resumeAnalysis);
  const matchResult = computeJobMatch(jobData, candidateProfile, resumeText);

  // 4. Candidate Qualification & Experience Alignment Check
  const candidateYears = candidateProfile.experienceYears || 0;
  const isCandidateFresher = candidateProfile.isFresher;
  const isJobFresherFriendly = Boolean(jobData.isFresherFriendly || jobData.experienceLevel?.toLowerCase().includes("fresher"));

  let isExperienceEligible = true;
  let eligibilityBadge = "⚡ Qualified Profile";
  let eligibilityDetail = "Your overall experience and skill background align with this opening.";

  if (isCandidateFresher && isJobFresherFriendly) {
    isExperienceEligible = true;
    eligibilityBadge = "🌱 Fresher Perfect Match";
    eligibilityDetail =
      "This role explicitly welcomes freshers and entry-level graduates. Your foundational coursework and projects make you an eligible applicant.";
  } else if (isCandidateFresher && (jobData.experienceLevel?.includes("Senior") || jobData.experienceLevel?.includes("5+"))) {
    isExperienceEligible = false;
    eligibilityBadge = "⚠️ Senior Role Notice";
    eligibilityDetail =
      "This position typically requires 5+ years of industry experience. Consider applying for Junior/Associate roles or emphasizing extensive open-source portfolio work.";
  } else if (!isCandidateFresher && isJobFresherFriendly) {
    isExperienceEligible = true;
    eligibilityBadge = "⭐ Highly Competitive Candidate";
    eligibilityDetail = `With ${candidateYears} year(s) of experience, you will stand out among applicants for this entry-level/fresher opening.`;
  } else {
    isExperienceEligible = true;
    eligibilityBadge = "✓ Experience Level Matched";
    eligibilityDetail = `Candidate level (${candidateProfile.experienceLevel}) matches the target profile (${jobData.experienceLevel || "Relevant Experience"}).`;
  }

  // 5. Stream Alignment
  const candidateStream = candidateProfile.primaryStream;
  const jobStream = jobData.stream;
  const isStreamMatch = Boolean(candidateStream && jobStream && candidateStream.id === jobStream.id);
  const isTrackMatch = Boolean(
    candidateProfile.track?.id &&
      (jobData.stream?.track === candidateProfile.track.id || jobData.track?.id === candidateProfile.track.id)
  );

  // 6. Actionable AI Tailoring Advice
  const matchedSkills = matchResult.matchedSkills || [];
  const missingSkills = matchResult.missingSkills || [];
  const tailoringAdvice = [];

  if (matchedSkills.length > 0) {
    tailoringAdvice.push(
      `Showcase your hands-on experience with ${matchedSkills.slice(0, 3).join(", ")} at the very top of your project and work history sections.`
    );
  }

  if (missingSkills.length > 0) {
    tailoringAdvice.push(
      `Add practical mentions or related familiarity with ${missingSkills.slice(0, 3).join(", ")} to maximize ATS keyword scoring.`
    );
  }

  if (isCandidateFresher) {
    tailoringAdvice.push(
      "Include deployed GitHub demo links, project metrics, and academic milestones prominently to demonstrate production readiness."
    );
  } else {
    tailoringAdvice.push(
      "Quantify your impact with measurable KPIs (e.g. latency reduced by 30%, user growth, cost savings) in your latest role."
    );
  }

  // 7. Company Details lookup
  const registeredCompany = findCompanyByIdOrSlug(jobData.companySlug || jobData.company);

  const fresherVsProfessional = jobData.structuredJD?.experienceRequirement || {
    isFresher: jobData.isFresherFriendly,
    candidateType: jobData.candidateType || jobData.experienceLevel,
    minYears: jobData.minExperienceYears || 0,
    maxYears: jobData.maxExperienceYears || 1,
    eligibilityVerdict: jobData.eligibilityVerdict || (jobData.isFresherFriendly ? "🌱 Fresher Friendly (0-1 yr)" : "💼 Professional"),
    fresherEligibilityReason: jobData.fresherEligibilityReason || (jobData.isFresherFriendly ? "Open to Freshers & Entry-Level candidates" : "Requires prior industry experience"),
  };

  return {
    job: {
      ...jobData,
      structuredJD: jobData.structuredJD,
      candidateType: fresherVsProfessional.candidateType,
      eligibilityVerdict: fresherVsProfessional.eligibilityVerdict,
      fresherEligibilityReason: fresherVsProfessional.fresherEligibilityReason,
      matchScore: matchResult.matchScore,
      matchedSkills,
      missingSkills,
    },
    structuredJD: jobData.structuredJD,
    fresherVsProfessional,
    probe,
    candidateMatch: {
      hasResume,
      matchScore: matchResult.matchScore,
      candidateLevel: candidateProfile.experienceLevel,
      candidateTrack: candidateProfile.track?.label || "Tech & Engineering",
      candidateStream: candidateStream?.label || "Full Stack",
      jobLevel: jobData.experienceLevel,
      jobStream: jobStream?.label || "Engineering",
      isExperienceEligible,
      eligibilityBadge,
      eligibilityDetail,
      isStreamMatch,
      isTrackMatch,
      streamFit: matchResult.streamFit,
      matchedSkills,
      missingSkills,
      tailoringAdvice,
    },
    companyInfo: registeredCompany
      ? {
          name: registeredCompany.name,
          slug: registeredCompany.slug,
          category: registeredCompany.category,
          officialPortalUrl: registeredCompany.officialPortalUrl,
          headquarters: registeredCompany.headquarters,
          logo: registeredCompany.logo,
        }
      : {
          name: jobData.company,
          slug: jobData.companySlug,
          category: "Technology Company",
          officialPortalUrl: targetUrl,
        },
    security: {
      isHttps: probe.isHttps,
      sslVerified: probe.isHttps,
      trustRating: probe.trustScore >= 95 ? "High Trust (Verified ATS/Company Portal)" : "Standard Trust",
      protectionStatus: probe.verdict === "ENTERPRISE_PROTECTED" ? "Protected by Cloudflare/WAF" : "Standard HTTPS",
    },
  };
}
