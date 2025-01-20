/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";

const ViewMaterialsModal = ({
  isOpen,
  onClose,
  materialData,
  selectedSession,
}) => {
  if (!isOpen || !selectedSession) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0  bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-xl font-medium text-gray-900"
                >
                  Study Session Materials
                </DialogTitle>

                {/* Display materials related to the selected session */}
                <div className="mt-4">
                  {materialData.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {materialData.map((data, i) => (
                        <div
                          key={i}
                          className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center"
                        >
                          {/* Material Image */}
                          <img
                            src={data.materialImage}
                            alt="Study Material"
                            className="w-full h-48 object-cover rounded-lg"
                          />

                          {/* Material Details */}
                          <div className="mt-4 flex flex-col items-center">
                            <p className="text-lg font-semibold text-gray-800">
                              Material {i + 1}
                            </p>
                            <p className="mt-2 text-sm font-medium text-gray-700">
                              <span className="font-bold">Material Id:</span>{" "}
                              <span className="text-gray-800">
                                {data?.sessionId}
                              </span>
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

                          {/* Download Button */}
                          <div className="mt-6 flex justify-center">
                            <a
                              href={data?.materialImage}
                              download="Image"
                              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                            >
                              Download Image
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-lg font-medium text-gray-600 text-center">
                      No Materials Available
                    </p>
                  )}
                </div>

                {/* Close Button */}
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={onClose}
                    className="btn bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
                  >
                    Close
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ViewMaterialsModal;
