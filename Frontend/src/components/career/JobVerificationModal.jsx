import React from "react";
import {
  X,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Globe,
  Building2,
  Clock,
} from "lucide-react";

export default function JobVerificationModal({ modalState, onClose, GRADIENT_PRIMARY }) {
  if (!modalState.isOpen) return null;

  const { loading, data, error, job } = modalState;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Live Requisition Inspector
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct ATS probe &amp; status verification
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
          {job && (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                {job.company}
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                {job.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {job.applyUrl}
              </p>
            </div>
          )}

          {loading && (
            <div className="py-10 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Probing Official Company Portal...
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Checking HTTP status, active requisition headers, and form availability.
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Verification Notice</span>
              </div>
              <p className="text-xs leading-relaxed opacity-90">{error}</p>
            </div>
          )}

          {data && !loading && (
            <div className="space-y-3">
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  data.online
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200"
                    : "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/80 text-rose-900 dark:text-rose-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      data.online
                        ? "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300"
                        : "bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300"
                    }`}
                  >
                    {data.online ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <AlertTriangle className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold">
                      {data.online ? "Verified Live Requisition" : (data.probe?.statusBadge || "Requisition Closed / Inaccessible")}
                    </div>
                    <div className="text-xs opacity-85">
                      {data.probe?.statusSummary ||
                        (data.online
                          ? "Actively accepting candidate applications online."
                          : "Opening is closed, expired, or timed out.")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Probe Details */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Portal Type:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {data.portalType || data.probe?.portalProvider || "Official ATS Board"}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Requisition Status:</span>
                  <span
                    className={`font-semibold ${
                      data.online
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {data.probe?.statusBadge || (data.online ? "🟢 Active & Live" : "🔴 Closed / Timed out")}
                  </span>
                </div>
                {data.responseTimeMs && (
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Response Time:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {data.responseTimeMs} ms
                    </span>
                  </div>
                )}
                {data.verifiedAt && (
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Probed At:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {new Date(data.verifiedAt).toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Close
          </button>

          {job?.applyUrl && (
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white ${GRADIENT_PRIMARY} shadow-sm`}
            >
              <span>Open Application</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
