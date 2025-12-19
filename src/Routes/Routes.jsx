import { createBrowserRouter } from "react-router";
import RootLayouts from "../Laouts/RootLayouts";
import Home from "../Pages/Home/Home/Home";
import AuthLayouts from "../Laouts/AuthLayouts";
import Login from "../Pages/Auth/Login/Login";
import Register from "../Pages/Auth/Register/Register";

import PrivateRouter from "./PrivateRouter";
import DashboardLayout from "../Laouts/DashboardLayout";
import Dashboard from "../Pages/Dashboard/Dashboard"; 
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
import UpdateContest from "../Pages/AllContests/UpdateContest";
import Submission from "../Pages/Submission/Submission";
import PopularContests from "../Pages/Home/PopularContests/PopularContests";
import Error from "../Pages/Error/Error";
import ExtraSection from "../Pages/ExtraSection/ExtraSection";



export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayouts,
    children: [
      { index: true, Component: Home },
      {
        path: '/all-contests',
        element: <AllContests></AllContests>
      },
      {
        path: '/details/:id',
        element: <PrivateRouter>
          <Details></Details>
        </PrivateRouter>
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
        element: <PaymentCancelled></PaymentCancelled>
      },
      {
        path: "/contest",
        element: <PopularContests></PopularContests>
      },
      {
        path:'/ExtraSection',
        element:<ExtraSection></ExtraSection>
      }
    ],
  },

  {
    path: "/",
    Component: AuthLayouts,
    children: [
      {
        path: "/login",
        Component: Login
      },
      {
        path: "/register",
        Component: Register
      },
      {
        path: '/allUsers',
        Component: ShowUsers
      }
    ],
  },

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
        path: 'user-profile',
        element: <UserProfile></UserProfile>
      },
      {
        path: 'UserParticipants',
        element: <UserParticipants></UserParticipants>
      },
      {
        path: 'UserWinning',
        element: <UserWinning></UserWinning>
      },
      {
        path: 'CreateContest',
        element: <CreateContest></CreateContest>
      },
      {
        path: 'ShowContestTable',
        element: <ShowContestTable></ShowContestTable>
      },
      {
        path: 'UpdateContest/:id',
        element: <UpdateContest></UpdateContest>
      },
      {
        path: 'Submission/:id',
        element: <Submission></Submission>
      }

    ],
  },
  {
    path: '/*',
    element: <Error></Error>
  }

]);
