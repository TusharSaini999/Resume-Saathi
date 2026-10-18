import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "../context/themeSlice";
import authSlice from "../context/authSlice.js";
import messageSlice from "../context/messageSlice";
import resumeSlice from "../context/resumeSlice";
import chatSlice from "../context/chatSlice";
import jobDecSlice from "../context/jobdecSlice";
import careerSlice from "../context/careerSlice";
export const store = configureStore({
  reducer: {
    theme: themeSlice,
    auth: authSlice,
    message:messageSlice,
    resume:resumeSlice,
    chat:chatSlice,
    jobDec:jobDecSlice,
    career: careerSlice,
  },
});

export default store;
