import { Helmet } from "react-helmet-async";
import useAuth from "../hook/useAuth";
import useRole from "../hook/useRole";

const Profile = () => {
  const { user, loading } = useAuth();
  const [role, isLoading] = useRole();
  if ((loading, isLoading))
    return <span className="loading loading-dots loading-lg"></span>;

  return (
    <div className="flex justify-center items-center h-screen">
      <Helmet>
        <title>Dashboard || Profile</title>
      </Helmet>
      <div className="bg-white shadow-lg rounded-2xl md:w-4/5 lg:w-3/5 w-11/12">
        <img
          alt="cover photo"
          src={user?.photoURL}
          className="w-full mb-4 rounded-t-lg h-56 object-cover"
        />
        <div className="flex flex-col items-center justify-center p-4 -mt-16">
          <a href="#" className="relative block">
            <img
              alt="profile"
              src={user?.photoURL}
              className="mx-auto object-cover rounded-full h-24 w-24  border-2 border-white "
            />
          </a>

          <p className="p-2 px-4 text-xs text-white bg-blue-500 rounded-full">
            {role}
          </p>
          <p className="mt-2 md:text-xl  md:font-medium text-gray-800 ">
            User Id: {user?.uid}
          </p>
          <div className="w-full p-2 mt-4 rounded-lg">
            <div className="flex flex-wrap items-center justify-between text-sm text-gray-600 ">
              <p className="flex flex-col">
                Name
                <span className="font-bold text-black ">
                  {user?.displayName}
                </span>
              </p>
              <p className="flex flex-col">
                Email
                <span className="font-bold text-black ">{user?.email}</span>
              </p>

              <div>
                <button className="bg-blue-500 px-10 py-1 rounded-lg text-white  cursor-pointer hover:bg-blue-800 block mb-1">
                  Update Profile
                </button>
                <button className="bg-blue-500 px-7 py-1 rounded-lg text-white cursor-pointer hover:bg-blue-800">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
