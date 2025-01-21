import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";

const ViewAllMetarials = () => {
  const {
    data: tutor = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["tutor"],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://study-hive-server-three.vercel.app/metarial`
      );

      return data;
    },
  });
  const handleDelete = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(
          `https://study-hive-server-three.vercel.app/veiwMetarial/${_id}`,
          {
            method: "DELETE",
          }
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.deletedCount > 0) {
              Swal.fire({
                title: "Deleted!",
                text: "Your metarials has been deleted successfully.",
                icon: "success",
              });
              refetch();
            }
          });
      }
    });
  };
  if (isLoading) {
    return <span className="loading loading-dots loading-lg"></span>;
  }
  return (
    <div>
      <div className="my-4">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Veiw All <span className="text-blue-400">Metarials</span>
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          This intuitive tool allows you to design and share in-depth study
          sessions, creating valuable resources for your students and fellow
          tutors.
        </p>
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 w-11/12 mx-auto">
        {tutor.map((tutor, i) => (
          <div
            key={i}
            className=" bg-white border rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src={tutor.materialImage}
              alt="Advanced English Course"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-gray-800 font-semibold text-lg mb-4">
                {tutor.sessionTitle}
              </h2>
              <div>
                <button
                  onClick={() => handleDelete(tutor._id)}
                  className="btn bg-red-600 text-white font-medium py-2 px-4 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewAllMetarials;
