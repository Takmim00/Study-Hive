"use client"

import { useContext, useState } from "react"
import { Helmet } from "react-helmet-async"
import { FaEye, FaEyeSlash, FaGithub } from "react-icons/fa"
import { FaGoogle } from "react-icons/fa6"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import bgImage from "../../assets/authentication.png"
import loginImage from "../../assets/loginImage.png"
import { AuthContext } from "../../provider/AuthProvider"

const Login = () => {
  const { userLogin, googleSignIn, handleGithubLogin } = useContext(AuthContext)
  const location = useLocation()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    const form = e.target
    const email = form.email.value
    const password = form.password.value

    userLogin(email, password)
      .then((res) => {
        const user = res.user
        const redirectTo = location.state?.from || "/"
        navigate(redirectTo)
        toast.success("Login successful!")
      })
      .catch((err) => {
        if (err.code) {
          toast.error("No account found with this email. Please register.")
        }
      })
      .finally(() => {
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
        toast.error("Google login failed. Please try again.")
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
        toast.error("GitHub login failed. Please try again.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <div className="  ">
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
      <Helmet>
        <title>Study Hive || Login</title>
      </Helmet>

      <div className="container mx-auto px-4 py-12 flex flex-col items-center">
        

        {/* Main Content */}
        <div className="w-full max-w-5xl">
          <div className="bg-white border border-gray-200 shadow-lg rounded-3xl overflow-hidden shadow-lg">
            <div className="flex flex-col md:flex-row">
              {/* Image Section */}
              <div className="md:w-1/2 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-cyan-600/30 z-10"></div>
                <img src={bgImage || "/placeholder.svg"} alt="Background" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <img
                    src={loginImage || "/placeholder.svg"}
                    alt="Study Hive"
                    className="w-2/3 max-w-xs rounded-2xl shadow-lg"
                  />
                </div>
              </div>

              {/* Form Section */}
              <div className="md:w-1/2 p-8 md:p-12">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-2 text-gray-800">Welcome Back</h2>
                  <div className="h-1 w-20 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-gray-700 text-sm mb-2">Email Address</label>
                    <div className="relative">
                      <input
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-400 text-black"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor="password" className="block text-gray-700 text-sm">
                        Password
                      </label>
                      
                    </div>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="••••••••"
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-400 text-black"
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
                        Signing in...
                      </div>
                    ) : (
                      "Sign in"
                    )}
                  </button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={googleLogIngHandler}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-2.5 px-4 rounded-lg transition-colors"
                    >
                      <FaGoogle />
                      <span>Google</span>
                    </button>
                    <button
                      type="button"
                      onClick={githubLogIngHandler}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-2.5 px-4 rounded-lg transition-colors"
                    >
                      <FaGithub />
                      <span>GitHub</span>
                    </button>
                  </div>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-gray-600">
                    New to Study Hive?{" "}
                    <Link to="/register" className="text-purple-400 hover:text-purple-300 font-medium">
                      Create an account
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  )
}

export default Login
