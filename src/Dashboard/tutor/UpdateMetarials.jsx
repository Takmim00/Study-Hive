import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UpdateMetarials = () => {
  const { id } = useParams(); 
  console.log(id);
  const [tutor, setTutor] = useState({}); 

  useEffect(() => {
    fetchTutorData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
 
  const fetchTutorData = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/tutors/${id}`);
      console.log(data);
      setTutor(data); 
    } catch (error) {
      console.error("Error fetching tutor data:", error);
    }
  };

  return (
    <div>
      <div className="my-4">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Update Your <span className="text-blue-600">Study Session</span>
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          This intuitive tool allows you to design and share in-depth study
          sessions, creating valuable resources for your students and fellow
          tutors.
        </p>
      </div>
      <form className="p-6 max-w-4xl mx-auto bg-white rounded shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="">
            <label className="block font-semibold mb-2">Session Title:</label>
            <input
              type="text"
              name="sessionTitle"
              placeholder="Session Title..."
              defaultValue={tutor?.sessionTitle}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="">
            <label className="block font-semibold mb-2">Tutor Name:</label>
            <input
              type="text"
              name="name"
              defaultValue={tutor?.name || ""}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div className="">
            <label className="block font-semibold mb-2">Tutor Email:</label>
            <input
              type="email"
              name="email"
              defaultValue={tutor?.email || ""}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div className="">
            <label className="block font-semibold mb-2">Session Image:</label>
            <input
              type="file"
              name="sessionImage"
              className="w-full p-2 border rounded"
              defaultValue={tutor?.sessionImage}
            />
          </div>
          <div className=" col-span-2">
            <label className="block font-semibold mb-2">
              Session Description:
            </label>
            <textarea
              name="sessionDescription"
              placeholder="Session Description..."
              defaultValue={tutor?.sessionDescription}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="">
            <label className="block font-semibold mb-2">
              Registration Start Date:
            </label>
            <input
              type="date"
              name="registrationStartDate"
              defaultValue={tutor?.registrationStartDate}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="">
            <label className="block font-semibold mb-2">
              Registration End Date:
            </label>
            <input
              type="date"
              name="registrationEndDate"
              defaultValue={tutor?.registrationEndDate}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="">
            <label className="block font-semibold mb-2">
              Class Start Time:
            </label>
            <input
              type="time"
              name="classStartTime"
              defaultValue={tutor?.classStartTime}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="">
            <label className="block font-semibold mb-2">Class End Time:</label>
            <input
              type="time"
              name="classEndTime"
              defaultValue={tutor?.classEndTime}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="">
            <label className="block font-semibold mb-2">
              Session Duration (hours):
            </label>
            <input
              type="number"
              name="sessionDuration"
              defaultValue={tutor?.sessionDuration}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="">
            <label className="block font-semibold mb-2">
              Registration Fee:
            </label>
            <input
              type="number"
              name="registrationFee"
              defaultValue={tutor?.registrationFee}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 px-4 mt-4 rounded hover:bg-blue-600"
        >
          Update Study Session
        </button>
      </form>
    </div>
  );
};

export default UpdateMetarials;
