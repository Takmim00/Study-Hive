const ViewDetails = () => {
  return (
    <div>
      <div className="my-4">
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
          <div className="w-full md:w-1/3">
            <img
              src="path/to/image" // Replace with your image source
              alt="Advanced English Course"
              className="rounded-lg w-full"
            />
          </div>
        </div>

        {/* Course Details */}
        <div className="mt-6 md:mt-0 md:ml-8">
          <h3 className="text-xl font-semibold text-gray-700">
            Advanced English Communication
          </h3>
          <p className="text-sm text-gray-600 mt-2">
            This course is designed to enhance students' proficiency in English,
            focusing on advanced communication skills for academic,
            professional, and social contexts. It covers complex grammar
            structures.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-gray-800">
            <div>
              <p>
                <span className="font-semibold">Student Name:</span> Student
                Account
              </p>
              <p>
                <span className="font-semibold">Student Email:</span>{" "}
                student@gmail.com
              </p>
              <p>
                <span className="font-semibold">Tutor Name:</span> Tutor
              </p>
              <p>
                <span className="font-semibold">Tutor Email:</span>{" "}
                tutor@gmail.com
              </p>
            </div>
            <div>
              <p>
                <span className="font-semibold">Class Start Time:</span> 07:00
              </p>
              <p>
                <span className="font-semibold">Class End Time:</span> 10:00
              </p>
              <p>
                <span className="font-semibold">Session Duration:</span> 3 hours
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
            <form className="mt-6 w-10/12 mx-auto space-y-4">
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
                  placeholder="Student Account"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  type="email"
                  placeholder="student@gmail.com"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  type="text"
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
