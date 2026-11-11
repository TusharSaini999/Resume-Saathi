import { Send, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

export default function ChatInput({ input, setInput, handleSend, handleKeyDown }) {
  const loading = useSelector((state) => state.chat.loading);
  const initialLoading = useSelector((state) => state.chat.initialLoading);
  const initialError = useSelector((state) => state.chat.initialError);

  const isInputDisabled = loading || initialLoading || initialError !== null;

  return (
    <div className="border-t border-zinc-200/80 bg-white p-2 dark:border-zinc-800 dark:bg-[#141415]">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-2 shadow-inner dark:border-zinc-800 dark:bg-[#19191b]">
          <div className="flex items-end gap-2">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (isInputDisabled && e.key === "Enter") {
                  e.preventDefault();
                  return;
                }
                handleKeyDown(e);
              }}
              placeholder="Ask about your resume, missing keywords, or job match criteria..."
              disabled={isInputDisabled}
              aria-label="Chat input"
              className="max-h-32 min-h-8 w-full resize-none bg-transparent px-2 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:text-zinc-100 dark:placeholder:text-zinc-500"
            />

            <button
              onClick={handleSend}
              disabled={isInputDisabled}
              aria-label="Send message"
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white transition-colors duration-150 active:scale-[0.97]
                ${
                  isInputDisabled
                    ? "cursor-not-allowed opacity-50 bg-zinc-300 dark:bg-zinc-700"
                    : "bg-[#fe3e91] hover:bg-[#e11d48] dark:bg-[#fe3e91] dark:hover:bg-[#ff2aac] text-white shadow-xs dark:shadow-[0_0_12px_rgba(254,62,145,0.25)]"
                }`}
            >
              {loading || initialLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Send size={14} />
              )}
            </button>
          </div>
        </div>
        <p className="mt-2 px-1 text-[11px] text-zinc-500 dark:text-zinc-500">
          Informed by your parsed resume context.
        </p>
      </div>
    </div>
  );
}