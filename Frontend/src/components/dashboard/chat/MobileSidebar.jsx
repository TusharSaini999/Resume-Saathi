import { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  Search,
  X,
  Trash2,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { history, deleteChat } from "../../../context/Thunk/Chat.js";
import {
  clearError,
  setActiveChat,
  setChatMessages,
} from "../../../context/chatSlice";

export default function MobileSidebar({
  mobileSidebarOpen,
  setMobileSidebarOpen,
  chatHistory,
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
    setMobileSidebarOpen(false);
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
        dispatch(setChatMessages([]));
        dispatch(setActiveChat(null));
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
        chat.session_title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [chatHistory, searchTerm]);

  const handleSelectChat = (chatId) => {
    if (deleteLoading && deletingChatId === chatId) return;

    dispatch(setActiveChat(chatId));
    dispatch(history(chatId));
    setMobileSidebarOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-75 transform border-r border-[#E2E8F0] bg-[#F8FAFC] transition-transform duration-300 dark:border-[#1E293B] dark:bg-[#020617] md:hidden ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E2E8F0] px-4 py-4 dark:border-[#1E293B]">
            <div>
              <h2 className="text-sm font-semibold text-[#0F172A] dark:text-white">
                Chats
              </h2>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                ResumeSaathi AI
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white text-[#475569] shadow-sm transition hover:scale-105 active:scale-95 dark:border-[#334155] dark:bg-[#0F172A] dark:text-[#94A3B8]"
            >
              <X size={18} />
            </button>
          </div>

          {/* New Chat */}
          <div className="px-4 pb-3 pt-4">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-[#FE3E91] via-[#CA25AF] to-[#803AD1] px-4 py-3 text-sm font-medium text-white shadow-[0_10px_30px_rgba(254,62,145,0.25)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.99]"
              onClick={handleNewChat}
            >
              <Plus size={18} />
              New Chat
            </button>
          </div>

          {/* Search */}
          <div className="px-4 pb-3">
            <div className="flex items-center gap-2 rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 shadow-sm dark:border-[#334155] dark:bg-[#0F172A]">
              <Search
                size={16}
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

          {/* Error */}
          {error && (
            <div className="mx-4 mb-3 rounded-2xl border border-red-200 bg-red-50 px-3 py-3 shadow-sm dark:border-red-500/20 dark:bg-red-500/10">
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
          <div className="history-scroll-hidden flex-1 overflow-y-auto px-3 pb-4">
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
                    className={`group relative w-full cursor-pointer rounded-2xl border px-4 py-3 text-left transition-all duration-200 ${
                      activeChat === chat._id
                        ? "border-[#FBCFE8] bg-linear-to-r from-[#FE3E91]/10 via-[#CA25AF]/10 to-[#803AD1]/10 shadow-sm dark:border-[#7C2D92]/30"
                        : "border-transparent hover:bg-white dark:hover:bg-[#0F172A]"
                    }`}
                  >
                    <div className="pr-10">
                      <p className="line-clamp-1 text-sm font-medium text-[#0F172A] dark:text-white">
                        {chat.session_title || "Untitled Chat"}
                      </p>
                      <p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
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

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={(e) => openDeleteConfirm(e, chat._id)}
                      disabled={deleteLoading && deletingChatId === chat._id}
                      className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-2 text-[#94A3B8] transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50 dark:hover:bg-red-500/10"
                      aria-label="Delete chat"
                    >
                      {deleteLoading && deletingChatId === chat._id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center px-2">
                <div className="w-full max-w-xs text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-linear-to-r from-[#FE3E91] via-[#CA25AF] to-[#803AD1] shadow-[0_12px_30px_rgba(202,37,175,0.25)]">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>

                  <h3 className="text-sm font-semibold text-[#0F172A] dark:text-white">
                    {searchTerm ? "No matching chats" : "No chats yet"}
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-[#64748B] dark:text-[#94A3B8]">
                    {searchTerm
                      ? "Try searching with another keyword."
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
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl dark:bg-[#0F172A]">
            <h3 className="text-lg font-semibold text-[#0F172A] dark:text-white">
              Delete Chat?
            </h3>
            <p className="mt-2 text-sm text-[#64748B] dark:text-[#94A3B8]">
              Are you sure you want to delete this chat? This action cannot be
              undone.
            </p>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                disabled={deleteLoading}
                className="rounded-xl border border-[#E2E8F0] px-4 py-2 text-sm font-medium text-[#475569] transition hover:bg-[#F8FAFC] dark:border-[#334155] dark:text-[#CBD5E1] dark:hover:bg-[#1E293B]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteChat}
                disabled={deleteLoading}
                className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 disabled:opacity-70"
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