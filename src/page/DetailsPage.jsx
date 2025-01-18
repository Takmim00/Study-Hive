import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import useAuth from "../hook/useAuth";

const DetailsPage = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState({});
  const [review, setReview] = useState([]);

  useEffect(() => {
    fetchSessionData();
    fetchReviewsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchSessionData = async () => {
    const { data } = await axios.get(`http://localhost:5000/tutors/${id}`);
    setSession(data);
  };
  const fetchReviewsData = async (sessionId) => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/reviews?sessionId=${sessionId}`
      );
      setReview(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };
  const calculateAverageRating = () => {
    if (review.length === 0) return "No ratings yet";
    const total = review.reduce(
      (sum, review) => sum + parseFloat(review.rating),
      0
    );
    return (total / review.length).toFixed(1);
  };

  const isRegistrationClosed =
    new Date() > new Date(session.registrationEndDate);
  const isDisabled =
    isRegistrationClosed || user?.role === "admin" || user?.role === "tutor";

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
        sessionDuration: parseFloat(session.sessionDuration),
        status: session.status,
      };

      if (session.registrationFee > 0) {
        navigate("/payment", {
          state: {
            bookingData,
            amount: session.registrationFee,
          },
        });
      } else {
        const res = await axios.post(`http://localhost:5000/booked`, bookingData);
        if (res.data.insertedId) {
          toast.success(`${session.sessionTitle} Session is Booked`);
          navigate("/");
        }
      }
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="w-1/2 mx-auto border-2 shadow-lg rounded-lg my-6 p-4">
        {session && (
          <>
            <div className="flex flex-col items-start gap-4">
              <img
                src={session.sessionImage}
                alt={session.title}
                className="w-full  object-cover rounded shadow"
              />
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{session.sessionTitle}</h1>
                <p>
                  <strong>Tutor Name:</strong> {session.name}
                </p>
                <p>
                  <strong>Average Rating:</strong> {calculateAverageRating()}
                </p>
                <p>
                  <strong>Description:</strong> {session.sessionDescription}
                </p>
                <p>
                  <strong>Registration Start Date:</strong>{" "}
                  {session.registrationStartDate}
                </p>
                <p>
                  <strong>Registration End Date:</strong>{" "}
                  {session.registrationEndDate}
                </p>
                <p>
                  <strong>Class Start Time:</strong> {session.classStartTime}
                </p>
                <p>
                  <strong>Class End Date:</strong> {session.classEndTime}
                </p>
                <p>
                  <strong>Session Duration:</strong> {session.sessionDuration}{" "}
                  hours
                </p>
                <p>
                  <strong>Registration Fee:</strong>$
                  {session.registrationFee || "Free"}
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mt-4">Reviews</h2>
              {review.map((review, i) => (
                <div key={i} className="border-b py-2">
                  <p>
                    <strong>Comment:</strong> {review.review}
                  </p>
                </div>
              ))}
            </div>
            <button
              disabled={isDisabled}
              onClick={handleBooking}
              className={`mt-4 px-4 py-2 text-white rounded ${
                isDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 btn"
              }`}
            >
              {isRegistrationClosed ? "Registration Closed" : "Book Now"}
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default DetailsPage;
