"use client"

import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { toast, ToastContainer } from "react-toastify"
import Swal from "sweetalert2"

const ViewAllSession = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [feedback, setFeedback] = useState("")
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [isPaid, setIsPaid] = useState(false)
  const [fee, setFee] = useState(0)
  const [activeTab, setActiveTab] = useState("pending")

  const {
    data: tutors = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["tutor"],
    queryFn: async () => {
      const { data } = await axios.get(`https://study-hive-server-three.vercel.app/tutors`)
      return data
    },
  })

  const openModal = (session) => {
    setSelectedSession(session)
    setIsModalOpen(true)
    setIsPaid(session.registrationFee > 0)
    setFee(session.registrationFee || 0)
  }

  const closeModal = () => {
    setSelectedSession(null)
    setIsModalOpen(false)
    setIsPaid(false)
    setFee(0)
  }

  const openRejectModal = (session) => {
    setSelectedSession(session)
    setIsRejectModalOpen(true)
  }

  const closeRejectModal = () => {
    setSelectedSession(null)
    setRejectionReason("")
    setFeedback("")
    setIsRejectModalOpen(false)
  }

  const handleApprove = async () => {
    if (!selectedSession) return

    const registrationFee = isPaid ? Number(fee) : 0

    try {
      const { data } = await axios.put(`https://study-hive-server-three.vercel.app/tutors/${selectedSession._id}`, {
        status: "Approved",
        registrationFee,
      })

      if (data.modifiedCount > 0) {
        toast.success("Session updated successfully!")
      } else {
        toast.error("No changes made or update failed")
      }

      refetch()
      closeModal()
    } catch (error) {
      toast.error("Error updating session:", error)
    }
  }

  const handleReject = async () => {
    if (!feedback) {
      toast.error("Please provide feedback before rejecting.")
      return
    }
    try {
      const { data } = await axios.put(`https://study-hive-server-three.vercel.app/tutors/${selectedSession._id}`, {
        status: "Rejected",
      })
      if (data.modifiedCount > 0) {
        toast.success("Session rejected successfully!")
      } else {
        toast.error("No changes made or rejection failed")
      }

      await axios.post("https://study-hive-server-three.vercel.app/rejects", {
        tutorEmail: selectedSession.email,
        sessionId: selectedSession._id,
        rejectionReason,
        feedback,
      })

      refetch()
      closeRejectModal()
    } catch (error) {
      toast.error("Error rejecting session:", error)
    }
  }

  const handleDelete = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://study-hive-server-three.vercel.app/tutors/${_id}`, {
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
              refetch()
            }
          })
      }
    })
  }

  // Categorize sessions
  const pendingSessions = tutors.filter((session) => session.status === "Pending")
  const approvedSessions = tutors.filter((session) => session.status === "Approved")
  const rejectedSessions = tutors.filter((session) => session.status === "Rejected")

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "Approved":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "Rejected":
        return "bg-rose-100 text-rose-700 border-rose-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getStatusDotClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-500"
      case "Approved":
        return "bg-emerald-500"
      case "Rejected":
        return "bg-rose-500"
      default:
        return "bg-gray-500"
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className=" min-h-screen p-6">
      <Helmet>
        <title>Dashboard | Study Sessions</title>
      </Helmet>
      <ToastContainer />

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold ">
              Study <span className="text-blue-600">Sessions Management</span>
            </h1>
            <p className="mt-1 text-gray-400">Review, approve, and manage all study sessions across the platform</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-white rounded-full px-4 py-1.5 shadow-sm border border-gray-200">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span className="text-sm font-medium text-gray-700">Total Sessions: {tutors.length}</span>
              </div>
              <button
                onClick={() => refetch()}
                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                title="Refresh data"
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
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Session Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          className={`bg-white rounded-xl shadow-sm border border-l-4 ${
            activeTab === "pending" ? "border-l-amber-500" : "border-l-gray-200"
          } p-5 cursor-pointer hover:shadow-md transition-shadow`}
          onClick={() => setActiveTab("pending")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Sessions</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-800">{pendingSessions.length}</h3>
            </div>
            <div className="p-3 rounded-full bg-amber-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-amber-600"
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
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full"
              style={{
                width: `${tutors.length ? (pendingSessions.length / tutors.length) * 100 : 0}%`,
              }}
            ></div>
          </div>
        </div>

        <div
          className={`bg-white rounded-xl shadow-sm border border-l-4 ${
            activeTab === "approved" ? "border-l-emerald-500" : "border-l-gray-200"
          } p-5 cursor-pointer hover:shadow-md transition-shadow`}
          onClick={() => setActiveTab("approved")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Approved Sessions</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-800">{approvedSessions.length}</h3>
            </div>
            <div className="p-3 rounded-full bg-emerald-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-emerald-600"
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
          </div>
          <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{
                width: `${tutors.length ? (approvedSessions.length / tutors.length) * 100 : 0}%`,
              }}
            ></div>
          </div>
        </div>

        <div
          className={`bg-white rounded-xl shadow-sm border border-l-4 ${
            activeTab === "rejected" ? "border-l-rose-500" : "border-l-gray-200"
          } p-5 cursor-pointer hover:shadow-md transition-shadow`}
          onClick={() => setActiveTab("rejected")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Rejected Sessions</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-800">{rejectedSessions.length}</h3>
            </div>
            <div className="p-3 rounded-full bg-rose-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-rose-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-500 rounded-full"
              style={{
                width: `${tutors.length ? (rejectedSessions.length / tutors.length) * 100 : 0}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Session Tables */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === "pending"
                  ? "border-amber-500 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Pending Sessions ({pendingSessions.length})
            </button>
            <button
              onClick={() => setActiveTab("approved")}
              className={`px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === "approved"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Approved Sessions ({approvedSessions.length})
            </button>
            <button
              onClick={() => setActiveTab("rejected")}
              className={`px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === "rejected"
                  ? "border-rose-500 text-rose-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Rejected Sessions ({rejectedSessions.length})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === "pending" && pendingSessions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-amber-500"
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
              </div>
              <h3 className="text-lg font-medium text-gray-900">No pending sessions</h3>
              <p className="mt-1 text-gray-500">All sessions have been reviewed</p>
            </div>
          )}

          {activeTab === "approved" && approvedSessions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-emerald-500"
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
              <h3 className="text-lg font-medium text-gray-900">No approved sessions</h3>
              <p className="mt-1 text-gray-500">Approve pending sessions to see them here</p>
            </div>
          )}

          {activeTab === "rejected" && rejectedSessions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-rose-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No rejected sessions</h3>
              <p className="mt-1 text-gray-500">No sessions have been rejected</p>
            </div>
          )}

          {activeTab === "pending" && pendingSessions.length > 0 && (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Session
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tutor
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingSessions.map((session) => (
                  <tr key={session._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden">
                          <img
                            src={session.sessionImage || "/placeholder.svg?height=48&width=48"}
                            alt={session.sessionTitle}
                            className="h-12 w-12 object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{session.sessionTitle}</div>
                          <div className="text-sm text-gray-500">
                            {session.category || "No category"} • {session.duration || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{session.name}</div>
                      <div className="text-sm text-gray-500">{session.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(
                          session.status,
                        )}`}
                      >
                        <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${getStatusDotClass(session.status)}`}></span>
                        {session.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal(session)}
                          className="inline-flex items-center px-3 py-1.5 border border-emerald-100 bg-emerald-50 rounded-lg text-emerald-700 hover:bg-emerald-100 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Approve
                        </button>
                        <button
                          onClick={() => openRejectModal(session)}
                          className="inline-flex items-center px-3 py-1.5 border border-rose-100 bg-rose-50 rounded-lg text-rose-700 hover:bg-rose-100 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "approved" && approvedSessions.length > 0 && (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Session
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tutor
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Fee
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {approvedSessions.map((session) => (
                  <tr key={session._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden">
                          <img
                            src={session.sessionImage || "/placeholder.svg?height=48&width=48"}
                            alt={session.sessionTitle}
                            className="h-12 w-12 object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{session.sessionTitle}</div>
                          <div className="text-sm text-gray-500">
                            {session.category || "No category"} • {session.duration || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{session.name}</div>
                      <div className="text-sm text-gray-500">{session.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(
                          session.status,
                        )}`}
                      >
                        <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${getStatusDotClass(session.status)}`}></span>
                        {session.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {session.registrationFee > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          ${session.registrationFee}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                          Free
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal(session)}
                          className="inline-flex items-center px-3 py-1.5 border border-blue-100 bg-blue-50 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
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
                          onClick={() => handleDelete(session._id)}
                          className="inline-flex items-center px-3 py-1.5 border border-rose-100 bg-rose-50 rounded-lg text-rose-700 hover:bg-rose-100 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "rejected" && rejectedSessions.length > 0 && (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Session
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tutor
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rejectedSessions.map((session) => (
                  <tr key={session._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden">
                          <img
                            src={session.sessionImage || "/placeholder.svg?height=48&width=48"}
                            alt={session.sessionTitle}
                            className="h-12 w-12 object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{session.sessionTitle}</div>
                          <div className="text-sm text-gray-500">
                            {session.category || "No category"} • {session.duration || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{session.name}</div>
                      <div className="text-sm text-gray-500">{session.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(
                          session.status,
                        )}`}
                      >
                        <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${getStatusDotClass(session.status)}`}></span>
                        {session.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal(session)}
                          className="inline-flex items-center px-3 py-1.5 border border-emerald-100 bg-emerald-50 rounded-lg text-emerald-700 hover:bg-emerald-100 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          Reconsider
                        </button>
                        <button
                          onClick={() => handleDelete(session._id)}
                          className="inline-flex items-center px-3 py-1.5 border border-rose-100 bg-rose-50 rounded-lg text-rose-700 hover:bg-rose-100 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Approve Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {selectedSession?.status === "Approved" ? "Update Session" : "Approve Session"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                aria-label="Close"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {selectedSession && (
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden">
                    <img
                      src={selectedSession.sessionImage || "/placeholder.svg?height=48&width=48"}
                      alt={selectedSession.sessionTitle}
                      className="h-12 w-12 object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{selectedSession.sessionTitle}</div>
                    <div className="text-sm text-gray-500">
                      By {selectedSession.name} ({selectedSession.email})
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Session Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setIsPaid(false)}
                  className={`flex items-center justify-center px-4 py-3 border rounded-lg ${
                    !isPaid
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 mr-2 ${!isPaid ? "text-blue-500" : "text-gray-400"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Free
                </button>
                <button
                  type="button"
                  onClick={() => setIsPaid(true)}
                  className={`flex items-center justify-center px-4 py-3 border rounded-lg ${
                    isPaid
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 mr-2 ${isPaid ? "text-blue-500" : "text-gray-400"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Paid
                </button>
              </div>
            </div>

            {isPaid && (
              <div className="mb-6">
                <label htmlFor="fee" className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Fee ($)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="fee"
                    id="fee"
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md py-3"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">USD</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApprove}
                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {selectedSession?.status === "Approved" ? "Update Session" : "Approve Session"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Reject Session</h2>
              <button
                onClick={closeRejectModal}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                aria-label="Close"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {selectedSession && (
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden">
                    <img
                      src={selectedSession.sessionImage || "/placeholder.svg?height=48&width=48"}
                      alt={selectedSession.sessionTitle}
                      className="h-12 w-12 object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{selectedSession.sessionTitle}</div>
                    <div className="text-sm text-gray-500">
                      By {selectedSession.name} ({selectedSession.email})
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason
              </label>
              <select
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              >
                <option value="">Select a reason</option>
                <option value="Inappropriate content">Inappropriate content</option>
                <option value="Insufficient information">Insufficient information</option>
                <option value="Quality concerns">Quality concerns</option>
                <option value="Duplicate session">Duplicate session</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                Feedback for Tutor
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Provide detailed feedback to help the tutor improve their session"
                required
              ></textarea>
              {!feedback && (
                <p className="mt-1 text-sm text-rose-600">Feedback is required before rejecting a session</p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeRejectModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                disabled={!feedback}
              >
                Reject Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ViewAllSession
