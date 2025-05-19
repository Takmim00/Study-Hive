import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
    <line x1="16" x2="16" y1="2" y2="6"></line>
    <line x1="8" x2="8" y1="2" y2="6"></line>
    <line x1="3" x2="21" y1="10" y2="10"></line>
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14"></path>
    <path d="m12 5 7 7-7 7"></path>
  </svg>
);

const StudySessionCards = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await axios.get(
        "https://study-hive-server-three.vercel.app/tutors/limit"
      );
      return data;
    },
  });

  const handleReadMore = (sessionId) => {
    navigate(`/sessionDetail/${sessionId}`);
  };

  if (isLoading) {
    return (
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 w-11/12 mx-auto">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg overflow-hidden border-none shadow-lg"
          >
            <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-4">
              <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-center">
          Study <span className="text-blue-500">Sessions</span>
        </h2>
        <div className="w-24 h-1 bg-blue-500 mx-auto mt-2 rounded-full"></div>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 w-11/12 mx-auto">
        {sessions
          .filter((session) => session.status === "Approved")
          .map((session) => {
            const currentDate = new Date();
            const registrationStartDate = new Date(
              session.registrationStartDate
            );
            const registrationEndDate = new Date(session.registrationEndDate);
            const isRegistrationOngoing =
              currentDate >= registrationStartDate &&
              currentDate <= registrationEndDate;

            // Format dates for display
            const startDateFormatted = new Date(
              session.registrationStartDate
            ).toLocaleDateString();
            const endDateFormatted = new Date(
              session.registrationEndDate
            ).toLocaleDateString();

            return (
              <div
                key={session._id}
                className={`group bg-white rounded-lg overflow-hidden border-0 transition-all duration-300 ${
                  hoveredCard === session._id
                    ? "shadow-xl transform -translate-y-1"
                    : "shadow-md hover:shadow-lg"
                }`}
                onMouseEnter={() => setHoveredCard(session._id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="relative overflow-hidden h-52">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                  <img
                    src={session.sessionImage || "/placeholder.jpg"}
                    alt={session.sessionTitle}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <span
                    className={`absolute top-3 right-3 z-20 px-3 py-1 rounded-full text-xs font-medium text-white ${
                      isRegistrationOngoing ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {isRegistrationOngoing
                      ? "Registration Open"
                      : "Registration Closed"}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="text-xl font-bold text-blue-700 overflow-hidden text-ellipsis whitespace-nowrap group-hover:text-blue-500 transition-colors">
                    {session.sessionTitle}
                  </h3>

                  <p className="text-gray-600 text-sm mt-2 line-clamp-2 h-10">
                    {session.sessionDescription}
                  </p>

                  <div className="flex items-center text-xs text-gray-500 gap-1 mt-3">
                    <CalendarIcon />
                    <span>
                      {startDateFormatted} - {endDateFormatted}
                    </span>
                  </div>

                  <button
                    onClick={() => handleReadMore(session._id)}
                    className="w-full mt-4 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center justify-center group-hover:shadow-md transition-all"
                  >
                    <span className="mr-1">Read More</span>
                    <span className="transition-transform group-hover:translate-x-1">
                      <ArrowRightIcon />
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default StudySessionCards;
