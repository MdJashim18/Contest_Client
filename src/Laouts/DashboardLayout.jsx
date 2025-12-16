import { Link, NavLink, Outlet } from "react-router";
import { CiDeliveryTruck } from "react-icons/ci";
import useRole from "../Hooks/useRole";

const DashboardLayout = () => {
  const [role, loading] = useRole();

  if (loading) {
    return <p className="text-center mt-10 text-lg">Loading dashboard...</p>;
  }

  const linkClass = ({ isActive }) =>
    `block py-2 px-4 rounded-lg transition-colors duration-200 ${
      isActive ? "bg-primary text-white" : "hover:bg-primary/20"
    }`;

  return (
    <div className="drawer lg:drawer-open max-w-7xl mx-auto">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main Content */}
      <div className="drawer-content flex flex-col min-h-screen bg-base-100">
        {/* Navbar */}
        <nav className="navbar bg-base-300 px-4 shadow-md">
          <label htmlFor="dashboard-drawer" className="btn btn-ghost lg:hidden">
            ☰
          </label>
          <span className="text-lg font-semibold ml-2">Contest Hub Dashboard</span>
        </nav>

        {/* Outlet for nested routes */}
        <div className="p-6 flex-1">
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <aside className="menu p-6 w-64 bg-base-200 min-h-full shadow-lg rounded-r-xl">
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="block py-2 px-4 rounded-lg hover:bg-primary/20 transition-colors"
              >
                Home
              </Link>
            </li>

            {role === "user" && (
              <>
                <li>
                  <NavLink to="/dashboard/user-profile" className={linkClass}>
                    My Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/UserWinning" className={linkClass}>
                    My Winning
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/UserParticipants" className={linkClass}>
                    My Contests
                  </NavLink>
                </li>
              </>
            )}

            {role === "creator" && (
              <>
                <li>
                  <NavLink to="/dashboard/CreateContest" className={linkClass}>
                    Add Contests
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/ShowContestTable" className={linkClass}>
                    Contest Table
                  </NavLink>
                </li>
              </>
            )}

            {role === "admin" && (
              <>
                <li>
                  <NavLink to="/dashboard/admin" className={linkClass}>
                    Admin Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/admin/All-Contest" className={linkClass}>
                    All Contests
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/admin/manage-contests" className={linkClass}>
                    Manage Contests
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayout;
