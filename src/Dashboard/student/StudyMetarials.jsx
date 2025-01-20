import axios from "axios";
import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hook/useAuth";
import ViewMetarialsModal from "../../modal/ViewMetarialsModal";

const StudyMetarials = () => {
  const { user, loading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  const { data: booked = [], isLoading } = useQuery({
    queryKey: ["bookedSessions", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:5000/viewBooked?email=${user?.email}`
      );

      return data;
    },
  });

  const { data: materialData = [], refetch: refetchMaterialData } = useQuery({
    queryKey: ["sessionMaterials", selectedSession],
    enabled: !loading && !!selectedSession,
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:5000/metarials/session/${selectedSession}`
      );

      return data || [];
    },
  });
  if (isLoading) {
    return <span className="loading loading-dots loading-lg"></span>;
  }

  const handleModalOpen = (sessionId) => {
    setSelectedSession(sessionId);
    setIsModalOpen(true);
    refetchMaterialData();
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSession(null);
  };

  return (
    <div>
      <div className="my-4">
        <h2 className="text-2xl font-bold mb-6 text-center">
          View Your <span className="text-blue-400">Booked Metarials</span>
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          This intuitive tool allows you to design and share in-depth study
          sessions, creating valuable resources for your students and fellow
          tutors.
        </p>
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 w-11/12 mx-auto">
        {booked.map((book, i) => (
          <div
            key={i}
            className=" bg-white border rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src={book.sessionImage}
              alt="Advanced English Course"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div>
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full gap-x-2 ${
                    book.status === "Pending" &&
                    "bg-yellow-100/60 text-yellow-500"
                  } ${
                    book.status === "Approved" &&
                    "bg-green-100/60 text-green-500"
                  } ${
                    book.status === "Rejected" && "bg-red-100/60 text-red-500"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      book.status === "Pending" && "bg-yellow-500"
                    }${book.status === "Approved" && "bg-green-500"} ${
                      book.status === "Rejected" && "bg-red-500"
                    }`}
                  ></span>
                  <h2 className="text-sm font-normal">{book.status}</h2>
                </div>
              </div>
              <h2 className="text-gray-800 font-semibold text-lg mb-4">
                {book.sessionTitle}
              </h2>
              <div>
                <button
                  onClick={() => handleModalOpen(book.sessionId)}
                  className="btn bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700"
                >
                  View Material
                </button>

                <ViewMetarialsModal
                  isOpen={isModalOpen}
                  onClose={handleModalClose}
                  materialData={materialData}
                  selectedSession={selectedSession}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyMetarials;
