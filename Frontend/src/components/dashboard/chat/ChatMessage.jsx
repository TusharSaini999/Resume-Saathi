import { useEffect, useRef, useState } from "react";
import {
  Menu,
  MessageSquare,
  Briefcase,
  FileText,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const loadingTexts = [
  "Thinking...",
  "Processing...",
  "Analyzing...",
  "Generating response...",
];

export default function ChatMessages({
  setMobileSidebarOpen,
  activeChatTitle = "Resume Chat",
}) {
  const error = useSelector((state) => state.chat.error);
  const messages = useSelector((state) => state.chat.currentChat || []);
  const isInitialLoading = useSelector((state) => state.chat.initialLoading);
  const isTyping = useSelector((state) => state.chat.loading);
  const activeChat = useSelector((state) => state.chat.activeChat);
  const initialError = useSelector((state) => state.chat.initialError);
  const bottomRef = useRef(null);
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
      setTimeout(() => setLoadingIndex(0), 0);
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
      <div className="h-20 w-full bg-white dark:bg-[#141415]" />

      {/* =========================
          Mobile Mini Header
      ========================= */}
      <div className="sticky top-0 z-10 border-b border-zinc-200/80 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-[#141415]/95 md:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 transition-colors dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <Menu size={18} />
          </button>

          <div className="flex-1 px-3 text-left">
            <p className="line-clamp-1 text-sm font-semibold text-zinc-900 dark:text-white">
              Resume Assistant
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
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
        <div className="flex-1 overflow-y-auto bg-white px-3 py-4 sm:px-4 dark:bg-[#141415]">
          <div className="w-full animate-pulse space-y-4">
            <div className="flex justify-start">
              <div className="w-[75%] max-w-125 rounded-2xl rounded-bl-md border border-zinc-200/80 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-[#19191b]">
                <div className="mb-2 h-3 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="mb-2 h-3 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="mb-2 h-3 w-[90%] rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-3 w-10 rounded bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>

            <div className="flex justify-end">
              <div className="w-[65%] max-w-105 rounded-2xl rounded-br-md bg-[#fe3e91]/10 px-4 py-3 dark:bg-[#fe3e91]/20">
                <div className="mb-2 h-3 w-full rounded bg-[#fe3e91]/20 dark:bg-[#fe3e91]/30" />
                <div className="mb-2 h-3 w-[80%] rounded bg-[#fe3e91]/20 dark:bg-[#fe3e91]/30" />
                <div className="h-3 w-10 rounded bg-[#fe3e91]/20 dark:bg-[#fe3e91]/30" />
              </div>
            </div>

            <div className="flex justify-start">
              <div className="w-[80%] max-w-135 rounded-2xl rounded-bl-md border border-zinc-200/80 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-[#19191b]">
                <div className="mb-2 h-3 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="mb-2 h-3 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="mb-2 h-3 w-[92%] rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="mb-2 h-3 w-[70%] rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-3 w-12 rounded bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>
          </div>
        </div>
      ) : messages.length === 0 && !activeChat ? (
        /* =========================
            Empty Welcome State
        ========================= */
        <div className="flex flex-1 items-center justify-center bg-[#fafafa] px-4 py-8 dark:bg-[#141415]">
          <div className="w-full max-w-xl text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              <MessageSquare size={20} />
            </div>

            <h1 className="text-xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
              Resume assistant
            </h1>

            <p className="mx-auto mt-2 max-w-md px-2 text-xs leading-relaxed text-zinc-600 sm:px-0 dark:text-zinc-400">
              Ask questions about your uploaded resume, identify missing technical keywords for specific roles, or draft improved bullet points.
            </p>

            <div className="mt-6 hidden grid-cols-1 gap-3 sm:grid sm:grid-cols-3">
              <div className="rounded-lg border border-zinc-200/80 bg-white p-4 text-center dark:border-zinc-800 dark:bg-[#19191b]">
                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  <MessageSquare size={16} />
                </div>
                <h3 className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                  Interview prep
                </h3>
              </div>

              <div className="rounded-lg border border-zinc-200/80 bg-white p-4 text-center dark:border-zinc-800 dark:bg-[#19191b]">
                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  <Briefcase size={16} />
                </div>
                <h3 className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                  ATS alignment
                </h3>
              </div>

              <div className="rounded-lg border border-zinc-200/80 bg-white p-4 text-center dark:border-zinc-800 dark:bg-[#19191b]">
                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  <FileText size={16} />
                </div>
                <h3 className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                  Bullet revision
                </h3>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* =========================
            Chat Messages
        ========================= */
        <div className="history-scroll-hidden relative flex-1 overflow-y-auto bg-[#fafafa] px-2 py-3 sm:px-4 dark:bg-[#141415]">
          {/* =========================
              Center Error Overlay
          ========================= */}

          {initialError && (

            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm dark:bg-[#141415]/70">
              <div className="w-full max-w-md animate-in zoom-in-95 duration-300 px-4">
                <div className="rounded-3xl border border-red-200/80 bg-white px-5 py-5 shadow-xl dark:border-red-500/20 dark:bg-[#19191b]">
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
                      className={`chat-bubble-animate w-[320px] rounded-lg px-3.5 py-2.5 sm:w-105 ${isAI
                        ? "sm:w-250 ml-0 mr-auto border border-zinc-200/80 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-[#19191b] dark:text-zinc-100"
                        : "sm:w-105 ml-auto mr-0 bg-[#fe3e91] text-white"
                      }`}
                    >
                      {isAI ? (
                        <div className="prose prose-sm max-w-full overflow-hidden wrap-break-word dark:prose-invert prose-p:my-2 prose-pre:rounded-xl prose-pre:bg-zinc-900 prose-pre:text-white dark:prose-pre:bg-[#141415] prose-code:before:content-[''] prose-code:after:content-[''] prose-li:my-1 prose-ul:my-2 prose-ol:my-2 prose-headings:my-3">
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
                                  <code className="block w-full overflow-x-auto whitespace-pre rounded-xl bg-zinc-900 dark:bg-[#141415] p-3 text-[12px] text-white">{children}</code>
                                );
                              },
                              pre: ({ children }) => (
                                <pre className="my-3 w-full max-w-full overflow-x-auto rounded-xl bg-zinc-900 dark:bg-[#141415] p-0">{children}</pre>
                              ),
                              blockquote: ({ children }) => (
                                <blockquote className="border-l-2 border-[#fe3e91] pl-3 italic wrap-break-word text-zinc-600 dark:text-zinc-400">{children}</blockquote>
                              ),
                              a: ({ href, children }) => (
                                <a href={href} target="_blank" rel="noopener noreferrer" className="break-all font-medium text-[#fe3e91] underline underline-offset-2">{children}</a>
                              ),
                              table: ({ children }) => (
                                <div className="my-3 w-full max-w-full overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
                                  <table className="w-max min-w-full border-collapse text-xs sm:text-sm">{children}</table>
                                </div>
                              ),
                              th: ({ children }) => (
                                <th className="border border-zinc-200 bg-zinc-50 px-3 py-2 text-left whitespace-nowrap dark:border-zinc-800 dark:bg-[#19191b]">{children}</th>
                              ),
                              td: ({ children }) => (
                                <td className="border border-zinc-200 px-3 py-2 align-top whitespace-nowrap dark:border-zinc-800">{children}</td>
                              ),
                            }}
                          >
                            {messageText}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap wrap-break-word text-xs leading-6 sm:text-sm">{messageText}</p>
                      )}
                      <p className={`mt-2 text-[10px] ${isAI ? "text-zinc-500 dark:text-zinc-400" : "text-white/75"}`}>
                        {createdAt}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* AI Typing Bubble */}
              {isTyping && (
                <div className="flex w-full items-end justify-start gap-3">
                  <div className="ml-0 mr-auto w-fit max-w-[85%] rounded-lg border border-zinc-200/80 bg-white px-3.5 py-2.5 dark:border-zinc-800 dark:bg-[#19191b]">
                    <div className="mb-1.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#fe3e91]"></span>
                      <span className="text-xs font-mono font-medium text-zinc-500">
                        Resume Assistant
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-600 dark:text-zinc-400">
                        {loadingTexts[loadingIndex]}
                      </span>

                      <div className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#fe3e91] animate-pulse [animation-delay:0ms]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-[#fe3e91] animate-pulse [animation-delay:150ms]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-[#fe3e91] animate-pulse [animation-delay:300ms]" />
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