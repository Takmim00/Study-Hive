import { useContext, useState } from "react";
import { FaEye, FaEyeSlash, FaGithub } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {  AuthContext } from "../../provider/AuthProvider";

const Login = () => {
  const { userLogin, googleSignIn, handleGithubLogin } =
    useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    userLogin(email, password)
      .then((res) => {
        const user = res.user;
        const redirectTo = location.state?.from || "/";
        navigate(redirectTo);
        toast.success("Login successful!");
      })
      .catch((err) => {
        if (err.code) {
          toast.error("No account found with this email. Please register.");
        }
      });
      
  };
  const googleLogIngHandler = () => {
    googleSignIn().then((res) => {
      const redirectTo = location.state?.from || "/";
      navigate(redirectTo);
    });
  };
  const githubLogIngHandler = () => {
    handleGithubLogin().then((res) => {
      const redirectTo = location.state?.from || "/";
      navigate(redirectTo);
    });
  };
  return (
    <div>
      <ToastContainer />
      <div className=" card bg-base-100 w-full max-w-lg mx-auto shrink-0 rounded-none p-10 border-2">
        <h2 className="text-4xl font-bold mb-4 text-gray-800 text-center">
          Login
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Type here"
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          {/* Password Input */}
          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <Link
              onClick={() => setShowPassword(!showPassword)}
              className="btn btn-xs absolute right-3 bottom-2"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </Link>
          </div>

          <input
            type="submit"
            value="Sign In"
            className="w-full btn bg-[#D1A054B3] text-white py-2 rounded-md hover:bg-yellow-600"
          />
        </form>

       
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            New here?{" "}
            <Link
              to="/register"
              className="text-yellow-500 font-bold hover:underline"
            >
              Create a New Account
            </Link>
            <a href="#" className="text-yellow-500 hover:underline"></a>
          </p>
        </div>

       
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Or sign in with</p>
          <div className="flex justify-center mt-2 space-x-4">
            <button
              onClick={googleLogIngHandler}
              className="p-2 rounded-full bg-gray-100 text-2xl hover:bg-gray-200"
            >
              <FaGoogle />
            </button>
            <button
              onClick={githubLogIngHandler}
              className="p-2 rounded-full bg-gray-100 text-2xl hover:bg-gray-200"
            >
              <FaGithub />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
