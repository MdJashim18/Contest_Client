import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import Logo from "../../../Components/Logo/Logo";
import useAuth from "../../../Hooks/useAuth";
import useRole from "../../../Hooks/useRole";
import { FaBars, FaTimes, FaUserCircle, FaCrown, FaPaintBrush } from "react-icons/fa";
import { MdDashboard, MdLogout } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi";

const Navbar = () => {
  const { user, LogOut } = useAuth();
  const [role, loading] = useRole();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogOut = async () => {
    try {
      await LogOut();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getDashboardPath = () => {
    switch (role) {
      case "admin":
        return "/dashboard/admin";
      case "creator":
        return "/dashboard/creator";
      default:
        return "/dashboard/user";
    }
  };

  const getRoleBadge = () => {
    switch (role) {
      case "admin":
        return { text: "Admin", icon: <FaCrown className="text-yellow-500" />, color: "badge-warning" };
      case "creator":
        return { text: "Creator", icon: <FaPaintBrush className="text-purple-500" />, color: "badge-secondary" };
      default:
        return { text: "User", icon: <FaUserCircle className="text-blue-500" />, color: "badge-info" };
    }
  };

  const roleBadge = getRoleBadge();
  const dashboardPath = getDashboardPath();

  const mainLinks = [
    { path: "/", label: "Home" },
    { path: "/all-contests", label: "All Contests" },
    { path: "/Contact", label: "Contact" },
    { path: "/About", label: "About" },
    { path: "/FAQ", label: "FAQ" },
  ];

  

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100" 
        : "bg-white border-b border-gray-100"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center space-x-3">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
            
            <NavLink to="/" className="flex items-center space-x-3 group">
             
              <div className="hidden md:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ContestHub
                </h1>
              </div>
            </NavLink>
          </div>

          <div className="hidden lg:flex items-center space-x-1">
            {mainLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
               
                {!loading && (
                  <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100">
                    {roleBadge.icon}
                    <span className="font-medium text-sm text-gray-700">
                      {roleBadge.text}
                    </span>
                  </div>
                )}

                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <div className="relative">
                      <img
                        src={user.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.email}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border-2 border-white shadow"
                      />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                  </div>

                  <ul className="dropdown-content menu p-3 shadow-lg bg-white rounded-xl w-64 mt-2 border border-gray-100">
                    
                    
                    {!loading && (
                      <li>
                        <NavLink
                          to={dashboardPath}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
                        >
                          <MdDashboard className="text-gray-600" />
                          <span>Dashboard</span>
                        </NavLink>
                      </li>
                    )}
                    
                    <div className="divider my-2"></div>
                    
                    <li>
                      <button
                        onClick={handleLogOut}
                        className="flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <MdLogout />
                        <span>Sign Out</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <NavLink
                  to="/register"
                  className="hidden sm:block px-6 py-2.5 font-medium rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Get Started Free
                </NavLink>
                <NavLink
                  to="/login"
                  className="px-6 py-2.5 font-medium rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all duration-300"
                >
                  Sign In
                </NavLink>
              </div>
            )}
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 mt-2 animate-slideDown">
            <div className="flex flex-col space-y-2">
              {mainLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg font-medium ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              
              {user && role === "admin" && adminLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium flex items-center gap-3"
                >
                  {link.icon}
                  {link.label}
                </NavLink>
              ))}

              {user && !loading && (
                <>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <NavLink
                      to={dashboardPath}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      <MdDashboard />
                      Dashboard
                    </NavLink>
                    <NavLink
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      <FaUserCircle />
                      My Profile
                    </NavLink>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;