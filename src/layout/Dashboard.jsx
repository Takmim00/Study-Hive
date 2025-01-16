import { AiFillHome } from "react-icons/ai";
import { FaBook, FaList, FaUsers } from "react-icons/fa6";
import { GrLogout } from "react-icons/gr";
import { NavLink, Outlet } from "react-router-dom";
import useAuth from "../hook/useAuth";
import useRole from "../hook/useRole";

const Dashboard = () => {
  const { logOut } = useAuth();
  const [role, isLoading] = useRole();

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 min-h-screen border-r border-stone-300 flex flex-col">
        <div className="p-4">
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
                <NavLink to="/dashboard/viewSessions">
                  <FaList />
                  View All Study Sessions
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/viewMaterials">
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
                <NavLink to="/dashboard/viewBookedSession">
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
                <NavLink to="/dashboard/viewMaterials">
                  <FaBook />
                  View All Study Materials
                </NavLink>
              </li>
            </>
          )}
          <hr className="my-4 border-t border-stone-400" />
          <li>
            <NavLink to="/">
              <AiFillHome /> Home
            </NavLink>
          </li>
          <li>
            <button
              onClick={logOut}
              className="flex w-full items-center px-4 py-2  text-gray-600 hover:bg-gray-300   hover:text-gray-700 transition-colors duration-300 transform"
            >
              <GrLogout className="w-5 h-5" />

              <span className="font-medium">Logout</span>
            </button>
          </li>
        </ul>
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
