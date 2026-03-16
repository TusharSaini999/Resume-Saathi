import { Outlet } from "react-router";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useEffect, useState } from "react";
import SplashScreen from "../components/layout/SplashScreen";

function MainLayout() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
    }, 1000);
  }, []);
  return (
    <>
      <SplashScreen show={showSplash} />
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default MainLayout;