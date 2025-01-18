const ViewMetarialsModal = ({isOpen,onClose}) => {
    if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white w-96 rounded-lg shadow-lg p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Study Session Material</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 focus:outline-none"
        >
          ✖
        </button>
      </div>

      {/* Content Section */}
      <div className="mt-4">
        <img
          src={'imageUrl'}
          alt="Study Material"
          className="w-full h-48 object-cover rounded-lg"
        />
        <p className="mt-4 text-sm font-medium text-gray-700">
          <span className="font-bold">Study Session Material Id:</span>{" "}
          <span className="text-gray-800">{'materialId'}</span>
        </p>
        <p className="mt-2 text-sm font-medium text-gray-700">
          <span className="font-bold">Material Link:</span>{" "}
          <a
            // href={materialLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Open Link
          </a>
        </p>
      </div>

      {/* Footer Section */}
      <div className="mt-6 flex justify-center">
        <a
        //   href={imageUrl}
          download
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Download Image
        </a>
      </div>
    </div>
  </div>
  );
};

export default ViewMetarialsModal;
