import React from "react";
import {
  X,
  ShieldCheck,
  Search,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Building2,
  Globe,
  Briefcase,
} from "lucide-react";

export default function UniversalLinkCheckerModal({
  modalState,
  onClose,
  onChangeUrl,
  onSubmit,
  GRADIENT_PRIMARY,
}) {
  if (!modalState.isOpen) return null;

  const { urlInput, analyzing, result, error } = modalState;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-linear-to-r from-emerald-500/10 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Universal Job Link Inspector
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paste any external job link to verify live status &amp; ATS details
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          <form onSubmit={onSubmit} className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Job URL (LinkedIn, Naukri, Wellfound, or Company Career Page)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Globe className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="https://www.linkedin.com/jobs/view/... or https://company.com/careers/..."
                  value={urlInput}
                  onChange={(e) => onChangeUrl(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={analyzing || !urlInput.trim()}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold text-white ${GRADIENT_PRIMARY} shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-1.5 shrink-0`}
              >
                {analyzing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Search className="w-3.5 h-3.5" />
                )}
                <span>{analyzing ? "Checking..." : "Inspect Link"}</span>
              </button>
            </div>
          </form>

          {error && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  {result.probe?.statusBadge || "Verified Online"}
                </span>

                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                  {result.portalType || "External Job Post"}
                </span>
              </div>

              {result.job && (
                <div className="space-y-1 pt-1">
                  <div className="text-xs text-purple-600 dark:text-purple-400 font-bold">
                    {result.job.company || "Company"}
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {result.job.title || "Job Requisition"}
                  </div>
                  {result.job.location && (
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      📍 {result.job.location}
                    </div>
                  )}
                  {result.job.requiredSkills?.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2">
                      {result.job.requiredSkills.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded text-[10px] bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
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
