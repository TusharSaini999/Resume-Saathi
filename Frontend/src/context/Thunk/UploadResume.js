import { createAsyncThunk } from "@reduxjs/toolkit";
import ResumeService from "../../services/resumeService.js";
import {
  setLoadingStage,
} from "../resumeSlice.js";

const submitResume = createAsyncThunk(
  "resume/submitResume",
  async (file, { dispatch, rejectWithValue }) => {
    try {
      setTimeout(() => {
        dispatch(setLoadingStage("processing"));
      }, 2000);
      setTimeout(() => {
        dispatch(setLoadingStage("finalizing"));
      }, 6000);
      const response = await ResumeService.uploadResume(file);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || "Failed to upload resume.");
      }
    } catch (error) {
      return rejectWithValue(
        error.message || "An error occurred while uploading the resume.",
      );
    }
  },
);

export { submitResume };
