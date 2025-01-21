import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hook/useAuth";

const StudySession = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["session"],

    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:5000/tutors`);
      return data;
    },
  });
  const handleReadMore = (sessionId) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/sessionDetail/${sessionId}`);
    }
  };
  if (isLoading) {
    return <span className="loading loading-dots loading-lg"></span>;
  }
  return (
    <div>
      <div>Study Session</div>
      <div>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 w-11/12 mx-auto">
          {sessions
            .filter((session) => session.status === "Approved")
            .map((session, i) => (
              <div
                key={i}
                className="max-w-md   bg-white border rounded-lg shadow-md overflow-hidden"
              >
                <img
                  className="w-full h-48 object-cover"
                  src={session.sessionImage}
                  alt="Course Thumbnail"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-blue-700">
                    {session.sessionTitle}
                  </h3>
                  <p className="text-gray-600 text-sm mt-2">
                    {session.sessionDescription}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <button
                      className={`px-4 py-2 rounded ${
                        session.isOngoing
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {session.isOngoing ? "Ongoing" : "Closed"}
                    </button>

                    <Link
                      onClick={() => handleReadMore(session._id)}
                      className="btn px-4 py-2 bg-blue-500 text-white rounded"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default StudySession;
