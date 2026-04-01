import { ChevronDown, Loader2, Monitor, Smartphone, Tablet } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const getSessionDeviceMeta = (session) => {
  const browser = session?.browser || "";
  const os = session?.os || "";
  const source = `${browser} ${os}`.toLowerCase();

  if (source.includes("ipad") || source.includes("tablet")) {
    return {
      label: "Tablet",
      Icon: Tablet,
      iconClass: "text-indigo-600 dark:text-indigo-300",
      iconBgClass: "bg-indigo-100 dark:bg-indigo-500/20",
    };
  }

  if (
    source.includes("android") ||
    source.includes("iphone") ||
    source.includes("ios") ||
    source.includes("mobile")
  ) {
    return {
      label: "Mobile",
      Icon: Smartphone,
      iconClass: "text-emerald-600 dark:text-emerald-300",
      iconBgClass: "bg-emerald-100 dark:bg-emerald-500/20",
    };
  }

  return {
    label: "Desktop",
    Icon: Monitor,
    iconClass: "text-sky-600 dark:text-sky-300",
    iconBgClass: "bg-sky-100 dark:bg-sky-500/20",
  };
};

const SessionsTab = ({
  sessions,
  isSessionsLoading,
  isLogoutAllLoading,
  killingSessionId,
  onLogoutAll,
  onKillSession,
  onRefresh,
}) => {
  const listRef = useRef(null);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const hasSessions = Array.isArray(sessions) && sessions.length > 0;
  const hasActiveSessions = hasSessions && sessions.some((session) => session?.is_active);

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
  }, [sessions.length]);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Session Management</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Review and control your active sessions.
          </p>
        </div>
        <button
          onClick={onLogoutAll}
          disabled={isLogoutAllLoading || !hasActiveSessions}
          className="rounded-xl border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-red-400/50 dark:text-red-300 dark:hover:bg-red-500/10"
        >
          {isLogoutAllLoading ? "Logging out all..." : "Logout All Sessions"}
        </button>
      </div>

      {isSessionsLoading ? (
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <Loader2 size={18} className="animate-spin" />
          Loading sessions...
        </div>
      ) : !hasSessions ? (
        <p className="text-sm text-slate-600 dark:text-slate-300">No sessions found.</p>
      ) : (
        <div className="relative">
          <div
            ref={listRef}
            className="history-scroll-hidden max-h-[60vh] space-y-3 overflow-y-auto overscroll-y-auto pr-1"
          >
            {sessions.map((session, index) => {
              const sessionKey = session?._id || `${session?.token || "session"}-${index}`;
              const deviceMeta = getSessionDeviceMeta(session);
              const DeviceIcon = deviceMeta.Icon;

              return (
                <div key={sessionKey} className="rounded-xl border border-slate-200/80 bg-white/80 p-4 dark:border-slate-700/80 dark:bg-slate-800/45">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full ${deviceMeta.iconBgClass}`}
                        title={deviceMeta.label}
                      >
                        <DeviceIcon size={16} className={deviceMeta.iconClass} />
                      </span>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {session?.browser || "Unknown Browser"} on {session?.os || "Unknown OS"}
                        </p>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          {deviceMeta.label} device
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {session?.location || "Unknown location"} | {session?.ip_address || "Unknown IP"}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                          Created: {session?.createdAt ? new Date(session.createdAt).toLocaleString() : "Unknown"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          session?.is_active
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                            : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                        }`}
                      >
                        {session?.is_active ? "Active" : "Inactive"}
                      </span>
                      {session?.isCurrent && (
                        <span className="rounded-full bg-pink-100 px-2 py-1 text-xs font-semibold text-pink-700 dark:bg-pink-500/20 dark:text-pink-300">
                          Current
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
                    {session?.is_active && (
                      <button
                        onClick={() => onKillSession(session?._id, session?.isCurrent)}
                        disabled={killingSessionId === session?._id}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                      >
                        {killingSessionId === session?._id ? "Removing..." : "Logout Session"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {showScrollHint && (
            <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center">
              <div className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500 shadow-sm dark:bg-slate-900/90 dark:text-slate-300">
                Scroll
                <ChevronDown size={12} className="animate-bounce" />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          Refresh Sessions
        </button>
      </div>
    </>
  );
};

export default SessionsTab;
