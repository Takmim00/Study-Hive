import axios from "axios";
import { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FaEye, FaEyeSlash, FaGithub } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import bgImage from "../../assets/authentication.png";
import signUp from "../../assets/signUp.png"
import { AuthContext } from "../../provider/AuthProvider";

const Register = () => {
  const {
    setUser,
    createUser,
    googleSignIn,
    handleGithubLogin,
    updateUserProfile,
  } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const name = form.get("name");
    const photoURL = form.get("photo");
    const email = form.get("email");
    const password = form.get("password");
    const role = form.get("role");

    if (!role) {
      toast.error("Please select a role.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must contain at least 6 characters");
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
      toast.error(
        "Password must contain at least one lowercase and one uppercase letter."
      );
      return;
    }

    createUser(email, password).then((result) => {
      const loggedUser = result.user;
      updateUserProfile(name, photoURL)
        .then(() => {
          const userInfo = {
            name: name,
            email: email,
            photo: photoURL,
            role,
          };

          axios
            .post("https://study-hive-server-three.vercel.app/users", userInfo)
            .then((response) => {
              const data = response.data;
              if (data.success) {
                toast.success(data.message);
                setUser(userInfo);
                navigate("/");
              } else {
                toast.error(data.message);
              }
            })
            .catch((error) => {
              toast.error("Failed to save user to the database.");
            });
        })
        .catch((error) => {
          const errorMessage = error.message || "An error occurred";
          toast.error(errorMessage);
        });
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
      <Helmet>
        <title>Study Hive || Register</title>
      </Helmet>
      <ToastContainer />
      
      <div
        className="flex flex-col lg:flex-row bg-white shadow-2xl rounded-lg w-4/5 mx-auto my-6  max-w-4xl"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Left Section - Form */}
        <div className="md:w-1/2 p-8">
          <h2 className="text-2xl font-semibold text-center">
            Register your account
          </h2>
          <form onSubmit={handleSubmit} className="card-body">
            {/* Email Input */}
            <div className="">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Your Name
              </label>
              <input
                type="name"
                id="name"
                name="name"
                placeholder="Type here"
                className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div className="">
              <label
                htmlFor="photo"
                className="block text-sm font-medium text-gray-700"
              >
                Photo URL
              </label>
              <input
                type="text"
                id="photo"
                name="photo"
                placeholder="Type here"
                className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            {/* Role Selection */}
            <div className="">
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Select Role
              </label>
              <select
                defaultValue="default"
                id="role"
                name="role"
                className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option disabled value="default">
                  Choose a role
                </option>
                <option value="student">Student</option>
                <option value="tutor">Tutor</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <div className="">
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
            <div className=" relative">
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
              value="Register"
              className="w-full btn bg-blue-400 text-white py-2 rounded-md hover:bg-blue-600"
            />
          </form>
          <div className=" text-center">
            <p className="text-sm text-gray-600">
              Already registered?{" "}
              <Link
                to="/login"
                className="text-blue-500 font-bold hover:underline"
              >
                Go to log in
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">Or sign up with</p>
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
        {/* Right Section - Image */}
        <div className="md:w-1/2  flex items-center justify-center rounded-l-lg">
          <img
            src={signUp}
            alt="Cafe Illustration"
            className="w-3/4  rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
