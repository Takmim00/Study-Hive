import { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FaEye, FaEyeSlash, FaGithub } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import bgImage from "../../assets/authentication.png";
import loginImage from "../../assets/loginImage.png";
import { AuthContext } from "../../provider/AuthProvider";

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
      <Helmet>
        <title>Study Hive || Login</title>
      </Helmet>
      
      <div className=" flex justify-center items-center my-6">
        <div
          className="flex flex-col lg:flex-row bg-white shadow-2xl rounded-lg w-4/5 py-6 max-w-4xl"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Left Section - Image */}
          <div className="md:w-1/2  flex items-center justify-center rounded-l-lg">
            <img
              src={loginImage}
              alt="Cafe Illustration"
              className="w-3/4  rounded-lg"
            />
          </div>

          {/* Right Section - Form */}
          <div className="md:w-1/2 p-8">
            <h2 className="text-2xl font-semibold text-center">
              Login your account
            </h2>
            <form onSubmit={handleSubmit} className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="email"
                  className="input input-bordered"
                  required
                />
              </div>
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
              <div className="form-control mt-6">
                <button className="btn bg-blue-400 hover:bg-blue-600 transition text-white font-semibold text-xl rounded-md">
                  Login
                </button>
              </div>
            </form>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                New here?{" "}
                <Link
                  to="/register"
                  className="text-blue-500 font-bold hover:underline"
                >
                  Create a New Account
                </Link>
                <a href="#" className="text-blue-500 hover:underline"></a>
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
      </div>
    </div>
  );
};

export default Login;
