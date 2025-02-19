import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import useAxiosPublic from "../hook/useAxiosPublic";
import useAxiosSecure from "../hook/useAxiosSecure";

const image_hosting_key = import.meta.env.VITE_IMAGE_API;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;
const UpdateMetarialModal = ({ isOpen, onClose, onSubmit, tutor }) => {
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const [materialImage, setMaterialImage] = useState(null);
  const [googleDriveLink, setGoogleDriveLink] = useState("");
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setMaterialImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let materialImageUrl = "";
    if (materialImage) {
      const imageFile = new FormData();
      imageFile.append("image", materialImage);

      try {
        const imageRes = await axiosPublic.post(image_hosting_api, imageFile, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (imageRes.data.success) {
          materialImageUrl = imageRes.data.data.display_url;
        } else {
          throw new Error("Image upload failed");
        }
      } catch (err) {
        toast.error("Image upload failed!");
        return;
      }
    }

    const materialData = {
      materialImage: materialImageUrl,
      googleDriveLink,
    };

    try {
      const res = await axiosSecure.put(
        `https://study-hive-server-three.vercel.app/VeiwMetarils/${tutor._id}`,
        materialData
      );

      if (res.data.modifiedCount > 0) {
        toast.success("Material updated successfully!");
      } else {
        toast.error("No changes made or update failed");
      }
    } catch (err) {
      toast.error(err.message);
    }

    onSubmit(materialData);
    // onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <ToastContainer />
      <div className="bg-white rounded-lg w-96 shadow-lg p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 border-2 rounded-full  px-2 hover:text-red-500 text-2xl text-center bg-red-100"
          onClick={onClose}
        >
          &times;
        </button>

        <h3 className="text-center text-xl font-semibold text-gray-800 mb-4">
          Upload Your Material
        </h3>
        {tutor && (
          <div className="mb-6 text-center text-sm text-gray-600">
            <p>
              <span className="font-bold">Session Name:</span>{" "}
              {tutor?.sessionTitle}
            </p>
            <p>
              <span className="font-bold">Session ID:</span> {tutor._id}
            </p>
            <p>
              <span className="font-bold">Tutor Email:</span> {tutor.tutorEmail}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Material Image:
            </label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Material Google Drive Link:
            </label>
            <input
              type="url"
              placeholder="Google Drive Link..."
              defaultValue={tutor.googleDriveLink}
              onChange={(e) => setGoogleDriveLink(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Upload Material
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateMetarialModal;
