import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hook/useAuth";

const Courses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("asc");

  const { data: tutors = [], isLoading } = useQuery({
    queryKey: ["tutors", search, sortBy, order],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:5000/tutor?search=${search}&sortBy=${sortBy}&order=${order}`
      );
      console.log(data);
      return data;
    },
  });

  const handleReadMore = (sessionId) => {
    
    
      navigate(`/sessionDetail/${sessionId}`);
    
  };

  return (
    <div className="my-4">
      <h2 className="text-2xl text-center font-bold mb-6">
        Available <span className="text-blue-400">Course</span>
      </h2>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
        <div className="flex p-1 overflow-hidden border rounded-lg    focus-within:ring focus-within:ring-opacity-40 focus-within:border-blue-400 focus-within:ring-blue-300">
          <input
            className="px-6 py-2 text-gray-700 placeholder-gray-500 bg-white outline-none focus:placeholder-transparent"
            type="text"
            name="search"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            placeholder="Enter Job Title"
            aria-label="Enter Job Title"
          />

          <button className="px-1 md:px-4 py-3 text-sm font-medium tracking-wider text-gray-100 uppercase transition-colors duration-300 transform bg-blue-500 rounded-md hover:bg-blue-600 focus:bg-blue-600 focus:outline-none">
            Search
          </button>
        </div>

        <div className="mb-4 flex gap-4 mt-4 items-center">
          <div>
            <select
              className="border p-2 rounded"
              defaultValue=""
              onChange={(e) => {
                const [field, orderValue] = e.target.value.split("-");
                setSortBy(field);
                setOrder(orderValue);
              }}
            >
              <option value="" disabled>
                Sort by Price
              </option>
              <option value="registrationFee-desc">Highest Price</option>
              <option value="registrationFee-asc">Lowest Price</option>
            </select>
          </div>
        </div>
      </div>
      <div>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-500"></div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 w-11/12 mx-auto">
            {tutors
              .filter((session) => session.status === "Approved")
              .map((session, i) => {
                const currentDate = new Date();
                const registrationStartDate = new Date(
                  session.registrationStartDate
                );
                const registrationEndDate = new Date(
                  session.registrationEndDate
                );
                const isRegistrationOngoing =
                  currentDate >= registrationStartDate &&
                  currentDate <= registrationEndDate;

                return (
                  <div
                    key={i}
                    className=" bg-white border flex flex-col rounded-lg shadow-md overflow-hidden"
                  >
                    <img
                      className="w-full h-48 object-cover"
                      src={session.sessionImage}
                      alt="Course Thumbnail"
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-bold text-blue-700">
                        {session.sessionTitle}
                      </h3>
                      <p className="text-gray-600  text-sm mt-2 line-clamp-2">
                        {session.sessionDescription}
                      </p>

                      <p>
                        <strong>Tutor Name:</strong> {session.name}
                      </p>

                      <p className=" text-sm font-medium">
                        <strong>Registration Start Date:</strong>{" "}
                        <span className="font-normal text-orange-600">
                          {session.registrationStartDate}
                        </span>
                      </p>
                      <p className=" text-sm font-medium">
                        <strong>Registration End Date:</strong>{" "}
                        <span className="font-normal text-orange-600">
                          {session.registrationEndDate}
                        </span>
                      </p>

                      <p className="  font-semibold mt-2">
                        <strong>Registration Fee: $</strong>{" "}
                        {session.registrationFee > 0
                          ? `${session.registrationFee}`
                          : "Free"}
                      </p>
                      <div className="mt-2 flex justify-between items-center">
                        <button
                          className={`px-4 py-2 rounded-xl ${
                            isRegistrationOngoing
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {isRegistrationOngoing ? "Ongoing" : "Closed"}
                        </button>

                        <Link
                          onClick={() => handleReadMore(session._id)}
                          className="btn px-4 py-2 bg-blue-500 text-white rounded-xl"
                        >
                          Read More
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
