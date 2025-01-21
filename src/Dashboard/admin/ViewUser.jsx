import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import useAuth from "../../hook/useAuth";
import useAxiosSecure from "../../hook/useAxiosSecure";
import UserDataRow from "./UserDataRow";
import { ToastContainer } from "react-toastify";

const ViewUser = () => {
  const { user, loading } = useAuth();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const axiosSecure = useAxiosSecure();
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]);
  const {
    data: users = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["users", user?.email, debouncedSearch],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/all-users/${user?.email}?search=${debouncedSearch}`
      );
      console.log(data);
      return data;
    },
  });
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    refetch();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <ToastContainer />
      <div className="my-2">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Veiw <span className="text-blue-400">All Users</span>
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          This intuitive tool allows you to design and share in-depth study
          sessions, creating valuable resources for your students and fellow
          tutors.
        </p>
      </div>
      {/* Search Bar */}
      <div className="mb-4 flex justify-center">
        <form
          onSubmit={handleSearchSubmit}
          className="w-full md:max-w-sm flex gap-2"
        >
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search users..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button className="px-1 md:px-4 py-3 text-sm font-medium tracking-wider text-gray-100 uppercase transition-colors duration-300 transform bg-blue-700 rounded-md hover:bg-blue-600 focus:bg-blue-600 focus:outline-none">
            Search
          </button>
        </form>
      </div>

      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr className="font-bold">
                    <th
                      scope="col"
                      className="px-5 py-3 font-bold bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase "
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-bold "
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-bold "
                    >
                      Role
                    </th>

                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-bold "
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4">
                        <span className="loading loading-dots loading-lg"></span>
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <UserDataRow
                        refetch={refetch}
                        key={user?._id}
                        userData={user}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUser;
