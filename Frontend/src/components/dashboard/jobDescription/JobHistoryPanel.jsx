import { Briefcase, ChevronDown, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatDate, getScoreTone } from "./jobDescriptionUtils";

function JobHistoryPanel({
  history,
  selectedId,
  onSelect,
  onNew,
  disabled = false,
  searchQuery,
  onSearchChange,
  isSearchMode,
}) {
  const listRef = useRef(null);
  const [showScrollHint, setShowScrollHint] = useState(false);

  useEffect(() => {
    const updateScrollHint = () => {
      const listEl = listRef.current;
      if (!listEl) {
        setShowScrollHint(false);
        return;
      }

      const hasOverflow = listEl.scrollHeight > listEl.clientHeight + 4;
      const isNearBottom = listEl.scrollTop + listEl.clientHeight >= listEl.scrollHeight - 6;
      setShowScrollHint(hasOverflow && !isNearBottom);
    };

    const listEl = listRef.current;
    updateScrollHint();

    if (!listEl) {
      return undefined;
    }

    listEl.addEventListener("scroll", updateScrollHint, { passive: true });
    window.addEventListener("resize", updateScrollHint);

    return () => {
      listEl.removeEventListener("scroll", updateScrollHint);
      window.removeEventListener("resize", updateScrollHint);
    };
  }, [history.length]);

  return (
    <aside className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-lg backdrop-blur-sm dark:border-[#334155] dark:bg-[#0f172a]/85 md:p-5 lg:sticky lg:top-24 lg:flex lg:max-h-[calc(100vh-7.5rem)] lg:flex-col">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-base font-black text-[#1e293b] dark:text-white">
          <Briefcase size={18} className="text-[#e11d48]" /> JD History
        </h2>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#f1f5f9] px-2.5 py-1 text-xs font-bold text-[#475569] dark:bg-[#1e293b] dark:text-[#cbd5e1]">
            {history.length}
          </span>
          <button
            type="button"
            onClick={onNew}
            disabled={disabled}
            className={`rounded-lg bg-[linear-gradient(120deg,#ff4f87_0%,#f43f5e_45%,#8b5cf6_100%)] px-3 py-1.5 text-xs font-black text-white shadow-sm transition-transform active:scale-95 ${
              disabled ? "cursor-not-allowed opacity-60" : "hover:scale-[1.03]"
            }`}
          >
            New
          </button>
        </div>
      </div>

      <div className="mb-3">
        <label className="sr-only" htmlFor="jd-history-search">
          Search job descriptions
        </label>
        <div className="relative">
          <Search size={14} className="pointer-events-none absolute left-3 top-2.5 text-[#64748b] dark:text-[#94a3b8]" />
          <input
            id="jd-history-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search job title..."
            disabled={disabled}
            className="w-full rounded-xl border border-[#dbe2ea] bg-white py-2 pl-9 pr-8 text-xs font-medium text-[#1e293b] outline-none transition focus:border-[#f43f5e] focus:ring-2 focus:ring-[#f43f5e]/20 dark:border-[#334155] dark:bg-[#111827] dark:text-white"
          />
        </div>
      </div>

      {!history.length ? (
        <div className="rounded-2xl border border-dashed border-[#cbd5e1] p-5 text-center dark:border-[#475569]">
          <p className="text-sm font-semibold text-[#475569] dark:text-[#cbd5e1]">
            {isSearchMode ? "No matching jobs" : "No history yet"}
          </p>
          <p className="mt-1 text-xs text-[#64748b] dark:text-[#94a3b8]">
            {isSearchMode ? "Try another keyword." : "Analyze your first job description."}
          </p>
        </div>
      ) : (
        <div className="relative lg:min-h-0 lg:flex-1">
          <div
            ref={listRef}
            className="history-scroll-hidden max-h-[60vh] space-y-3 overflow-y-auto overscroll-y-contain pr-1 lg:min-h-0 lg:max-h-none lg:h-full"
          >
            {history.map((item) => {
              const active = item?._id === selectedId;
              const matchScore = item?.jd_analysis?.match_score ?? 0;

              return (
                <button
                  key={item?._id}
                  onClick={() => onSelect(item?._id)}
                  disabled={disabled}
                  className={`w-full rounded-2xl border p-3 text-left transition-all ${
                    active
                      ? "border-[#f43f5e] bg-[#fff1f2] shadow-sm dark:border-[#fb7185] dark:bg-[#3b1120]"
                      : "border-[#e2e8f0] bg-white hover:-translate-y-0.5 hover:shadow-sm dark:border-[#334155] dark:bg-[#0b1220]"
                  } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
                >
                  <p className="truncate text-sm font-black text-[#1e293b] dark:text-white">
                    {item?.title || "Untitled Position"}
                  </p>
                  <p className="mt-1 truncate text-xs text-[#64748b] dark:text-[#94a3b8]">
                    {item?.company_name || "Company not provided"}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-2 text-xs">
                    <span className={`rounded-full px-2 py-1 font-bold ${getScoreTone(matchScore)}`}>
                      {matchScore}% Match
                    </span>
                    <span className="text-[#64748b] dark:text-[#94a3b8]">{formatDate(item?.createdAt)}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {showScrollHint && (
            <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center">
              <div className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#64748b] shadow-sm dark:bg-[#111827]/90 dark:text-[#94a3b8]">
                Scroll
                <ChevronDown size={12} className="animate-bounce" />
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}

export default JobHistoryPanel;