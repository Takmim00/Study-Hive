import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import useAuth from "../../hook/useAuth";
import UpdateMetarialModal from "../../modal/UpdateMetarialModal";
import { Helmet } from "react-helmet-async";

const VeiwMetarils = () => {
  const { user, loading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const navigate = useNavigate();

  const {
    data: metarial = [],
    refetch,
    isLoading: metarialIsLoading,
  } = useQuery({
    queryKey: ["metarial", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const { data } = await axios.get(
        `https://study-hive-server-three.vercel.app/veiwMetarial?email=${user?.email}`
      );

      return data;
    },
  });
  const {
    data: session = [],
    refetch: sessionRefetch,
    isLoading: sessionIsLoading,
  } = useQuery({
    queryKey: ["session", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const { data } = await axios.get(
        `https://study-hive-server-three.vercel.app/veiwSession/${user?.email}`
      );

      return data;
    },
  });

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
        fetch(
          `https://study-hive-server-three.vercel.app/veiwMetarial/${_id}`,
          {
            method: "DELETE",
          }
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.deletedCount > 0) {
              Swal.fire({
                title: "Deleted!",
                text: "Your metarials has been deleted successfully.",
                icon: "success",
              });
              refetch();
            }
          });
      }
    });
  };
  const handleSessionDelete = (_id) => {
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
                text: "Your metarials has been deleted successfully.",
                icon: "success",
              });
              sessionRefetch();
            }
          });
      }
    });
  };
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
  const handleUpdate = (id) => {
    navigate(`updateMetarials/${id}`);
  };
  if (metarialIsLoading && sessionIsLoading) {
    return <span className="loading loading-dots loading-lg"></span>;
  }

  return (
    <div>
      <Helmet>
        <title>Dashboard || View Metarial</title>
      </Helmet>
      <ToastContainer />
      <div className="my-4">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Veiw All <span className="text-blue-400">Metarials</span>
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          This intuitive tool allows you to design and share in-depth study
          sessions, creating valuable resources for your students and fellow
          tutors.
        </p>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">
          All <span className="text-blue-400">Metarials</span>
        </h2>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 w-11/12 mx-auto">
          {metarial.map((tutor, i) => (
            <div
              key={i}
              className=" bg-white border rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={tutor.materialImage}
                alt="Advanced English Course"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-gray-800 font-semibold text-lg mb-4">
                  {tutor.sessionTitle}
                </h2>
                <div>
                  <button
                    onClick={() => handleModalOpen(tutor)}
                    className="btn bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(tutor._id)}
                    className="btn bg-red-600 text-white font-medium py-2 px-4 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                  <UpdateMetarialModal
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

      {/* Sessions Section */}
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          All <span className="text-blue-400">Sessions</span>
        </h2>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 w-11/12 mx-auto">
          {session.map((sessionData, i) => (
            <div
              key={i}
              className="bg-white border rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={sessionData.sessionImage}
                alt="Session"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-gray-800 font-semibold text-lg mb-4">
                  {sessionData.sessionTitle}
                </h2>
                <div>
                  <button
                    onClick={() => handleUpdate(sessionData._id)}
                    className="btn bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleSessionDelete(sessionData._id)}
                    className="btn bg-red-600 text-white font-medium py-2 px-4 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VeiwMetarils;
