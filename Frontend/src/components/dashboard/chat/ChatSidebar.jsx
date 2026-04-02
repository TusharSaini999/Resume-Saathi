import {
  Plus,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  Trash2,
  Loader2,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useMemo, useState, useRef, useEffect } from "react";
import { history, deleteChat } from "../../../context/Thunk/Chat.js";
import {
  clearError,
  setActiveChat,
  setChatMessages,
} from "../../../context/chatSlice";

export default function ChatSidebar({
  sidebarOpen,
  setSidebarOpen,
  chatHistory = [],
}) {
  const dispatch = useDispatch();

  const activeChat = useSelector((state) => state.chat.activeChat);
  const deleteLoading = useSelector((state) => state.chat.deleteLoading);
  const deletingChatId = useSelector((state) => state.chat.deletingChatId);
  const error = useSelector((state) => state.chat.deleteError);

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const errorTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  const handleNewChat = () => {
    dispatch(setChatMessages([]));
    dispatch(setActiveChat(null));
  };

  const openDeleteConfirm = (e, chatId) => {
    e.stopPropagation();
    setConfirmDelete(chatId);
  };

  const handleDeleteChat = async () => {
    if (!confirmDelete) return;

    try {
      await dispatch(deleteChat(confirmDelete)).unwrap();

      if (activeChat === confirmDelete) {
        dispatch(setActiveChat(null));
        dispatch(setChatMessages([]));
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setConfirmDelete(null);

      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }

      errorTimeoutRef.current = setTimeout(() => {
        dispatch(clearError());
      }, 2000);
    }
  };

  const filteredChats = useMemo(() => {
    return [...chatHistory]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .filter((chat) =>
        (chat.session_title || "Untitled Chat")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
  }, [chatHistory, searchTerm]);

  const handleSelectChat = (chatId) => {
    if (deleteLoading && deletingChatId === chatId) return;
    dispatch(history(chatId));
    dispatch(setActiveChat(chatId));
  };

  return (
    <>
      <aside
              className={`sidebar-animated ${sidebarOpen ? "sidebar-open" : "sidebar-closed"} hidden h-full flex-col border-r border-[#E2E8F0] bg-[#FFFFFF] dark:border-[#1E293B] dark:bg-[#0B1120] md:flex`}
        style={{ minWidth: 0 }}
      >
        {/* Top Spacer */}
        <div className="h-20 w-full bg-[#FFFFFF] dark:bg-[#0B1120]" />

        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-[#E2E8F0] bg-[#FFFFFF]/95 px-3 py-3 backdrop-blur-md dark:border-[#1E293B] dark:bg-[#0B1120]/95">
          <div className="flex items-center justify-between">
            {sidebarOpen ? (
              <div>
                <h2 className="text-sm font-semibold text-[#0F172A] dark:text-white">
                  Chats
                </h2>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                  ResumeSaathi AI
                </p>
              </div>
            ) : (
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-r from-[#FE3E91] via-[#CA25AF] to-[#803AD1] shadow-[0_8px_24px_rgba(202,37,175,0.25)] mt-10">
                <Sparkles size={18} className="text-white" />
              </div>
            )}

            {sidebarOpen && (
              <button
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white text-[#475569] shadow-sm transition hover:scale-105 active:scale-95 dark:border-[#334155] dark:bg-[#111827] dark:text-[#94A3B8]"
              >
                <PanelLeftClose size={18} />
              </button>
            )}

            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="absolute top-0 left-1/2 hidden -translate-x-1/2 rounded-2xl border border-[#E2E8F0] bg-white p-2 text-[#475569] shadow-sm transition hover:scale-105 dark:border-[#334155] dark:bg-[#111827] dark:text-[#94A3B8] xl:flex"
                style={{ zIndex: 20 }}
              >
                <PanelLeftOpen size={18} />
              </button>
            )}
          </div>

          {/* New Chat */}
          {sidebarOpen && (
            <div className="mt-3">
              <button
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-[#FE3E91] via-[#CA25AF] to-[#803AD1] px-4 py-2.5 text-sm font-medium text-white shadow-[0_10px_30px_rgba(254,62,145,0.20)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.99]"
                onClick={handleNewChat}
              >
                <Plus size={16} />
                New Chat
              </button>
            </div>
          )}

          {/* Search */}
          {sidebarOpen && (
            <div className="mt-3">
              <div className="flex items-center gap-2 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 shadow-sm dark:border-[#334155] dark:bg-[#111827]">
                <Search
                  size={15}
                  className="text-[#64748B] dark:text-[#94A3B8]"
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search chats..."
                  className="w-full bg-transparent text-sm text-[#0F172A] outline-none placeholder:text-[#64748B] dark:text-white dark:placeholder:text-[#94A3B8]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && sidebarOpen && (
          <div className="mx-3 mt-3 rounded-2xl border border-red-200 bg-red-50 px-3 py-3 shadow-sm dark:border-red-500/20 dark:bg-red-500/10">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-red-600 dark:text-red-400">
                  Failed to delete chat
                </p>
                <p className="mt-1 text-[11px] leading-5 text-red-500 dark:text-red-300">
                  {typeof error === "string"
                    ? error
                    : error?.message ||
                      "Something went wrong. Please try again."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => dispatch(clearError())}
                className="rounded-md p-1 text-red-400 transition hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-500/10"
                aria-label="Close error"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* History */}
        <div className="history-scroll-hidden flex-1 overflow-y-auto px-2 py-3">
          {filteredChats.length > 0 ? (
            <div className="space-y-2">
              {filteredChats.map((chat) => (
                <div
                  key={chat._id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelectChat(chat._id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelectChat(chat._id);
                    }
                  }}
                  className={`group relative w-full cursor-pointer rounded-2xl border px-3 py-3 text-left transition-all duration-300 ${
                    activeChat === chat._id
                      ? "border-[#FBCFE8] bg-linear-to-r from-[#FE3E91]/10 via-[#CA25AF]/10 to-[#803AD1]/10 shadow-sm dark:border-[#7C2D92]/30"
                      : "border-transparent hover:-translate-y-px hover:bg-[#F8FAFC] hover:shadow-sm dark:hover:bg-[#111827]"
                  }`}
                >
                  {sidebarOpen ? (
                    <div className="pr-9">
                      <div className="flex items-start gap-2">
                        <div
                          className={`mt-1 h-2.5 w-2.5 rounded-full ${
                            activeChat === chat._id
                              ? "bg-linear-to-r from-[#FE3E91] via-[#CA25AF] to-[#803AD1]"
                              : "bg-[#CBD5E1] dark:bg-[#475569]"
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-1 text-sm font-medium text-[#0F172A] dark:text-white">
                            {chat.session_title || "Untitled Chat"}
                          </p>
                          <p className="mt-1 text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                            {new Date(chat.createdAt).toLocaleString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => openDeleteConfirm(e, chat._id)}
                        disabled={deleteLoading && deletingChatId === chat._id}
                        className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-xl p-2 text-[#94A3B8] transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50 group-hover:flex dark:hover:bg-red-500/10"
                        aria-label="Delete chat"
                      >
                        {deleteLoading && deletingChatId === chat._id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          activeChat === chat._id
                            ? "bg-linear-to-r from-[#FE3E91] via-[#CA25AF] to-[#803AD1]"
                            : "bg-[#CBD5E1] dark:bg-[#475569]"
                        }`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center px-2">
              {sidebarOpen ? (
                <div className="w-full max-w-xs text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-linear-to-r from-[#FE3E91] via-[#CA25AF] to-[#803AD1] shadow-[0_12px_30px_rgba(202,37,175,0.25)]">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>

                  <h3 className="text-sm font-semibold text-[#0F172A] dark:text-white">
                    {searchTerm ? "No chats found" : "No chats yet"}
                  </h3>
                  <p className="mt-2 text-xs leading-6 text-[#64748B] dark:text-[#94A3B8]">
                    {searchTerm
                      ? "Try searching with a different title."
                      : "Start a new conversation and your chat history will appear here."}
                  </p>

                  {!searchTerm && (
                    <button
                      onClick={handleNewChat}
                      className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-[#FE3E91] via-[#CA25AF] to-[#803AD1] px-4 py-2 text-sm font-medium text-white shadow-[0_10px_30px_rgba(254,62,145,0.18)] transition hover:scale-[1.02]"
                    >
                      <Plus size={15} />
                      New Chat
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F1F5F9] dark:bg-[#111827]">
                    <MessageSquare
                      size={18}
                      className="text-[#94A3B8]"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-2xl dark:border-[#1E293B] dark:bg-[#111827]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-500/10">
              <Trash2 className="h-5 w-5 text-red-500" />
            </div>

            <h3 className="text-lg font-semibold text-[#0F172A] dark:text-white">
              Delete Chat?
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#64748B] dark:text-[#94A3B8]">
              Are you sure you want to delete this chat? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                disabled={deleteLoading}
                className="rounded-2xl border border-[#E2E8F0] px-4 py-2.5 text-sm font-medium text-[#475569] transition hover:bg-[#F8FAFC] dark:border-[#334155] dark:text-[#CBD5E1] dark:hover:bg-[#1E293B]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteChat}
                disabled={deleteLoading}
                className="flex items-center gap-2 rounded-2xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-600 disabled:opacity-70"
              >
                {deleteLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}