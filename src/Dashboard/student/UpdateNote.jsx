import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import useAxiosSecure from "../../hook/useAxiosSecure";

const UpdateNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const { data: notes, isLoading } = useQuery({
    queryKey: ["note", id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await axios.get(
        `https://study-hive-server-three.vercel.app/veiwNotes/notes/${id}`
      );

      return data;
    },
  });

  const handleUpdateNote = async (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const note = form.note.value;

    const updatedNoteData = {
      title,
      note,
    };

    try {
      const res = await axiosSecure.put(
        `https://study-hive-server-three.vercel.app/updateNotes/${id}`,
        updatedNoteData
      );

      if (res.data.modifiedCount > 0) {
        toast.success("Note updated successfully!");
        navigate("/dashboard/manageNotes");
      } else {
        toast.error("No changes made or update failed");
      }
    } catch (err) {
      toast.error("Error updating note!");
      toast.error(err);
    }
  };
  if (isLoading) {
    return <span className="loading loading-dots loading-lg"></span>;
  }
  return (
    <div>
      <div className="my-4">
        <ToastContainer />
        <h2 className="text-2xl font-bold mb-6 text-center">
          Update Your <span className="text-blue-600">Notes</span>
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          This intuitive tool allows you to design and share in-depth study
          sessions, creating valuable resources for your students and fellow
          tutors.
        </p>
      </div>
      {/* Form Section */}
      <form
        onSubmit={handleUpdateNote}
        className="mt-6 w-10/12 mx-auto space-y-4"
      >
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
            defaultValue={notes?.studentEmail}
            type="email"
            placeholder="student@gmail.com"
            className="w-full border cursor-not-allowed border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Note Title */}
        <div>
          <label className="block text-gray-700 font-medium">Note Title:</label>
          <input
            type="text"
            name="title"
            defaultValue={notes.title}
            placeholder="Note Title..."
            className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Note Descriptions */}
        <div>
          <label className="block text-gray-700 font-medium">
            Note Descriptions:
          </label>
          <textarea
            id="note"
            name="note"
            defaultValue={notes.note}
            placeholder="Your Note..."
            className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="5"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white font-medium px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Update Note
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateNote;
