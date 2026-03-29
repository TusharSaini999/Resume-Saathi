import { useMemo } from "react";
import {
  AlertTriangle,
  RotateCcw,
  Info,
} from "lucide-react";

const getErrorMessage = (error) => {
  if (!error) return "An error occurred while analyzing your resume. Please try again.";
  if (typeof error === "string") return error;
  if (typeof error?.message === "string") return error.message;
  return "An error occurred while analyzing your resume. Please try again.";
};

const classifyError = (message) => {
  const normalized = message.toLowerCase();

  if (normalized.includes("size") || normalized.includes("5mb")) {
    return {
      label: "File Size Limit",
      suggestion: "Use a smaller PDF under 5MB.",
      tone: "amber",
    };
  }

  if (normalized.includes("format") || normalized.includes("pdf") || normalized.includes("type")) {
    return {
      label: "Unsupported Format",
      suggestion: "Upload a clean .pdf file only.",
      tone: "blue",
    };
  }

  if (normalized.includes("network") || normalized.includes("timeout") || normalized.includes("server")) {
    return {
      label: "Server or Network",
      suggestion: "Retry after a moment and check your connection.",
      tone: "violet",
    };
  }

  if (normalized.includes("password") || normalized.includes("protected")) {
    return {
      label: "Protected Document",
      suggestion: "Remove PDF password protection and upload again.",
      tone: "rose",
    };
  }

  return {
    label: "Unknown Processing Error",
    suggestion: "Try another resume PDF and upload again.",
    tone: "red",
  };
};

const toneClassMap = {
  red: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  violet: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
  rose: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
};

const AnalysisError = ({ error, onReupload }) => {
  const errorMessage = useMemo(() => getErrorMessage(error), [error]);
  const errorMeta = useMemo(() => classifyError(errorMessage), [errorMessage]);

  return (
    <div className="rounded-3xl border border-red-300 bg-red-50 p-5 shadow-sm sm:p-6 md:p-8 dark:border-red-500/40 dark:bg-red-500/10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-red-500/20 p-3 sm:p-4">
            <AlertTriangle size={34} className="text-red-500" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-red-600 dark:text-red-400">Analysis Failed</h3>
            <p className="mt-1 text-sm text-[#7f1d1d] dark:text-[#fda4af]">
              We could not complete your resume analysis this time.
            </p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold">
              <span className={`rounded-full px-2.5 py-1 ${toneClassMap[errorMeta.tone]}`}>
                {errorMeta.label}
              </span>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 md:w-auto">
          <button
            onClick={onReupload}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#fe3e91] via-[#ca25af] to-[#803ad1] dark:from-[#ff5fa7] dark:via-[#d340bd] dark:to-[#9d65d5] px-5 py-3 font-bold text-white transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-purple-500/25 md:w-auto"
          >
            <RotateCcw size={18} />
            Try Again
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-red-200 bg-white/70 p-4 dark:border-red-500/30 dark:bg-[#1e293b]/70">
        <p className="text-sm text-[#7f1d1d] dark:text-[#e2e8f0]">
          {errorMessage}
        </p>
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-500/30 dark:bg-blue-500/10">
          <Info size={16} className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />
          <p className="text-xs text-[#475569] dark:text-[#cbd5e1]">
            Recommended next step: {errorMeta.suggestion}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-red-200 bg-white p-4 dark:border-red-500/30 dark:bg-[#1e293b]">
          <h4 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-red-600 dark:text-red-400">
            Possible Issues
          </h4>
          <ul className="space-y-2 text-sm text-[#64748b] dark:text-[#cbd5e1]">
            <li>• File is corrupted or not readable</li>
            <li>• Resume format is not supported</li>
            <li>• File size exceeds the limit (5MB)</li>
            <li>• Server error during processing</li>
          </ul>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-500/30 dark:bg-blue-500/10">
          <h4 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-blue-600 dark:text-blue-400">
            Quick Fixes
          </h4>
          <ul className="space-y-2 text-sm text-[#64748b] dark:text-[#cbd5e1]">
            <li>• Upload a different PDF file</li>
            <li>• Ensure file format is .pdf only</li>
            <li>• Keep file size below 5MB</li>
            <li>• Remove password protection if enabled</li>
          </ul>
        </div>
      </div>

    </div>
  );
};

export default AnalysisError;
