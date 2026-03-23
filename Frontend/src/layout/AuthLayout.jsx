import { Outlet } from "react-router";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router";
function AuthLayout() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (user && user.email_verified) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default AuthLayout;