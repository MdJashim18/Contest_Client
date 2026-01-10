import { Link, NavLink, Outlet } from "react-router";
import { FaHome, FaBars, FaTachometerAlt, FaUser, FaTrophy, FaPaintBrush, FaPlusCircle, FaTable, FaCrown, FaUsers, FaCog, FaSignOutAlt, FaChevronRight } from "react-icons/fa";
import { MdDashboard, MdOutlineSpaceDashboard } from "react-icons/md";
import { HiOutlineUserGroup } from "react-icons/hi";
import useRole from "../Hooks/useRole";
import UseAxiosSecure from "../Hooks/UseAxiosSecure";
import useAuth from "../Hooks/useAuth";

const DashboardLayout = () => {
  const [role, loading] = useRole();
  const { user, logOut } = useAuth();


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const getRoleIcon = () => {
    switch (role) {
      case "admin":
        return <FaCrown className="text-amber-500" />;
      case "creator":
        return <FaPaintBrush className="text-purple-500" />;
      case "user":
        return <FaUser className="text-blue-500" />;
      default:
        return <FaUser className="text-gray-500" />;
    }
  };

  const getRoleColor = () => {
    switch (role) {
      case "admin":
        return "bg-gradient-to-r from-indigo-500 to-purple-600";
      case "creator":
        return "bg-gradient-to-r from-purple-500 to-pink-500";
      case "user":
        return "bg-gradient-to-r from-blue-500 to-cyan-500";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 group ${
      isActive 
        ? `text-white ${getRoleColor()} shadow-lg transform scale-[1.02]` 
        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:shadow-md"
    }`;

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      
      <div className="drawer-content flex flex-col min-h-screen">
        
        <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div className="navbar max-w-7xl mx-auto px-4">
            <div className="flex-1">
              <label htmlFor="dashboard-drawer" className="btn btn-ghost btn-circle lg:hidden">
                <FaBars className="text-gray-600" />
              </label>
              <div className="flex items-center gap-3 hidden lg:flex">
                <div className={`p-2 rounded-lg ${getRoleColor()} text-white`}>
                  <MdDashboard className="text-xl" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Contest Hub
                  </h1>
                  <p className="text-xs text-gray-500">Professional Dashboard</p>
                </div>
              </div>
            </div>

            <div className="flex-none gap-4">
              <div className="dropdown dropdown-end">
                <div tabIndex={0} className="btn btn-ghost btn-circle">
                  <div className="indicator">
                    <img className="w-10 h-10 rounded-full" src={user?.photoURL} alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      <div className="drawer-side z-20">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <aside className="menu p-4 w-80 min-h-full bg-gradient-to-b from-white to-gray-50 shadow-xl border-r border-gray-200">
         
          <div className="px-4 py-6 mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${getRoleColor()} text-white shadow-lg`}>
                {getRoleIcon()}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Contest Hub</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-3 py-1 rounded-full capitalize ${role === 'admin' ? 'bg-amber-100 text-amber-800' : role === 'creator' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                    {role} Access
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-2">
            <div className="mb-6">
              <h3 className="text-xs uppercase text-gray-500 font-semibold tracking-wider px-4 mb-3">Main Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="flex items-center gap-3 py-3 px-4 rounded-xl text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors group"
                  >
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <FaHome />
                    </div>
                    <span className="font-medium">Back to Home</span>
                    <FaChevronRight className="ml-auto text-gray-400 text-xs" />
                  </Link>
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xs uppercase text-gray-500 font-semibold tracking-wider px-4 mb-3">Dashboard</h3>
              <ul className="space-y-2">
                {role === "user" && (
                  <>
                    <li>
                      <NavLink to="/dashboard/user" className={linkClass}>
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-white group-hover:text-blue-600 transition-colors">
                          <FaTachometerAlt />
                        </div>
                        <span className="font-medium">Dashboard</span>
                        <FaChevronRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/dashboard/user-profile" className={linkClass}>
                        <div className="p-2 bg-green-100 text-green-600 rounded-lg group-hover:bg-white group-hover:text-green-600 transition-colors">
                          <FaUser />
                        </div>
                        <span className="font-medium">My Profile</span>
                        <FaChevronRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/dashboard/UserWinning" className={linkClass}>
                        <div className="p-2 bg-amber-100 text-amber-600 rounded-lg group-hover:bg-white group-hover:text-amber-600 transition-colors">
                          <FaTrophy />
                        </div>
                        <span className="font-medium">My Winning</span>
                        <FaChevronRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/dashboard/UserParticipants" className={linkClass}>
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-white group-hover:text-purple-600 transition-colors">
                          <MdOutlineSpaceDashboard />
                        </div>
                        <span className="font-medium">My Contests</span>
                        <FaChevronRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </NavLink>
                    </li>
                    
                  </>
                )}

                {role === "creator" && (
                  <>
                    <li>
                      <NavLink to="/dashboard/creator" className={linkClass}>
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-white group-hover:text-purple-600 transition-colors">
                          <FaTachometerAlt />
                        </div>
                        <span className="font-medium">Creator Dashboard</span>
                        <FaChevronRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/dashboard/CreateContest" className={linkClass}>
                        <div className="p-2 bg-green-100 text-green-600 rounded-lg group-hover:bg-white group-hover:text-green-600 transition-colors">
                          <FaPlusCircle />
                        </div>
                        <span className="font-medium">Create Contest</span>
                        <FaChevronRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/dashboard/ShowContestTable" className={linkClass}>
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-white group-hover:text-blue-600 transition-colors">
                          <FaTable />
                        </div>
                        <span className="font-medium">Contest Table</span>
                        <FaChevronRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </NavLink>
                    </li>
                  </>
                )}

                {role === "admin" && (
                  <>
                    <li>
                      <NavLink to="/dashboard/admin" className={linkClass}>
                        <div className="p-2 bg-amber-100 text-amber-600 rounded-lg group-hover:bg-white group-hover:text-amber-600 transition-colors">
                          <FaTachometerAlt />
                        </div>
                        <span className="font-medium">Admin Dashboard</span>
                        <FaChevronRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/dashboard/admin/All-Contest" className={linkClass}>
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-white group-hover:text-blue-600 transition-colors">
                          <FaTable />
                        </div>
                        <span className="font-medium">All Contests</span>
                        <FaChevronRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/dashboard/CreateContest" className={linkClass}>
                        <div className="p-2 bg-green-100 text-green-600 rounded-lg group-hover:bg-white group-hover:text-green-600 transition-colors">
                          <FaPlusCircle />
                        </div>
                        <span className="font-medium">Manage Contests</span>
                        <FaChevronRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/dashboard/ShowContestTable" className={linkClass}>
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-white group-hover:text-purple-600 transition-colors">
                          <FaUsers />
                        </div>
                        <span className="font-medium">Contest Table</span>
                        <FaChevronRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </NavLink>
                    </li>
                  </>
                )}
              </ul>
            </div>

           
            <div className="mt-8 px-4">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Quick Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Role Access</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded capitalize ${role === 'admin' ? 'bg-amber-100 text-amber-800' : role === 'creator' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                      {role}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Status</span>
                    <span className="text-xs font-semibold text-green-600">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayout;