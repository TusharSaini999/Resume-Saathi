import { useState } from "react";
import ChatSidebar from "../components/dashboard/chat/ChatSidebar.jsx";
import MobileSidebar from "../components/dashboard/chat/MobileSidebar.jsx";
import ChatMessages from "../components/dashboard/chat/ChatMessage.jsx";
import ChatInput from "../components/dashboard/chat/ChatInput.jsx";
import NoResumeNotice from "../components/dashboard/chat/NoResumeNotice.jsx";
import { useSelector, useDispatch } from "react-redux";
import { chat } from "../context/Thunk/Chat.js";
import { AddCurrentMessage } from "../context/chatSlice.js";
export default function Chat() {
    const [input, setInput] = useState("");
    const dispatch = useDispatch();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const chatHistory = useSelector((state) => state.chat.chatSession);
    const activeChat = useSelector((state) => state.chat.activeChat);
    const resume = useSelector((state) => state.resume.resume);

    const handleSend = () => {
        if (!input.trim()) return;
        dispatch(
            AddCurrentMessage({
                _id: Date.now().toString(),
                message: input,
                sender: "user",
                createdAt: new Date().toISOString(),
            })
        );
        dispatch(chat({ query: input, chatId: activeChat }));
        setInput("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="h-screen w-full overflow-hidden bg-[#FFFFFF] dark:bg-[#020617]">
            {!resume ? (
                <div className="flex h-screen w-full items-center justify-center">
                    <NoResumeNotice />
                </div>
            ) : (
                <div className="flex h-screen w-full overflow-hidden">
                    <ChatSidebar
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                        chatHistory={chatHistory}
                    />

                    <MobileSidebar
                        mobileSidebarOpen={mobileSidebarOpen}
                        setMobileSidebarOpen={setMobileSidebarOpen}
                        chatHistory={chatHistory}
                    />

                    <main className="flex min-h-0 flex-1 flex-col bg-[#FFFFFF] dark:bg-[#0B1120]">
                        <ChatMessages
                            setMobileSidebarOpen={setMobileSidebarOpen}
                            activeChatTitle={
                                chatHistory.find((chat) => chat._id === activeChat)?.session_title ||
                                "Resume Chat"
                            }
                        />

                        <ChatInput
                            input={input}
                            setInput={setInput}
                            handleSend={handleSend}
                            handleKeyDown={handleKeyDown}
                        />
                    </main>
                </div>
            )}
        </div>
    );
}