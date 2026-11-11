import { useSelector, useDispatch } from "react-redux";
import { clearError } from "../../context/messageSlice.js";
import { useEffect } from "react";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

function GlobalMessage() {
  const { message, type } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  if (!message) return null;

  const typeStyles = {
    error:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/80 dark:text-red-300 dark:border-red-800/80",
    success:
      "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800/80",
    warning:
      "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800/80",
  };

  const Icon =
    type === "error"
      ? AlertCircle
      : type === "success"
        ? CheckCircle
        : AlertTriangle;

  return (
    <div className="fixed z-50 bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] sm:w-auto max-w-md">
      <div
        className={`px-3.5 py-2.5 rounded-lg border text-xs font-medium flex items-center gap-2.5 shadow-xs wrap-break-word ${
          typeStyles[type] || "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-700"
        }`}
      >
        <Icon size={15} className="shrink-0" />
        <span>{message}</span>
      </div>
    </div>
  );
}

export default GlobalMessage;
