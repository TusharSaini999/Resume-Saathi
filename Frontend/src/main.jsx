import React from "react";
import ReactDOM from "react-dom/client";
import MainLayout from "./layout/MainLayout.jsx";
import AuthLayout from "./layout/AuthLayout.jsx";
import DashboardLayout from "./layout/DashboardLayout.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import App from "./App";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyToken from "./pages/VerifyToken";
import VerifyEmail from "./pages/VerifyEmail";
import VerifyEmailUserUpdate from "./pages/VerifyEmailUserUpdate";
import Resume from "./pages/Resume";
import { Provider } from "react-redux";
import store from "./store/store.js";
import GlobalError from "./pages/Error.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement:<GlobalError />,
    children: [
      {
        path: "/",
        element: <Landing />,
      }
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    errorElement:<GlobalError />,
    children: [
      {
        path: "/auth/login",
        element: <Login />
      },
      {
        path: "/auth/register",
        element: <Signup />
      },
      {
        path: "/auth/forgot-password",
        element: <ForgotPassword />
      },
      {
        path: "/auth/reset-password",
        element: <VerifyToken />
      },
      {
        path: "/auth/verify-token",
        element: <VerifyToken />
      },
      {
        path: "/auth/verify-email",
        element: <VerifyEmail />
      },
      {
        path: "/auth/verify-email-update",
        element: <VerifyEmailUserUpdate />
      }
    ]
  },
  {
    path:"/dashboard",
    element:<DashboardLayout/>,
    errorElement:<GlobalError />,
    children:[
      {
        path:"/dashboard",
        element:<Resume/>
      },
      {
        path:"/dashboard/job",
        element:<>Job Description Check</>
      },
      {
        path:"/dashboard/chat",
        element:<>Chat</>
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App>
        <RouterProvider router={router} />
      </App>
    </Provider>
  </React.StrictMode>
);