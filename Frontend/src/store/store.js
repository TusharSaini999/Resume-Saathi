import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "../context/themeSlice";
import authSlice from "../context/authSlice";
import messageSlice from "../context/messageSlice";
export const store = configureStore({
  reducer: {
    theme: themeSlice,
    auth: authSlice,
    message:messageSlice,
  },
});

export default store;
