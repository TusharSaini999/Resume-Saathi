import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  resume: null,
  loading: false,
  loadingStage: "uploading",
  error: null,
};
import { submitResume } from "./Thunk/UploadResume";

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    setResume: (state, action) => {
      state.resume = action.payload;
      state.loading = false;
      state.error = null;
      state.loadingStage = "uploading";
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setLoadingStage: (state, action) => {
      state.loadingStage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLogout: (state) => {
      state.resume = null;
      state.loading = false;
      state.loadingStage = "uploading";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitResume.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.loadingStage = "uploading";
      })
      .addCase(submitResume.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.resume = action.payload.analysis;
        state.loadingStage = "uploading";
      })
      .addCase(submitResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to upload resume.";
        state.loadingStage = "uploading";
      });
  },
});

export const { setResume, setLoading, setError, setLoadingStage, clearError,setLogout } =
  resumeSlice.actions;
export default resumeSlice.reducer;
