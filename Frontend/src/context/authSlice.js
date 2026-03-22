import { createSlice } from "@reduxjs/toolkit";

const initialUser = null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: initialUser,
  },
  reducers: {
    setLogin: (state, action) => {
      console.log("Setting login with user data:", action.payload);
      if(action.payload?.email_verified){
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
  },
});

export const { setLogin, setLogout,updateExpiration } = authSlice.actions;
export default authSlice.reducer;

// const theme = useSelector((state) => state.theme.value);
