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
        className={`fixed left-0 top-0 z-50 h-screen w-75 transform border-r border-zinc-200/80 bg-zinc-50 transition-transform duration-300 dark:border-zinc-800 dark:bg-[#141415] md:hidden ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-200/80 px-4 py-4 dark:border-zinc-800">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">
                Chats
              </h2>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                ResumeSaathi AI
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 transition-colors dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <X size={18} />
            </button>
          </div>

          {/* New Chat */}
          <div className="px-4 pb-3 pt-4">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#fe3e91] hover:bg-[#e11d48] dark:bg-[#fe3e91] dark:hover:bg-[#ff2aac] px-4 py-2.5 text-xs font-medium text-white shadow-xs dark:shadow-[0_0_12px_rgba(254,62,145,0.25)] transition-all duration-150 active:scale-[0.98]"
              onClick={handleNewChat}
            >
              <Plus size={16} />
              New chat
            </button>
          </div>

          {/* Search */}
          <div className="px-4 pb-3">
            <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <Search
                size={16}
                className="text-zinc-400 dark:text-zinc-500"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search chats..."
                className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-white dark:placeholder:text-zinc-500"
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
                    className={`group relative w-full cursor-pointer rounded-lg border px-3.5 py-2.5 text-left transition-colors duration-150 ${
                      activeChat === chat._id
                        ? "border-zinc-200/90 bg-zinc-100 text-zinc-900 dark:border-zinc-700/80 dark:bg-[#232325] dark:text-zinc-100"
                        : "border-transparent text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-[#19191b]"
                    }`}
                  >
                    <div className="pr-10">
                      <p className="line-clamp-1 text-sm font-medium text-zinc-900 dark:text-white">
                        {chat.session_title || "Untitled Chat"}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
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
                      className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-2 text-zinc-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50 dark:hover:bg-red-500/10"
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
              <div className="flex h-full items-center justify-center px-2 py-8">
                <div className="w-full max-w-xs text-center">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    <MessageSquare size={18} />
                  </div>

                  <h3 className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                    {searchTerm ? "No matching chats" : "No chats yet"}
                  </h3>

                  <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
                    {searchTerm
                      ? "Try searching with another keyword."
                      : "Start a conversation to see past sessions here."}
                  </p>

                  {!searchTerm && (
                    <button
                      onClick={handleNewChat}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#fe3e91] hover:bg-[#e11d48] dark:bg-[#fe3e91] dark:hover:bg-[#ff2aac] px-3 py-1.5 text-xs font-medium text-white shadow-xs dark:shadow-[0_0_12px_rgba(254,62,145,0.25)] transition-all"
                    >
                      <Plus size={14} />
                      New chat
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
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl dark:bg-[#19191b] border border-zinc-200/80 dark:border-zinc-800">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Delete Chat?
            </h3>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Are you sure you want to delete this chat? This action cannot be
              undone.
            </p>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                disabled={deleteLoading}
                className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
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