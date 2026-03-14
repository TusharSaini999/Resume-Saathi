import { useEffect, useState } from "react";
import SplashScreen from "./components/layout/SplashScreen";

function App({ children }) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
    }, 1000);
  }, []);

  return (
    <>
      <SplashScreen show={showSplash} />
      {children}
    </>
  )
}

export default App;