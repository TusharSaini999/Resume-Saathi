import { createSlice } from "@reduxjs/toolkit";
import { chat, history } from "./Thunk/Chat.js";
import { set } from "mongoose";
const initialState = {
  chatSession: [],
  currentChat: [],
  loading: false,
  initialLoading: false,
  error: null,
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
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLogout:(state)=>{
      state.chatSession = [];
      state.currentChat = [];
      state.loading = false;
      state.initialLoading = false;
      state.error = null;
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
          state.chatSession.push(...action.payload.chatSession);
        }
        state.currentChat.push(...action.payload.message);
      })
      .addCase(chat.rejected, (state) => {
        state.error = null;
        state.loading = false;
      });

    builder
      .addCase(history.pending, (state) => {
        state.initialLoading = true;
        state.error = null;
        state.currentChat = [];
      })
      .addCase(history.fulfilled, (state, action) => {
        state.initialLoading = false;
        state.error = null;
        state.currentChat = action.payload;
      })
      .addCase(history.rejected, (state) => {
        state.error = null;
        state.initialLoading = false;
      });
  },
});

export const { setChatSession, setLoading, setError, clearError } =
  chatSlice.actions;
export default chatSlice.reducer;
