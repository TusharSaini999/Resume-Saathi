import { useEffect, useState } from "react";
import SplashScreen from "./components/layout/SplashScreen";
import { useDispatch } from "react-redux";
import AuthService from "./services/authService.js";
import { Suspense } from "react";
import GlobalMessage from "./components/layout/GlobalMessage.jsx";
import { setError, setSuccess } from "./context/messageSlice.js";
import { Login ,Logout} from "./context/Thunk/Auth.js";
import { setAuthResolved } from "./context/authSlice.js";

function App({ children }) {
  const [showSplash, setShowSplash] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setAuthResolved(false));
    const fetchProfile = async () => {
      try {
        const response = await AuthService.getProfile();
        if (response.success) {
          dispatch(Login(response.data));
          dispatch(setSuccess("Logged in successfully"));
        } else {
          dispatch(Logout());
          dispatch(setError(response.message || "Failed to fetch profile"));
        }
      } catch (error) {
        dispatch(setError("Something went wrong while fetching"));
      } finally {
        dispatch(setAuthResolved(true));
        setTimeout(() => {
          setShowSplash(false);
        }, 2000);
      }
    };
    if (localStorage.getItem("trueLogin") === "true") {
      fetchProfile();
    } else {
      dispatch(setAuthResolved(true));
      setTimeout(() => {
        setShowSplash(false);
      }, 1000);
    }
  }, [dispatch]);

  return (
    <>
      <SplashScreen show={showSplash} />
      <GlobalMessage />
      <Suspense fallback={<SplashScreen show={true} />}>
        {children}
      </Suspense>
    </>
  );
}

export default App;