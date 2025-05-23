"use client";

/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useState } from "react";

const ViewMaterialsModal = ({
  isOpen,
  onClose,
  materialData,
  selectedSession,
}) => {
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [imageLoading, setImageLoading] = useState({});

  if (!isOpen || !selectedSession) return null;

  const handleImageLoad = (index) => {
    setImageLoading((prev) => ({ ...prev, [index]: false }));
  };

  const handleImageError = (index) => {
    setImageLoading((prev) => ({ ...prev, [index]: false }));
  };

  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename || "material-image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback to direct link
      window.open(url, "_blank");
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <DialogTitle
                          as="h3"
                          className="text-xl font-semibold text-white"
                        >
                          Study Session Materials
                        </DialogTitle>
                        <p className="text-blue-100 text-sm">
                          {materialData.length}{" "}
                          {materialData.length === 1 ? "material" : "materials"}{" "}
                          available
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {materialData.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {materialData.map((data, i) => (
                        <div
                          key={i}
                          className="bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
                        >
                          {/* Material Image */}
                          <div className="relative h-48 overflow-hidden">
                            {imageLoading[i] !== false && (
                              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                                <svg
                                  className="w-8 h-8 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                            )}
                            <img
                              src={
                                data.materialImage ||
                                "/placeholder.svg?height=192&width=384"
                              }
                              alt={`Study Material ${i + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                              onLoad={() => handleImageLoad(i)}
                              onError={() => handleImageError(i)}
                              
                            />

                            {/* Material Number Badge */}
                            <div className="absolute top-3 left-3">
                              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                                #{i + 1}
                              </span>
                            </div>
                          </div>

                          {/* Material Details */}
                          <div className="p-4">
                            <h4 className="text-lg font-semibold text-gray-800 mb-3">
                              Material {i + 1}
                            </h4>

                            <div className="space-y-2 mb-4">
                              <div className="flex items-center text-sm text-gray-600">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 mr-2 text-gray-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                  />
                                </svg>
                                <span className="font-medium">ID:</span>
                                <span className="ml-1 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                  {data?.sessionId?.slice(-8) || "N/A"}
                                </span>
                              </div>

                              {data?.googleDriveLink && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-2 text-gray-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                    />
                                  </svg>
                                  <span className="font-medium">
                                    Drive Link:
                                  </span>
                                  <a
                                    href={data.googleDriveLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-1 text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                                  >
                                    Open
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3 w-3 ml-1"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                      />
                                    </svg>
                                  </a>
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleDownload(
                                    data.materialImage,
                                    `material-${i + 1}.jpg`
                                  )
                                }
                                className="flex-1 flex items-center justify-center bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 mr-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                                Download
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        No Materials Available
                      </h3>
                      <p className="text-gray-600">
                        This session doesn't have any study materials uploaded
                        yet.
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Session ID:{" "}
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                      {selectedSession}
                    </span>
                  </div>
                  <button
                    onClick={onClose}
                    className="flex items-center bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Close
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>

        {/* Image Preview Modal */}
        {selectedMaterial && (
          <Transition appear show={!!selectedMaterial} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-60"
              onClose={() => setSelectedMaterial(null)}
            >
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-75" />
              </TransitionChild>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                  <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <DialogPanel className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-lg bg-white shadow-xl">
                      <div className="absolute top-4 right-4 z-10">
                        <button
                          onClick={() => setSelectedMaterial(null)}
                          className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <img
                        src={
                          selectedMaterial.materialImage || "/placeholder.svg"
                        }
                        alt="Material Preview"
                        className="w-full h-auto max-h-[90vh] object-contain"
                      />
                    </DialogPanel>
                  </TransitionChild>
                </div>
              </div>
            </Dialog>
          </Transition>
        )}
      </Dialog>
    </Transition>
  );
};

export default ViewMaterialsModal;
