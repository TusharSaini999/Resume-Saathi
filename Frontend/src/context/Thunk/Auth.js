import { setLogin, setLogout as authLogout } from "../authSlice.js";
import { setResume, setLogout as resumeLogout } from "../resumeSlice.js";
import { setJobDecSetUp, setLogout as jobDecLogout } from "../jobdecSlice.js";
import { setChatSession, setLogout as chatLogout } from "../chatSlice.js";

const Login = (payload) => (dispatch) => {
  dispatch(setLogin(payload));
  dispatch(setResume(payload.resumeResp));
  dispatch(setJobDecSetUp(payload.jobResp));
  dispatch(setChatSession(payload.currentChatSession));
};

const Logout = () => (dispatch) => {
  dispatch(authLogout());
  dispatch(resumeLogout());
  dispatch(jobDecLogout());
  dispatch(chatLogout());

};

export { Login, Logout };