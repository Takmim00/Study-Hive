import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import useAuth from "../../hook/useAuth";

const ViewDetails = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState({});
  useEffect(() => {
    fetchSessionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchSessionData = async () => {
    const { data } = await axios.get(`http://localhost:5000/booked/${id}`);
    console.log(data);
    setSession(data);
  };
  const handleReview = async (e) => {
    e.preventDefault();

    const form = e.target;
    const review = form.review.value;
    const rating = form.rating.value;

    const reviewPayload = {
      studentName: user?.displayName,
      studentEmail: user?.email,
      sessionId: session.sessionId,
      review,
      rating,
    };

    try {
      const { data } = await axios.post(
        "http://localhost:5000/reviews",
        reviewPayload
      );
      console.log(data);
      if (data.insertedId) {
        form.reset()
        toast.success("Review added successfully!");
        navigate('/dashboard/viewBooked')
      } else {
        toast.error("Failed to add the review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("An error occurred while submitting your review.");
    }
  };
  return (
    <div>
      <ToastContainer />
      <div className="my-2">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Veiw <span className="text-blue-400">Booked Details Session</span>
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          This intuitive tool allows you to design and share in-depth study
          sessions, creating valuable resources for your students and fellow
          tutors.
        </p>
      </div>
      <div className="w-11/12 my-4 mx-auto bg-white shadow-md rounded-lg p-6 flex flex-col  items-center">
        <div>
          <div className="flex flex-col items-center">
            {/* Image Section */}
            <div className="w-full  ">
              <img
                src={session.sessionImage} // Replace with your image source
                alt="Advanced English Course"
                className="rounded-lg w-full lg:h-[50vh] object-cover"
              />
            </div>
          </div>

          {/* Course Details */}
          <div className="mt-6 md:mt-0 md:ml-8">
            <h3 className="text-xl font-semibold text-gray-700">
              {session.sessionTitle}
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              {session.sessionDescription}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-gray-800">
              <div>
                <p>
                  <span className="font-semibold">Student Name:</span>{" "}
                  {session.bookedName}
                </p>
                <p>
                  <span className="font-semibold">Student Email:</span>{" "}
                  {session.bookedEmail}
                </p>
                <p>
                  <span className="font-semibold">Tutor Name:</span>{" "}
                  {session.name}
                </p>
                <p>
                  <span className="font-semibold">Tutor Email:</span>{" "}
                  {session.email}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">Class Start Time:</span>{" "}
                  {session.classStartTime}
                </p>
                <p>
                  <span className="font-semibold">Class End Time:</span>{" "}
                  {session.classEndTime}
                </p>
                <p>
                  <span className="font-semibold">Session Duration:</span>{" "}
                  {session.sessionDuration} hours
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center  ">
          <div className="  bg-white  p-8">
            {/* Header Section */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800">
                Please Provide Your{" "}
                <span className="text-blue-600">Review & Rating</span>
              </h1>
              <p className="text-gray-600 mt-2">
                Feeling overwhelmed by upcoming exams and projects? Juggling a
                busy schedule can make it tough to keep track of your booked
                study sessions. Designed specifically for students, this guide
                is here to help!
              </p>
            </div>

            {/* Form Section */}
            <form
              onSubmit={handleReview}
              className="mt-6 w-10/12 mx-auto space-y-4"
            >
              {/* Student Name */}
              <div>
                <label
                  className="block text-gray-700 font-medium"
                  htmlFor="studentName"
                >
                  Student Name:
                </label>
                <input
                  id="studentName"
                  type="text"
                  defaultValue={user?.displayName}
                  readOnly
                  placeholder="Student Account"
                  className="w-full border cursor-not-allowed border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Student Email */}
              <div>
                <label
                  className="block text-gray-700 font-medium"
                  htmlFor="studentEmail"
                >
                  Student Email:
                </label>
                <input
                  id="studentEmail"
                  defaultValue={user?.email}
                  type="email"
                  placeholder="student@gmail.com"
                  className="w-full border cursor-not-allowed border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Your Review */}
              <div>
                <label
                  className="block text-gray-700 font-medium"
                  htmlFor="review"
                >
                  Your Review:
                </label>
                <textarea
                  id="review"
                  name="review"
                  placeholder="Your Review..."
                  className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="5"
                ></textarea>
              </div>

              {/* Your Rating */}
              <div>
                <label
                  className="block text-gray-700 font-medium"
                  htmlFor="rating"
                >
                  Your Rating:
                </label>
                <input
                  id="rating"
                  type="number"
                  name="rating"
                  min="1"
                  max="10"
                  placeholder="Your Rating..."
                  className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white font-medium px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Send Review & Rating
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;
