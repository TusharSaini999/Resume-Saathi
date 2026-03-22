import { useSelector, useDispatch } from "react-redux";
import { clearError } from "../../context/messageSlice.js";
import { useEffect } from "react";

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
      "bg-[#EF4444] text-white dark:bg-red-500 dark:text-white",
    success:
      "bg-[#22C55E] text-white dark:bg-green-500 dark:text-white",
    warning:
      "bg-[#F59E0B] text-white dark:bg-yellow-500 dark:text-black",
  };

  return (
    <div className="fixed z-50 bottom-10 sm:bottom-15 left-1/2 -translate-x-1/2 w-[calc(100%-1rem)] sm:w-auto max-w-md">
      <div
        className={`
          px-3 sm:px-4 py-2 rounded-xl shadow-lg text-xs sm:text-sm font-medium
          flex items-center gap-2 w-full sm:w-auto
          wrap-break-word
          backdrop-blur-md
          border border-white/20 dark:border-white/10
          ${typeStyles[type] || "bg-gray-800 text-white dark:bg-gray-700"}
        `}
      >
        {message}
      </div>
    </div>
  );
}

export default GlobalMessage;