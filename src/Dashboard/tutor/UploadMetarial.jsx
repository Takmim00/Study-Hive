"use client"

import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useState, useEffect } from "react"
import { Helmet } from "react-helmet-async"
import { FiSearch, FiUpload, FiX, FiFilter, FiClock, FiCalendar, FiBook, FiCheckCircle, FiAlertCircle } from "react-icons/fi"
import useAuth from "../../hook/useAuth"
import UploadMetarialModal from "../../modal/UploadMetarialModal"

const UploadMetarial = () => {
  const { user, loading } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTutor, setSelectedTutor] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [showSortOptions, setShowSortOptions] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const { data: tutor = [], isLoading, refetch } = useQuery({
    queryKey: ["tutor", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const { data } = await axios.get(
        `https://study-hive-server-three.vercel.app/veiwSession/${user?.email}`
      )
      return data
    },
  })

  const handleModalOpen = (tutor) => {
    setSelectedTutor(tutor)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setSelectedTutor(null)
    setIsModalOpen(false)
  }

  const handleSubmit = () => {
    refetch()
    setIsModalOpen(false)
  }

  // Filter tutors based on search term and approved status
  const filteredTutors = tutor
    .filter((t) => t.status === "Approved")
    .filter((t) => 
      t.sessionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.category && t.category.toLowerCase().includes(searchTerm.toLowerCase()))
    )

  // Sort tutors based on selected sort option
  const sortedTutors = [...filteredTutors].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    } else if (sortBy === "oldest") {
      return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
    } else if (sortBy === "alphabetical") {
      return a.sessionTitle.localeCompare(b.sessionTitle)
    }
    return 0
  })

  // Close sort options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSortOptions && !event.target.closest(".sort-container")) {
        setShowSortOptions(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showSortOptions])

  // Stats for the dashboard
  const approvedSessions = tutor.filter(t => t.status === "Approved").length
  const pendingSessions = tutor.filter(t => t.status === "Pending").length
  const totalMaterials = tutor.reduce((acc, t) => acc + (t.materials?.length || 0), 0)

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Helmet>
        <title>Dashboard | Upload Material</title>
      </Helmet>
      
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Upload Your <span className="text-blue-600">Materials</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-center">
          Share valuable resources with your students by uploading materials to your approved study sessions.
          Enhance learning with documents, presentations, and more.
        </p>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-100 transition-all hover:shadow-md">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FiCheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Approved Sessions</h3>
                <p className="text-2xl font-bold text-gray-800">{approvedSessions}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100 transition-all hover:shadow-md">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <FiBook className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Materials Uploaded</h3>
                <p className="text-2xl font-bold text-gray-800">{totalMaterials}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-yellow-100 transition-all hover:shadow-md">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <FiClock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Pending Sessions</h3>
                <p className="text-2xl font-bold text-gray-800">{pendingSessions}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className={`relative flex-grow max-w-md transition-all ${isSearchFocused ? 'ring-2 ring-blue-300 rounded-lg' : ''}`}>
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX />
              </button>
            )}
          </div>
          
          <div className="relative sort-container">
            <button
              onClick={() => setShowSortOptions(!showSortOptions)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FiFilter className="text-gray-500" />
              <span>Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}</span>
            </button>
            
            {showSortOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 animate-fadeIn">
                <button
                  onClick={() => {
                    setSortBy("newest")
                    setShowSortOptions(false)
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${sortBy === "newest" ? "bg-blue-50 text-blue-600" : ""}`}
                >
                  Newest First
                </button>
                <button
                  onClick={() => {
                    setSortBy("oldest")
                    setShowSortOptions(false)
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${sortBy === "oldest" ? "bg-blue-50 text-blue-600" : ""}`}
                >
                  Oldest First
                </button>
                <button
                  onClick={() => {
                    setSortBy("alphabetical")
                    setShowSortOptions(false)
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${sortBy === "alphabetical" ? "bg-blue-50 text-blue-600" : ""}`}
                >
                  Alphabetical
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-5">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : sortedTutors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTutors.map((tutor, i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-blue-200 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={tutor.sessionImage || "/placeholder.svg?height=192&width=384"}
                    alt={tutor.sessionTitle}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/0 to-black/60"></div>
                  <div className="absolute bottom-0 left-0 p-4 w-full">
                    <div className="flex justify-between items-center">
                      <span className="bg-blue-600 text-white text-xs font-medium px-2.5 py-1 rounded">
                        {tutor.category || "General"}
                      </span>
                      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${
                        tutor.status === "Approved" ? "bg-green-100 text-green-700" : 
                        tutor.status === "Pending" ? "bg-yellow-100 text-yellow-700" : 
                        "bg-red-100 text-red-700"
                      }`}>
                        <span className={`h-2 w-2 rounded-full ${
                          tutor.status === "Approved" ? "bg-green-500" : 
                          tutor.status === "Pending" ? "bg-yellow-500" : 
                          "bg-red-500"
                        }`}></span>
                        <span className="text-xs">{tutor.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-5">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 h-14">
                    {tutor.sessionTitle}
                  </h2>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <FiCalendar className="mr-1" />
                    <span>
                      {tutor.createdAt 
                        ? new Date(tutor.createdAt).toLocaleDateString() 
                        : "No date available"}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleModalOpen(tutor)}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
                  >
                    <FiUpload className="h-4 w-4" />
                    Upload Material
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <div className="flex justify-center">
              <FiAlertCircle className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No sessions found</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              {searchTerm 
                ? `No sessions matching "${searchTerm}" were found. Try a different search term.` 
                : "You don't have any approved sessions yet. Once your sessions are approved, they will appear here."}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <UploadMetarialModal
        isOpen={isModalOpen}
        tutor={selectedTutor}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default UploadMetarial
