"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";

const AllTutor = () => {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://study-hive-server-three.vercel.app/users`
      );
      return data;
    },
  });

  const tutors = users.filter((user) => user.role === "tutor").slice(0, 4);

  return (
    <div className="w-11/12 mx-auto my-12">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold">
          Our <span className="text-blue-500">Tutors</span>
        </h2>
        <div className="w-16 h-1 bg-blue-500 mx-auto mt-2"></div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="loading loading-spinner loading-lg text-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tutors.map((tutor) => (
            <div
              key={tutor._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6 text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-100">
                    <img
                      src={
                        tutor.photo || "/placeholder.svg?height=100&width=100"
                      }
                      alt={tutor.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=100&width=100";
                      }}
                    />
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  {tutor.name || "Tutor Name"}
                </h3>

                <p className="text-blue-500 text-sm font-medium mb-3">
                  {tutor.education || "Education Expert"}
                </p>

                <p className="text-gray-500 text-sm mb-4 truncate">
                  {tutor.email}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link to='/tutor' className="btn px-6 py-2 border border-blue-500 text-blue-500 hover:bg-blue-50 rounded-md transition-colors text-sm font-medium">
          View All Tutors
        </Link>
      </div>
    </div>
  );
};

export default AllTutor;
