import { useContext, useEffect, useState } from "react";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/studyHive.png";
import useRole from "../../hook/useRole";
import { AuthContext } from "../../provider/AuthProvider";


const Navbar = () => {
  const { user, logOut, loading } = useContext(AuthContext);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [role, isLoading] = useRole();


  useEffect(() => {
    document.body.className = theme === "dark" ? "dark-theme" : "light-theme";
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute(
      "data-theme",
      theme === "dark" ? "dark" : "light"
    );
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const handleLogOut = () => {
    logOut()
      .then(() => {})
      .catch((err) => console.error(err));
  };

  // Active link style
  const activeStyle =
    "bg-primary/10 text-primary font-medium border-b-2 border-primary";
  const normalStyle = "hover:bg-base-200 transition-all duration-300";

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-16">
  //       <div className="loading loading-spinner loading-lg text-blue-500"></div>
  //     </div>
  //   );
  // }
  return (
    <div className="sticky top-0 z-50 backdrop-blur-md bg-base-100/80 dark:bg-base-300/80 border-b border-base-200 dark:border-base-700">
      <div className="navbar md:w-11/12 mx-auto ">
        {/* Logo Section */}
        <div className="navbar-start">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="avatar">
              <div className="md:w-10 md:h-10 w-8 h-8 rounded-full ring ring-primary ring-offset-base-100 md:ring-offset-2 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                <img
                  src={logo || "/placeholder.svg"}
                  alt="StudyHive"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="md:text-xl text-sm font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                StudyHive
              </span>
              <span className="text-xs -mt-1 text-base-content/70 hidden sm:inline-block">
                Learn Together, Grow Together
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-center hidden md:flex">
          <ul className="menu menu-horizontal px-1 gap-1">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2 ${isActive ? activeStyle : normalStyle}`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/course"
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2 ${isActive ? activeStyle : normalStyle}`
                }
              >
                Courses
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/tutor"
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2 ${isActive ? activeStyle : normalStyle}`
                }
              >
                Tutor
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/support"
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2 ${isActive ? activeStyle : normalStyle}`
                }
              >
                Support
              </NavLink>
            </li>
          </ul>
        </div>

        {/* User Actions */}
        <div className="navbar-end gap-2">
          {/* Theme Toggle */}
          <label className="swap swap-rotate btn btn-circle btn-ghost">
            <input
              type="checkbox"
              onChange={toggleTheme}
              checked={theme === "dark"}
            />
            <MdOutlineLightMode className="swap-on h-5 w-5 text-yellow-500" />
            <MdDarkMode className="swap-off h-5 w-5 text-slate-700" />
          </label>

          {/* User Profile or Login */}
          {user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar online"
              >
                <div className="md:w-10 w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src={
                      user?.photoURL ||
                      "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                    }
                    alt={user?.displayName || "User"}
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 dark:bg-base-300 rounded-box w-52 mt-2 border border-base-200 dark:border-base-700"
              >
                <li className="p-2 text-sm font-medium border-b border-base-200 dark:border-base-700">
                  <div className="flex flex-col">
                    <span className="font-bold">
                      {user?.displayName || "User"}
                    </span>
                    <span className="text-xs opacity-70 truncate">
                      {user?.email}
                    </span>
                  </div>
                </li>
                <li>
                  {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                      <div className="loading loading-spinner loading-lg text-blue-500"></div>
                    </div>
                  ) : (
                    <NavLink
                      to={
                        role === "admin"
                          ? "/dashboard/adminDashboard"
                          : role === "tutor"
                          ? "/dashboard/tutorDashboard"
                          : "/dashboard/studentDashboard"
                      }
                      className="flex gap-2 mt-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                        />
                      </svg>
                      Dashboard
                    </NavLink>
                  )}
                </li>
                <li>
                  <button
                    onClick={handleLogOut}
                    className="flex gap-2 text-error hover:bg-error/10"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                      />
                    </svg>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm md:btn-md">
              <span>Log in</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                />
              </svg>
            </Link>
          )}

          {/* Mobile Menu */}
          <div className="dropdown dropdown-end md:hidden">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
              className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 dark:bg-base-300 rounded-box w-52 mt-2 border border-base-200 dark:border-base-700"
            >
              <li>
                <NavLink to="/" className="rounded-lg">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/course" className="rounded-lg">
                  Courses
                </NavLink>
              </li>
              <li>
                <NavLink to="/tutor" className="rounded-lg">
                  Tutor
                </NavLink>
              </li>
              <li>
                <NavLink to="/support" className="rounded-lg">
                  Support
                </NavLink>
              </li>
              {user && (
                <li>
                  {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                      <div className="loading loading-spinner loading-lg text-blue-500"></div>
                    </div>
                  ) : (
                    <NavLink
                      to={
                        role === "admin"
                          ? "/dashboard/adminDashboard"
                          : role === "tutor"
                          ? "/dashboard/tutorDashboard"
                          : "/dashboard/studentDashboard"
                      }
                      className="rounded-lg"
                    >
                      Dashboard
                    </NavLink>
                  )}
                </li>
              )}
              {user ? (
                <li>
                  <button
                    onClick={handleLogOut}
                    className="text-error hover:bg-error/10 rounded-lg"
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <li>
                  <Link
                    to="/login"
                    className="bg-primary text-primary-content rounded-lg"
                  >
                    Log in
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
