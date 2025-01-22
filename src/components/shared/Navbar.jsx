import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../provider/AuthProvider";
import logo from '../../assets/studyHive.png'

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);

  const handleLogOut = () => {
    logOut()
      .then(() => {})
      .catch((err) => console.error(err));
  };

  return (
    <div className="navbar  shadow-sm px-6 py-2">
      <div className="flex-1">
        <Link to="/" className="flex gap-2 items-center">
          <img src={logo} alt="" className="h-8" />
          <p className="text-2xl font-semibold text-gray-800">StudyHive</p>
        </Link>
      </div>

      <div className="dropdown dropdown-left md:hidden">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content mt-3 z-[1] w-52 bg-base-100 rounded-box shadow p-2"
        >
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          {user ? (
            <>
              <li>
                <NavLink to="/dashboard/profile">Dashboard</NavLink>
              </li>
              <li>
                <button onClick={handleLogOut} className="btn transition ">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/login"
                  className="btn bg-blue-500 hover:bg-blue-700 transition text-white"
                >
                  Log-in
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/register"
                  className="btn bg-green-500 hover:bg-green-700 transition text-white"
                >
                  Sign-up
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className="hidden md:flex md:items-center">
        <ul className="menu menu-horizontal items-center px-1 space-x-4">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          {user ? (
            <>
              <li>
                <NavLink to="/dashboard/profile">Dashboard</NavLink>
              </li>

              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div
                    title={user?.displayName || "Profile"}
                    className="w-10 rounded-full"
                  >
                    <img
                      referrerPolicy="no-referrer"
                      alt="User Profile"
                      src={user?.photoURL}
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <button onClick={handleLogOut} className="btn  transition ">
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/login"
                  className="btn bg-blue-500 hover:bg-blue-700 transition text-white"
                >
                  Log-in
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/register"
                  className="btn bg-green-500 hover:bg-green-700 transition text-white"
                >
                  Sign-up
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
