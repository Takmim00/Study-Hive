import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast, ToastContainer } from "react-toastify";

import Swal from "sweetalert2";

const ViewAllSession = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [fee, setFee] = useState(0);
  const {
    data: tutors = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["tutor"],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:5000/tutors`);
      return data;
    },
  });

  const openModal = (session) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedSession(null);
    setIsModalOpen(false);
    setIsPaid(false);
    setFee();
  };
  const openRejectModal = (session) => {
    setSelectedSession(session);
    setIsRejectModalOpen(true);
  };

  const closeRejectModal = () => {
    setSelectedSession(null);
    setRejectionReason("");
    setFeedback("");
    setIsRejectModalOpen(false);
  };

  const handleApprove = async () => {
    if (!selectedSession) return;

    const registrationFee = isPaid ? Number(fee) : 0;

    try {
      const { data } = await axios.put(
        `http://localhost:5000/tutors/${selectedSession._id}`,
        {
          status: "Approved",
          registrationFee,
        }
      );

      if (data.modifiedCount > 0) {
        toast.success("Session updated successfully!");
      } else {
        toast.error("No changes made or update failed");
      }

      refetch();
      closeModal();
    } catch (error) {
      toast.error("Error updating session:", error);
    }
  };
  const handleReject = async () => {
    if (!feedback) {
      toast.error("Please provide feedback before rejecting.");
      return; 
    }
    try {
      const { data } = await axios.put(
        `http://localhost:5000/tutors/${selectedSession._id}`,
        { status: "Rejected" }
      );
      if (data.modifiedCount > 0) {
        toast.success("Session rejected successfully!");
      } else {
        toast.error("No changes made or rejection failed");
      }

      const { rjData } = await axios.post("http://localhost:5000/rejects", {
        sessionId: selectedSession._id,
        rejectionReason,
        feedback,
      });

      refetch();
      closeRejectModal();
    } catch (error) {
      toast.error("Error rejecting session:", error);
    }
  };
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
        fetch(`http://localhost:5000/tutors/${_id}`, {
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
              refetch();
            }
          });
      }
    });
  };
  if (isLoading) {
    return <span className="loading loading-dots loading-lg"></span>;
  }

  // Categorize sessions
  const pendingSessions = tutors.filter(
    (session) => session.status === "Pending"
  );
  const approvedSessions = tutors.filter(
    (session) => session.status === "Approved"
  );
  const rejectedSessions = tutors.filter(
    (session) => session.status === "Rejected"
  );

  const renderTable = (sessions, isPending = false, isApproved = false) => (
    <table className="table-auto w-full border-collapse border rounded-md border-gray-300 text-left">
      <thead>
        <tr className="bg-gray-200">
          <th className="px-4 py-2 border border-gray-300">
            Session Title - Image
          </th>
          <th className="px-4 py-2 border border-gray-300">Tutor Name</th>
          <th className="px-4 py-2 border border-gray-300">
            Tutor Email Address
          </th>
          <th className="px-4 py-2 border border-gray-300">Status</th>

          {(isPending || isApproved) && (
            <th className="px-4 py-2 border border-gray-300 text-center">
              Actions
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {sessions.map((session) => (
          <tr
            key={session._id}
            className="hover:bg-gray-100 border-b border-gray-300"
          >
            <td className="px-4 py-2 flex items-center gap-4">
              <img
                src={session.sessionImage}
                alt={session.title}
                className="w-12 h-12 object-cover rounded"
              />
              {session.sessionTitle}
            </td>
            <td className="px-4 py-2">{session.name}</td>
            <td className="px-4 py-2">{session.email}</td>
            <td className="px-4 py-2">
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full gap-x-2 ${
                  session.status === "Pending" &&
                  "bg-yellow-100/60 text-yellow-500"
                } ${
                  session.status === "Approved" &&
                  "bg-green-100/60 text-green-500"
                } ${
                  session.status === "Rejected" && "bg-red-100/60 text-red-500"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    session.status === "Pending" && "bg-yellow-500"
                  } ${session.status === "Approved" && "bg-green-500"} ${
                    session.status === "Rejected" && "bg-red-500"
                  }`}
                ></span>
                <h2 className="text-sm font-normal">{session.status}</h2>
              </div>
            </td>

            {(isPending || isApproved) && (
              <td className="px-4 py-2 text-center gap-2">
                {isPending && (
                  <>
                    <button
                      onClick={() => openModal(session)}
                      className="cursor-pointer rounded-full bg-green-100 px-3 py-1 font-semibold text-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => openRejectModal(session)}
                      className="cursor-pointer rounded-full bg-red-100 px-3 py-1 font-semibold text-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
                {isApproved && (
                  <>
                    <button
                      onClick={() => openModal(session)}
                      className="cursor-pointer rounded-full bg-green-100 px-3 py-1 font-semibold text-green-700"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(session._id)}
                      className="cursor-pointer rounded-full bg-red-100 px-3 py-1 font-semibold text-red-700"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="md:w-11/12 mx-auto my-4">
      <Helmet>
        <title>Dashboard || All Session</title>
      </Helmet>
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6 text-center">
        ALL Study Sessions :{" "}
        <span className="text-blue-600 bg-blue-100 rounded-full px-2 py-1">
          {tutors.length}
        </span>
      </h2>

      {/* Pending Sessions */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">
          Pending Sessions :{" "}
          <span className="text-blue-600 bg-blue-100 rounded-full px-2 py-1">
            {pendingSessions.length}
          </span>
        </h3>
        <div className="overflow-x-auto">
          {renderTable(pendingSessions, true)}
        </div>
      </div>
      {/* Approved Sessions */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">
          Approved Sessions :{" "}
          <span className="text-blue-600 bg-blue-100 rounded-full px-2 py-1">
            {approvedSessions.length}
          </span>
        </h3>
        <div className="overflow-x-auto">
          {renderTable(approvedSessions, false, true)}
        </div>
      </div>

      {/* Rejected Sessions */}
      <div>
        <h3 className="text-xl font-semibold mb-4">
          Rejected Sessions :{" "}
          <span className="text-blue-600 bg-blue-100 rounded-full px-2 py-1">
            {rejectedSessions.length}
          </span>
        </h3>
        <div className="overflow-x-auto">{renderTable(rejectedSessions)}</div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">Approve Session</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Is the session free or paid?
              </label>
              <select
                value={isPaid ? "Paid" : "Free"}
                onChange={(e) => setIsPaid(e.target.value === "Paid")}
                className="block w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="Free">Free</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
            {isPaid && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Amount</label>
                <input
                  type="number"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  className="block w-full border border-gray-300 rounded px-3 py-2"
                  min="0"
                />
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">Reject Session</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Rejection Reason
              </label>
              <input
                type="text"
                value={rejectionReason}
                required
                onChange={(e) => setRejectionReason(e.target.value)}
                className="block w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter the reason for rejection"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Feedback</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="block w-full border border-gray-300 rounded px-3 py-2"
                rows="3"
                required
                placeholder="Provide feedback for the tutor"
              ></textarea>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={closeRejectModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAllSession;
