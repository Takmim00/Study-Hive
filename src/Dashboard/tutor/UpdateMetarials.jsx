import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import useAxiosPublic from "../../hook/useAxiosPublic";
import useAxiosSecure from "../../hook/useAxiosSecure";

const image_hosting_key = import.meta.env.VITE_IMAGE_API;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;
const UpdateMetarials = () => {
  const { id } = useParams();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const { data: tutors, isLoading } = useQuery({
    queryKey: ["totor", id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:5000/veiwMetarial/tutors/${id}`
      );

      return data;
    },
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const sessionTitle = form.sessionTitle.value;
    const sessionDescription = form.sessionDescription.value;
    const sessionImage = form.sessionImage.files[0];
    const registrationStartDate = form.registrationStartDate.value;
    const registrationEndDate = form.registrationEndDate.value;
    const classStartTime = form.classStartTime.value;
    const classEndTime = form.classEndTime.value;
    const sessionDuration = form.sessionDuration.value;
    const registrationFee = form.registrationFee.value;

    let imageUrl = "";
    if (sessionImage) {
      const imageFile = new FormData();
      imageFile.append("image", sessionImage);

      try {
        const imageRes = await axiosPublic.post(image_hosting_api, imageFile, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (imageRes.data.success) {
          imageUrl = imageRes.data.data.display_url;
        } else {
          throw new Error(`Image upload failed: ${imageRes.data.message}`);
        }
      } catch (err) {
        toast.error(`Image upload failed! ${err.message}`);

        return;
      }
    }

    const updatedTutorData = {
      sessionTitle,
      sessionDescription,
      sessionImage: imageUrl,
      registrationStartDate,
      registrationEndDate,
      classStartTime,
      classEndTime,
      sessionDuration,
    };

    try {
      const res = await axiosSecure.put(
        `http://localhost:5000/updateMetarials/${id}`,
        updatedTutorData
      );

      if (res.data.modifiedCount > 0) {
        toast.success("Session updated successfully!");
        navigate("/dashboard/viewMaterials");
      } else {
        toast.error("No changes made or update failed");
      }
    } catch (err) {
      toast.error("Error updating session :", err);
    }
  };

  if (isLoading) {
    return <span className="loading loading-dots loading-lg"></span>;
  }
  return (
    <div>
      <Helmet>
        <title>Dashboard || Update Session</title>
      </Helmet>
      <div className="my-4">
        <ToastContainer />
        <h2 className="text-2xl font-bold mb-6 text-center">
          Update Your <span className="text-blue-600">Study Session</span>
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          This intuitive tool allows you to design and share in-depth study
          sessions, creating valuable resources for your students and fellow
          tutors.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="p-6 max-w-4xl mx-auto bg-white rounded shadow-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="">
            <label className="block font-semibold mb-2">Session Title:</label>
            <input
              type="text"
              name="sessionTitle"
              placeholder="Session Title..."
              defaultValue={tutors?.sessionTitle}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="">
            <label className="block font-semibold mb-2">Tutor Name:</label>
            <input
              type="text"
              name="name"
              defaultValue={tutors?.name || ""}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div className="">
            <label className="block font-semibold mb-2">Tutor Email:</label>
            <input
              type="email"
              name="email"
              defaultValue={tutors?.email || ""}
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
            />
            {tutors?.sessionImage && (
              <div className="mb-4">
                <label className="block font-semibold mb-2">
                  Current Session Image:
                </label>
                <img
                  src={tutors.sessionImage}
                  alt="Current Session"
                  className="h-32 object-cover rounded"
                />
              </div>
            )}
          </div>
          <div className=" col-span-2">
            <label className="block font-semibold mb-2">
              Session Description:
            </label>
            <textarea
              name="sessionDescription"
              placeholder="Session Description..."
              defaultValue={tutors?.sessionDescription}
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
              defaultValue={tutors?.registrationStartDate}
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
              defaultValue={tutors?.registrationEndDate}
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
              defaultValue={tutors?.classStartTime}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="">
            <label className="block font-semibold mb-2">Class End Time:</label>
            <input
              type="time"
              name="classEndTime"
              defaultValue={tutors?.classEndTime}
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
              defaultValue={tutors?.sessionDuration}
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
              defaultValue={tutors?.registrationFee}
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
