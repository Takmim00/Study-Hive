import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import useAuth from "../../hook/useAuth";
import useAxiosPublic from "../../hook/useAxiosPublic";
import useAxiosSecure from "../../hook/useAxiosSecure";
import useRole from "../../hook/useRole";
import { Helmet } from "react-helmet-async";

const image_hosting_key = import.meta.env.VITE_IMAGE_API;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;
const CreateStudy = () => {
  const [role, isLoading] = useRole();
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sessionTitle: "",
    name: user?.displayName || "",
    email: user?.email || "",
    role: role,
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, sessionImage: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload image to imgbb
    let imageUrl = "";
    if (formData.sessionImage) {
      const imageFile = new FormData();
      imageFile.append("image", formData.sessionImage);

      try {
        const imageRes = await axiosPublic.post(image_hosting_api, imageFile, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (imageRes.data.success) {
          imageUrl = imageRes.data.data.display_url;
        } else {
          throw new Error("Image upload failed");
        }
      } catch (err) {
        toast.error("Image upload failed! : ", err);

        return;
      }
    }

    const tutorData = {
      sessionTitle: formData.sessionTitle,
      name: formData.name,
      email: formData.email,
      sessionDescription: formData.sessionDescription,
      sessionImage: imageUrl,
      registrationStartDate: formData.registrationStartDate,
      registrationEndDate: formData.registrationEndDate,
      classStartTime: formData.classStartTime,
      classEndTime: formData.classEndTime,
      sessionDuration: parseFloat(formData.sessionDuration),
      registrationFee: formData.registrationFee,
      status: formData.status,
      role: role,
    };

    // Send the data to the server
    try {
      const res = await axiosSecure.post(
        "https://study-hive-server-three.vercel.app/tutors",
        tutorData
      );

      if (res.data.insertedId) {
        toast.success("Session added successfully!");
        navigate("/dashboard/viewSession");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Dashboard || Create Session</title>
      </Helmet>
      <div className="my-4">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create a <span className="text-blue-600">New Study Session</span>
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          This intuitive tool allows you to design and share in-depth study
          sessions, creating valuable resources for your students and fellow
          tutors.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="p-6 md:max-w-4xl mx-auto bg-white rounded shadow-md"
      >
        <ToastContainer />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="">
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
          <div className="">
            <label className="block font-semibold mb-2">Tutor Name:</label>
            <input
              type="text"
              name="name"
              value={user?.displayName}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div className="">
            <label className="block font-semibold mb-2">Tutor Email:</label>
            <input
              type="email"
              name="email"
              value={user?.email}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div className="">
            <label className="block font-semibold mb-2">Session Image:</label>
            <input
              type="file"
              name="sessionImage"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className=" col-span-2">
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

          <div className="">
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
          <div className="">
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
          <div className="">
            <label className="block font-semibold mb-2">
              Class Start Time:
            </label>
            <input
              type="time"
              name="classStartTime"
              value={formData.classStartTime}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="">
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
          <div className="">
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

          <div className="">
            <label className="block font-semibold mb-2">
              Registration Fee:
            </label>
            <input
              type="number"
              name="registrationFee"
              value={formData.registrationFee}
              readOnly={role !== "admin"}
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 px-4 mt-4 rounded hover:bg-blue-600"
        >
          Create Study Session
        </button>
      </form>
    </div>
  );
};

export default CreateStudy;
