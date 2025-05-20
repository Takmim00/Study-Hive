import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../hook/useAuth";

const ManageNote = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["notes", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const { data } = await axios.get(
        `https://study-hive-server-three.vercel.app/veiwNotes?email=${user?.email}`
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
        fetch(`https://study-hive-server-three.vercel.app/notes/${_id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.deletedCount > 0) {
              Swal.fire({
                title: "Deleted!",
                text: "Your note has been deleted successfully.",
                icon: "success",
              });
              queryClient.invalidateQueries(["notes", user?.email]);
            }
          });
      }
    });
  };
  const handleUpdate = (id) => {
    navigate(`updateNotes/${id}`);
  };
  if (isLoading) {
    return (
      <div className="loading loading-spinner loading-lg text-blue-500"></div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>Dashboard || Manage Notes</title>
      </Helmet>
      <div className="my-4">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Manage your <span className="text-blue-400">Notes</span>
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          This intuitive tool allows you to design and share in-depth study
          sessions, creating valuable resources for your students and fellow
          tutors.
        </p>
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 w-11/12 mx-auto">
        {notes.map((note, i) => (
          <div
            key={i}
            className=" bg-white border rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-4">
              <h2 className="text-black font-semibold  mb-4">
                <strong>Your email:</strong> {note.studentEmail}
              </h2>
              <p className="text-black">
                <strong>Note Title:</strong> {note.title}
              </p>
              <p className="text-black">
                <strong>Note Description:</strong> {note.note}
              </p>
              <div className="pt-2 text-center">
                <button
                  onClick={() => handleUpdate(note._id)}
                  className="btn bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(note._id)}
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

export default ManageNote;
