import { createBrowserRouter } from "react-router";
import RootLayouts from "../Laouts/RootLayouts";
import Home from "../Pages/Home/Home/Home";
import Coverage from "../Pages/Coverage/Coverage";
import AuthLayouts from "../Laouts/AuthLayouts";
import Login from "../Pages/Auth/Login/Login";
import Register from "../Pages/Auth/Register/Register";

import PrivateRouter from "./PrivateRouter";
import DashboardLayout from "../Laouts/DashboardLayout";
import Dashboard from "../Pages/Dashboard/Dashboard"; // redirect based on role
import AdminDashboard from "../Pages/Dashboard/AdminDashboard";
import CreatorDashboard from "../Pages/Dashboard/CreatorDashboard";
import UserDashboard from "../Pages/Dashboard/UserDashboard";

import Rider from "../Pages/Rider/Rider";
import ShowUsers from "../Pages/ShowUsers/ShowUsers";
import AllContestAdmin from "../Pages/AllContestAdmin/AllContestAdmin";

export const router = createBrowserRouter([
  // ================= PUBLIC =================
  {
    path: "/",
    Component: RootLayouts,
    children: [
      { index: true, Component: Home },
      {
        path: "coverage",
        Component: Coverage,
        loader: () => fetch("/warehouses.json").then(res => res.json()),
      },
      {
        path: "rider",
        element: (
          <PrivateRouter>
            <Rider />
          </PrivateRouter>
        ),
      },
    ],
  },

  // ================= AUTH =================
  {
    path: "/",
    Component: AuthLayouts,
    children: [
      { 
        path: "login",
        Component: Login 
      },
      { 
        path: "register", 
        Component: Register 
      },
      {
        path:'/allUsers',
        Component:ShowUsers
      }
    ],
  },

  // ================= DASHBOARD =================
  {
    path: "/dashboard",
    element: (
      <PrivateRouter>
        <DashboardLayout />
      </PrivateRouter>
    ),
    children: [
      { index: true, element: <Dashboard /> },

      
      { path: "admin", element: <AdminDashboard /> },

      
      { path: "creator", element: <CreatorDashboard /> },

      
      { path: "user", element: <UserDashboard /> },
      {
        path:'admin/All-Contest',
        element:<AllContestAdmin></AllContestAdmin>
      }
    ],
  },
]);
