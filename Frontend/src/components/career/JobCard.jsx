import React, { useState } from "react";
import {
  MapPin,
  Briefcase,
  Clock,
  ExternalLink,
  Bookmark,
  Building2,
  Globe,
  RefreshCw,
  ShieldCheck,
  FileText,
  Target,
  Linkedin,
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

  const portalName = isLinkedIn ? "LinkedIn" : "Official Portal";

  return (
    <div className="group relative flex flex-col justify-between p-5 rounded-xl bg-white dark:bg-[#19191b] border border-zinc-200/80 dark:border-zinc-800 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
      <div className="space-y-3.5">
        {/* Top Header: Company logo + Title + Score */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            {/* Company Avatar / Logo */}
            <div className="w-10 h-10 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 p-1 flex items-center justify-center shrink-0">
              {job.companyLogo && !imgError ? (
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-full h-full object-contain"
                  onError={() => setImgError(true)}
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 font-mono text-xs font-medium">
                  {companyInitial}
                </div>
              )}
            </div>

            {/* Company Name & Role Title */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                <span
                  onClick={(e) => onOpenCompanyProfile(job.companySlug || job.company, e)}
                  className="text-xs font-medium text-zinc-900 dark:text-zinc-100 hover:text-[#fe3e91] cursor-pointer transition-colors truncate max-w-[140px] sm:max-w-none"
                  title="View company profile"
                >
                  {job.company}
                </span>

                <span className="text-zinc-300 dark:text-zinc-700">&middot;</span>

                {/* Source Badge */}
                {isLinkedIn ? (
                  <span
                    className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-medium bg-[#fe3e91]/10 text-[#fe3e91] border border-[#fe3e91]/25"
                    title="Direct live requisition from LinkedIn"
                  >
                    <span>LinkedIn</span>
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-medium bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700/80"
                    title="Official Company Career Portal"
                  >
                    <Building2 size={11} className="text-[#fe3e91]" />
                    <span>Official Portal</span>
                  </span>
                )}

                {/* Real Opening / Verified Badge */}
                {job.isRealOpening !== false && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                    <span>Verified</span>
                  </span>
                )}

                {/* Full JD Captured Badge */}
                {(job.hasFullJD || (job.description && job.description.length > 400) || (job.fullDescription && job.fullDescription.length > 400)) && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-mono text-zinc-500 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60">
                    <FileText size={11} />
                    <span>Full JD</span>
                  </span>
                )}
              </div>

              <h3
                onClick={() => onOpenDetails(job)}
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:text-[#fe3e91] cursor-pointer transition-colors line-clamp-1"
                title={job.title}
              >
                {job.title}
              </h3>
            </div>
          </div>

          {/* Match Score Gauge */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            <div
              className={`flex flex-col items-center justify-center px-2 py-1 rounded-md text-xs font-mono font-medium shrink-0 border ${
                isHighMatch
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60"
                  : isMedMatch
                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/60"
                  : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200/60 dark:border-zinc-700/60"
              }`}
            >
              <span className="font-mono text-xs font-semibold tabular-nums leading-tight">
                {job.matchScore || 65}%
              </span>
              <span className="text-[9px] uppercase text-zinc-500">
                {job.aiMatch ? "AI" : "ATS"}
              </span>
            </div>
          </div>
        </div>

        {/* Feature Tags */}
        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
          <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60">
            {job.stream?.track === "management" ? "Management" : "Engineering"}
          </span>

          {job.stream?.label && (
            <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60">
              {job.stream.label}
            </span>
          )}

          <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60">
            {isInternship ? "Internship" : "Full-Time"}
          </span>

          {job.isFresherFriendly && (
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
              Fresher Friendly
            </span>
          )}

          {job.isTrackMatch && (
            <span className="px-1.5 py-0.5 rounded bg-[#fe3e91]/10 text-[#fe3e91] border border-[#fe3e91]/25">
              Target Match
            </span>
          )}
        </div>

        {/* AI Insight or Summary */}
        {job.aiMatch?.fitReason ? (
          <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60 text-xs text-zinc-700 dark:text-zinc-300">
            <p className="line-clamp-2 text-xs leading-relaxed">
              <span className="font-medium text-zinc-900 dark:text-zinc-100">Match Reason: </span>
              {job.aiMatch.fitReason}
            </p>
          </div>
        ) : (
          (job.structuredJD?.summary || job.descriptionSummary || job.description) && (
            <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
              {stripHtml(job.structuredJD?.summary || job.descriptionSummary || job.description)}
            </p>
          )
        )}

        {/* Location & Time */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
          <div className="flex items-center gap-1">
            <MapPin size={12} className="text-zinc-400" />
            <span className="truncate max-w-[150px] sm:max-w-none">{job.location || "India"}</span>
          </div>

          {(job.isRemote || job.structuredJD?.workMode === "Remote") && (
            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#fe3e91]/10 text-[#fe3e91]">
              Remote
            </span>
          )}

          <div className="flex items-center gap-1 text-[11px] font-mono ml-auto">
            <Clock size={11} className="text-zinc-400" />
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

        {/* Official Channels Strip */}
        <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-zinc-500 border-t border-zinc-100/80 dark:border-zinc-800/80">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400">Direct:</span>
          {(job.companyPageUrl || job.website) && (
            <a
              href={job.companyPageUrl || job.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-[#fe3e91] dark:hover:text-[#fe3e91] transition-colors"
              title="Official Company Page"
            >
              <Globe size={11} className="text-[#fe3e91]" />
              <span>Company</span>
            </a>
          )}
          {(job.careerPageUrl || job.officialPortalUrl) && (
            <a
              href={job.careerPageUrl || job.officialPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-[#fe3e91] dark:hover:text-[#fe3e91] transition-colors"
              title={
                (job.careerPageUrl || "").includes("linkedin.com")
                  ? "Official LinkedIn Careers Portal"
                  : "Official Careers Portal"
              }
            >
              <Briefcase size={11} className="text-[#fe3e91]" />
              <span>
                {(job.careerPageUrl || "").includes("linkedin.com") ? "LinkedIn Portal" : "Careers"}
              </span>
            </a>
          )}
          <a
            href={
              job.linkedInJobsUrl ||
              job.linkedInUrl ||
              (job.companySlug
                ? `https://www.linkedin.com/company/${job.companySlug}/jobs/`
                : job.company
                ? `https://www.linkedin.com/company/${job.company.toLowerCase().replace(/[^a-z0-9]/g, "")}/jobs/`
                : "https://www.linkedin.com/jobs")
            }
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-[#fe3e91] dark:hover:text-[#fe3e91] transition-colors"
            title="Official LinkedIn Company Jobs"
          >
            <Linkedin size={11} className="text-[#fe3e91]" />
            <span>LinkedIn</span>
          </a>
        </div>

        {/* Matched from Resume Strip */}
        {((job.matchedResumeKeywords && job.matchedResumeKeywords.length > 0) || (job.matchedResumeRoles && job.matchedResumeRoles.length > 0) || job.inferredStackMatched) && (
          <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 text-xs">
            <span className="font-mono text-zinc-500 flex items-center gap-1 text-[11px]">
              <Target size={12} />
              <span>Matched:</span>
            </span>

            {job.inferredStackMatched && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#fe3e91]/10 text-[#fe3e91] border border-[#fe3e91]/25">
                {job.inferredStackMatched}
              </span>
            )}

            {job.matchedResumeRoles && job.matchedResumeRoles.map((role) => (
              <span
                key={role}
                className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200"
              >
                {role}
              </span>
            ))}
            {job.matchedResumeKeywords && job.matchedResumeKeywords
              .filter((k) => !job.matchedResumeRoles?.some((r) => r.toLowerCase() === k.toLowerCase()))
              .slice(0, 3)
              .map((kw) => (
                <span
                  key={kw}
                  className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                >
                  &middot; {kw}
                </span>
              ))}
          </div>
        )}

        {/* Skills Preview */}
        {((job.matchedSkills && job.matchedSkills.length > 0) ||
          (job.requiredSkills && job.requiredSkills.length > 0) ||
          (job.skills && job.skills.length > 0)) && (
          <div className="flex flex-wrap items-center gap-1 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            {job.matchedSkills && job.matchedSkills.length > 0 ? (
              <>
                {job.matchedSkills
                  .map((s) => stripHtml(s))
                  .filter((s) => s && !["hiring", "job", "team", "work"].includes(s.toLowerCase()))
                  .slice(0, 4)
                  .map((s) => (
                    <span
                      key={s}
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60"
                    >
                      {s}
                    </span>
                  ))}
                {job.missingSkills && job.missingSkills.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
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
                    className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                  >
                    {s}
                  </span>
                ))
            )}
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="flex items-center justify-between gap-2 pt-3.5 mt-3.5 border-t border-zinc-100 dark:border-zinc-800">
        {/* Left Utilities */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onSave(job)}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              saved
                ? "bg-[#fe3e91]/10 text-[#fe3e91] border border-[#fe3e91]/30"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
            title={saved ? "Saved in Application Tracker" : "Save to Tracker"}
          >
            <Bookmark size={14} className={saved ? "fill-current" : ""} />
          </button>

          {/* Quick Check Online */}
          <button
            onClick={(e) => onCheckOnline(job, e)}
            disabled={checkingOnline?.checking}
            className={`px-2 py-1 rounded-lg text-xs font-mono border transition-colors flex items-center gap-1.5 ${
              checkingOnline?.online === true
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700"
                : checkingOnline?.online === false
                ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border-red-300 dark:border-red-700"
                : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
            }`}
            title="Probe official portal to verify live status"
          >
            {checkingOnline?.checking ? (
              <RefreshCw size={12} className="animate-spin text-[#fe3e91]" />
            ) : checkingOnline?.online === true ? (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            ) : checkingOnline?.online === false ? (
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            ) : (
              <ShieldCheck size={12} className="text-[#fe3e91]" />
            )}
            <span className="hidden sm:inline">
              {checkingOnline?.statusText || "Verify"}
            </span>
          </button>
        </div>

        {/* Right CTAs */}
        <div className="flex items-center gap-1.5">
          {onTailorResume && (
            <button
              onClick={() => onTailorResume(job)}
              className="hidden lg:inline-flex px-2 py-1 rounded-lg text-xs text-[#fe3e91] hover:bg-[#fe3e91]/10 border border-[#fe3e91]/30 transition-colors"
            >
              Tailor
            </button>
          )}

          <button
            onClick={() => onOpenDetails(job)}
            className="px-2.5 py-1 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-colors"
          >
            Details
          </button>

          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium text-white bg-[#fe3e91] hover:bg-[#e11d48] dark:bg-[#fe3e91] dark:hover:bg-[#ff2aac] shadow-xs dark:shadow-[0_0_12px_rgba(254,62,145,0.25)] transition-all"
          >
            <span>Apply</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
