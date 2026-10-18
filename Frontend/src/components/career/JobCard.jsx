import React, { useState } from "react";
import {
  MapPin,
  Briefcase,
  Clock,
  Sparkles,
  ExternalLink,
  Bookmark,
  Building2,
  Globe,
  RefreshCw,
  Check,
  ChevronRight,
  ShieldCheck,
  FileText,
  Target,
} from "lucide-react";
import { stripHtml } from "../../utils/textSanitizer";

export default function JobCard({
  job,
  saved,
  onSave,
  onOpenDetails,
  onCheckOnline,
  checkingOnline,
  onOpenCompanyProfile,
  onTailorResume,
  GRADIENT_PRIMARY,
}) {
  const [imgError, setImgError] = useState(false);

  const isHighMatch = job.matchScore >= 80;
  const isMedMatch = job.matchScore >= 60 && job.matchScore < 80;
  const isInternship = job.employmentType === "Internship";

  const companyInitial = (job.company || "C").charAt(0).toUpperCase();

  const isLinkedIn =
    job.portalType === "linkedin" ||
    job.source === "linkedin" ||
    job.source === "linkedin_job_post" ||
    (job.applyUrl || "").toLowerCase().includes("linkedin.com");

  const isThirdParty =
    job.portalType === "third_party" ||
    job.source === "third_party" ||
    job.source === "startup_direct_post" ||
    job.source === "ai_search";

  // Source portal label cleaner
  const portalName =
    job.portalLabel ||
    job.sourcePortal ||
    (isLinkedIn
      ? "LinkedIn"
      : isThirdParty
      ? "Third-Party Portal"
      : job.source === "greenhouse"
      ? "Greenhouse ATS"
      : job.source === "lever"
      ? "Lever ATS"
      : job.source === "smartrecruiters"
      ? "SmartRecruiters ATS"
      : job.source === "tcs_ion"
      ? "TCS iON"
      : "Official Career ATS");

  return (
    <div className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 hover:border-purple-400 dark:hover:border-purple-500/80 shadow-xs hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300">
      <div className="space-y-4">
        {/* Top Header: Company logo + Title + Score */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            {/* Company Avatar / Logo */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 p-1.5 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              {job.companyLogo && !imgError ? (
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-full h-full object-contain"
                  onError={() => setImgError(true)}
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm">
                  {companyInitial}
                </div>
              )}
            </div>

            {/* Company Name & Role Title */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                <span
                  onClick={(e) => onOpenCompanyProfile(job.companySlug || job.company, e)}
                  className="text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer transition-colors truncate max-w-[140px] sm:max-w-none"
                  title="Click to view company profile"
                >
                  {job.company}
                </span>

                <span className="text-slate-300 dark:text-slate-700">•</span>

                {/* Source Badge */}
                {isLinkedIn ? (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#0077b5]/10 dark:bg-[#0077b5]/20 text-[#0077b5] dark:text-[#38a6e8] border border-[#0077b5]/30 shadow-2xs"
                    title="Direct live requisition from LinkedIn Company Jobs"
                  >
                    <svg className="w-2.5 h-2.5 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    <span>LinkedIn</span>
                  </span>
                ) : isThirdParty ? (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60 shadow-2xs"
                    title="Third-party portal / Aggregator listing"
                  >
                    <Globe className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                    <span>Third-Party</span>
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60 shadow-2xs"
                    title={`Official Direct ATS: ${portalName}`}
                  >
                    <Building2 className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="truncate max-w-[95px] sm:max-w-none">{portalName}</span>
                  </span>
                )}

                {/* Real Opening / Verified Badge */}
                {job.isRealOpening !== false && (
                  <span
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                    title="Direct live requisition from official career ATS"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Real</span>
                  </span>
                )}

                {/* Full JD Captured Badge */}
                {(job.hasFullJD || (job.description && job.description.length > 400) || (job.fullDescription && job.fullDescription.length > 400)) && (
                  <span
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60"
                    title="100% full authoritative job description captured"
                  >
                    <FileText className="w-2.5 h-2.5 text-purple-600 dark:text-purple-400" />
                    <span>Full JD</span>
                  </span>
                )}
              </div>

              <h3
                onClick={() => onOpenDetails(job)}
                className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 cursor-pointer transition-colors line-clamp-1 leading-snug"
                title={job.title}
              >
                {job.title}
              </h3>
            </div>
          </div>

          {/* Match Score Gauge */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            <div
              className={`flex flex-col items-center justify-center min-w-[56px] px-2.5 py-1.5 rounded-xl text-xs font-black shrink-0 ${
                isHighMatch
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25"
                  : isMedMatch
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25"
                  : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/25"
              }`}
            >
              <span className="text-sm sm:text-base font-extrabold leading-tight">
                {job.matchScore || 65}%
              </span>
              <span className="text-[9px] uppercase tracking-wider font-semibold opacity-85">
                {job.aiMatch ? "AI Match" : "ATS Match"}
              </span>
            </div>
            {job.aiMatch?.verdict && (
              <span
                className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                  job.aiMatch.verdict === "STRONG_MATCH"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    : "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                }`}
              >
                {job.aiMatch.verdict.replace("_", " ")}
              </span>
            )}
          </div>
        </div>

        {/* Feature Pills: Track, Stream, Type, Fresher Friendly */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Domain Track */}
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              job.stream?.track === "management"
                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60"
                : "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-900/60"
            }`}
          >
            {job.stream?.track === "management" ? "👔 Management" : "💻 Tech"}
          </span>

          {/* Stream */}
          {job.stream?.label && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <span>{job.stream.icon}</span>
              <span className="truncate max-w-[120px]">{job.stream.label}</span>
            </span>
          )}

          {/* Employment Type */}
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
              isInternship
                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                : "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
            }`}
          >
            {isInternship ? "🎓 Internship" : "💼 Full-Time"}
          </span>

          {/* Fresher vs Experienced */}
          {job.isFresherFriendly ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <span>🌱</span>
              <span>Fresher Friendly</span>
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {job.candidateType || job.experienceLevel || "1-3 yrs"}
            </span>
          )}

          {job.isTrackMatch && (
            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
              🎯 Track Match
            </span>
          )}

          {job.isSmallStartup && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              🌱 Startup
            </span>
          )}
        </div>

        {/* AI Insight or Concise Summary */}
        {job.aiMatch?.fitReason ? (
          <div className="p-2.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 text-xs text-purple-950 dark:text-purple-200 flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
            <p className="line-clamp-2 text-xs leading-relaxed">
              <span className="font-bold">AI Analysis: </span>
              {job.aiMatch.fitReason}
            </p>
          </div>
        ) : (
          (job.structuredJD?.summary || job.descriptionSummary || job.description) && (
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {stripHtml(job.structuredJD?.summary || job.descriptionSummary || job.description)}
            </p>
          )
        )}

        {/* Location & Time Row */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate max-w-[150px] sm:max-w-none">{job.location || "India"}</span>
          </div>

          {(job.isRemote || job.structuredJD?.workMode === "Remote") && (
            <span className="px-2 py-0.2 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
              🏠 Remote Friendly
            </span>
          )}

          <div className="flex items-center gap-1 text-[11px] ml-auto">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>
              {job.postedAt
                ? new Date(job.postedAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })
                : "Active"}
            </span>
          </div>
        </div>

        {/* Matched from Resume Strip (Direct User Feature: Explicit Keywords & Inferred Stacks) */}
        {((job.matchedResumeKeywords && job.matchedResumeKeywords.length > 0) || (job.matchedResumeRoles && job.matchedResumeRoles.length > 0) || job.inferredStackMatched) && (
          <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/60 text-xs">
            <span className="font-extrabold text-purple-700 dark:text-purple-300 flex items-center gap-1 shrink-0 text-[11px]">
              <Target className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Matched from Resume:</span>
            </span>

            {/* Inferred Tech Stack Badge (e.g. MERN Stack, Python & Django Full Stack) */}
            {job.inferredStackMatched && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-2xs flex items-center gap-1">
                <span>⚡ Inferred: {job.inferredStackMatched}</span>
              </span>
            )}

            {job.matchedResumeRoles && job.matchedResumeRoles.map((role) => (
              <span
                key={role}
                className="px-2 py-0.5 rounded-md text-[10px] font-black bg-purple-600 text-white shadow-2xs"
              >
                {role}
              </span>
            ))}
            {job.matchedResumeKeywords && job.matchedResumeKeywords
              .filter((k) => !job.matchedResumeRoles?.some((r) => r.toLowerCase() === k.toLowerCase()))
              .slice(0, 4)
              .map((kw) => (
                <span
                  key={kw}
                  className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-white dark:bg-slate-900 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-800/80 shadow-2xs"
                >
                  ✓ {kw}
                </span>
              ))}
            {job.matchedResumeKeywords && job.matchedResumeKeywords.length > 4 && (
              <span className="text-[10px] font-black text-purple-600 dark:text-purple-400">
                +{job.matchedResumeKeywords.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Skills Preview */}
        {((job.matchedSkills && job.matchedSkills.length > 0) ||
          (job.requiredSkills && job.requiredSkills.length > 0) ||
          (job.skills && job.skills.length > 0)) && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            {job.matchedSkills && job.matchedSkills.length > 0 ? (
              <>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mr-0.5">
                  Skills:
                </span>
                {job.matchedSkills
                  .map((s) => stripHtml(s))
                  .filter((s) => s && !["hiring", "job", "team", "work"].includes(s.toLowerCase()))
                  .slice(0, 4)
                  .map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60"
                    >
                      ✓ {s}
                    </span>
                  ))}
                {job.missingSkills && job.missingSkills.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60">
                    +{job.missingSkills.length} gap
                  </span>
                )}
              </>
            ) : (
              (job.requiredSkills || job.skills || [])
                .map((s) => stripHtml(s))
                .filter((s) => s && !["hiring", "job", "team", "work"].includes(s.toLowerCase()))
                .slice(0, 4)
                .map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700/60"
                  >
                    {s}
                  </span>
                ))
            )}
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="flex items-center justify-between gap-2 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80">
        {/* Left Utilities: Save + Live Check */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onSave(job)}
            className={`p-2 rounded-xl text-xs font-semibold transition-all ${
              saved
                ? "bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
            title={saved ? "Saved in Application Tracker" : "Save to Tracker"}
          >
            <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
          </button>

          {/* Quick Check Online */}
          <button
            onClick={(e) => onCheckOnline(job, e)}
            disabled={checkingOnline?.checking}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              checkingOnline?.online === true
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700"
                : checkingOnline?.online === false
                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300 dark:border-amber-700"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-purple-400 hover:text-purple-600"
            }`}
            title="Probe official portal to verify live requisition status"
          >
            {checkingOnline?.checking ? (
              <RefreshCw className="w-3 h-3 animate-spin text-purple-600" />
            ) : checkingOnline?.online ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
            )}
            <span className="hidden sm:inline">
              {checkingOnline?.statusText || "Verify Live"}
            </span>
          </button>
        </div>

        {/* Right CTAs: Details + Apply */}
        <div className="flex items-center gap-2">
          {onTailorResume && (
            <button
              onClick={() => onTailorResume(job)}
              className="hidden lg:inline-flex px-2.5 py-1.5 rounded-xl text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 border border-purple-200 dark:border-purple-800 transition-colors"
              title="Tailor your resume for this opening"
            >
              Tailor
            </button>
          )}

          <button
            onClick={() => onOpenDetails(job)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            Details
          </button>

          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white ${GRADIENT_PRIMARY} shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all`}
          >
            <span>Apply</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

