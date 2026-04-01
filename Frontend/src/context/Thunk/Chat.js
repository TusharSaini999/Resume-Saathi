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
      console.log("Response from ChatService.sendMessage:", response);
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

const deleteChat = createAsyncThunk(
  "chat/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await ChatService.deleteChat(id);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(
          response.message || "Failed to delete chat.",
        );
      }
    } catch (error) {
      rejectWithValue(
        error.message || "An error occurred while deleting the chat.",
      );
    }
  },
);
export { chat, history, deleteChat };