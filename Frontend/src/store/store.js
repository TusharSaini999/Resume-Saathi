import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "../context/themeSlice";
export const store = configureStore({
  reducer: {
    theme: themeSlice,
  },
});

export default store;
