import { Briefcase, ChevronDown, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BUTTON_CLASS } from "../../../constants/style";

const formatDate = (isoString) => {
  if (!isoString) return "Recently";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });
};

const getScoreTone = (score) => {
  if (score >= 80) return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60";
  if (score >= 60) return "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60";
  return "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-200/60 dark:border-red-800/60";
};

function JobHistoryPanel({
  history = [],
  selectedId,
  onSelect,
  onNew,
  disabled = false,
  searchQuery = "",
  onSearchChange = () => {},
  isSearchMode = false,
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
      const canScroll = listEl.scrollHeight > listEl.clientHeight + 8;
      const isNearBottom = listEl.scrollTop + listEl.clientHeight >= listEl.scrollHeight - 16;
      setShowScrollHint(canScroll && !isNearBottom);
    };

    updateScrollHint();
    const listEl = listRef.current;
    if (!listEl) return;

    listEl.addEventListener("scroll", updateScrollHint);
    window.addEventListener("resize", updateScrollHint);

    return () => {
      listEl.removeEventListener("scroll", updateScrollHint);
      window.removeEventListener("resize", updateScrollHint);
    };
  }, [history.length]);

  return (
    <aside className="rounded-xl border border-zinc-200/80 bg-white p-4 dark:border-zinc-800 dark:bg-[#19191b] shadow-xs lg:sticky lg:top-24 lg:flex lg:max-h-[calc(100vh-7.5rem)] lg:flex-col">
      <div className="mb-3.5 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-xs font-mono font-medium text-zinc-900 dark:text-zinc-100 uppercase">
          <Briefcase size={15} className="text-[#fe3e91]" />
          <span>JD History</span>
        </h2>
        <div className="flex items-center gap-2">
          <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-mono text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            {history.length}
          </span>
          <button
            type="button"
            onClick={onNew}
            disabled={disabled}
            className="rounded-lg bg-[#fe3e91] px-2.5 py-1 text-xs font-medium text-white hover:bg-[#e11d48] dark:bg-[#fe3e91] dark:hover:bg-[#ff2aac] shadow-xs transition-all"
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
          <Search size={14} className="pointer-events-none absolute left-3 top-2.5 text-zinc-400" />
          <input
            id="jd-history-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search job title..."
            disabled={disabled}
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50/50 py-2 pl-9 pr-3 text-xs text-zinc-900 outline-none transition focus:border-[#fe3e91] dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-100"
          />
        </div>
      </div>

      {!history.length ? (
        <div className="rounded-lg border border-dashed border-zinc-200 p-5 text-center dark:border-zinc-800">
          <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            {isSearchMode ? "No matching jobs" : "No history yet"}
          </p>
          <p className="mt-1 text-[11px] text-zinc-500">
            {isSearchMode ? "Try another keyword." : "Analyze your first job description."}
          </p>
        </div>
      ) : (
        <div className="relative lg:min-h-0 lg:flex-1">
          <div
            ref={listRef}
            className="history-scroll-hidden max-h-[60vh] space-y-2 overflow-y-auto pr-1 lg:min-h-0 lg:max-h-none lg:h-full"
          >
            {history.map((item) => {
              const active = item?._id === selectedId;
              const matchScore = item?.jd_analysis?.match_score ?? 0;

              return (
                <button
                  key={item?._id}
                  onClick={() => onSelect(item?._id)}
                  disabled={disabled}
                  className={`w-full rounded-lg border p-3 text-left transition-colors ${
                    active
                      ? "border-[#fe3e91]/60 bg-rose-50/30 dark:border-[#fe3e91]/40 dark:bg-rose-950/20"
                      : "border-zinc-200/80 bg-white hover:bg-zinc-50/60 dark:border-zinc-800 dark:bg-[#19191b] dark:hover:bg-zinc-800/40"
                  } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
                >
                  <p className="truncate text-xs font-medium text-zinc-900 dark:text-zinc-100">
                    {item?.title || "Untitled Position"}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                    {item?.company_name || "Company not specified"}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between gap-2 text-[11px] font-mono">
                    <span className={`rounded px-1.5 py-0.5 font-medium ${getScoreTone(matchScore)}`}>
                      {matchScore}% match
                    </span>
                    <span className="text-zinc-400">{formatDate(item?.createdAt)}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {showScrollHint && (
            <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center">
              <div className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-mono uppercase text-zinc-500 shadow-xs dark:bg-zinc-900/90 dark:text-zinc-400">
                Scroll
                <ChevronDown size={12} />
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}

export default JobHistoryPanel;
