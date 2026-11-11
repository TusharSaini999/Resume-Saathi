import { FileSearch } from "lucide-react";
import { BUTTON_CLASS } from "../../../constants/style";

function JobAnalysisForm({
  onSubmit,
  companyName,
  setCompanyName,
  description,
  setDescription,
  loading,
  loadingTitle,
  error,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-[#19191b] md:p-6"
    >
      <h2 className="text-lg font-medium text-zinc-900 dark:text-white">Analyze New Job Description</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-mono uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Company Name
          </span>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Ex: Acme Technologies"
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 outline-none transition focus:border-[#fe3e91] focus:ring-1 focus:ring-[#fe3e91]/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />
        </label>

        <div className="rounded-xl border border-dashed border-[#fe3e91]/30 bg-[#fe3e91]/5 px-3.5 py-2.5">
          <p className="text-xs font-mono uppercase tracking-wide text-[#fe3e91]">Quick Tip</p>
          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
            Paste the complete JD including required skills, responsibilities, and qualifications for best accuracy.
          </p>
        </div>
      </div>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-xs font-mono uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Job Description
        </span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Paste job description here..."
          rows={7}
          className="w-full resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 outline-none transition focus:border-[#fe3e91] focus:ring-1 focus:ring-[#fe3e91]/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
        />
      </label>

      {error && (
        <div className="mt-3 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`mt-4 inline-flex items-center justify-center gap-2 ${BUTTON_CLASS} ${loading ? "cursor-not-allowed opacity-70" : ""}`}
      >
        <FileSearch size={16} />
        {loading ? `${loadingTitle}...` : "Analyze Job Description"}
      </button>
    </form>
  );
}

export default JobAnalysisForm;