import { Outlet } from "react-router";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate , useLocation} from "react-router";

function AuthLayout() {
  const user = useSelector((state) => state.auth.user);
  const isAuthResolved = useSelector((state) => state.auth.isAuthResolved);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthResolved) {
      return;
    }

    if (user && user.email_verified) {
      const redirectPath = location.state?.from?.pathname || "/dashboard";
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthResolved, user, navigate, location.state]);

  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default AuthLayout;