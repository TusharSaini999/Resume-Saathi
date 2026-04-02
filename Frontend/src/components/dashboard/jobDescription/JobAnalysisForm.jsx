import { FileSearch } from "lucide-react";

const GRADIENT_SHARED = "bg-linear-to-r from-[#fe3e91] via-[#ca25af] to-[#803ad1] dark:from-[#ff5fa7] dark:via-[#d340bd] dark:to-[#9d65d5]";
const BUTTON_CLASS = `w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-bold text-white rounded-xl ${GRADIENT_SHARED} hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/25 transition-all`;

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
      className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-lg backdrop-blur-sm dark:border-[#334155] dark:bg-[#0f172a]/85 md:p-6"
    >
      <h2 className="text-lg font-black text-[#1e293b] dark:text-white">Analyze New Job Description</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#64748b] dark:text-[#94a3b8]">
            Company Name
          </span>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Ex: Acme Technologies"
            className="w-full rounded-xl border border-[#cbd5e1] bg-white px-3 py-2.5 text-sm text-[#1e293b] outline-none transition focus:border-[#f43f5e] focus:ring-2 focus:ring-[#f43f5e]/20 dark:border-[#334155] dark:bg-[#111827] dark:text-white"
          />
        </label>

        <div className="rounded-xl border border-dashed border-[#dbe2ea] bg-[#f8fafc] px-3 py-2.5 dark:border-[#334155] dark:bg-[#111827]">
          <p className="text-xs font-bold uppercase tracking-wide text-[#64748b] dark:text-[#94a3b8]">Quick Tip</p>
          <p className="mt-1 text-sm text-[#475569] dark:text-[#cbd5e1]">
            Paste the complete JD including required skills, responsibilities, and qualifications for best accuracy.
          </p>
        </div>
      </div>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#64748b] dark:text-[#94a3b8]">
          Job Description
        </span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Paste job description here..."
          rows={7}
          className="w-full resize-y rounded-xl border border-[#cbd5e1] bg-white px-3 py-2.5 text-sm text-[#1e293b] outline-none transition focus:border-[#f43f5e] focus:ring-2 focus:ring-[#f43f5e]/20 dark:border-[#334155] dark:bg-[#111827] dark:text-white"
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