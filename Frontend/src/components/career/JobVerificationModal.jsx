import React from "react";
import {
  X,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

export default function JobVerificationModal({ modalState, onClose, GRADIENT_PRIMARY }) {
  if (!modalState.isOpen) return null;

  const { loading, data, error, job } = modalState;

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
                Requisition Inspector
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Direct ATS probe and live status verification
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
          {job && (
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 space-y-0.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                {job.company}
              </span>
              <h4 className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-snug">
                {job.title}
              </h4>
              <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 truncate">
                {job.applyUrl}
              </p>
            </div>
          )}

          {loading && (
            <div className="py-8 text-center space-y-2">
              <RefreshCw className="w-6 h-6 text-zinc-400 animate-spin mx-auto" />
              <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                Probing official portal endpoint...
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
                Checking HTTP status, active requisition headers, and form availability.
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="p-3.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Verification notice</span>
              </div>
              <p className="text-xs opacity-90">{error}</p>
            </div>
          )}

          {data && !loading && (
            <div className="space-y-3">
              <div
                className={`p-3.5 rounded-lg border flex items-center justify-between ${
                  data.online
                    ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200"
                    : "bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/80 text-rose-900 dark:text-rose-200"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
                      data.online
                        ? "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300"
                        : "bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300"
                    }`}
                  >
                    {data.online ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-semibold">
                      {data.online ? "Verified Live Requisition" : (data.probe?.statusBadge || "Requisition Closed / Inaccessible")}
                    </div>
                    <div className="text-[11px] opacity-85">
                      {data.probe?.statusSummary ||
                        (data.online
                          ? "Actively accepting candidate applications online."
                          : "Opening is closed, expired, or timed out.")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Probe Details */}
              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Portal Type:</span>
                  <span className="font-mono text-zinc-900 dark:text-zinc-100">
                    {data.portalType || data.probe?.portalProvider || "Official ATS Board"}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Requisition Status:</span>
                  <span
                    className={`font-mono ${
                      data.online
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {data.probe?.statusBadge || (data.online ? "Active & Live" : "Closed / Timed out")}
                  </span>
                </div>
                {data.responseTimeMs && (
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Response Time:</span>
                    <span className="font-mono text-zinc-900 dark:text-zinc-100">
                      {data.responseTimeMs} ms
                    </span>
                  </div>
                )}
                {data.verifiedAt && (
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Probed At:</span>
                    <span className="font-mono text-zinc-900 dark:text-zinc-100">
                      {new Date(data.verifiedAt).toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-2 bg-zinc-50/50 dark:bg-zinc-900/50">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Close
          </button>

          {job?.applyUrl && (
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-white ${GRADIENT_PRIMARY || "bg-[#fe3e91] hover:bg-[#e11d48] dark:bg-[#fe3e91] dark:hover:bg-[#ff2aac]"} shadow-xs transition-all`}
            >
              <span>Open application</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
