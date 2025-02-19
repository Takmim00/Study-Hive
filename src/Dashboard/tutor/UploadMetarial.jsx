import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import useAuth from "../../hook/useAuth";
import UploadMetarialModal from "../../modal/UploadMetarialModal";

const UploadMetarial = () => {
  const { user, loading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);

  const { data: tutor = [], isLoading } = useQuery({
    queryKey: ["tutor", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const { data } = await axios.get(
        `https://study-hive-server-three.vercel.app/veiwSession/${user?.email}`
      );

      return data;
    },
  });

  const handleModalOpen = (tutor) => {
    setSelectedTutor(tutor);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedTutor(null);
    setIsModalOpen(false);
  };

  const handleSubmit = () => {
    setIsModalOpen(false);
  };
  if (isLoading) {
    return <span className="loading loading-dots loading-lg"></span>;
  }

  return (
    <div>
      <Helmet>
        <title>Dashboard || Upload Metarial</title>
      </Helmet>
      <div className="my-4">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Upload Your <span className="text-blue-400">Metarials</span>
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          This intuitive tool allows you to design and share in-depth study
          sessions, creating valuable resources for your students and fellow
          tutors.
        </p>
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 w-11/12 mx-auto">
        {tutor
          .filter((tutor) => tutor.status === "Approved")
          .map((tutor, i) => (
            <div
              key={i}
              className=" bg-white border rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={tutor.sessionImage}
                alt="Advanced English Course"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div>
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full gap-x-2 ${
                      tutor.status === "Pending" &&
                      "bg-yellow-100/60 text-yellow-500"
                    } ${
                      tutor.status === "Approved" &&
                      "bg-green-100/60 text-green-500"
                    } ${
                      tutor.status === "Rejected" &&
                      "bg-red-100/60 text-red-500"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        tutor.status === "Pending" && "bg-yellow-500"
                      }${tutor.status === "Approved" && "bg-green-500"} ${
                        tutor.status === "Rejected" && "bg-red-500"
                      }`}
                    ></span>
                    <h2 className="text-sm font-normal">{tutor.status}</h2>
                  </div>
                </div>
                <h2 className="text-gray-800 font-semibold text-lg mb-4">
                  {tutor.sessionTitle}
                </h2>
                <div>
                  <button
                    onClick={() => handleModalOpen(tutor)}
                    className="btn bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700"
                  >
                    Upload Material
                  </button>

                  <UploadMetarialModal
                    isOpen={isModalOpen}
                    tutor={selectedTutor}
                    onClose={handleModalClose}
                    onSubmit={handleSubmit}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default UploadMetarial;
