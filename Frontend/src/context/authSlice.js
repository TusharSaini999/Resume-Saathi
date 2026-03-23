import { createSlice } from "@reduxjs/toolkit";
import { submitResume } from "./Thunk/UploadResume.js";
const initialUser = null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: initialUser,
    loading: false,
    error: null,
  },
  reducers: {
    setLogin: (state, action) => {
      console.log("Setting login with user data:", action.payload);
      if (action.payload?.email_verified) {
        localStorage.setItem("trueLogin", true);
      }
      state.user = action.payload;
    },
    updateExpiration: (state, action) => {
      if (state.user) {
        state.user.email_ExpiresAt = action.payload;
      }
    },
    setLogout: (state) => {
      state.user = null;
      localStorage.setItem("trueLogin", false);
    },
    setErrorClear: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitResume.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user.resume_id = action.payload.resumeId;
        state.user.resumeResp = action.payload.analysis;
      })
      .addCase(submitResume.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload.message ||
          "Failed to upload and analyze resume. Please try again.";
      });
  },
});

export const { setLogin, setLogout, updateExpiration, setErrorClear } =
  authSlice.actions;
export default authSlice.reducer;

// const theme = useSelector((state) => state.theme.value);
