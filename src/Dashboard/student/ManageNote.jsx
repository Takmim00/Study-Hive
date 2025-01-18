import axios from "axios";
import { useEffect, useState } from "react";
import useAuth from "../../hook/useAuth";

const ManageNote = () => {
  const { user } = useAuth();

  const [notes, setNote] = useState([]);
  useEffect(() => {
    fetchNote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchNote = async () => {
    const { data } = await axios.get(
      `http://localhost:5000/veiwNotes?email=${user?.email}`
    );
    console.log(data);
    setNote(data);
  };
  return (
    <div>
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
              <h2 className="text-gray-800 font-semibold  mb-4">
                <strong>Your email:</strong> {note.studentEmail}
              </h2>
              <p>
                <strong>Note Title:</strong> {note.title}
              </p>
              <p>
                <strong>Note Description:</strong> {note.note}
              </p>
              <div className="pt-2 text-center">
                <button
                  //   onClick={() => handleUpdate(note._id)}
                  className="btn bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700"
                >
                  Update
                </button>
                <button
                  //   onClick={() => handleDelete(tutor._id)}
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
