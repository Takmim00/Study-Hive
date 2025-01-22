import { useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { FaBars, FaBook, FaList, FaUsers } from "react-icons/fa6";
import { GrLogout } from "react-icons/gr";
import { ImProfile } from "react-icons/im";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hook/useAuth";
import useRole from "../hook/useRole";

const Dashboard = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate()
  const [role, isLoading] = useRole();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  if (isLoading) {
    return <span className="loading loading-dots loading-lg"></span>;
  }
  const handleLogOut = () => {
    logOut()
    navigate('/')
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
        <div className="p-4 ">
          <h1 className="text-xl font-bold">Study Hive</h1>
        </div>
        <ul className="menu p-4 space-y-2">
          {/* Admin Routes */}
          {role === "admin" && (
            <>
              <li>
                <NavLink to="/dashboard/viewUsers">
                  <FaUsers />
                  View All Users
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/viewAllSessions">
                  <FaList />
                  View All Study Sessions
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/viewAllMaterials">
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
                <NavLink to="/dashboard/createStudy">
                  <FaBook />
                  Create Study Session
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/viewSession">
                  <FaList />
                  View My Study Sessions
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/uploadMaterial">
                  <FaBook />
                  Upload Materials
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/viewMaterials">
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
                <NavLink to="/dashboard/viewBooked">
                  <FaBook />
                  View Booked Session
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/createNote">
                  <FaList />
                  Create Note
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/manageNotes">
                  <FaList />
                  Manage Personal Notes
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/studyMetarials">
                  <FaBook />
                  View All Study Materials
                </NavLink>
              </li>
            </>
          )}
          <hr className="my-4 border-t border-stone-400" />

          <li>
            <NavLink to="/dashboard/profile">
              <ImProfile /> Profile
            </NavLink>
          </li>
          <li>
            <NavLink to="/">
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
      <div className="flex-1 p-4">
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
