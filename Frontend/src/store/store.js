import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "../context/themeSlice";
import authSlice from "../context/authSlice";
import { Slice } from "lucide-react";
export const store = configureStore({
  reducer: {
    theme: themeSlice,
    auth: authSlice,
  },
});

export default store;
