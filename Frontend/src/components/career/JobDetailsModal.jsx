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
  Calendar,
  Globe,
  ShieldCheck,
  RefreshCw,
  Zap,
  FileText,
  Target,
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
  const [viewTab, setViewTab] = useState("structured"); // "structured" | "full" | "criteria"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 flex items-center justify-center shrink-0 shadow-2xs">
              {currentJob.companyLogo && !imgError ? (
                <img
                  src={currentJob.companyLogo}
                  alt={currentJob.company}
                  className="w-full h-full object-contain"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-black text-base">
                  {companyInitial}
                </div>
              )}
            </div>

            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  {currentJob.company}
                </span>

                <button
                  onClick={() => onOpenCompanyProfile(currentJob.companySlug || currentJob.company)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-950/80 dark:hover:bg-purple-900 dark:text-purple-300 border border-purple-200 dark:border-purple-800 transition-colors"
                >
                  <Building2 className="w-2.5 h-2.5" />
                  <span>Profile</span>
                </button>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    currentJob.stream?.track === "management"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                      : "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                  }`}
                >
                  {currentJob.stream?.track === "management" ? "👔 Management" : "💻 Tech"}
                </span>

                {currentJob.isRealOpening !== false && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Verified Requisition</span>
                  </span>
                )}

                {currentJob.hasFullJD && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-300 dark:border-purple-700">
                    <FileText className="w-2.5 h-2.5 text-purple-600 dark:text-purple-400" />
                    <span>Full JD Available</span>
                  </span>
                )}
              </div>

              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
                {currentJob.title}
              </h2>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {currentJob.location || "India"}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" /> {currentJob.experienceLevel || "Full-time"}
                </span>
                {currentJob.structuredJD?.workMode && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Work Mode: {currentJob.structuredJD.workMode}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Live Full JD Extraction Status / Action Banner */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center gap-2 min-w-0">
              {isCapturingFullJD ? (
                <RefreshCw className="w-4 h-4 text-purple-500 animate-spin shrink-0" />
              ) : currentJob.hasFullJD ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
              )}
              <div className="min-w-0 text-xs">
                {isCapturingFullJD ? (
                  <span className="font-bold text-purple-700 dark:text-purple-300">
                    ⚡ Capturing full official job description from live portal...
                  </span>
                ) : currentJob.hasFullJD ? (
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">
                    ✓ 100% Full Official JD Captured ({currentJob.fullDescription?.length || currentJob.description?.length || 0} characters)
                  </span>
                ) : (
                  <span className="font-medium text-slate-600 dark:text-slate-400">
                    Partial description displayed. Capture authoritative job description.
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => handleCaptureFullJD()}
              disabled={isCapturingFullJD}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/80 transition-all shrink-0 ml-2"
            >
              {isCapturingFullJD ? "Capturing..." : currentJob.hasFullJD ? "Re-sync Full JD" : "⚡ Capture Full JD"}
            </button>
          </div>

          {/* Criteria Badges (Seniority, Employment Type, Industry) */}
          {currentJob.criteria && Object.keys(currentJob.criteria).length > 0 && (
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
                Official Criteria:
              </span>
              {Object.entries(currentJob.criteria).map(([k, v]) => (
                <span
                  key={k}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  <span className="capitalize text-slate-400">{k}:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{v}</span>
                </span>
              ))}
            </div>
          )}

          {/* AI Match Overview Banner */}
          <div className="p-4 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Resume Compatibility Score
              </span>
              <span className="text-lg font-black text-purple-600 dark:text-purple-400">
                {currentJob.matchScore || 65}% Match
              </span>
            </div>

            {currentJob.aiMatch?.fitReason && (
              <p className="text-xs text-purple-900 dark:text-purple-200 leading-relaxed">
                {currentJob.aiMatch.fitReason}
              </p>
            )}

            {currentJob.recommendation && (
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic pt-1 border-t border-purple-200/50 dark:border-purple-800/40">
                💡 {currentJob.recommendation}
              </p>
            )}
          </div>

          {/* Matched from Resume Section (Direct User Feature) */}
          {((currentJob.matchedResumeKeywords && currentJob.matchedResumeKeywords.length > 0) || (currentJob.matchedResumeRoles && currentJob.matchedResumeRoles.length > 0)) && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 border border-purple-200/90 dark:border-purple-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-purple-700 dark:text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  Keywords Matched from Your Resume
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-600 text-white shadow-2xs">
                  {currentJob.keywordMatchCount || currentJob.matchedResumeKeywords?.length || 0} matched
                </span>
              </div>

              {/* Matched Roles, Inferred Stacks & Skills Chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                {currentJob.inferredStackMatched && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-2xs">
                    <span>⚡ Inferred Stack: {currentJob.inferredStackMatched}</span>
                  </span>
                )}
                {currentJob.matchedResumeRoles && currentJob.matchedResumeRoles.map((role) => (
                  <span
                    key={role}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-extrabold bg-purple-600 text-white shadow-2xs"
                  >
                    <Check className="w-3 h-3" />
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
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-white dark:bg-slate-900 text-purple-900 dark:text-purple-200 border border-purple-200 dark:border-purple-800 shadow-2xs"
                  >
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span>{kw}</span>
                  </span>
                ))}
              </div>

              {currentJob.resumeMatchReason && (
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed italic pt-1 border-t border-purple-200/50 dark:border-purple-800/40">
                  🎯 {currentJob.resumeMatchReason}
                </p>
              )}
            </div>
          )}

          {/* Eligibility & Experience Verdict */}
          <div
            className={`p-4 rounded-2xl border ${
              currentJob.isFresherFriendly
                ? "bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60"
                : "bg-indigo-50/80 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/60"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span
                className={`px-2.5 py-1 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                  currentJob.isFresherFriendly
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
                    : "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300"
                }`}
              >
                <span>{currentJob.isFresherFriendly ? "🌱" : "💼"}</span>
                <span>
                  {currentJob.isFresherFriendly
                    ? "Fresher Friendly Opening"
                    : currentJob.candidateType || "Professional Opening"}
                </span>
              </span>

              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Experience:{" "}
                {currentJob.isFresherFriendly
                  ? "0 - 1 Years (Freshers Welcome)"
                  : `${currentJob.minExperienceYears || 1}+ Years Commercial Experience`}
              </span>
            </div>

            <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              <span className="font-bold text-slate-900 dark:text-white">
                Eligibility Verdict & Reasoning:{" "}
              </span>
              {currentJob.fresherEligibilityReason ||
                currentJob.structuredJD?.experienceRequirement?.fresherEligibilityReason ||
                (currentJob.isFresherFriendly
                  ? "Open to freshers, campus graduates, and entry-level candidates with hands-on projects or coursework."
                  : `Requires minimum ${currentJob.minExperienceYears || 1}+ years of production industry experience.`)}
            </p>
          </div>

          {/* JD Switcher Tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewTab("structured")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewTab === "structured"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                📋 Structured Breakdown
              </button>
              <button
                onClick={() => setViewTab("full")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 ${
                  viewTab === "full"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span>📄 Full Description</span>
                {isCapturingFullJD ? (
                  <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-purple-200/60 dark:bg-purple-900/60 text-purple-900 dark:text-purple-200">
                    <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Fetching
                  </span>
                ) : (currentJob.fullDescription?.length || currentJob.structuredJD?.fullText?.length || (currentJob.description?.length > 200 ? currentJob.description.length : 0)) ? (
                  <span className="text-[10px] opacity-80">
                    ({(currentJob.fullDescription?.length || currentJob.structuredJD?.fullText?.length || currentJob.description?.length)} chars)
                  </span>
                ) : null}
              </button>
            </div>

            {viewTab === "full" && (
              <button
                onClick={handleCopyJD}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              >
                {copiedJd ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedJd ? "Copied!" : "Copy JD"}</span>
              </button>
            )}
          </div>

          {/* Tab Content: Structured vs Full */}
          {viewTab === "structured" ? (
            <div className="space-y-4">
              {/* Summary */}
              {currentJob.structuredJD?.summary && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="font-bold text-slate-900 dark:text-white block mb-1">
                    Role Summary:
                  </span>
                  {stripHtml(currentJob.structuredJD.summary)}
                </div>
              )}

              {/* Responsibilities */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" /> Key Responsibilities
                </h4>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  {cleanListItems(
                    currentJob.structuredJD?.keyResponsibilities,
                    [
                      `Design, build, and deploy production-ready solutions for ${currentJob.title}.`,
                      "Write clean, maintainable, modular, and thoroughly tested code.",
                      "Collaborate cross-functionally with product managers and engineering peers.",
                      "Optimize application throughput, reliability, and security.",
                    ]
                  ).map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                      <span className="w-4 h-4 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black">
                        {idx + 1}
                      </span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements & Education Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Qualifications & Requirements
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    {cleanListItems(
                      currentJob.structuredJD?.requiredQualifications,
                      [
                        `Demonstrated competence in core tools: ${
                          (currentJob.requiredSkills || currentJob.skills || []).slice(0, 3).join(", ") ||
                          "software engineering"
                        }.`,
                        currentJob.isFresherFriendly
                          ? "0-1 years experience or practical academic projects."
                          : `Minimum ${currentJob.minExperienceYears || 1}+ years commercial experience.`,
                      ]
                    ).map((qual, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{qual}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5" /> Education Criteria
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    {cleanListItems(
                      (currentJob.structuredJD?.educationRequirements || []).filter(
                        (edu) => !edu.toLowerCase().includes("responsibility, not tasks")
                      ),
                      [
                        "B.Tech / B.E. / MCA / Computer Science or equivalent practical degree.",
                      ]
                    ).map((edu, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed">
                        <GraduationCap className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
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
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Required Tech Stack & Skills:
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
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                        >
                          {s}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {isCapturingFullJD && !currentJob.fullDescription && (!currentJob.description || currentJob.description.length < 200) ? (
                <div className="p-8 rounded-2xl bg-purple-500/5 dark:bg-purple-950/20 border border-purple-500/20 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-sm">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      Capturing Authoritative Full Job Description...
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
                      Extracting full requirements, team expectations, compensation, and qualifications directly from {currentJob.sourcePortal || "employer portal"}.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-sans max-h-[500px] overflow-y-auto select-text shadow-inner">
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
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                      <span className="text-slate-600 dark:text-slate-400">
                        Need the complete live requisition text?
                      </span>
                      <button
                        onClick={() => handleCaptureFullJD(currentJob)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/80 hover:bg-purple-100 dark:hover:bg-purple-900 border border-purple-200 dark:border-purple-800 transition-colors"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Fetch Full Text</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSave(currentJob)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                saved
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-current" : ""}`} />
              <span>{saved ? "Saved" : "Save Job"}</span>
            </button>

            <button
              onClick={(e) => onCheckOnline(currentJob, e)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-400"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
              <span>Verify Live</span>
            </button>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {onTailorResume && (
              <button
                onClick={() => onTailorResume(currentJob)}
                className="hidden sm:inline-flex px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 border border-slate-200 dark:border-slate-700 hover:border-purple-400 transition-all"
              >
                Tailor Resume
              </button>
            )}

            <a
              href={currentJob.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white ${GRADIENT_PRIMARY} shadow-md shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all`}
            >
              <span>Apply on Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
