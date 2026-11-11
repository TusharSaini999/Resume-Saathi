import React, { useState } from "react";
import {
  X,
  ExternalLink,
  MapPin,
  Globe,
  Search,
  RefreshCw,
  Linkedin,
  Building2,
  Briefcase,
} from "lucide-react";

export default function CompanyProfileModal({
  company,
  companyJobs,
  onClose,
  onOpenJobDetails,
  onScanPortal,
  scanning,
  GRADIENT_PRIMARY,
}) {
  const [imgError, setImgError] = useState(false);

  if (!company) return null;

  const companyInitial = (company.name || "C").charAt(0).toUpperCase();

  const companyWebsite =
    company.companyPageUrl ||
    company.website ||
    (company.slug ? `https://${company.slug.replace(/[^a-z0-9]/g, "")}.com` : null);

  const careerPageUrl =
    company.careerPageUrl ||
    company.officialPortalUrl ||
    (companyWebsite ? `${companyWebsite.replace(/\/+$/, "")}/careers` : null);

  const linkedInUrl =
    company.linkedInUrl ||
    (company.slug ? `https://www.linkedin.com/company/${company.slug.replace(/[^a-z0-9]/g, "")}/` : null);

  const linkedInSlug = (company.slug || company.id || company.name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  const linkedInJobsUrl =
    company.linkedInJobsUrl ||
    (linkedInUrl
      ? `${linkedInUrl.replace(/\/+$/, "")}/jobs/`
      : linkedInSlug
      ? `https://www.linkedin.com/company/${linkedInSlug}/jobs/`
      : "https://www.linkedin.com/jobs");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl bg-white dark:bg-[#19191b] border border-zinc-200/80 dark:border-zinc-800 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-start justify-between gap-4 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-2 flex items-center justify-center shrink-0">
              {company.logo && !imgError ? (
                <img
                  src={company.logo}
                  alt={company.name}
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
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                  {company.category || "Technology"}
                </span>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#fe3e91]/10 text-[#fe3e91] border border-[#fe3e91]/25">
                  Official Portal
                </span>
              </div>

              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
                {company.name}
              </h2>

              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {company.headquarters || "India / Global Hubs"}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {company.description && (
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {company.description}
            </p>
          )}

          {/* Official Company Channels Strip (Requested: Career pages, Company pages & LinkedIn pages) */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Official Company Channels
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* 1. Official Company Website */}
              {companyWebsite && (
                <a
                  href={companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:border-[#fe3e91]/40 hover:bg-white dark:hover:bg-zinc-900 transition-all flex flex-col justify-between gap-1.5 group"
                >
                  <div className="flex items-center justify-between text-zinc-500 group-hover:text-[#fe3e91]">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-[#fe3e91]">
                      <Globe className="w-3.5 h-3.5 text-[#fe3e91]" />
                      <span>Company Page</span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-[#fe3e91]" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 truncate">
                    {companyWebsite.replace(/^https?:\/\//i, "")}
                  </span>
                </a>
              )}

              {/* 2. Official Careers Portal */}
              {careerPageUrl && (
                <a
                  href={careerPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:border-[#fe3e91]/40 hover:bg-white dark:hover:bg-zinc-900 transition-all flex flex-col justify-between gap-1.5 group"
                >
                  <div className="flex items-center justify-between text-zinc-500 group-hover:text-[#fe3e91]">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-[#fe3e91]">
                      <Briefcase className="w-3.5 h-3.5 text-[#fe3e91]" />
                      <span>Careers Portal</span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-[#fe3e91]" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 truncate">
                    Official ATS Portal
                  </span>
                </a>
              )}

              {/* 3. Official LinkedIn Jobs */}
              <a
                href={linkedInJobsUrl || linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:border-[#fe3e91]/40 hover:bg-white dark:hover:bg-zinc-900 transition-all flex flex-col justify-between gap-1.5 group"
              >
                <div className="flex items-center justify-between text-zinc-500 group-hover:text-[#fe3e91]">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-[#fe3e91]">
                    <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
                    <span>LinkedIn Jobs</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-[#fe3e91]" />
                </div>
                <span className="text-[10px] font-mono text-zinc-400 truncate">
                  Live LinkedIn Requisitions
                </span>
              </a>
            </div>
          </div>

          {/* Quick Actions & Live Scan */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
            <div className="text-xs font-mono text-zinc-700 dark:text-zinc-300">
              Verified Open Positions ({companyJobs.length})
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => onScanPortal(company.slug || company.id || company.name, e)}
                disabled={scanning}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-750 transition-colors"
              >
                {scanning ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#fe3e91]" />
                ) : (
                  <Search className="w-3.5 h-3.5 text-[#fe3e91]" />
                )}
                <span>{scanning ? "Scanning portal..." : "Scan live portal"}</span>
              </button>

              {careerPageUrl && (
                <a
                  href={careerPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-[#fe3e91] hover:bg-[#e11d48] transition-colors"
                >
                  <span>Visit Careers</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Openings List */}
          {companyJobs.length === 0 ? (
            <div className="text-center py-8 text-xs text-zinc-500 dark:text-zinc-400 space-y-2">
              <p>No cached openings found for {company.name}.</p>
              <button
                onClick={(e) => onScanPortal(company.slug || company.id || company.name, e)}
                disabled={scanning}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                Scan official portal now
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {companyJobs.map((j) => (
                <div
                  key={j.id || j.externalId || j.title}
                  className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 truncate">
                        {j.title}
                      </span>
                      {j.isRealOpening !== false && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                      <span>{j.location || "India"}</span>
                      <span>·</span>
                      <span>{j.experienceLevel || "Full-time"}</span>
                      {j.matchScore && (
                        <>
                          <span>·</span>
                          <span className="font-mono text-zinc-800 dark:text-zinc-200">
                            {j.matchScore}% Match
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => onOpenJobDetails(j)}
                      className="px-2.5 py-1 rounded-md text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                    >
                      View
                    </button>

                    <a
                      href={j.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-white bg-[#fe3e91] hover:bg-[#e11d48] dark:bg-[#fe3e91] dark:hover:bg-[#ff2aac] shadow-xs transition-all"
                    >
                      <span>Apply</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end bg-zinc-50/50 dark:bg-zinc-900/50">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
