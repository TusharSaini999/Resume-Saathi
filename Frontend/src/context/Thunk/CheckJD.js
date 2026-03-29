import { createAsyncThunk } from "@reduxjs/toolkit";
import JobService from "../../services/jobService.js";
import { setLoadingStage } from "../jobdecSlice.js";

const submitJD = createAsyncThunk(
  "jobDec/submitJD",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      setTimeout(() => {
        dispatch(setLoadingStage("processing"));
      }, 500);
      setTimeout(() => {
        dispatch(setLoadingStage("finalizing"));
      }, 1000);
      const response = await JobService.checkJobDec(payload);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || "Failed to check JD.");
      }
    } catch (error) {
      return rejectWithValue(
        error.message || "An error occurred while chicking the JD.",
      );
    }
  },
);

export { submitJD };
