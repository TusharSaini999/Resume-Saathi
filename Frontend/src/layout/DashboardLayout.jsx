import { Outlet } from "react-router";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router";


function DashboardLayout() {
  const user = useSelector((state) => state.auth.user);
  const isAuthResolved = useSelector((state) => state.auth.isAuthResolved);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthResolved) {
      return;
    }

    if (!user) {
      navigate("/auth/login", {
        replace: true,
        state: { from: location },
      });
    }
  }, [isAuthResolved, user, navigate, location]);

  return (
    <>
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default DashboardLayout;