import React from "react";
import {
  X,
  ShieldCheck,
  Search,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Globe,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-xl bg-white dark:bg-[#19191b] border border-zinc-200/80 dark:border-zinc-800 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                Universal Job Link Inspector
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Verify live status and ATS details for external requisitions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <form onSubmit={onSubmit} className="space-y-3">
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Job URL (LinkedIn, Naukri, Wellfound, or Company Career Page)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Globe className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="https://www.linkedin.com/jobs/view/... or careers page"
                  value={urlInput}
                  onChange={(e) => onChangeUrl(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                />
              </div>

              <button
                type="submit"
                disabled={analyzing || !urlInput.trim()}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium text-white ${GRADIENT_PRIMARY || "bg-[#fe3e91] hover:bg-[#e11d48] dark:bg-[#fe3e91] dark:hover:bg-[#ff2aac]"} shadow-xs transition-all disabled:opacity-50 flex items-center gap-1.5 shrink-0`}
              >
                {analyzing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Search className="w-3.5 h-3.5" />
                )}
                <span>{analyzing ? "Checking..." : "Inspect link"}</span>
              </button>
            </div>
          </form>

          {error && (
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className={`p-4 rounded-lg border space-y-2.5 ${
              result.online
                ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60"
                : "bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/60"
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 ${
                  result.online
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-rose-700 dark:text-rose-400"
                }`}>
                  {result.online ? (
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  )}
                  {result.probe?.statusBadge || (result.online ? "Verified Online" : "Position Closed / Inaccessible")}
                </span>

                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                  {result.portalType || "External Job Post"}
                </span>
              </div>

              {result.probe?.statusSummary && (
                <p className={`text-xs ${result.online ? "text-emerald-800 dark:text-emerald-300" : "text-rose-800 dark:text-rose-300"}`}>
                  {result.probe.statusSummary}
                </p>
              )}

              {result.job && (
                <div className="space-y-1 pt-1 border-t border-zinc-200/60 dark:border-zinc-800">
                  <div className="text-[11px] font-mono uppercase text-zinc-400">
                    {result.job.company || "Company"}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {result.job.title || "Job Requisition"}
                  </div>
                  {result.job.location && (
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      {result.job.location}
                    </div>
                  )}
                  {result.job.requiredSkills?.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1.5">
                      {result.job.requiredSkills.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded text-[11px] bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
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
