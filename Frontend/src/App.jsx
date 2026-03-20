import { useEffect, useState } from "react";
import SplashScreen from "./components/layout/SplashScreen";
import { useDispatch } from "react-redux";
import { setLogin } from "./context/authSlice.js"
import AuthService from "./services/authService.js";
import { Suspense } from "react";

function App({ children }) {
  const [showSplash, setShowSplash] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await AuthService.getProfile();
        if (response.success) {
          console.log("User profile fetched successfully:", response);
          dispatch(setLogin(response.data));
        }
      } catch (error) {
        console.log("Error fetching user profile:", error);
      } finally {
        setTimeout(() => {
          setShowSplash(false);
        }, 2000);
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
      <SplashScreen show={showSplash} />
      <Suspense fallback={<SplashScreen show="true" />}>
        {children}
      </Suspense>
    </>
  );
}

export default App;