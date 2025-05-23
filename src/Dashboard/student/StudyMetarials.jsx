import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import useAuth from "../../hook/useAuth";
import ViewMetarialsModal from "../../modal/ViewMetarialsModal";

const StudyMetarials = () => {
  const { user, loading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [hoveredCard, setHoveredCard] = useState(null);

  const { data: booked = [], isLoading } = useQuery({
    queryKey: ["bookedSessions", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const { data } = await axios.get(
        `https://study-hive-server-three.vercel.app/viewBooked?email=${user?.email}`
      );
      return data;
    },
  });

  const { data: materialData = [], refetch: refetchMaterialData } = useQuery({
    queryKey: ["sessionMaterials", selectedSession],
    enabled: !loading && !!selectedSession,
    queryFn: async () => {
      const { data } = await axios.get(
        `https://study-hive-server-three.vercel.app/metarials/session/${selectedSession}`
      );
      return data || [];
    },
  });

  // Filter and search logic
  const filteredSessions = booked.filter((book) => {
    const matchesSearch = book.sessionTitle
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      activeFilter === "all" ||
      book.status.toLowerCase() === activeFilter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const handleModalOpen = (sessionId) => {
    setSelectedSession(sessionId);
    setIsModalOpen(true);
    refetchMaterialData();
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSession(null);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-80">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-4 text-gray-600">Loading your study materials...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <Helmet>
        <title>Study Materials | Study Hive</title>
      </Helmet>

      {/* Header */}
      <div className="bg-white shadow-sm py-6 px-4 mb-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800">
            Your Study <span className="text-blue-500">Materials</span>
          </h2>
          <p className="text-gray-600 mt-1">
            Access all materials from your booked study sessions
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Sessions Grid */}
        {filteredSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((book, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="relative">
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        book.status === "Pending" &&
                        "bg-yellow-100 text-yellow-700"
                      } ${
                        book.status === "Approved" &&
                        "bg-green-100 text-green-700"
                      } ${
                        book.status === "Rejected" && "bg-red-100 text-red-700"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                          book.status === "Pending" && "bg-yellow-500"
                        } ${book.status === "Approved" && "bg-green-500"} ${
                          book.status === "Rejected" && "bg-red-500"
                        }`}
                      ></span>
                      {book.status}
                    </div>
                  </div>

                  {/* Image with Overlay */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        book.sessionImage ||
                        "/placeholder.svg?height=192&width=384"
                      }
                      alt={book.sessionTitle || "Session"}
                      className={`w-full h-full object-cover transition-transform duration-500 ${
                        hoveredCard === i ? "scale-110" : "scale-100"
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                    {/* Category Badge */}
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        Study Session
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  {/* Session Title */}
                  <h2 className="text-gray-800 font-semibold text-lg mb-2 line-clamp-2">
                    {book.sessionTitle}
                  </h2>

                  {/* Session Details */}
                  <div className="mb-4 text-sm text-gray-600">
                    {book.tutorName && (
                      <p className="flex items-center mb-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1 text-gray-500"
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
                        Tutor: {book.tutorName}
                      </p>
                    )}
                    {book.classStartTime && (
                      <p className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1 text-gray-500"
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
                        {book.classStartTime}
                      </p>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleModalOpen(book.sessionId)}
                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
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
                    View Materials
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
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
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {searchTerm || activeFilter !== "all"
                ? "No matching sessions found"
                : "No booked sessions yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || activeFilter !== "all"
                ? "Try adjusting your search terms or filters to see more results."
                : "Book a study session to access study materials."}
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveFilter("all");
              }}
              className={`inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                !(searchTerm || activeFilter !== "all") && "hidden"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
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
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Material Modal */}
      <ViewMetarialsModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        materialData={materialData}
        selectedSession={selectedSession}
      />
    </div>
  );
};

export default StudyMetarials;
