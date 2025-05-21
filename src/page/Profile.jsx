"use client"

import { Helmet } from "react-helmet-async"
import useAuth from "../hook/useAuth"
import useRole from "../hook/useRole"

const Profile = () => {
  const { user, loading } = useAuth()
  const [role, isLoading] = useRole()

  if (loading || isLoading)
    return (
      <div className="flex justify-center items-center h-40">
        <div className="loading loading-spinner loading-lg text-blue-500"></div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Helmet>
        <title>Dashboard || Profile</title>
      </Helmet>

      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-600">Manage your account information and settings</p>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          {/* Banner & Profile Picture */}
          <div className="relative">
            {/* Banner - Simple gradient */}
            <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>

            {/* Profile Picture */}
            <div className="absolute left-6 -bottom-12">
              <div className="rounded-full h-24 w-24 border-4 border-white overflow-hidden bg-white">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL || "/placeholder.svg"}
                    alt={user.displayName || "User"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Role Badge */}
            <div className="absolute right-6 bottom-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-blue-600">
                {role}
              </span>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-16 pb-6 px-6">
            <h2 className="text-xl font-bold text-gray-800">{user?.displayName || "User"}</h2>
            <p className="text-gray-500 mb-4">{user?.email}</p>

            <div className="border-t border-gray-100 pt-4 mt-4">
              <div className="text-sm text-gray-500 mb-1">User ID</div>
              <div className="font-mono text-gray-700 text-sm bg-gray-50 p-2 rounded">{user?.uid}</div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-800">Account Information</h3>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-800">
                  {user?.displayName || "Not provided"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-800">
                  {user?.email || "Not provided"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                <div className="border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-800">{role}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Verification</label>
                <div className="border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-800 flex items-center">
                  {user?.emailVerified ? (
                    <>
                      <svg
                        className="w-5 h-5 text-green-500 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      Verified
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 text-yellow-500 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      Not Verified
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Statistics */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-blue-50">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  ></path>
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium text-gray-500">Study Sessions</h4>
                <div className="text-2xl font-bold text-gray-800">0</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-green-50">
                <svg
                  className="w-6 h-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium text-gray-500">Completed Courses</h4>
                <div className="text-2xl font-bold text-gray-800">0</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-purple-50">
                <svg
                  className="w-6 h-6 text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium text-gray-500">Points Earned</h4>
                <div className="text-2xl font-bold text-gray-800">0</div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Action Buttons
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              ></path>
            </svg>
            Update Profile
          </button>

          <button className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              ></path>
            </svg>
            Change Password
          </button>
        </div> */}
      </div>
    </div>
  )
}

export default Profile
