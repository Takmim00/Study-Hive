import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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
    <div className="w-11/12 mx-auto my-4">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">
          <span className="text-blue-400">Tutors</span>
        </h2>
      </div>

      {isLoading ? (
        <span className="loading loading-dots loading-lg"></span>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3  gap-6">
          {tutors.map((tutor) => (
            <div
              key={tutor._id}
              className=" bg-white border rounded-lg shadow-lg p-4"
            >
              <img
                src={tutor.photo}
                alt={tutor.name}
                className="w-28 h-28 mx-auto rounded-full border-2 object-cover border-gray-300"
              />
              <h3 className="mt-4 text-center text-lg font-bold text-gray-800">
                {tutor.name}
              </h3>
              <p className="text-center text-sm text-gray-500">{tutor.email}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllTutor;
