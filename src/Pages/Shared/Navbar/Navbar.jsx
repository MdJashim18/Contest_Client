import React from "react";
import Logo from "../../../Components/Logo/Logo";
import { NavLink } from "react-router";
import useAuth from "../../../Hooks/useAuth";
import useRole from "../../../Hooks/useRole";

const Navbar = () => {
  const { user, LogOut } = useAuth();
  const [role, loading] = useRole();

  const handleLogOut = () => {
    LogOut().catch(error => console.log(error));
  };

  const dashboardPath =
    role === "admin"
      ? "/dashboard/admin"
      : role === "creator"
      ? "/dashboard/creator"
      : "/dashboard/user";

  const links = (
    <>
      <li><NavLink to="/">Home</NavLink></li>
      <li><NavLink to="/all-contests">All Contests</NavLink></li>
      <li><NavLink to="/">Extra Section</NavLink></li>
      

      
      {user && role==="admin" && (
        <li><NavLink to="/allUsers">All Users</NavLink></li>
      )}
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            ☰
          </div>
          <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow">
            {links}
          </ul>
        </div>
        <NavLink to="/" className="btn btn-ghost text-xl">
          <Logo />
        </NavLink>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{links}</ul>
      </div>

      <div className="navbar-end pr-5">
        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  src={user.photoURL || "https://via.placeholder.com/100"}
                  alt="User"
                />
              </div>
            </div>

            <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow">
              <li>
                <NavLink to="/profile">
                  {user.displayName || "Profile"}
                </NavLink>
              </li>

              {!loading && (
                <li>
                  <NavLink to={dashboardPath}>Dashboard</NavLink>
                </li>
              )}

              <li>
                <button onClick={handleLogOut}>Logout</button>
              </li>
            </ul>
          </div>
        ) : (
          <NavLink to="/login" className="btn">Login</NavLink>
        )}
      </div>
    </div>
  );
};

export default Navbar;
