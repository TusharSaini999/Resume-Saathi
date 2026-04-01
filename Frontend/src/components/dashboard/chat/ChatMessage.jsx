import { useEffect, useRef, useState } from "react";
import {
  Menu,
  MessageSquare,
  Briefcase,
  FileText,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatMessages({
  setMobileSidebarOpen,
  activeChatTitle = "Resume Chat",
}) {
  const dispatch = useDispatch();

  const error = useSelector((state) => state.chat.error);
  const messages = useSelector((state) => state.chat.currentChat || []);
  const isInitialLoading = useSelector((state) => state.chat.initialLoading);
  const isTyping = useSelector((state) => state.chat.loading);
  const activeChat = useSelector((state) => state.chat.activeChat);
  const initialError = useSelector((state) => state.chat.initialError);
  const bottomRef = useRef(null);

  const loadingTexts = [
    "Thinking...",
    "Processing...",
    "Analyzing...",
    "Generating response...",
  ];
  const [loadingIndex, setLoadingIndex] = useState(0);

  // Auto scroll when messages / typing changes
  useEffect(() => {
    if (!error && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, error]);

  // Rotate loading text while AI is typing
  useEffect(() => {
    if (!isTyping) {
      setLoadingIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [isTyping]);

  return (
    <>
      {/* =========================
          Mobile Top Spacer
      ========================= */}
      <div className="h-20 w-full bg-[#FFFFFF] dark:bg-[#0B1120]" />

      {/* =========================
          Mobile Mini Header
      ========================= */}
      <div className="sticky top-0 z-10 border-b border-[#E2E8F0] bg-[#FFFFFF]/95 backdrop-blur-md dark:border-[#1E293B] dark:bg-[#0B1120]/95 md:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white text-[#475569] shadow-sm transition hover:scale-105 active:scale-95 dark:border-[#334155] dark:bg-[#111827] dark:text-[#94A3B8]"
          >
            <Menu size={18} />
          </button>

          <div className="flex-1 px-3 text-left">
            <p className="line-clamp-1 text-sm font-semibold text-[#0F172A] dark:text-white">
              Resume Assistant
            </p>
            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
              {activeChatTitle}
            </p>
          </div>

          <div className="h-10 w-10" />
        </div>
      </div>

      {/* =========================
          Initial Loading Skeleton
      ========================= */}
      {isInitialLoading ? (
        <div className="flex-1 overflow-y-auto bg-[#FFFFFF] px-3 py-4 sm:px-4 dark:bg-[#0B1120]">
          <div className="w-full animate-pulse space-y-4">
            <div className="flex justify-start">
              <div className="w-[75%] max-w-125 rounded-2xl rounded-bl-md border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 dark:border-[#1E293B] dark:bg-[#111827]">
                <div className="mb-2 h-3 w-24 rounded bg-[#E2E8F0] dark:bg-[#1E293B]" />
                <div className="mb-2 h-3 w-full rounded bg-[#E2E8F0] dark:bg-[#1E293B]" />
                <div className="mb-2 h-3 w-[90%] rounded bg-[#E2E8F0] dark:bg-[#1E293B]" />
                <div className="h-3 w-10 rounded bg-[#E2E8F0] dark:bg-[#1E293B]" />
              </div>
            </div>

            <div className="flex justify-end">
              <div className="w-[65%] max-w-105 rounded-2xl rounded-br-md bg-[#F3E8FF] px-4 py-3 dark:bg-[#312E81]/30">
                <div className="mb-2 h-3 w-full rounded bg-[#E9D5FF] dark:bg-[#4338CA]/40" />
                <div className="mb-2 h-3 w-[80%] rounded bg-[#E9D5FF] dark:bg-[#4338CA]/40" />
                <div className="h-3 w-10 rounded bg-[#E9D5FF] dark:bg-[#4338CA]/40" />
              </div>
            </div>

            <div className="flex justify-start">
              <div className="w-[80%] max-w-135 rounded-2xl rounded-bl-md border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 dark:border-[#1E293B] dark:bg-[#111827]">
                <div className="mb-2 h-3 w-20 rounded bg-[#E2E8F0] dark:bg-[#1E293B]" />
                <div className="mb-2 h-3 w-full rounded bg-[#E2E8F0] dark:bg-[#1E293B]" />
                <div className="mb-2 h-3 w-[92%] rounded bg-[#E2E8F0] dark:bg-[#1E293B]" />
                <div className="mb-2 h-3 w-[70%] rounded bg-[#E2E8F0] dark:bg-[#1E293B]" />
                <div className="h-3 w-12 rounded bg-[#E2E8F0] dark:bg-[#1E293B]" />
              </div>
            </div>
          </div>
        </div>
      ) : messages.length === 0 && !activeChat ? (
        /* =========================
            Empty Welcome State
        ========================= */
        <div className="flex flex-1 items-center justify-center bg-[#FFFFFF] px-4 py-8 dark:bg-[#0B1120]">
          <div className="w-full max-w-2xl text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-linear-to-r from-[#FE3E91] via-[#CA25AF] to-[#803AD1] shadow-[0_12px_30px_rgba(202,37,175,0.30)] sm:mb-6 sm:h-16 sm:w-16">
              <Sparkles className="h-7 w-7 text-white sm:h-8 sm:w-8" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl dark:text-white">
              Welcome to{" "}
              <span className="bg-linear-to-r from-[#FE3E91] via-[#CA25AF] to-[#803AD1] bg-clip-text text-transparent">
                Resume Assistant
              </span>
            </h1>

            <p className="mx-auto mt-3 max-w-xl px-2 text-sm leading-6 text-[#64748B] sm:mt-4 sm:px-0 sm:text-base sm:leading-7 dark:text-[#94A3B8]">
              Create better resumes, improve ATS score, practice AI interviews,
              and get smart guidance to strengthen your profile.
            </p>

            <div className="mt-8 hidden grid-cols-1 gap-4 sm:grid sm:grid-cols-3">
              <div className="rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-[#1E293B] dark:bg-[#111827]">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EDE9FE] dark:bg-[#312E81]">
                  <MessageSquare className="h-5 w-5 text-[#FE3E91]" />
                </div>
                <h3 className="text-sm font-semibold text-[#0F172A] dark:text-white">
                  AI Interview
                </h3>
              </div>

              <div className="rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-[#1E293B] dark:bg-[#111827]">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F3E8FF] dark:bg-[#2E1065]">
                  <Briefcase className="h-5 w-5 text-[#803AD1]" />
                </div>
                <h3 className="text-sm font-semibold text-[#0F172A] dark:text-white">
                  ATS Optimization
                </h3>
              </div>

              <div className="rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-[#1E293B] dark:bg-[#111827]">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FCE7F3] dark:bg-[#3B0820]">
                  <FileText className="h-5 w-5 text-[#CA25AF]" />
                </div>
                <h3 className="text-sm font-semibold text-[#0F172A] dark:text-white">
                  Resume Guidance
                </h3>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* =========================
            Chat Messages
        ========================= */
        <div className="history-scroll-hidden relative flex-1 overflow-y-auto bg-[#FFFFFF] px-2 py-3 sm:px-4 dark:bg-[#0B1120]">
          {/* =========================
              Center Error Overlay
          ========================= */}

          {initialError && (

            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm dark:bg-[#0B1120]/70">
              <div className="w-full max-w-md animate-in zoom-in-95 duration-300 px-4">
                <div className="rounded-3xl border border-red-200/80 bg-white px-5 py-5 shadow-xl dark:border-red-500/20 dark:bg-[#111827]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-500/10">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                          Failed to process your request
                        </p>

                        <p className="mt-1 text-xs leading-5 text-red-600 dark:text-red-300">
                          {typeof error === "string"
                            ? error
                            : error?.message ||
                            "Something went wrong while loading or sending messages. Please try again."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="w-full space-y-3">
            {/* Show messages only when no error */}
            <>
              {/* Messages */}
              {Array.isArray(messages) && messages.map((msg, index) => {
                // Defensive: fallback for missing/invalid properties
                const sender = typeof msg.sender === "string" ? msg.sender : "user";
                const isAI = sender === "assistant";
                const messageText = typeof msg.message === "string" ? msg.message : "[No message]";
                let createdAt = "";
                if (msg.createdAt) {
                  try {
                    createdAt = new Date(msg.createdAt).toLocaleString("en-IN", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    });
                  } catch {
                    createdAt = "";
                  }
                }
                return (
                  <div
                    key={msg._id || index}
                    className={`flex w-full items-end gap-3 ${isAI ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`chat-bubble-animate w-[320px] rounded-2xl px-3 py-2 shadow-sm sm:w-105 ${isAI
                        ? "sm:w-250 ml-0 mr-auto rounded-bl-md border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] dark:border-[#1E293B] dark:bg-[#111827] dark:text-white"
                        : "sm:w-105 ml-auto mr-0 rounded-br-md bg-linear-to-r from-[#FE3E91] via-[#CA25AF] to-[#803AD1] text-white shadow-[0_10px_30px_rgba(254,62,145,0.20)]"
                      }`}
                    >
                      {isAI ? (
                        <div className="prose prose-sm max-w-full overflow-hidden wrap-break-word dark:prose-invert prose-p:my-2 prose-pre:rounded-xl prose-pre:bg-[#0F172A] prose-pre:text-white prose-code:before:content-[''] prose-code:after:content-[''] prose-li:my-1 prose-ul:my-2 prose-ol:my-2 prose-headings:my-3">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({ children }) => (
                                <p className="wrap-break-word text-xs leading-6 sm:text-sm">{children}</p>
                              ),
                              h1: ({ children }) => (
                                <h1 className="wrap-break-word text-lg font-bold sm:text-xl">{children}</h1>
                              ),
                              h2: ({ children }) => (
                                <h2 className="wrap-break-word text-base font-semibold sm:text-lg">{children}</h2>
                              ),
                              h3: ({ children }) => (
                                <h3 className="wrap-break-word text-sm font-semibold sm:text-base">{children}</h3>
                              ),
                              ul: ({ children }) => (
                                <ul className="list-disc pl-5 text-xs wrap-break-word sm:text-sm">{children}</ul>
                              ),
                              ol: ({ children }) => (
                                <ol className="list-decimal pl-5 text-xs wrap-break-word sm:text-sm">{children}</ol>
                              ),
                              li: ({ children }) => (
                                <li className="wrap-break-word">{children}</li>
                              ),
                              strong: ({ children }) => (
                                <strong className="font-semibold">{children}</strong>
                              ),
                              em: ({ children }) => <em className="italic">{children}</em>,
                              code({ inline, children }) {
                                return inline ? (
                                  <code className="break-all rounded-md bg-black/5 px-1.5 py-0.5 text-[11px] dark:bg-white/10">{children}</code>
                                ) : (
                                  <code className="block w-full overflow-x-auto whitespace-pre rounded-xl bg-[#0F172A] p-3 text-[12px] text-white">{children}</code>
                                );
                              },
                              pre: ({ children }) => (
                                <pre className="my-3 w-full max-w-full overflow-x-auto rounded-xl bg-[#0F172A] p-0">{children}</pre>
                              ),
                              blockquote: ({ children }) => (
                                <blockquote className="border-l-4 border-[#CA25AF] pl-4 italic wrap-break-word text-[#475569] dark:text-[#CBD5E1]">{children}</blockquote>
                              ),
                              a: ({ href, children }) => (
                                <a href={href} target="_blank" rel="noopener noreferrer" className="break-all font-medium text-[#CA25AF] underline underline-offset-2">{children}</a>
                              ),
                              table: ({ children }) => (
                                <div className="my-3 w-full max-w-full overflow-x-auto rounded-xl border border-[#E2E8F0] dark:border-[#334155]">
                                  <table className="w-max min-w-full border-collapse text-xs sm:text-sm">{children}</table>
                                </div>
                              ),
                              th: ({ children }) => (
                                <th className="border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-left whitespace-nowrap dark:border-[#334155] dark:bg-[#1E293B]">{children}</th>
                              ),
                              td: ({ children }) => (
                                <td className="border border-[#E2E8F0] px-3 py-2 align-top whitespace-nowrap dark:border-[#334155]">{children}</td>
                              ),
                            }}
                          >
                            {messageText}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap wrap-break-word text-xs leading-6 sm:text-sm">{messageText}</p>
                      )}
                      <p className={`mt-2 text-[10px] ${isAI ? "text-[#64748B] dark:text-[#94A3B8]" : "text-white/75"}`}>
                        {createdAt}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* AI Typing Bubble */}
              {isTyping && (
                <div className="flex w-full items-end justify-start gap-3">
                  <div className="ml-0 mr-auto w-fit max-w-[85%] rounded-2xl rounded-bl-md border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 shadow-sm dark:border-[#1E293B] dark:bg-[#111827]">
                    <div className="mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 animate-pulse text-[#CA25AF]" />
                      <span className="text-xs font-medium text-[#475569] dark:text-[#CBD5E1]">
                        Resume Assistant
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#64748B] transition-all duration-300 dark:text-[#94A3B8]">
                        {loadingTexts[loadingIndex]}
                      </span>

                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-[#CA25AF] [animation-delay:0ms]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-[#CA25AF] [animation-delay:150ms]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-[#CA25AF] [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
            {error && (
              <div className="flex w-full items-end justify-start gap-3">
                <div className="ml-0 mr-auto w-full max-w-[90%] rounded-2xl rounded-bl-md border border-red-200 bg-red-50 px-4 py-3 shadow-sm sm:w-auto sm:max-w-[80%] dark:border-red-500/20 dark:bg-red-500/10">
                  <div className="mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-xs font-medium text-red-700 dark:text-red-300">
                      Error
                    </span>
                  </div>

                  <p className="whitespace-pre-wrap text-xs leading-6 text-red-700 sm:text-sm dark:text-red-200">
                    {typeof error === "string"
                      ? error
                      : error?.message ||
                      "Something went wrong while loading or sending messages. Please try again."}
                  </p>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>
      )}
    </>
  );
}