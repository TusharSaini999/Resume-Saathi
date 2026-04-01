import { Send, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

export default function ChatInput({ input, setInput, handleSend, handleKeyDown }) {
  const loading = useSelector((state) => state.chat.loading);
  const initialLoading = useSelector((state) => state.chat.initialLoading);
  const initialError = useSelector((state) => state.chat.initialError);

  const isInputDisabled = loading || initialLoading || initialError !== null;

  return (
    <div className="border-t border-[#E2E8F0] bg-[#FFFFFF] p-2 dark:border-[#1E293B] dark:bg-[#020617]">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] p-2 shadow-inner dark:border-[#334155] dark:bg-[#111827]">
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
              placeholder="Ask anything about your resume, jobs, or ATS..."
              disabled={isInputDisabled}
              aria-label="Chat input"
              className="max-h-32 min-h-8 w-full resize-none bg-transparent px-2 py-2 text-xs text-[#0F172A] placeholder:text-[#64748B] outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:text-white dark:placeholder:text-[#94A3B8]"
            />

            <button
              onClick={handleSend}
              disabled={isInputDisabled}
              aria-label="Send message"
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-[0_8px_20px_rgba(254,62,145,0.18)] transition-all duration-300 active:scale-95
                ${
                  isInputDisabled
                    ? "cursor-not-allowed opacity-70 bg-[#94A3B8]"
                    : "bg-linear-to-r from-[#FE3E91] via-[#CA25AF] to-[#803AD1] hover:scale-105"
                }`}
            >
              {loading || initialLoading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Send size={15} />
              )}
            </button>
          </div>
        </div>
        <p className="mt-2 px-2 text-[11px] text-[#64748B] dark:text-[#94A3B8]">
          Get resume tips, ATS advice, and job matching help instantly.
        </p>
      </div>
    </div>
  );
}