import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hook/useAuth";

const VeiwBooked = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const { data: session = [], isLoading } = useQuery({
    queryKey: ["session", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const { data } = await axios.get(
        `https://study-hive-server-three.vercel.app/viewBooked?email=${user?.email}`
      );
      return data;
    },
  });
  const handleReadMore = (id) => {
    navigate(`viewBookedDetails/${id}`);
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="loading loading-spinner loading-lg text-blue-500"></div>
      </div>
    );
  }
  return (
    <div>
      <Helmet>
        <title>Dashboard || Booked Session</title>
      </Helmet>
      <div className="my-4">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Veiw Your <span className="text-blue-400">Booked Session</span>
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          This intuitive tool allows you to design and share in-depth study
          sessions, creating valuable resources for your students and fellow
          tutors.
        </p>
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 w-11/12 mx-auto">
        {session.map((session, i) => (
          <div
            key={i}
            className=" bg-white border rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src={session.sessionImage}
              alt="Advanced English Course"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-gray-800 font-semibold text-lg">
                {session.sessionTitle}
              </h2>
              <p className="text-gray-600 text-sm mb-1">
                {session.sessionDescription}
              </p>
              <div>
                <button
                  onClick={() => handleReadMore(session._id)}
                  className="btn bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700"
                >
                  Reade More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VeiwBooked;
