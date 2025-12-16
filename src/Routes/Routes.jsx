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


import ShowUsers from "../Pages/ShowUsers/ShowUsers";
import AllContestAdmin from "../Pages/AllContestAdmin/AllContestAdmin";
import ContestDetails from "../Pages/Details/ContestDetails";
import AllContests from "../Pages/AllContests/AllContests";
import Details from "../Pages/ContestDetails/Details";
import Payment from "../Pages/Payment/Payment";
import PaymentSuccess from "../Pages/Payment/PaymentSuccess";
import PaymentCancelled from "../Pages/Payment/PaymentCancelled";
import UserProfile from "../Pages/UserProfile/UserProfile";
import UserParticipants from "../Pages/UserParticipants/UserParticipants";
import UserWinning from "../Pages/UserWinning/UserWinning";
import CreateContest from "../Pages/CreateContest/CreateContest";
import ShowContestTable from "../Pages/AllContests/ShowContestTable";



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
        path: '/all-contests',
        element: <AllContests></AllContests>
      },
      {
        path: '/details/:id',
        element: <Details></Details>
      },
      {
        path: '/payment/:id',
        element: <Payment></Payment>
      },
      {
        path: "/payment-success",
        element: (
          <PrivateRouter>
            <PaymentSuccess></PaymentSuccess>
          </PrivateRouter>
        )
      },
      {
        path: "/payment-cancelled",
        element:<PaymentCancelled></PaymentCancelled>
      }
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
        path: '/allUsers',
        Component: ShowUsers
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
        path: 'admin/All-Contest',
        element: <AllContestAdmin></AllContestAdmin>
      },
      {
        path: 'contest/:id',
        element: <ContestDetails></ContestDetails>
      },
      {
        path:'user-profile',
        element:<UserProfile></UserProfile>
      },
      {
        path:'UserParticipants',
        element:<UserParticipants></UserParticipants>
      },
      {
        path:'UserWinning',
        element:<UserWinning></UserWinning>
      },
      {
        path:'CreateContest',
        element:<CreateContest></CreateContest>
      },
      {
        path:'ShowContestTable',
        element:<ShowContestTable></ShowContestTable>
      }

    ],
  },
]);
