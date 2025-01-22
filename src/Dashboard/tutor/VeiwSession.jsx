import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import useAuth from "../../hook/useAuth";
import { Helmet } from "react-helmet-async";

const VeiwSession = () => {
  const { user, loading } = useAuth();

  const {
    data: tutor = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["tutor", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const { data } = await axios.get(
        `https://study-hive-server-three.vercel.app/veiwSession/${user?.email}`
      );

      return data;
    },
  });
  const handleRequestApproval = async (sessionId) => {
    try {
      const { data } = await axios.put(
        `https://study-hive-server-three.vercel.app/tutors/${sessionId}`,
        {
          status: "Pending",
        }
      );
      if (data.modifiedCount > 0) {
        toast.success("Request successfully!");
      } else {
        toast.error("No changes made or update failed");
      }
      refetch();
    } catch (error) {
      toast.error("Failed to update status:", error);
    }
  };
  if (isLoading) {
    return <span className="loading loading-dots loading-lg"></span>;
  }
  return (
    <div>
      <Helmet>
        <title>Dashboard || View Session</title>
      </Helmet>
      <ToastContainer />
      <div className="my-4">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Veiw Your <span className="text-blue-400">Study Session</span>
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          This intuitive tool allows you to design and share in-depth study
          sessions, creating valuable resources for your students and fellow
          tutors.
        </p>
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 w-11/12 mx-auto">
        {tutor.map((tutor, i) => (
          <div
            key={i}
            className="max-w-md   bg-white border rounded-lg shadow-md overflow-hidden"
          >
            <img
              className="w-full h-48 object-cover"
              src={tutor.sessionImage}
              alt="Course Thumbnail"
            />
            <div className="p-4">
              <h3 className="text-xl font-bold text-blue-700">
                {tutor.sessionTitle}
              </h3>
              <p className="text-gray-600 text-sm mt-2">
                {tutor.sessionDescription}
              </p>
              <div className="mt-4">
                <p className="text-orange-600 text-sm font-medium">
                  Registration Start Date:{" "}
                  <span className="font-normal">
                    {tutor.registrationStartDate}
                  </span>
                </p>
                <p className="text-orange-600 text-sm font-medium">
                  Registration End Date:{" "}
                  <span className="font-normal">
                    {tutor.registrationEndDate}
                  </span>
                </p>
                <p className="text-pink-600 text-sm font-medium">
                  Class Start Time:{" "}
                  <span className="font-normal">{tutor.classStartTime}</span>
                </p>
                <p className="text-pink-600 text-sm font-medium">
                  Class End Time:{" "}
                  <span className="font-normal">{tutor.classEndTime}</span>
                </p>
                <p className="text-blue-600 text-sm font-medium">
                  Session Duration:{" "}
                  <span className="font-normal">
                    {tutor.sessionDuration}hours
                  </span>
                </p>
                <p className="text-green-600 text-lg font-semibold mt-2">
                  Fee: ${tutor.registrationFee}
                </p>
              </div>
              <div className="mt-4  ">
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full gap-x-2 ${
                    tutor.status === "Pending" &&
                    "bg-yellow-100/60 text-yellow-500"
                  } ${
                    tutor.status === "Approved" &&
                    "bg-green-100/60 text-green-500"
                  } ${
                    tutor.status === "Rejected" && "bg-red-100/60 text-red-500"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      tutor.status === "Pending" && "bg-yellow-500"
                    } ${tutor.status === "Approved" && "bg-green-500"} ${
                      tutor.status === "Rejected" && "bg-red-500"
                    }`}
                  ></span>
                  <h2 className="text-sm font-normal">{tutor.status}</h2>
                </div>
                {tutor.status === "Rejected" && (
                  <span
                    onClick={() => handleRequestApproval(tutor._id)}
                    className="btn  px-4 py-2 bg-blue-500  text-white text-sm font-medium rounded-full hover:bg-blue-600 transition"
                    disabled={tutor.isLoading}
                  >
                    Request Approval
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VeiwSession;
