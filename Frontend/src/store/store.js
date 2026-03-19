import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "../context/themeSlice";
import authSlice from "../context/authSlice";
export const store = configureStore({
  reducer: {
    theme: themeSlice,
    auth: authSlice,
  },
});

export default store;
