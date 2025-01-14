import { AiFillHome } from "react-icons/ai";
import { FaBook, FaList, FaUsers } from "react-icons/fa6";
import { NavLink, Outlet } from "react-router-dom";

const Dashboard = () => {
  const role = ("userRole"); 

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
                <NavLink
                  to="/dashboard/viewUsers"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#A66E3A] p-2 rounded"
                      : "hover:bg-[#A66E3A] p-2 rounded"
                  }
                >
                  <FaUsers />
                  View All Users
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/viewSessions"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#A66E3A] p-2 rounded"
                      : "hover:bg-[#A66E3A] p-2 rounded"
                  }
                >
                  <FaList />
                  View All Study Sessions
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/viewMaterials"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#A66E3A] p-2 rounded"
                      : "hover:bg-[#A66E3A] p-2 rounded"
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
                  to="/dashboard/createSession"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#A66E3A] p-2 rounded"
                      : "hover:bg-[#A66E3A] p-2 rounded"
                  }
                >
                  <FaBook />
                  Create Study Session
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/viewTutorSessions"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#A66E3A] p-2 rounded"
                      : "hover:bg-[#A66E3A] p-2 rounded"
                  }
                >
                  <FaList />
                  View My Study Sessions
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/uploadMaterials"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#A66E3A] p-2 rounded"
                      : "hover:bg-[#A66E3A] p-2 rounded"
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
                    isActive
                      ? "bg-[#A66E3A] p-2 rounded"
                      : "hover:bg-[#A66E3A] p-2 rounded"
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
                  to="/dashboard/viewBookedSession"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#A66E3A] p-2 rounded"
                      : "hover:bg-[#A66E3A] p-2 rounded"
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
                    isActive
                      ? "bg-[#A66E3A] p-2 rounded"
                      : "hover:bg-[#A66E3A] p-2 rounded"
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
                    isActive
                      ? "bg-[#A66E3A] p-2 rounded"
                      : "hover:bg-[#A66E3A] p-2 rounded"
                  }
                >
                  <FaList />
                  Manage Personal Notes
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/viewMaterials"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#A66E3A] p-2 rounded"
                      : "hover:bg-[#A66E3A] p-2 rounded"
                  }
                >
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
        </ul>
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
