"use client"

import axios from "axios"
import { useContext, useState } from "react"
import { Helmet } from "react-helmet-async"
import { FaEye, FaEyeSlash, FaGithub } from "react-icons/fa"
import { FaGoogle } from "react-icons/fa6"
import { Link, useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import bgImage from "../../assets/authentication.png"
import signUp from "../../assets/signUp.png"
import { AuthContext } from "../../provider/AuthProvider"

const Register = () => {
  const { setUser, createUser, googleSignIn, handleGithubLogin, updateUserProfile } = useContext(AuthContext)
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)

    const form = new FormData(e.target)
    const name = form.get("name")
    const photoURL = form.get("photo")
    const email = form.get("email")
    const password = form.get("password")
    const role = form.get("role")

    if (!role) {
      toast.error("Please select a role.")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      toast.error("Password must contain at least 6 characters")
      setIsLoading(false)
      return
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
      toast.error("Password must contain at least one lowercase and one uppercase letter.")
      setIsLoading(false)
      return
    }

    createUser(email, password)
      .then((result) => {
        const loggedUser = result.user
        updateUserProfile(name, photoURL)
          .then(() => {
            const userInfo = {
              name: name,
              email: email,
              photo: photoURL,
              role,
            }

            axios
              .post("https://study-hive-server-three.vercel.app/users", userInfo)
              .then((response) => {
                const data = response.data
                if (data.success) {
                  toast.success(data.message)
                  setUser(userInfo)
                  navigate("/")
                } else {
                  toast.error(data.message)
                }
              })
              .catch((error) => {
                toast.error("Failed to save user to the database.")
              })
              .finally(() => {
                setIsLoading(false)
              })
          })
          .catch((error) => {
            const errorMessage = error.message || "An error occurred"
            toast.error(errorMessage)
            setIsLoading(false)
          })
      })
      .catch((error) => {
        toast.error("Registration failed. Please try again.")
        setIsLoading(false)
      })
  }

  const googleLogIngHandler = () => {
    setIsLoading(true)
    googleSignIn()
      .then((res) => {
        const redirectTo = location.state?.from || "/"
        navigate(redirectTo)
      })
      .catch((err) => {
        toast.error("Google registration failed. Please try again.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const githubLogIngHandler = () => {
    setIsLoading(true)
    handleGithubLogin()
      .then((res) => {
        const redirectTo = location.state?.from || "/"
        navigate(redirectTo)
      })
      .catch((err) => {
        toast.error("GitHub registration failed. Please try again.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <div className="  ">
      <Helmet>
        <title>Study Hive || Register</title>
      </Helmet>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      <div className="container mx-auto px-4 py-12">
        

        {/* Main Content */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white border border-gray-200 shadow-lg rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex flex-col md:flex-row">
              {/* Left Section - Form */}
              <div className="md:w-1/2 p-8 md:p-12">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h2>
                  <p className="text-gray-600">Join us to start your learning journey</p>
                  <div className="h-1 w-20 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full mt-2"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="photo" className="block text-gray-700 text-sm font-medium mb-2">
                      Photo URL
                    </label>
                    <input
                      type="url"
                      id="photo"
                      name="photo"
                      placeholder="https://example.com/photo.jpg"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-gray-700 text-sm font-medium mb-2">
                      Select Role
                    </label>
                    <select
                      defaultValue=""
                      id="role"
                      name="role"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      required
                    >
                      <option disabled value="">
                        Choose your role
                      </option>
                      <option value="student">Student</option>
                      <option value="tutor">Tutor</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Create a strong password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Password must be at least 6 characters with uppercase and lowercase letters
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-400 to-cyan-500 text-white py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating account...
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={googleLogIngHandler}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2.5 px-4 rounded-lg transition-colors shadow-sm"
                    >
                      <FaGoogle />
                      <span>Google</span>
                    </button>
                    <button
                      type="button"
                      onClick={githubLogIngHandler}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2.5 px-4 rounded-lg transition-colors shadow-sm"
                    >
                      <FaGithub />
                      <span>GitHub</span>
                    </button>
                  </div>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>

              {/* Right Section - Image */}
              <div className="md:w-1/2 relative bg-teal-50">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                <div className="relative h-full flex flex-col items-center justify-center p-8 z-10">
                  <img
                    src={signUp || "/placeholder.svg"}
                    alt="Study Hive Registration"
                    className="w-3/4 max-w-xs rounded-xl shadow-lg mb-8"
                  />

                  <div className="space-y-4 w-full max-w-xs">
                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-teal-400">
                      <h3 className="font-medium text-gray-800 mb-1">Choose Your Role</h3>
                      <p className="text-sm text-gray-600">
                        Student, Tutor, or Administrator - pick what fits you best
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-teal-400">
                      <h3 className="font-medium text-gray-800 mb-1">Secure Registration</h3>
                      <p className="text-sm text-gray-600">Your data is protected with industry-standard security</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-teal-400">
                      <h3 className="font-medium text-gray-800 mb-1">Instant Access</h3>
                      <p className="text-sm text-gray-600">Start learning immediately after registration</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
