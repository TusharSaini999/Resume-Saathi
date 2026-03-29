import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "../context/themeSlice";
import authSlice from "../context/authSlice";
import messageSlice from "../context/messageSlice";
import resumeSlice from "../context/resumeSlice";
import chatSlice from "../context/chatSlice";
import jobDecSlice from "../context/jobdecSlice";
export const store = configureStore({
  reducer: {
    theme: themeSlice,
    auth: authSlice,
    message:messageSlice,
    resume:resumeSlice,
    chat:chatSlice,
    jobDec:jobDecSlice,
  },
});

export default store;
