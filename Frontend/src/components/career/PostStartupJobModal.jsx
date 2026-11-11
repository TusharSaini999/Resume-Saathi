import React from "react";
import {
  X,
  Rocket,
  Globe,
  Search,
  RefreshCw,
} from "lucide-react";

export default function PostStartupJobModal({
  modalState,
  onClose,
  onChangeField,
  onAutoExtract,
  onSubmit,
  GRADIENT_PRIMARY,
}) {
  if (!modalState.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl bg-white dark:bg-[#19191b] border border-zinc-200/80 dark:border-zinc-800 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-start justify-between gap-4 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center shrink-0">
              <Rocket className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                  Startup &amp; Emerging Tech
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
                Post / Import Startup Job Profile
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={modalState.submitting}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={onSubmit} className="p-5 overflow-y-auto space-y-4">
          {/* 1-Click Link Auto-Extractor */}
          <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                Auto-extract from URL
              </span>
              <span className="text-[11px] font-mono text-zinc-500">
                LinkedIn Jobs, Wellfound, Direct URLs
              </span>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Globe className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
                <input
                  type="url"
                  placeholder="Paste link: https://www.linkedin.com/jobs/view/... or company portal"
                  value={modalState.applyUrl}
                  onChange={(e) => onChangeField("applyUrl", e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                />
              </div>
              <button
                type="button"
                onClick={() => onAutoExtract(modalState.applyUrl)}
                disabled={modalState.extracting || !modalState.applyUrl.trim()}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#fe3e91] hover:bg-[#e11d48] dark:bg-[#fe3e91] dark:hover:bg-[#ff2aac] text-white shadow-xs dark:shadow-[0_0_12px_rgba(254,62,145,0.25)] transition-all disabled:opacity-50 shrink-0 flex items-center gap-1.5"
              >
                {modalState.extracting ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Search className="w-3.5 h-3.5" />
                )}
                <span>{modalState.extracting ? "Extracting..." : "Auto-extract"}</span>
              </button>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Parses live JD to auto-fill title, company, requirements, and fresher suitability.
            </p>
          </div>

          {/* Company Name & Job Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Acme Corp"
                value={modalState.company}
                onChange={(e) => onChangeField("company", e.target.value)}
                required
                className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Role / Job Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Software Engineer"
                value={modalState.title}
                onChange={(e) => onChangeField("title", e.target.value)}
                required
                className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
              />
            </div>
          </div>

          {/* Location & Employment Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Bengaluru, India / Remote"
                value={modalState.location}
                onChange={(e) => onChangeField("location", e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Employment Type
              </label>
              <select
                value={modalState.employmentType}
                onChange={(e) => onChangeField("employmentType", e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-zinc-400"
              >
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={modalState.isFresherFriendly}
                  onChange={(e) => onChangeField("isFresherFriendly", e.target.checked)}
                  className="rounded border-zinc-300 text-[#fe3e91] focus:ring-[#fe3e91]"
                />
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Fresher Friendly
                </span>
              </label>
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Key Skills (comma-separated)
            </label>
            <input
              type="text"
              placeholder="React, Node.js, Python, PostgreSQL, Docker"
              value={modalState.skillsInput}
              onChange={(e) => onChangeField("skillsInput", e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
            />
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Job Description &amp; Requirements
            </label>
            <textarea
              rows={4}
              placeholder="Paste job description, responsibilities, or requirements..."
              value={modalState.description}
              onChange={(e) => onChangeField("description", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
            />
          </div>

          {/* Error Banner */}
          {modalState.error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-300">
              {modalState.error}
            </div>
          )}

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={modalState.submitting}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={modalState.submitting}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium text-white ${GRADIENT_PRIMARY || "bg-[#fe3e91] hover:bg-[#e11d48] dark:bg-[#fe3e91] dark:hover:bg-[#ff2aac]"} shadow-xs dark:shadow-[0_0_12px_rgba(254,62,145,0.25)] transition-all disabled:opacity-50`}
            >
              {modalState.submitting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Rocket className="w-3.5 h-3.5" />
              )}
              <span>{modalState.submitting ? "Publishing..." : "Publish opening"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
