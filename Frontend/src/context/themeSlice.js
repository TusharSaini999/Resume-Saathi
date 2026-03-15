import { createSlice } from "@reduxjs/toolkit";

const initialTheme = localStorage.getItem("theme") || "system";
const initialIsDark = localStorage.getItem("isDark") === "true";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: initialTheme,
    isDark: initialIsDark,
  },
  reducers: {
    setTheme: (state, action) => {
      const theme = action.payload.theme;
      const isDark=action.payload.isDark;

      state.mode = theme;
      state.isDark = isDark;

      localStorage.setItem("theme", theme);
      localStorage.setItem("isDark", isDark);
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;

// const theme = useSelector((state) => state.theme.value);