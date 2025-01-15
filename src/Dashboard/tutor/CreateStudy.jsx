import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import useAuth from "../../hook/useAuth";
import useAxiosPublic from "../../hook/useAxiosPublic";

const image_hosting_key=import.meta.env.VITE_IMAGE_API;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;
const CreateStudy = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic()
  const [formData, setFormData] = useState({
    sessionTitle: "",
    name: "",
    email: "",
    sessionDescription: "",
    sessionImage: null,
    registrationStartDate: "",
    registrationEndDate: "",
    classStartTime: "",
    classEndTime: "",
    sessionDuration: 0,
    registrationFee: 0,
    status: "Pending",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.displayName || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, sessionImage: file });

    // Upload the image to imgbb
    if (file) {
      const formDataToSend = new FormData();
      formDataToSend.append("image", file);

      try {
        const response = await axiosPublic.post(image_hosting_api, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const imageUrl = response.data.data.display_url; 
        setFormData((prev) => ({
          ...prev,
          sessionImage: imageUrl, 
        }));
      } catch (err) {
        toast.error("Image upload failed!");
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tutorData = {
      ...formData,
    };

    console.log(tutorData);
    try {
      const formDataToSend = new FormData();
      Object.entries(tutorData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const res = await axios.post(
        `http://localhost:5000/tutors`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(res.data);
      toast.success("Data Added Successfully!!!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 max-w-4xl mx-auto bg-white rounded shadow-md"
    >
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6 text-center">
        Create a <span className="text-blue-600">New Study Session</span>
      </h2>
      <p className="text-gray-600 mb-8 text-center">
        This intuitive tool allows you to design and share in-depth study
        sessions, creating valuable resources for your students and fellow
        tutors.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block font-semibold mb-2">Session Title:</label>
          <input
            type="text"
            name="sessionTitle"
            placeholder="Session Title..."
            value={formData.sessionTitle}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Tutor Name:</label>
          <input
            type="text"
            name="name"
            value={user?.displayName}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Tutor Email:</label>
          <input
            type="email"
            name="email"
            value={user?.email}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-2">
            Session Description:
          </label>
          <textarea
            name="sessionDescription"
            placeholder="Session Description..."
            value={formData.sessionDescription}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Session Image:</label>
          <input
            type="file"
            name="sessionImage"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-2">
            Registration Start Date:
          </label>
          <input
            type="date"
            name="registrationStartDate"
            value={formData.registrationStartDate}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-2">
            Registration End Date:
          </label>
          <input
            type="date"
            name="registrationEndDate"
            value={formData.registrationEndDate}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Class Start Time:</label>
          <input
            type="time"
            name="classStartTime"
            value={formData.classStartTime}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Class End Time:</label>
          <input
            type="time"
            name="classEndTime"
            value={formData.classEndTime}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-2">
            Session Duration (hours):
          </label>
          <input
            type="number"
            name="sessionDuration"
            value={formData.sessionDuration}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Registration Fee:</label>
          <input
            type="number"
            name="registrationFee"
            value={formData.registrationFee}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-3 px-4 rounded hover:bg-blue-600"
      >
        Create Study Session
      </button>
    </form>
  );
};

export default CreateStudy;
