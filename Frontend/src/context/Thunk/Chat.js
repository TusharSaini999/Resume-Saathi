import { createAsyncThunk } from "@reduxjs/toolkit";
import ChatService from "../../services/chatService.js";

const chat = createAsyncThunk(
  "chat/Message",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await ChatService.sendMessage(
        payload.query,
        payload.chatId,
      );
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || "Failed to upload resume.");
      }
    } catch (error) {
      return rejectWithValue(
        error.message || "An error occurred while uploading the resume.",
      );
    }
  },
);

const history = createAsyncThunk(
  "chat/history",
  async (id, { rejectWithValue }) => {
    try {
      const response = await ChatService.getChat(id);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(
          response.message || "Failed to fetch chat history.",
        );
      }
    } catch (error) {
      rejectWithValue(
        error.message || "An error occurred while fetching chat history.",
      );
    }
  },
);
export { chat, history };
