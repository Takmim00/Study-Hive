import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import useAuth from "../../hook/useAuth";

const CreateNote = () => {
  const { user } = useAuth();
  const handleNote = async (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const note = form.note.value;

    const noteData = {
      studentEmail: user?.email,
      title,
      note,
    };

    try {
      const { data } = await axios.post(
        "http://localhost:5000/notes",
        noteData
      );
      console.log(data);
      if (data.insertedId) {
        toast.success("Note added successfully!");
        form.reset();
      } else {
        toast.error("Failed to add the note.");
      }
    } catch (error) {
      console.error("Error submitting note:", error);
      alert("An error occurred while submitting your note.");
    }
  };
  return (
    <div>
        <ToastContainer/>
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
      {/* Form Section */}
      <form onSubmit={handleNote} className="mt-6 w-10/12 mx-auto space-y-4">
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
        {/* Note Title */}
        <div>
          <label className="block text-gray-700 font-medium">Note Title:</label>
          <input
            type="text"
            name="title"
            min="1"
            max="10"
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
            Create Note
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNote;
