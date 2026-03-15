import React from "react";
import ReactDOM from "react-dom/client";
import MainLayout from "./layout/MainLayout";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import App from "./App";
import Landing from "./pages/Landing";
import { Provider } from "react-redux";
import store from "./store/store.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Landing />,
      }
    ],
  },
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