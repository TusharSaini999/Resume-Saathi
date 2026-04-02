import { createSlice } from "@reduxjs/toolkit";
import { submitJD } from "./Thunk/CheckJD";
const initialState = {
  jobDec: [],
  loading: false,
  loadingStage: "uploading",
  error: null,
};

const jobDecSlice = createSlice({
  name: "jobDec",
  initialState,
  reducers: {
    setJobDecSetUp: (state, action) => {
      console.log("Setting jobDec with data:", action.payload);
      state.jobDec = action.payload;
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
      state.jobDec = [];
      state.loading = false;
      state.loadingStage = "uploading";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitJD.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.loadingStage = "uploading";
      })
      .addCase(submitJD.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.jobDec.push(action.payload);
        state.loadingStage = "uploading";
      })
      .addCase(submitJD.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to check JD.";
        state.loadingStage = "uploading";
      });
  },
});
export const {
  setJobDecSetUp,
  setLoading,
  setError,
  setLoadingStage,
  clearError,
  setLogout,
} = jobDecSlice.actions;
export default jobDecSlice.reducer;
