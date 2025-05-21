import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { useNavigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Swal from "sweetalert2"
import useAuth from "../../hook/useAuth"
import UpdateMetarialModal from "../../modal/UpdateMetarialModal"

const ViewMaterials = () => {
  const { user, loading } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setShowSortOption] = useState("newest")
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [activeTab, setActiveTab] = useState("materials")
  const navigate = useNavigate()

  // Fetch materials data
  const {
    data: materials = [],
    refetch: refetchMaterials,
    isLoading: materialsLoading,
  } = useQuery({
    queryKey: ["materials", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const { data } = await axios.get(`https://study-hive-server-three.vercel.app/veiwMetarial?email=${user?.email}`)
      return data
    },
  })

  // Fetch sessions data
  const {
    data: sessions = [],
    refetch: refetchSessions,
    isLoading: sessionsLoading,
  } = useQuery({
    queryKey: ["sessions", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const { data } = await axios.get(`https://study-hive-server-three.vercel.app/veiwSession/${user?.email}`)
      return data
    },
  })

  // Stats calculations
  const totalMaterials = materials.length
  const totalSessions = sessions.length
  const approvedSessions = sessions.filter((session) => session.status === "Approved").length

  // Filter and sort materials
  const filteredMaterials = materials.filter((material) =>
    material.sessionTitle?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedMaterials = [...filteredMaterials].sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    } else if (sortOption === "oldest") {
      return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
    } else if (sortOption === "alphabetical") {
      return a.sessionTitle?.localeCompare(b.sessionTitle)
    }
    return 0
  })

  // Filter and sort sessions
  const filteredSessions = sessions.filter((session) =>
    session.sessionTitle?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedSessions = [...filteredSessions].sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    } else if (sortOption === "oldest") {
      return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
    } else if (sortOption === "alphabetical") {
      return a.sessionTitle?.localeCompare(b.sessionTitle)
    }
    return 0
  })

  // Handle material deletion
  const handleDeleteMaterial = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover this material!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://study-hive-server-three.vercel.app/veiwMetarial/${id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.deletedCount > 0) {
              Swal.fire({
                title: "Deleted!",
                text: "Your material has been deleted successfully.",
                icon: "success",
              })
              refetchMaterials()
            }
          })
      }
    })
  }

  // Handle session deletion
  const handleDeleteSession = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover this session!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://study-hive-server-three.vercel.app/tutors/${id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.deletedCount > 0) {
              Swal.fire({
                title: "Deleted!",
                text: "Your session has been deleted successfully.",
                icon: "success",
              })
              refetchSessions()
            }
          })
      }
    })
  }

  // Modal handlers
  const handleModalOpen = (material) => {
    setSelectedMaterial(material)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setSelectedMaterial(null)
    setIsModalOpen(false)
  }

  const handleSubmit = () => {
    refetchMaterials()
    setIsModalOpen(false)
  }

  // Navigation handler
  const handleUpdateSession = (id) => {
    navigate(`updateMetarials/${id}`)
  }

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "No date"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Loading state
  if (materialsLoading && sessionsLoading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="loading loading-spinner loading-lg text-blue-500"></div>
          <p className="text-gray-500">Loading your materials and sessions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-12">
      <Helmet>
        <title>Dashboard | View Materials</title>
      </Helmet>
      <ToastContainer />

      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center">
          Your <span className="text-blue-500">Learning</span> Resources
        </h1>
        <p className="text-gray-600 text-center mt-2 max-w-2xl mx-auto">
          Manage your study materials and sessions. Create, update, or remove resources to keep your learning content
          organized and up-to-date.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 px-4">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 transition-all hover:shadow-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm">Total Materials</h2>
              <p className="text-2xl font-bold text-gray-800">{totalMaterials}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 transition-all hover:shadow-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm">Total Sessions</h2>
              <p className="text-2xl font-bold text-gray-800">{totalSessions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 transition-all hover:shadow-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm">Approved Sessions</h2>
              <p className="text-2xl font-bold text-gray-800">{approvedSessions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`px-5 py-2.5 text-sm font-medium rounded-l-lg ${
              activeTab === "materials" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            } transition-colors duration-200`}
            onClick={() => setActiveTab("materials")}
          >
            Materials
          </button>
          <button
            type="button"
            className={`px-5 py-2.5 text-sm font-medium rounded-r-lg ${
              activeTab === "sessions" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            } transition-colors duration-200`}
            onClick={() => setActiveTab("sessions")}
          >
            Sessions
          </button>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 px-4 gap-4">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            <span>Sort by: {sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}</span>
            <svg
              className={`h-5 w-5 transition-transform duration-200 ${showSortDropdown ? "transform rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showSortDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowSortOption("newest")
                    setShowSortDropdown(false)
                  }}
                  className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${
                    sortOption === "newest" ? "bg-blue-50 text-blue-600" : ""
                  }`}
                >
                  Newest
                </button>
                <button
                  onClick={() => {
                    setShowSortOption("oldest")
                    setShowSortDropdown(false)
                  }}
                  className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${
                    sortOption === "oldest" ? "bg-blue-50 text-blue-600" : ""
                  }`}
                >
                  Oldest
                </button>
                <button
                  onClick={() => {
                    setShowSortOption("alphabetical")
                    setShowSortDropdown(false)
                  }}
                  className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${
                    sortOption === "alphabetical" ? "bg-blue-50 text-blue-600" : ""
                  }`}
                >
                  Alphabetical
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Materials Section */}
      {activeTab === "materials" && (
        <div className="px-4">
          {sortedMaterials.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl border border-gray-200">
              <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No materials found</h3>
              <p className="text-gray-500 text-center max-w-md">
                {searchTerm
                  ? `No materials matching "${searchTerm}" were found. Try a different search term.`
                  : "You haven't uploaded any materials yet. Start by creating a new material."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedMaterials.map((material, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 transition-all hover:shadow-lg hover:border-blue-200 group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={material.materialImage || "/placeholder.svg?height=200&width=400"}
                      alt={material.sessionTitle || "Material"}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 p-3">
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-500 text-white rounded-full">
                        Material
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                      {material.sessionTitle || "Untitled Material"}
                    </h3>

                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {formatDate(material.createdAt)}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <button
                        onClick={() => handleModalOpen(material)}
                        className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center"
                      >
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Update
                      </button>
                      <button
                        onClick={() => handleDeleteMaterial(material._id)}
                        className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 flex items-center justify-center"
                      >
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </button>
                    </div>

                    {material.googleDriveLink && (
                      <a
                        href={material.googleDriveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 text-sm text-gray-500 hover:text-blue-600 flex items-center transition-colors duration-200"
                      >
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        View on Google Drive
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sessions Section */}
      {activeTab === "sessions" && (
        <div className="px-4">
          {sortedSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl border border-gray-200">
              <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No sessions found</h3>
              <p className="text-gray-500 text-center max-w-md">
                {searchTerm
                  ? `No sessions matching "${searchTerm}" were found. Try a different search term.`
                  : "You haven't created any sessions yet. Start by creating a new session."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedSessions.map((session, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 transition-all hover:shadow-lg hover:border-blue-200 group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={session.sessionImage || "/placeholder.svg?height=200&width=400"}
                      alt={session.sessionTitle || "Session"}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 p-3">
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-green-500 text-white rounded-full">
                        Session
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          session.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : session.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full mr-1 ${
                            session.status === "Approved"
                              ? "bg-green-500"
                              : session.status === "Pending"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        ></span>
                        {session.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                      {session.sessionTitle || "Untitled Session"}
                    </h3>

                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {formatDate(session.createdAt)}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <button
                        onClick={() => handleUpdateSession(session._id)}
                        className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center"
                      >
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Update
                      </button>
                      <button
                        onClick={() => handleDeleteSession(session._id)}
                        className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 flex items-center justify-center"
                      >
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Update Material Modal */}
      <UpdateMetarialModal
        isOpen={isModalOpen}
        tutor={selectedMaterial}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default ViewMaterials
