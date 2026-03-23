import { createAsyncThunk } from "@reduxjs/toolkit";
import { setError } from "../messageSlice.js";
import ResumeService from "../../services/resumeService.js";

export const submitResume = createAsyncThunk(
  "auth/submitResume",
  async (file, { dispatch, rejectWithValue }) => {
    try {
      const response = await ResumeService.uploadResume(file);
      if (response.success) {
        return response.data;
      } else {
        dispatch(
          setError(
            response.message ||
              "Failed to upload and analyze resume. Please try again.",
          ),
        );
        return rejectWithValue(
          response.message ||
            "Failed to upload and analyze resume. Please try again.",
        );
      }
    } catch (error) {
      dispatch(
        setError(
          error.message ||
            "An error occurred while uploading the resume. Please try again.",
        ),
      );
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "An error occurred while uploading the resume. Please try again.",
      );
    }
  },
);
