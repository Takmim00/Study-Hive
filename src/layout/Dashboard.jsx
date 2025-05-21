import { useEffect, useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { FaBars, FaBook, FaList, FaUsers } from "react-icons/fa6";
import { GrLogout } from "react-icons/gr";
import { ImProfile } from "react-icons/im";
import {
  MdDarkMode,
  MdOutlineLightMode,
  MdSpaceDashboard,
} from "react-icons/md";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import logo from "../assets/studyHive.png";
import useAuth from "../hook/useAuth";
import useRole from "../hook/useRole";

const Dashboard = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();
  const [role, isLoading] = useRole();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark-theme" : "light-theme";
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="loading loading-spinner loading-lg text-blue-500"></div>
      </div>
    );
  }

  const handleLogOut = () => {
    logOut();
    navigate("/")
      .then(() => {})
      .catch((err) => console.error(err));
  };

  // Group navigation items by section
  const navSections = {
    admin: [
      {
        to: "/dashboard/adminDashboard",
        icon: <MdSpaceDashboard />,
        label: "Dashboard",
      },
      {
        to: "/dashboard/viewUsers",
        icon: <FaUsers />,
        label: "View All Users",
      },
      {
        to: "/dashboard/viewAllSessions",
        icon: <FaList />,
        label: "View All Study Sessions",
      },
      {
        to: "/dashboard/viewAllMaterials",
        icon: <FaBook />,
        label: "View All Materials",
      },
    ],
    tutor: [
      {
        to: "/dashboard/tutorDashboard",
        icon: <MdSpaceDashboard />,
        label: "Dashboard",
      },
      {
        to: "/dashboard/createStudy",
        icon: <FaBook />,
        label: "Create Study Session",
      },
      {
        to: "/dashboard/viewSession",
        icon: <FaList />,
        label: "View My Study Sessions",
      },
      {
        to: "/dashboard/uploadMaterial",
        icon: <FaBook />,
        label: "Upload Materials",
      },
      {
        to: "/dashboard/viewMaterials",
        icon: <FaList />,
        label: "View All Materials",
      },
    ],
    student: [
      {
        to: "/dashboard/studentDashboard",
        icon: <MdSpaceDashboard />,
        label: "Dashboard",
      },
      {
        to: "/dashboard/viewBooked",
        icon: <FaBook />,
        label: "View Booked Session",
      },
      { to: "/dashboard/createNote", icon: <FaList />, label: "Create Note" },
      {
        to: "/dashboard/manageNotes",
        icon: <FaList />,
        label: "Manage Personal Notes",
      },
      {
        to: "/dashboard/studyMetarials",
        icon: <FaBook />,
        label: "View All Study Materials",
      },
    ],
    common: [
      { to: "/dashboard/profile", icon: <ImProfile />, label: "Profile" },
      { to: "/", icon: <AiFillHome />, label: "Home" },
    ],
  };

  return (
    <div className="flex flex-col lg:flex-row overflow-x-hidden">
      <button
        className="lg:hidden p-4 text-gray-700 fixed top-4 right-4 z-50 bg-white rounded-full shadow-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <FaBars className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed lg:static top-0 left-0 z-50  w-72 max-w-[18rem]  flex flex-col transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 lg:translate-x-0 ${
          theme === "dark"
            ? "bg-gradient-to-b from-gray-800 to-gray-900 text-white"
            : "bg-gradient-to-b from-white to-gray-50 text-gray-800 border-r border-gray-200"
        }`}
      >
        {/* Logo and Theme Toggle */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-500 opacity-10 rounded-br-[100px]"></div>
          <div className="relative p-5 flex flex-col">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img
                src={logo || "/placeholder.svg"}
                alt="StudyHive Logo"
                className="h-10"
              />
              <div>
                <p className="text-xl font-bold">StudyHive</p>
                <div className="h-1 w-12 bg-blue-500 rounded-full"></div>
              </div>
            </Link>

            <div className="flex items-center justify-between mt-2">
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  theme === "dark"
                    ? "bg-gray-700 text-blue-400"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                {role?.charAt(0)?.toUpperCase() + role?.slice(1)} Account
              </div>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-colors ${
                  theme === "dark"
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {theme === "light" ? (
                  <MdDarkMode className="w-5 h-5" />
                ) : (
                  <MdOutlineLightMode className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          {/* Role-specific navigation */}
          <div className="mb-6">
            <div
              className={`px-4 py-2 mb-2 text-xs font-semibold uppercase tracking-wider ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Main Navigation
            </div>
            <ul className="space-y-1">
              {navSections[role]?.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => `
                      flex items-center px-4 py-1.5 rounded-lg transition-all duration-200
                      ${
                        isActive
                          ? theme === "dark"
                            ? "bg-gray-700 text-blue-400"
                            : "bg-blue-50 text-blue-600"
                          : theme === "dark"
                          ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }
                    `}
                  >
                    <span className="flex items-center justify-center w-8 h-8">
                      {item.icon}
                    </span>
                    <span className="ml-3">{item.label}</span>
                    {item.to.includes("Dashboard") && (
                      <span
                        className={`ml-auto px-1.5 py-0.5 text-xs rounded-full ${
                          theme === "dark" ? "bg-gray-600" : "bg-blue-100"
                        }`}
                      >
                        Home
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Common navigation */}
          <div className="mb-6">
            <div
              className={`px-4 py-2 mb-2 text-xs font-semibold uppercase tracking-wider ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              General
            </div>
            <ul className="space-y-1">
              {navSections.common.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => `
                      flex items-center px-4 py-1.5 rounded-lg transition-all duration-200
                      ${
                        isActive
                          ? theme === "dark"
                            ? "bg-gray-700 text-blue-400"
                            : "bg-blue-50 text-blue-600"
                          : theme === "dark"
                          ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }
                    `}
                  >
                    <span className="flex items-center justify-center w-8 h-8">
                      {item.icon}
                    </span>
                    <span className="ml-3">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* User section and logout */}
        <div
          className={`p-4 mt-auto ${
            theme === "dark"
              ? "bg-gray-800"
              : "bg-white border-t border-gray-200"
          }`}
        >
          <button
            onClick={handleLogOut}
            className={`flex items-center w-full px-4 py-2.5 rounded-lg transition-colors ${
              theme === "dark"
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className="flex items-center justify-center w-8 h-8">
              <GrLogout
                className={`w-5 h-5 ${theme === "dark" ? "filter invert" : ""}`}
              />
            </span>
            <span className="ml-3 font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 p-4 overflow-y-auto overflow-x-hidden w-full ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
        style={{ height: "100vh" }}
      >
        <Outlet />
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Dashboard;
