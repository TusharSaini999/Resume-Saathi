import React, { useState, useEffect } from "react";
import {
  X,
  ExternalLink,
  Bookmark,
  Building2,
  MapPin,
  Briefcase,
  Sparkles,
  CheckCircle2,
  Check,
  Copy,
  GraduationCap,
  ShieldCheck,
  RefreshCw,
  Zap,
  FileText,
  Target,
  Globe,
  Linkedin,
} from "lucide-react";
import careerService from "../../services/careerService";
import { stripHtml, cleanListItems } from "../../utils/textSanitizer";

export default function JobDetailsModal({
  job,
  onClose,
  saved,
  onSave,
  onCheckOnline,
  onOpenCompanyProfile,
  onTailorResume,
  GRADIENT_PRIMARY,
}) {
  const [currentJob, setCurrentJob] = useState(job);
  const [viewTab, setViewTab] = useState("structured"); // "structured" | "full"
  const [copiedJd, setCopiedJd] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isCapturingFullJD, setIsCapturingFullJD] = useState(false);

  useEffect(() => {
    setCurrentJob(job);
    const hasFull =
      job?.hasFullJD ||
      (job?.fullDescription && job.fullDescription.length >= 400) ||
      (job?.description && job.description.length >= 400) ||
      (job?.structuredJD?.fullText && job.structuredJD.fullText.length >= 400);

    if (job && !hasFull) {
      handleCaptureFullJD(job);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job]);

  if (!currentJob) return null;

  const handleCaptureFullJD = async (targetJob = currentJob) => {
    if (!targetJob) return;
    setIsCapturingFullJD(true);
    try {
      const res = await careerService.getFullJobDescription({
        jobId: targetJob.id || targetJob._id,
        applyUrl: targetJob.applyUrl,
        source: targetJob.source,
        companySlug: targetJob.companySlug,
        externalId: targetJob.externalId,
        company: targetJob.company,
        title: targetJob.title,
      });

      if (res?.success && res.data) {
        const fullText =
          res.data.fullDescription ||
          res.data.structuredJD?.fullText ||
          res.data.description ||
          "";

        setCurrentJob((prev) => ({
          ...prev,
          description: fullText || prev.description,
          fullDescription: fullText || prev.fullDescription,
          fullDescriptionHtml: res.data.fullDescriptionHtml || prev.fullDescriptionHtml,
          structuredJD: res.data.structuredJD || prev.structuredJD,
          criteria: res.data.criteria || prev.criteria,
          requiredSkills: res.data.requiredSkills || prev.requiredSkills,
          hasFullJD: true,
        }));
      }
    } catch (e) {
      console.warn("Failed capturing full job description:", e);
    } finally {
      setIsCapturingFullJD(false);
    }
  };

  const handleCopyJD = () => {
    const textToCopy =
      currentJob.fullDescription ||
      currentJob.structuredJD?.fullText ||
      currentJob.description ||
      currentJob.descriptionSummary ||
      "";
    navigator.clipboard.writeText(textToCopy);
    setCopiedJd(true);
    setTimeout(() => setCopiedJd(false), 2000);
  };

  const companyInitial = (currentJob.company || "C").charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-xl bg-white dark:bg-[#19191b] border border-zinc-200/80 dark:border-zinc-800 shadow-xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-start justify-between gap-4 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-750 p-2 flex items-center justify-center shrink-0">
              {currentJob.companyLogo && !imgError ? (
                <img
                  src={currentJob.companyLogo}
                  alt={currentJob.company}
                  className="w-full h-full object-contain"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono font-bold flex items-center justify-center text-sm">
                  {companyInitial}
                </div>
              )}
            </div>

            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  {currentJob.company}
                </span>

                <button
                  onClick={() => onOpenCompanyProfile(currentJob.companySlug || currentJob.company)}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <Building2 className="w-2.5 h-2.5" />
                  <span>Profile</span>
                </button>

                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                  {currentJob.stream?.track === "management" ? "Management" : "Tech"}
                </span>

                {currentJob.isRealOpening !== false && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Verified</span>
                  </span>
                )}

                {currentJob.hasFullJD && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                    <FileText className="w-2.5 h-2.5" />
                    <span>Full JD</span>
                  </span>
                )}
              </div>

              <h2 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
                {currentJob.title}
              </h2>

              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {currentJob.location || "India"}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" /> {currentJob.experienceLevel || "Full-time"}
                </span>
                {currentJob.structuredJD?.workMode && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    {currentJob.structuredJD.workMode}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Official Company, Career & LinkedIn Channels */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Official Channels &amp; Application Paths
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* 1. Official Company Website */}
              {(currentJob.companyPageUrl || currentJob.website) && (
                <a
                  href={currentJob.companyPageUrl || currentJob.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:border-[#fe3e91]/40 hover:bg-white dark:hover:bg-zinc-900 transition-all flex items-center justify-between text-xs group"
                >
                  <div className="flex items-center gap-1.5 font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-[#fe3e91] min-w-0">
                    <Globe className="w-3.5 h-3.5 text-[#fe3e91] shrink-0" />
                    <span className="truncate">Company Website</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-[#fe3e91] shrink-0 ml-1" />
                </a>
              )}

              {/* 2. Official Careers Portal */}
              {(currentJob.careerPageUrl || currentJob.officialPortalUrl) && (
                <a
                  href={currentJob.careerPageUrl || currentJob.officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:border-[#fe3e91]/40 hover:bg-white dark:hover:bg-zinc-900 transition-all flex items-center justify-between text-xs group"
                >
                  <div className="flex items-center gap-1.5 font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-[#fe3e91] min-w-0">
                    <Briefcase className="w-3.5 h-3.5 text-[#fe3e91] shrink-0" />
                    <span className="truncate">Careers Portal</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-[#fe3e91] shrink-0 ml-1" />
                </a>
              )}

              {/* 3. Official LinkedIn Jobs */}
              <a
                href={
                  currentJob.linkedInJobsUrl ||
                  currentJob.linkedInUrl ||
                  (currentJob.companySlug
                    ? `https://www.linkedin.com/company/${currentJob.companySlug}/jobs/`
                    : currentJob.company
                    ? `https://www.linkedin.com/company/${currentJob.company.toLowerCase().replace(/[^a-z0-9]/g, "")}/jobs/`
                    : "https://www.linkedin.com/jobs")
                }
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:border-[#fe3e91]/40 hover:bg-white dark:hover:bg-zinc-900 transition-all flex items-center justify-between text-xs group"
                title="Official LinkedIn Company Jobs"
              >
                <div className="flex items-center gap-1.5 font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-[#fe3e91] min-w-0">
                  <Linkedin className="w-3.5 h-3.5 text-[#0A66C2] shrink-0" />
                  <span className="truncate">Official LinkedIn Jobs</span>
                </div>
                <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-[#fe3e91] shrink-0 ml-1" />
              </a>
            </div>
          </div>
          {/* Live Full JD Extraction Status / Action Banner */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 min-w-0">
              {isCapturingFullJD ? (
                <RefreshCw className="w-4 h-4 text-[#fe3e91] animate-spin shrink-0" />
              ) : currentJob.hasFullJD ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
              )}
              <div className="min-w-0 text-xs">
                {isCapturingFullJD ? (
                  <span className="text-zinc-700 dark:text-zinc-300">
                    Capturing official job description from live portal...
                  </span>
                ) : currentJob.hasFullJD ? (
                  <span className="text-zinc-700 dark:text-zinc-300">
                    Authoritative JD captured ({currentJob.fullDescription?.length || currentJob.description?.length || 0} characters)
                  </span>
                ) : (
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Partial description displayed. Capture authoritative job description.
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => handleCaptureFullJD()}
              disabled={isCapturingFullJD}
              className="px-2.5 py-1 rounded-md text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-750 transition-colors shrink-0 ml-2"
            >
              {isCapturingFullJD ? "Capturing..." : currentJob.hasFullJD ? "Re-sync JD" : "Capture full JD"}
            </button>
          </div>

          {/* Criteria Badges */}
          {currentJob.criteria && Object.keys(currentJob.criteria).length > 0 && (
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 shrink-0">
                Criteria:
              </span>
              {Object.entries(currentJob.criteria).map(([k, v]) => (
                <span
                  key={k}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                >
                  <span className="capitalize text-zinc-400">{k}:</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">{v}</span>
                </span>
              ))}
            </div>
          )}

          {/* Diagnostic Match Overview */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#fe3e91]" />
                Resume Compatibility Score
              </span>
              <span className="text-sm font-mono font-medium text-zinc-900 dark:text-zinc-100">
                {currentJob.matchScore || 65}% Match
              </span>
            </div>

            {currentJob.aiMatch?.fitReason && (
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {currentJob.aiMatch.fitReason}
              </p>
            )}

            {currentJob.recommendation && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed pt-1 border-t border-zinc-200/60 dark:border-zinc-800">
                {currentJob.recommendation}
              </p>
            )}
          </div>

          {/* Matched from Resume Section */}
          {((currentJob.matchedResumeKeywords && currentJob.matchedResumeKeywords.length > 0) || (currentJob.matchedResumeRoles && currentJob.matchedResumeRoles.length > 0)) && (
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-zinc-400" />
                  Keywords Matched from Resume
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  {currentJob.keywordMatchCount || currentJob.matchedResumeKeywords?.length || 0} matched
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {currentJob.inferredStackMatched && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-mono bg-[#fe3e91] text-white dark:bg-[#fe3e91] dark:text-white shadow-2xs">
                    <span>Stack: {currentJob.inferredStackMatched}</span>
                  </span>
                )}
                {currentJob.matchedResumeRoles && currentJob.matchedResumeRoles.map((role) => (
                  <span
                    key={role}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700"
                  >
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span>Role: {role}</span>
                  </span>
                ))}
                {currentJob.matchedResumeKeywords && currentJob.matchedResumeKeywords
                  .filter((k) => !currentJob.matchedResumeRoles?.some((r) => r.toLowerCase() === k.toLowerCase()))
                  .reduce((acc, curr) => {
                    if (!acc.some((x) => x.toLowerCase() === curr.toLowerCase())) acc.push(curr);
                    return acc;
                  }, [])
                  .map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700"
                  >
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span>{kw}</span>
                  </span>
                ))}
              </div>

              {currentJob.resumeMatchReason && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed pt-1 border-t border-zinc-200/60 dark:border-zinc-800">
                  {currentJob.resumeMatchReason}
                </p>
              )}
            </div>
          )}

          {/* Eligibility & Experience Verdict */}
          <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                {currentJob.isFresherFriendly
                  ? "Fresher Friendly"
                  : currentJob.candidateType || "Professional Opening"}
              </span>

              <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                Exp:{" "}
                {currentJob.isFresherFriendly
                  ? "0 - 1 Years"
                  : `${currentJob.minExperienceYears || 1}+ Years`}
              </span>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                Eligibility:{" "}
              </span>
              {currentJob.fresherEligibilityReason ||
                currentJob.structuredJD?.experienceRequirement?.fresherEligibilityReason ||
                (currentJob.isFresherFriendly
                  ? "Open to freshers, campus graduates, and entry-level candidates with hands-on projects."
                  : `Requires minimum ${currentJob.minExperienceYears || 1}+ years of industry experience.`)}
            </p>
          </div>

          {/* JD Switcher Tabs */}
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setViewTab("structured")}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  viewTab === "structured"
                    ? "bg-[#fe3e91] text-white dark:bg-[#fe3e91] dark:text-white shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                Structured Breakdown
              </button>
              <button
                onClick={() => setViewTab("full")}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors inline-flex items-center gap-1.5 ${
                  viewTab === "full"
                    ? "bg-[#fe3e91] text-white dark:bg-[#fe3e91] dark:text-white shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <span>Full Description</span>
                {isCapturingFullJD ? (
                  <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                ) : (currentJob.fullDescription?.length || currentJob.structuredJD?.fullText?.length || (currentJob.description?.length > 200 ? currentJob.description.length : 0)) ? (
                  <span className="text-[10px] font-mono opacity-80">
                    ({(currentJob.fullDescription?.length || currentJob.structuredJD?.fullText?.length || currentJob.description?.length)} chars)
                  </span>
                ) : null}
              </button>
            </div>

            {viewTab === "full" && (
              <button
                onClick={handleCopyJD}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
              >
                {copiedJd ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedJd ? "Copied" : "Copy"}</span>
              </button>
            )}
          </div>

          {/* Tab Content: Structured vs Full */}
          {viewTab === "structured" ? (
            <div className="space-y-3">
              {/* Summary */}
              {currentJob.structuredJD?.summary && (
                <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  <span className="font-medium text-zinc-900 dark:text-zinc-100 block mb-1">
                    Role Summary
                  </span>
                  {stripHtml(currentJob.structuredJD.summary)}
                </div>
              )}

              {/* Responsibilities */}
              <div className="p-4 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" /> Key Responsibilities
                </h4>
                <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                  {cleanListItems(
                    currentJob.structuredJD?.keyResponsibilities,
                    [
                      `Design, build, and deploy production-ready solutions for ${currentJob.title}.`,
                      "Write clean, maintainable, modular, and thoroughly tested code.",
                      "Collaborate cross-functionally with product managers and engineering peers.",
                      "Optimize application throughput, reliability, and security.",
                    ]
                  ).map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="font-mono text-[10px] text-zinc-400 mt-0.5">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Qualifications & Education Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Qualifications
                  </h4>
                  <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                    {cleanListItems(
                      currentJob.structuredJD?.requiredQualifications,
                      [
                        `Demonstrated competence in core tools: ${
                          (currentJob.requiredSkills || currentJob.skills || []).slice(0, 3).join(", ") ||
                          "software engineering"
                        }.`,
                        currentJob.isFresherFriendly
                          ? "0-1 years experience or practical academic projects."
                          : `Minimum ${currentJob.minExperienceYears || 1}+ years industry experience.`,
                      ]
                    ).map((qual, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{qual}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5" /> Education
                  </h4>
                  <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                    {cleanListItems(
                      (currentJob.structuredJD?.educationRequirements || []).filter(
                        (edu) => !edu.toLowerCase().includes("responsibility, not tasks")
                      ),
                      [
                        "B.Tech / B.E. / MCA / Computer Science or equivalent practical background.",
                      ]
                    ).map((edu, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed">
                        <GraduationCap className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                        <span>{edu}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Skills breakdown */}
              {((currentJob.requiredSkills && currentJob.requiredSkills.length > 0) ||
                (currentJob.skills && currentJob.skills.length > 0) ||
                (currentJob.structuredJD?.techStack && currentJob.structuredJD.techStack.length > 0)) && (
                <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block">
                    Required Tech Stack &amp; Skills
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from(
                      new Set(
                        [
                          ...(currentJob.requiredSkills || []),
                          ...(currentJob.skills || []),
                          ...(currentJob.structuredJD?.techStack || []),
                        ].map((s) => stripHtml(s))
                      )
                    )
                      .filter((s) => s && !["hiring", "job", "team", "work", "responsibilities"].includes(s.toLowerCase()))
                      .map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded text-xs bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700"
                        >
                          {s}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {isCapturingFullJD && !currentJob.fullDescription && (!currentJob.description || currentJob.description.length < 200) ? (
                <div className="p-8 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center space-y-2">
                  <RefreshCw className="w-5 h-5 text-zinc-500 animate-spin" />
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Capturing full requisition text from {currentJob.sourcePortal || "employer portal"}...
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-line leading-relaxed font-sans max-h-[460px] overflow-y-auto select-text">
                    {stripHtml(
                      currentJob.fullDescription ||
                      currentJob.structuredJD?.fullText ||
                      (currentJob.description && currentJob.description.length > 200 ? currentJob.description : null) ||
                      currentJob.description ||
                      currentJob.descriptionSummary ||
                      "No detailed description text provided."
                    )}
                  </div>

                  {(!currentJob.hasFullJD || (currentJob.description && currentJob.description.length < 300)) && !isCapturingFullJD && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs">
                      <span className="text-zinc-500 dark:text-zinc-400">
                        Need complete live requisition text?
                      </span>
                      <button
                        onClick={() => handleCaptureFullJD(currentJob)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-750 transition-colors"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Fetch full text</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-5 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSave(currentJob)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                saved
                  ? "bg-[#fe3e91] text-white dark:bg-[#fe3e91] dark:text-white shadow-xs"
                  : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700"
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-current" : ""}`} />
              <span>{saved ? "Saved" : "Save Job"}</span>
            </button>

            <button
              onClick={(e) => onCheckOnline(currentJob, e)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-750 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
              <span>Verify Live</span>
            </button>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {onTailorResume && (
              <button
                onClick={() => onTailorResume(currentJob)}
                className="hidden sm:inline-flex px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-colors"
              >
                Tailor Resume
              </button>
            )}

            <a
              href={currentJob.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium text-white ${GRADIENT_PRIMARY || "bg-[#fe3e91] hover:bg-[#e11d48] dark:bg-[#fe3e91] dark:hover:bg-[#ff2aac]"} shadow-xs dark:shadow-[0_0_12px_rgba(254,62,145,0.25)] transition-all`}
            >
              <span>Apply on portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
