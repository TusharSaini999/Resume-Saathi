import { Outlet } from "react-router";

function AuthLayout() {
  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default AuthLayout;