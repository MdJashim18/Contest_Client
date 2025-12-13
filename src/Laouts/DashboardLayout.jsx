import { Link, NavLink, Outlet } from "react-router";
import { CiDeliveryTruck } from "react-icons/ci";
import useRole from "../Hooks/useRole";

const DashboardLayout = () => {
  const [role, loading] = useRole();


  if (loading) {
    return <p className="text-center mt-10">Loading dashboard...</p>;
  }

  return (
    <div className="drawer lg:drawer-open max-w-7xl mx-auto">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

     
      <div className="drawer-content flex flex-col">
        <nav className="navbar bg-base-300">
          <label htmlFor="dashboard-drawer" className="btn btn-ghost lg:hidden">
            ☰
          </label>
          <span className="text-lg font-semibold ml-2">
            Contest Hub Dashboard
          </span>
        </nav>

        <div className="p-4">
          <Outlet />
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>

        <aside className="menu p-4 w-64 bg-base-200 min-h-full">
          <ul className="space-y-1">
            <li>
              <Link to="/"> Home</Link>
            </li>

            {role === "user" && (
              <li>
                <NavLink to="user">
                  <CiDeliveryTruck />My Contest
                </NavLink>
              </li>
            )}

            {role === "creator" && (
              <>
                <li>
                  <NavLink to="creator"> My Contests</NavLink>
                </li>
                <li>
                  <NavLink to="creator/add-contest"> Add Contest</NavLink>
                </li>
              </>
            )}

            {role === "admin" && (
              <>
                <li>
                  <NavLink to="admin"> Admin Dashboard</NavLink>
                </li>
                <li>
                  <NavLink to="admin/manage-users"> Manage Users</NavLink>
                </li>
                <li>
                  <NavLink to="admin/manage-contests"> Manage Contests</NavLink>
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
