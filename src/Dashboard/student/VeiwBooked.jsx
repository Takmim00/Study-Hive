import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hook/useAuth";

const ViewBooked = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [displaySessions, setDisplaySessions] = useState([]);

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["session", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const { data } = await axios.get(
        `https://study-hive-server-three.vercel.app/viewBooked?email=${user?.email}`
      );
      return data;
    },
  });

  useEffect(() => {
    let filtered = [...sessions];

    // Apply filter
    if (activeFilter === "upcoming") {
      filtered = filtered.filter(
        (session) => new Date(session.sessionDate) > new Date()
      );
    } else if (activeFilter === "completed") {
      filtered = filtered.filter(
        (session) => new Date(session.sessionDate) < new Date()
      );
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(
        (session) =>
          session.sessionTitle
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          session.sessionDescription
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    setDisplaySessions(filtered);
  }, [sessions, searchTerm, activeFilter]);

  const handleReadMore = (id) => {
    navigate(`viewBookedDetails/${id}`);
  };

  // Get counts for statistics
  // const totalSessions = sessions.length
  // const upcomingSessions = sessions.filter((session) => new Date(session.sessionDate) > new Date()).length
  // const completedSessions = sessions.filter((session) => new Date(session.sessionDate) < new Date()).length

  // // Handle search input change
  // const handleSearchChange = (e) => {
  //   setSearchTerm(e.target.value)
  // }

  // // Clear search
  // const handleClearSearch = () => {
  //   setSearchTerm("")
  // }

  // // Handle filter change
  // const handleFilterChange = (filter) => {
  //   setActiveFilter(filter)
  // }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-80">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">
          Loading your sessions...
        </p>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <Helmet>
        <title>Dashboard | Booked Sessions</title>
      </Helmet>

      {/* Header Section */}
      <div className="my-8 px-4">
        <h2 className="text-3xl font-bold mb-4 text-center">
          Your <span className="text-blue-500">Booked Sessions</span>
        </h2>
        <p className="text-gray-600 mb-8 text-center max-w-3xl mx-auto">
          Access and manage all your booked study sessions. Click on any session
          to view details, materials, and connect with your tutor.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 px-6">
        {/* Total Sessions */}
        {/* <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg">
          <div className="p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Sessions</h3>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{totalSessions}</p>
                  <p className="ml-2 text-sm text-gray-600">sessions</p>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Upcoming Sessions */}
        {/* <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg">
          <div className="p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-500"
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
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Upcoming</h3>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{upcomingSessions}</p>
                  <p className="ml-2 text-sm text-gray-600">sessions</p>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Completed Sessions */}
        {/* <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg">
          <div className="p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-500"
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
                <h3 className="text-sm font-medium text-gray-500">Completed</h3>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{completedSessions}</p>
                  <p className="ml-2 text-sm text-gray-600">sessions</p>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 px-6">
        {/* Search Bar */}
        {/* <div className="relative w-full md:w-64 mb-4 md:mb-0">
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 pl-10 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute left-3 top-2.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
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
          {searchTerm && (
            <button onClick={handleClearSearch} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div> */}

        {/* Filter Tabs */}
        {/* <div className="flex space-x-2 overflow-x-auto pb-1 w-full md:w-auto">
          <button
            onClick={() => handleFilterChange("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ease-in-out whitespace-nowrap
              ${activeFilter === "all" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            All Sessions
          </button>
          <button
            onClick={() => handleFilterChange("upcoming")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ease-in-out whitespace-nowrap
              ${activeFilter === "upcoming" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => handleFilterChange("completed")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ease-in-out whitespace-nowrap
              ${activeFilter === "completed" ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            Completed
          </button>
        </div> */}
      </div>

      {/* Sessions Grid */}
      {displaySessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
          {displaySessions.map((session, i) => (
            <div
              key={i}
              className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px] group"
            >
              {/* Card Header - Image with Overlay */}
              <div className="relative overflow-hidden">
                <img
                  src={
                    session.sessionImage ||
                    "/placeholder.svg?height=200&width=400"
                  }
                  alt={session.sessionTitle || "Session"}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>

                {/* Session Date Badge */}
                <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 mr-1 text-blue-500"
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
                  {new Date(
                    session.sessionDate || new Date()
                  ).toLocaleDateString()}
                </div>

                {/* Category Label */}
                <div className="absolute bottom-3 left-3 bg-blue-500/90 px-3 py-1 rounded-full text-xs font-medium text-white shadow-sm">
                  {session.sessionCategory || "Study Session"}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5">
                {/* Title with truncation */}
                <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                  {session.sessionTitle}
                </h2>

                {/* Description with truncation */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {session.sessionDescription}
                </p>

                {/* Footer with Tutor Info and Button */}
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                  {/* Tutor Info */}
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {session.tutorImage ? (
                        <img
                          src={session.tutorImage || "/placeholder.svg"}
                          alt={session.tutorName || "Tutor"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="ml-2 text-xs text-gray-500">
                      {session.tutorName || "Tutor"}
                    </span>
                  </div>

                  {/* Read More Button */}
                  <button
                    onClick={() => handleReadMore(session._id)}
                    className="text-sm px-4 py-2 bg-blue-500 text-white rounded-lg transition-all duration-200 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                  >
                    Read More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Empty State
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="bg-gray-100 p-4 rounded-full mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No sessions found
          </h3>
          <p className="text-gray-500 text-center max-w-md">
            {searchTerm
              ? `No sessions matching "${searchTerm}" were found. Try a different search term.`
              : activeFilter !== "all"
              ? `You don't have any ${activeFilter} sessions at the moment.`
              : "You haven't booked any sessions yet. Browse available sessions to get started."}
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setActiveFilter("all");
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {searchTerm || activeFilter !== "all"
              ? "Clear Filters"
              : "Browse Sessions"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewBooked;
