import { createSlice } from "@reduxjs/toolkit";
import { chat, history, deleteChat } from "./Thunk/Chat.js";

const initialState = {
  chatSession: [],
  currentChat: [],
  loading: false,
  initialLoading: false,
  initialError: null,
  error: null,
  deleteLoading: false,
  deleteError: null,
  activeChat: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatSession: (state, action) => {
      state.chatSession = action.payload;
      state.loading = false;
      state.error = null;
    },
    setChatMessages: (state, action) => {
      state.currentChat = action.payload;
      state.loading = false;
      state.error = null;
    },
    AddCurrentMessage: (state, action) => {
      state.currentChat.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
      state.deleteError = null;
    },
    setLogout: (state) => {
      state.chatSession = [];
      state.currentChat = [];
      state.loading = false;
      state.initialLoading = false;
      state.error = null;
      state.initialError = null;
    },
    setActiveChat: (state, action) => {
      if (action.payload === null) {
        state.initialError = null;
      }
      state.activeChat = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(chat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(chat.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload.newChat == true) {
          state.chatSession.push(action.payload?.chatSession);
        }
        state.currentChat.push(action.payload.message);
        state.activeChat = action.payload.message.session_id;
      })
      .addCase(chat.rejected, (state) => {
        state.error = "Failed to send message.";
        state.loading = false;
      });

    builder
      .addCase(history.pending, (state) => {
        state.initialLoading = true;
        state.initialError = null;
        state.currentChat = [];
      })
      .addCase(history.fulfilled, (state, action) => {
        state.initialLoading = false;
        state.initialError = null;
        state.currentChat = action.payload;
      })
      .addCase(history.rejected, (state) => {
        state.initialError = "Failed to fetch chat history.";
        state.initialLoading = false;
      });

    builder
      .addCase(deleteChat.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteChat.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = null;
        state.chatSession = state.chatSession.filter(
          (chat) => chat._id !== action.payload,
        );
        if (state.activeChat === action.payload) {
          state.activeChat = null;
          state.currentChat = [];
        }
      })
      .addCase(deleteChat.rejected, (state, active) => {
        state.deleteError = active.payload.message || "Failed to delete chat.";
        state.deleteLoading = false;
      });
  },
});

export const {
  setChatSession,
  setChatMessages,
  setLoading,
  setError,
  clearError,
  setLogout,
  AddCurrentMessage,
  setActiveChat,
} = chatSlice.actions;
export default chatSlice.reducer;
