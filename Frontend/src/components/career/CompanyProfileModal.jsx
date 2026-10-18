import React, { useState } from "react";
import {
  X,
  Building2,
  ExternalLink,
  MapPin,
  Globe,
  Briefcase,
  Search,
  RefreshCw,
  Sparkles,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 flex items-center justify-center shrink-0 shadow-2xs">
              {company.logo && !imgError ? (
                <img
                  src={company.logo}
                  alt={company.name}
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
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                  {company.category || "Technology Leader"}
                </span>

                {company.provider && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {company.provider}
                  </span>
                )}
              </div>

              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {company.name}
              </h2>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {company.headquarters || "India / Global Hubs"}
                </span>

                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Website</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {company.description && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {company.description}
            </p>
          )}

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Open Positions ({companyJobs.length})
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => onScanPortal(company.slug || company.id, e)}
                disabled={scanning}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-400 text-slate-700 dark:text-slate-300 transition-all"
              >
                {scanning ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-600" />
                ) : (
                  <Search className="w-3.5 h-3.5" />
                )}
                <span>{scanning ? "Scanning Portal..." : "Scan Portal Live"}</span>
              </button>

              {company.officialPortalUrl && (
                <a
                  href={company.officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white ${GRADIENT_PRIMARY} shadow-xs`}
                >
                  <span>Official Careers</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Openings List */}
          {companyJobs.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500 dark:text-slate-400 space-y-2">
              <p>No cached openings found for {company.name}.</p>
              <button
                onClick={(e) => onScanPortal(company.slug || company.id, e)}
                disabled={scanning}
                className="px-4 py-2 rounded-xl text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60"
              >
                Scan Official Portal Now
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {companyJobs.map((j) => (
                <div
                  key={j.id || j.externalId || j.title}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {j.title}
                      </span>
                      {j.isRealOpening !== false && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>📍 {j.location || "India"}</span>
                      <span>•</span>
                      <span>{j.experienceLevel || "Full-time"}</span>
                      {j.matchScore && (
                        <>
                          <span>•</span>
                          <span className="font-bold text-purple-600 dark:text-purple-400">
                            {j.matchScore}% Match
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => onOpenJobDetails(j)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    >
                      View
                    </button>

                    <a
                      href={j.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white ${GRADIENT_PRIMARY}`}
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
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

