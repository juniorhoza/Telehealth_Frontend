import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
]);
