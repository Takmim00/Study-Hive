import axios from "axios";
import { useEffect, useState } from "react";

const ViewMetarialsModal = ({ isOpen, onClose, sessionTitle }) => {
  const [materialData, setMaterialData] = useState();

  useEffect(() => {
    if (isOpen && sessionTitle) {
      const fetchMaterialData = async () => {
        try {
          const { data } = await axios.get(
            `http://localhost:5000/metarials/${sessionTitle}`
          );
          setMaterialData(data);

        } catch (err) {
          console.error(err);
        }
      };

      fetchMaterialData();
    }
  }, [isOpen, sessionTitle]);

  if (!isOpen || !materialData) return null;

  return (
    <>
      {materialData.map((data,i) => (
        <div key={i} className="fixed inset-0   bg-opacity-50 flex items-center justify-center ">
          <div className="bg-white w-96 rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Study Session Material
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500  hover:text-gray-800 focus:outline-none"
              >
                ✖
              </button>
            </div>

            {/* Content Section */}
            <div className="mt-4">
              <img
                src={data.materialImage}
                alt="Study Material"
                className="w-full h-48 object-cover rounded-lg"
              />
              <p className="mt-4 text-sm font-medium text-gray-700">
                <span className="font-bold">Material Id:</span>{" "}
                <span className="text-gray-800">{data?.sessionId}</span>
              </p>
              <p className="mt-2 text-sm font-medium text-gray-700">
                <span className="font-bold">Material Link:</span>{" "}
                <a
                  href={data?.googleDriveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Open Link
                </a>
              </p>
            </div>
            <div className="mt-6 flex justify-center">
              <a
                href={data?.materialImage}
                download="Image"
                className="bg-blue-500 btn text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Download Image
              </a>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ViewMetarialsModal;
