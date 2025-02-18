import { useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { FaBars, FaBook, FaList, FaUsers } from "react-icons/fa6";
import { GrLogout } from "react-icons/gr";
import { ImProfile } from "react-icons/im";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdSpaceDashboard } from "react-icons/md";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import logo from "../assets/studyHive.png";
import useAuth from "../hook/useAuth";
import useRole from "../hook/useRole";

const Dashboard = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();
  const [role, isLoading] = useRole();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  if (isLoading) {
    return <span className="loading loading-dots loading-lg"></span>;
  }
  const handleLogOut = () => {
    logOut();
    navigate("/")
      .then(() => {})
      .catch((err) => console.error(err));
  };
  return (
    <div className="flex flex-col lg:flex-row">
      <button
        className="lg:hidden p-4 text-gray-700"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <FaBars className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed lg:static top-0 left-0 z-50 h-full w-64 min-h-screen bg-white shadow-lg border-r border-stone-300 flex flex-col transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 lg:translate-x-0`}
      >
        <div>
          <Link
            to="/dashboard"
            className="flex flex-1 gap-2 items-center ml-4 mt-4"
          >
            <p className="text-2xl font-semibold text-gray-800">StudyHive</p>
            <img src={logo} alt="" className="h-8" />
          </Link>
        </div>

        <ul className="menu p-4 space-y-2">
          <hr className="my-4 border-t border-stone-400" />
          <p className="text-end text-xl font-semibold">
            You Are<span className="text-blue-400"> {role}</span>
          </p>
          {/* Admin Routes */}
          {role === "admin" && (
            <>
              <li>
                <NavLink
                  to="/dashboard/adminDashboard"
                  className={({ isActive }) =>
                    isActive ? "text-blue-500" : "text-gray-700"
                  }
                >
                  <MdSpaceDashboard />
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/viewUsers"
                  className={({ isActive }) =>
                    isActive ? "text-blue-500" : "text-gray-700"
                  }
                >
                  <FaUsers />
                  View All Users
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/viewAllSessions"
                  className={({ isActive }) =>
                    isActive ? "text-blue-500" : "text-gray-700"
                  }
                >
                  <FaList />
                  View All Study Sessions
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/viewAllMaterials"
                  className={({ isActive }) =>
                    isActive ? "text-blue-500" : "text-gray-700"
                  }
                >
                  <FaBook />
                  View All Materials
                </NavLink>
              </li>
            </>
          )}
          {/* Tutor Routes */}
          {role === "tutor" && (
            <>
              <li>
                <NavLink
                  to="/dashboard/createStudy"
                  className={({ isActive }) =>
                    isActive ? "text-blue-500" : "text-gray-700"
                  }
                >
                  <FaBook />
                  Create Study Session
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/viewSession"
                  className={({ isActive }) =>
                    isActive ? "text-blue-500" : "text-gray-700"
                  }
                >
                  <FaList />
                  View My Study Sessions
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/uploadMaterial"
                  className={({ isActive }) =>
                    isActive ? "text-blue-500" : "text-gray-700"
                  }
                >
                  <FaBook />
                  Upload Materials
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/viewMaterials"
                  className={({ isActive }) =>
                    isActive ? "text-blue-500" : "text-gray-700"
                  }
                >
                  <FaList />
                  View All Materials
                </NavLink>
              </li>
            </>
          )}
          {/* Student Routes */}
          {role === "student" && (
            <>
              <li>
                <NavLink
                  to="/dashboard/viewBooked"
                  className={({ isActive }) =>
                    isActive ? "text-blue-500" : "text-gray-700"
                  }
                >
                  <FaBook />
                  View Booked Session
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/createNote"
                  className={({ isActive }) =>
                    isActive ? "text-blue-500" : "text-gray-700"
                  }
                >
                  <FaList />
                  Create Note
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/manageNotes"
                  className={({ isActive }) =>
                    isActive ? "text-blue-500" : "text-gray-700"
                  }
                >
                  <FaList />
                  Manage Personal Notes
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/studyMetarials"
                  className={({ isActive }) =>
                    isActive ? "text-blue-500" : "text-gray-700"
                  }
                >
                  <FaBook />
                  View All Study Materials
                </NavLink>
              </li>
            </>
          )}
          <hr className="my-4 border-t border-stone-400" />
          {role === "tutor" && (
            <>
              <li>
                <NavLink
                  to="/dashboard/rejectDashboard"
                  className={({ isActive }) =>
                    isActive ? "text-blue-500" : "text-gray-700"
                  }
                >
                  <LuLayoutDashboard /> Dashboard
                </NavLink>
              </li>
            </>
          )}
          <li>
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                isActive ? "text-blue-500" : "text-gray-700"
              }
            >
              <ImProfile /> Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-blue-500" : "text-gray-700"
              }
            >
              <AiFillHome /> Home
            </NavLink>
          </li>
          <li>
            <button
              onClick={handleLogOut}
              className="flex w-full items-center px-4 py-2 text-gray-600 hover:bg-gray-300 hover:text-gray-700 transition-colors duration-300 transform"
            >
              <GrLogout className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div
        className="flex-1 p-4  overflow-auto"
        style={{ height: "100vh", overflowY: "auto" }}
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
