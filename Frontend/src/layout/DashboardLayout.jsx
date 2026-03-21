import { Outlet } from "react-router";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router";


function DashboardLayout() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    }
  }, [user]);
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