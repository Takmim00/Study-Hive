import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { toast, ToastContainer } from "react-toastify"
import useAuth from "../../hook/useAuth"

const ViewSession = () => {
  const { user, loading } = useAuth()
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)

  const {
    data: sessions = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["tutor", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const { data } = await axios.get(`https://study-hive-server-three.vercel.app/veiwSession/${user?.email}`)
      return data
    },
  })

  const handleRequestApproval = async (sessionId) => {
    try {
      const { data } = await axios.put(`https://study-hive-server-three.vercel.app/tutors/${sessionId}`, {
        status: "Pending",
      })
      if (data.modifiedCount > 0) {
        toast.success("Request submitted successfully!")
      } else {
        toast.error("No changes made or update failed")
      }
      refetch()
    } catch (error) {
      toast.error("Failed to update status")
    }
  }

  const openSessionDetails = (session) => {
    setSelectedSession(session)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedSession(null)
  }

  // Filter sessions based on status and search query
  const filteredSessions = sessions.filter((session) => {
    const matchesFilter = activeFilter === "all" || session.status.toLowerCase() === activeFilter.toLowerCase()
    const matchesSearch = session.sessionTitle.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Get counts for each status
  const statusCounts = {
    all: sessions.length,
    pending: sessions.filter((session) => session.status === "Pending").length,
    approved: sessions.filter((session) => session.status === "Approved").length,
    rejected: sessions.filter((session) => session.status === "Rejected").length,
  }

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified"
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-80">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
        </div>
        <p className="mt-4 text-gray-600">Loading your sessions...</p>
      </div>
    )
  }

  return (
    <div className=" py-8 px-4">
      <Helmet>
        <title>Dashboard | My Study Sessions</title>
      </Helmet>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold ">
            My <span className="text-blue-600">Study Sessions</span>
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Manage and track all your created study sessions. Monitor their approval status and engage with your
            students.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sessions..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
              />
            </div>

            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === "all"
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                }`}
              >
                All ({statusCounts.all})
              </button>
              <button
                onClick={() => setActiveFilter("pending")}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === "pending"
                    ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                    : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                }`}
              >
                Pending ({statusCounts.pending})
              </button>
              <button
                onClick={() => setActiveFilter("approved")}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === "approved"
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                }`}
              >
                Approved ({statusCounts.approved})
              </button>
              <button
                onClick={() => setActiveFilter("rejected")}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === "rejected"
                    ? "bg-red-100 text-red-700 border border-red-200"
                    : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                }`}
              >
                Rejected ({statusCounts.rejected})
              </button>
            </div>
          </div>
        </div>

        {/* Sessions Grid */}
        {filteredSessions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-500"
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
            <h3 className="text-lg font-medium text-gray-900">No sessions found</h3>
            <p className="mt-1 text-gray-500">
              {searchQuery
                ? "Try adjusting your search to find what you're looking for."
                : "You haven't created any study sessions yet."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <div
                key={session._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md group"
              >
                <div className="relative">
                  <img
                    src={session.sessionImage || "/placeholder.svg?height=200&width=400"}
                    alt={session.sessionTitle}
                    className="w-full h-48 object-cover"
                  />
                  <div
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
                      session.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                        : session.status === "Approved"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-red-100 text-red-700 border border-red-200"
                    }`}
                  >
                    <div className="flex items-center">
                      <span
                        className={`h-2 w-2 rounded-full mr-1.5 ${
                          session.status === "Pending"
                            ? "bg-yellow-500"
                            : session.status === "Approved"
                              ? "bg-green-500"
                              : "bg-red-500"
                        }`}
                      ></span>
                      {session.status}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                    <button
                      onClick={() => openSessionDetails(session)}
                      className="px-4 py-2 bg-white/90 text-gray-800 rounded-lg text-sm font-medium hover:bg-white transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">{session.sessionTitle}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{session.sessionDescription}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-400 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-gray-600">
                        {formatDate(session.registrationStartDate)} - {formatDate(session.registrationEndDate)}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-400 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-gray-600">
                        {session.classStartTime} - {session.classEndTime} ({session.sessionDuration} hours)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-blue-600 font-semibold">
                      {session.registrationFee > 0 ? `$${session.registrationFee}` : "Free"}
                    </div>
                    {session.status === "Rejected" && (
                      <button
                        onClick={() => handleRequestApproval(session._id)}
                        className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Request Approval
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Session Details Modal */}
      {isModalOpen && selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="relative">
              <img
                src={selectedSession.sessionImage || "/placeholder.svg?height=300&width=800"}
                alt={selectedSession.sessionTitle}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div
                className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${
                  selectedSession.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                    : selectedSession.status === "Approved"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-red-100 text-red-700 border border-red-200"
                }`}
              >
                <div className="flex items-center">
                  <span
                    className={`h-2 w-2 rounded-full mr-1.5 ${
                      selectedSession.status === "Pending"
                        ? "bg-yellow-500"
                        : selectedSession.status === "Approved"
                          ? "bg-green-500"
                          : "bg-red-500"
                    }`}
                  ></span>
                  {selectedSession.status}
                </div>
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedSession.sessionTitle}</h2>
              <p className="text-gray-600 mb-6">{selectedSession.sessionDescription}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Registration Period</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Start Date</p>
                        <p className="text-sm text-gray-600">{formatDate(selectedSession.registrationStartDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-700">End Date</p>
                        <p className="text-sm text-gray-600">{formatDate(selectedSession.registrationEndDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Class Schedule</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Time</p>
                        <p className="text-sm text-gray-600">
                          {selectedSession.classStartTime} - {selectedSession.classEndTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Duration</p>
                        <p className="text-sm text-gray-600">{selectedSession.sessionDuration} hours</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Registration Fee</p>
                  <p className="text-xl font-bold text-blue-600">
                    {selectedSession.registrationFee > 0 ? `$${selectedSession.registrationFee}` : "Free"}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  {selectedSession.status === "Rejected" && (
                    <button
                      onClick={() => {
                        handleRequestApproval(selectedSession._id)
                        closeModal()
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Request Approval
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ViewSession
