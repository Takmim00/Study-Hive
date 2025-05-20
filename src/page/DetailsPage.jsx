import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../hook/useAuth";
import useRole from "../hook/useRole";
import PurchaseModal from "../modal/PurchaseModal";

// Icons
const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
      clipRule="evenodd"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path
      fillRule="evenodd"
      d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
      clipRule="evenodd"
    />
  </svg>
);

const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
      clipRule="evenodd"
    />
  </svg>
);

const DollarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z" />
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a3.833 3.833 0 001.719-.756c.712-.566 1.112-1.35 1.112-2.178 0-.829-.4-1.612-1.113-2.178a3.833 3.833 0 00-1.718-.756V8.334c.29.082.559.213.786.393l.415.33a.75.75 0 00.933-1.175l-.415-.33a3.836 3.836 0 00-1.719-.755V6z"
      clipRule="evenodd"
    />
  </svg>
);

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path
      fillRule="evenodd"
      d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
      clipRule="evenodd"
    />
  </svg>
);

const DetailsPage = () => {
  const [role, isRoleLoading] = useRole();
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ["session", id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await axios.get(
        `https://study-hive-server-three.vercel.app/tutors/${id}`
      );
      return data;
    },
  });

  const { data: reviews = [], isLoading: isReviewLoading } = useQuery({
    queryKey: ["review", id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await axios.get(
        `https://study-hive-server-three.vercel.app/review/session/${id}`
      );
      return data;
    },
  });

  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return "No ratings yet";
    const total = reviews.reduce(
      (sum, review) => sum + Number.parseFloat(review.rating),
      0
    );
    return (total / reviews.length).toFixed(1);
  };

  const isRegistrationClosed =
    session && new Date() > new Date(session.registrationEndDate);
  const isDisabled =
    isRegistrationClosed || role === "admin" || role === "tutor";

  const handleBookingClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (session.registrationFee > 0) {
      setIsPurchaseModalOpen(true);
    } else {
      handleBooking();
    }
  };

  const handleBooking = async () => {
    try {
      const bookingData = {
        sessionId: id,
        sessionTitle: session.sessionTitle,
        registrationFee: session.registrationFee || 0,
        bookedAt: new Date().toISOString(),
        name: user?.displayName,
        email: user?.email,
        tutorName: session.name,
        tutorEmail: session.email,
        sessionDescription: session.sessionDescription,
        sessionImage: session.sessionImage,
        registrationStartDate: session.registrationStartDate,
        registrationEndDate: session.registrationEndDate,
        classStartTime: session.classStartTime,
        classEndTime: session.classEndTime,
        sessionDuration: Number.parseFloat(session.sessionDuration),
        status: session.status,
      };

      if (session.registrationFee > 0) {
        navigate("/", {
          state: {
            bookingData,
            amount: session.registrationFee,
          },
        });
      } else {
        const res = await axios.post(
          `https://study-hive-server-three.vercel.app/booked`,
          bookingData
        );
        if (res.data.insertedId) {
          toast.success(`${session.sessionTitle} Session is Booked`);
          navigate("/dashboard/viewBooked");
        }
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handlePayment = async () => {
    try {
      const bookingData = {
        sessionId: id,
        sessionTitle: session.sessionTitle,
        registrationFee: session.registrationFee,
        bookedAt: new Date().toISOString(),
        name: user?.displayName,
        email: user?.email,
        tutorName: session.name,
        tutorEmail: session.email,
        sessionDescription: session.sessionDescription,
        sessionImage: session.sessionImage,
        registrationStartDate: session.registrationStartDate,
        registrationEndDate: session.registrationEndDate,
        classStartTime: session.classStartTime,
        classEndTime: session.classEndTime,
        sessionDuration: Number.parseFloat(session.sessionDuration),
        status: session.status,
      };

      const res = await axios.post(
        `https://study-hive-server-three.vercel.app/booked`,
        bookingData
      );
      if (res.data.insertedId) {
        toast.success(`${session.sessionTitle} Session is Booked`);
        setIsPurchaseModalOpen(false);
        navigate("/dashboard/viewBooked");
      }
    } catch (err) {
      toast.error("Booking failed. Please try again.");
    }
  };

  if (isSessionLoading || isReviewLoading || isRoleLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="loading loading-spinner loading-lg text-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 mr-2"
          >
            <path
              fillRule="evenodd"
              d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
              clipRule="evenodd"
            />
          </svg>
          Back to Sessions
        </button>

        {session && (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="relative h-80 md:h-96">
              <img
                src={session.sessionImage || "/placeholder.svg"}
                alt={session.sessionTitle}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

              <div className="absolute bottom-0 left-0 p-6 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isRegistrationClosed ? "bg-red-500" : "bg-green-500"
                    }`}
                  >
                    {isRegistrationClosed
                      ? "Registration Closed"
                      : "Registration Open"}
                  </span>

                  <span className="flex items-center bg-blue-500 px-3 py-1 rounded-full text-xs font-medium">
                    <StarIcon />
                    <span className="ml-1">{calculateAverageRating()}</span>
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {session.sessionTitle}
                </h1>

                <div className="flex items-center">
                  <UserIcon />
                  <span className="ml-2 text-lg">{session.name}</span>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === "details"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Session Details
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === "reviews"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Reviews ({reviews.length})
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "details" ? (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      About This Session
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {session.sessionDescription}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-5 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4 text-blue-800">
                        Registration Period
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <CalendarIcon />
                          <div className="ml-3">
                            <p className="text-sm text-gray-500">Start Date</p>
                            <p className="font-medium">
                              {new Date(
                                session.registrationStartDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon />
                          <div className="ml-3">
                            <p className="text-sm text-gray-500">End Date</p>
                            <p className="font-medium">
                              {new Date(
                                session.registrationEndDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 p-5 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4 text-purple-800">
                        Class Schedule
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <ClockIcon />
                          <div className="ml-3">
                            <p className="text-sm text-gray-500">Start Time</p>
                            <p className="font-medium">
                              {session.classStartTime}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <ClockIcon />
                          <div className="ml-3">
                            <p className="text-sm text-gray-500">End Time</p>
                            <p className="font-medium">
                              {session.classEndTime}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <ClockIcon />
                          <div className="ml-3">
                            <p className="text-sm text-gray-500">Duration</p>
                            <p className="font-medium">
                              {session.sessionDuration} hours
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-5 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-green-800">
                        Registration Fee
                      </h3>
                      <div className="flex items-center">
                        <DollarIcon />
                        <span className="ml-2 text-2xl font-bold text-green-700">
                          {session.registrationFee > 0
                            ? `$${session.registrationFee}`
                            : "Free"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      disabled={isDisabled}
                      onClick={handleBookingClick}
                      className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                        isDisabled
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {isRegistrationClosed
                        ? "Registration Closed"
                        : "Book This Session"}
                    </button>
                    {!user && !isDisabled && (
                      <p className="text-center text-sm text-gray-500 mt-2">
                        You need to be logged in to book this session
                      </p>
                    )}
                    {(isDisabled && role === "admin") || role === "tutor" ? (
                      <p className="text-center text-sm text-gray-500 mt-2">
                        Admins and tutors cannot book sessions
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Student Reviews
                  </h2>

                  {reviews.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        No reviews yet for this session.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((review, i) => (
                        <div key={i} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                              {review.name
                                ? review.name.charAt(0).toUpperCase()
                                : "U"}
                            </div>
                            <div className="ml-3">
                              <p className="font-medium">
                                {review.name || "Anonymous"}
                              </p>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, index) => (
                                  <StarIcon
                                    key={index}
                                    className={`w-4 h-4 ${
                                      index < review.rating
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                                <span className="ml-1 text-sm text-gray-500">
                                  {new Date(review.date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700">{review.review}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      {session && (
        <PurchaseModal
          session={session}
          isOpen={isPurchaseModalOpen}
          closeModal={() => setIsPurchaseModalOpen(false)}
          handlePayment={handlePayment}
        />
      )}
    </>
  );
};

export default DetailsPage;
