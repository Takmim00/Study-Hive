import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import useAuth from "../../hook/useAuth";

const ViewDetails = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const { data: session, isLoading } = useQuery({
    queryKey: ["session", id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await axios.get(
        `https://study-hive-server-three.vercel.app/booked/${id}`
      );
      return data;
    },
  });

  const handleReview = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.target;
    const review = form.review.value;

    if (!rating) {
      toast.error("Please select a rating");
      setIsSubmitting(false);
      return;
    }

    const reviewPayload = {
      studentName: user?.displayName,
      studentEmail: user?.email,
      sessionId: session.sessionId,
      sessionName: session.sessionTitle,
      review,
      rating,
    };

    try {
      const { data } = await axios.post(
        "https://study-hive-server-three.vercel.app/reviews",
        reviewPayload
      );

      if (data.insertedId) {
        form.reset();
        setRating(0);
        toast.success("Review added successfully!");
        setTimeout(() => {
          navigate("/dashboard/viewBooked");
        }, 1500);
      } else {
        toast.error("Failed to add the review.");
      }
    } catch (error) {
      toast.error("Error submitting review: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to determine session status
  const getSessionStatus = () => {
    if (!session || !session.classStartTime) return { label: "Unknown", color: "gray" };
    
    const now = new Date();
    const startTime = new Date(session.classStartTime);
    const endTime = new Date(session.classEndTime);
    
    if (now < startTime) {
      return { label: "Upcoming", color: "blue" };
    } else if (now >= startTime && now <= endTime) {
      return { label: "In Progress", color: "green" };
    } else {
      return { label: "Completed", color: "purple" };
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-80">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-4 text-gray-600">Loading session details...</p>
      </div>
    );
  }

  const status = getSessionStatus();

  return (
    <div className=" pb-12">
      <Helmet>
        <title>Session Details | Study Hive</title>
      </Helmet>
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="bg-white shadow-sm py-6 px-4 mb-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800">
            Session <span className="text-blue-500">Details</span>
          </h2>
          <p className="text-gray-600 mt-1">
            View detailed information about your booked session
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Session Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden lg:w-2/3">
            {/* Session Image */}
            <div className="relative w-full h-64 md:h-80 overflow-hidden">
              <img
                src={session.sessionImage || "/placeholder.svg?height=320&width=640"}
                alt={session.sessionTitle || "Session"}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${status.color}-100 text-${status.color}-700`}>
                  {status.label}
                </span>
              </div>
            </div>

            <div className="p-6">
              {/* Session Title and Description */}
              <h1 className="text-2xl font-bold text-gray-800 mb-3">
                {session.sessionTitle}
              </h1>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {session.sessionDescription}
              </p>

              {/* Session Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Student Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Student Information
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-medium">Name:</span>{" "}
                      {session.name}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Email:</span>{" "}
                      {session.email}
                    </p>
                  </div>
                </div>

                {/* Tutor Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Tutor Information
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-medium">Name:</span>{" "}
                      {session.tutorName}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Email:</span>{" "}
                      {session.tutorEmail}
                    </p>
                  </div>
                </div>

                {/* Session Schedule */}
                <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Session Schedule
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Start Time</p>
                      <p className="text-gray-800 font-medium">{session.classStartTime}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">End Time</p>
                      <p className="text-gray-800 font-medium">{session.classEndTime}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Duration</p>
                      <p className="text-gray-800 font-medium">{session.sessionDuration} hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Review Form Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:w-1/3 h-fit sticky top-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Your <span className="text-blue-500">Feedback</span>
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Share your experience and help other students make informed decisions.
            </p>

            <form onSubmit={handleReview} className="space-y-5">
              {/* Student Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="studentName">
                  Student Name
                </label>
                <input
                  id="studentName"
                  type="text"
                  defaultValue={user?.displayName}
                  readOnly
                  className="w-full bg-gray-50 border cursor-not-allowed border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none"
                />
              </div>

              {/* Student Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="studentEmail">
                  Student Email
                </label>
                <input
                  id="studentEmail"
                  type="email"
                  defaultValue={user?.email}
                  readOnly
                  className="w-full bg-gray-50 border cursor-not-allowed border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Rating
                </label>
                <div className="flex items-center">
                  {[...Array(10)].map((_, index) => {
                    const ratingValue = index + 1;
                    return (
                      <button
                        type="button"
                        key={index}
                        className={`text-2xl focus:outline-none transition-colors ${
                          (hoverRating || rating) >= ratingValue
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        onClick={() => setRating(ratingValue)}
                        onMouseEnter={() => setHoverRating(ratingValue)}
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        ★
                      </button>
                    );
                  })}
                  <span className="ml-2 text-sm text-gray-600">
                    {rating ? `${rating}/10` : "Select rating"}
                  </span>
                  <input
                    type="hidden"
                    name="rating"
                    value={rating}
                  />
                </div>
              </div>

              {/* Review */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="review">
                  Your Review
                </label>
                <textarea
                  id="review"
                  name="review"
                  placeholder="Share your experience with this session..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="5"
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white ${
                  isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                } transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Submit Review
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;