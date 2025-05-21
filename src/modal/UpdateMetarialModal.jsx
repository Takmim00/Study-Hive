"use client"

import { useState, useRef, useEffect } from "react"
import { FiUploadCloud, FiX, FiImage, FiLink, FiInfo, FiCheck, FiExternalLink } from "react-icons/fi"
import { toast, ToastContainer } from "react-toastify"
import useAxiosPublic from "../hook/useAxiosPublic"
import useAxiosSecure from "../hook/useAxiosSecure"

const image_hosting_key = import.meta.env.VITE_IMAGE_API
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`

const UpdateMetarialModal = ({ isOpen, onClose, onSubmit, tutor }) => {
  const axiosPublic = useAxiosPublic()
  const axiosSecure = useAxiosSecure()
  const [materialImage, setMaterialImage] = useState(null)
  const [googleDriveLink, setGoogleDriveLink] = useState("")
  const [previewImage, setPreviewImage] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [showSuccessCheck, setShowSuccessCheck] = useState(false)

  const fileInputRef = useRef(null)
  const modalRef = useRef(null)

  // Initialize with tutor data
  useEffect(() => {
    if (tutor) {
      setGoogleDriveLink(tutor.googleDriveLink || "")
      if (tutor.materialImage) {
        setPreviewImage(tutor.materialImage)
      }
    }
  }, [tutor])

  // Handle modal visibility with CSS transitions
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      // Small delay to ensure CSS transition works properly
      setTimeout(() => setModalVisible(true), 10)
    } else {
      setModalVisible(false)
      // Wait for the transition to complete before removing from DOM
      setTimeout(() => {
        document.body.style.overflow = ""
      }, 300)
    }
  }, [isOpen])

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target) && modalVisible) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [modalVisible, onClose])

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (file) => {
    if (!file) return
    setMaterialImage(file)

    // Create preview for images
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewImage(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleInputFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileChange(file)
    }
  }

  const openGoogleDriveLink = () => {
    if (googleDriveLink) {
      window.open(googleDriveLink, "_blank", "noopener,noreferrer")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!materialImage && !googleDriveLink) {
      toast.error("Please upload an image or provide a Google Drive link")
      return
    }

    setIsUploading(true)
    setUploadProgress(10)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 300)

      // Upload material image to imgbb
      let materialImageUrl = ""
      if (materialImage) {
        const imageFile = new FormData()
        imageFile.append("image", materialImage)

        try {
          setUploadProgress(30)
          const imageRes = await axiosPublic.post(image_hosting_api, imageFile, {
            headers: { "Content-Type": "multipart/form-data" },
          })

          setUploadProgress(70)
          if (imageRes.data.success) {
            materialImageUrl = imageRes.data.data.display_url
          } else {
            throw new Error("Image upload failed")
          }
        } catch (err) {
          toast.error("Image upload failed!")
          setIsUploading(false)
          clearInterval(progressInterval)
          return
        }
      }

      setUploadProgress(80)
      const materialData = {
        materialImage: materialImageUrl || tutor.materialImage, // Keep existing image if no new one
        googleDriveLink: googleDriveLink || tutor.googleDriveLink, // Keep existing link if no new one
      }

      // Send data to server
      const res = await axiosSecure.put(
        `https://study-hive-server-three.vercel.app/VeiwMetarils/${tutor._id}`,
        materialData
      )

      setUploadProgress(100)
      if (res.data.modifiedCount > 0) {
        setShowSuccessCheck(true)
        setTimeout(() => {
          setShowSuccessCheck(false)
          toast.success("Material updated successfully!")
          onSubmit(materialData)
        }, 1500)
      } else {
        toast.error("No changes made or update failed")
      }
    } catch (error) {
      toast.error(error.message || "Failed to update material")
    } finally {
      setIsUploading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300">
      <ToastContainer position="top-right" autoClose={3000} />
      <div
        ref={modalRef}
        className={`bg-white rounded-xl shadow-2xl relative max-w-md w-full mx-4 transition-all duration-300 transform ${
          modalVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        } overflow-hidden`}
      >
        {/* Success overlay */}
        {showSuccessCheck && (
          <div className="absolute inset-0 bg-white bg-opacity-90 z-10 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4 animate-pulse">
              <FiCheck className="text-green-500 w-10 h-10" />
            </div>
            <p className="text-green-600 font-medium text-lg">Update Successful!</p>
          </div>
        )}

        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-5 text-white">
          <button
            className="absolute top-3 right-3 text-white hover:text-red-100 transition-colors"
            onClick={onClose}
          >
            <FiX className="w-6 h-6" />
          </button>
          <h3 className="text-xl font-bold">Update Material</h3>
          <p className="text-blue-100 text-sm mt-1">Make changes to your study material</p>
        </div>

        {/* Session Info */}
        {tutor && (
          <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
            <div className="flex items-center mb-2">
              <FiInfo className="text-blue-500 mr-2" />
              <h4 className="font-medium text-blue-700">Session Information</h4>
            </div>
            <div className="grid grid-cols-1 gap-1 text-sm text-gray-600">
              <p>
                <span className="font-bold">Session Name:</span>{" "}
                <span className="text-gray-700">{tutor?.sessionTitle}</span>
              </p>
              <p className="flex items-center">
                <span className="font-bold mr-1">Session ID:</span>{" "}
                <span className="text-gray-500 text-xs truncate max-w-[200px]">{tutor._id}</span>
              </p>
              <p>
                <span className="font-bold">Tutor Email:</span> <span className="text-gray-700">{tutor.tutorEmail}</span>
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <FiImage className="mr-2 text-blue-500" />
              Material Image:
            </label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              {previewImage ? (
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <img
                      src={previewImage || "/placeholder.svg"}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg mb-3 group-hover:opacity-80 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setMaterialImage(null)
                          // Only clear preview if it's not from tutor data
                          if (previewImage !== tutor.materialImage) {
                            setPreviewImage(null)
                          } else {
                            setPreviewImage(tutor.materialImage)
                          }
                        }}
                        className="bg-red-500 text-white p-1 rounded-full"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {materialImage ? materialImage.name : "Current image"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {materialImage ? `${(materialImage.size / 1024).toFixed(1)} KB` : "Click to change"}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <FiImage className="w-10 h-10 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-700">Drag and drop your image here, or click to browse</p>
                  <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG, GIF (Max 5MB)</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleInputFileChange}
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <FiLink className="mr-2 text-blue-500" />
              Material Google Drive Link:
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLink className="h-5 w-5 text-gray-400" />
              </div>
              {googleDriveLink && (
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-blue-500 hover:text-blue-700"
                  onClick={openGoogleDriveLink}
                >
                  <FiExternalLink className="h-5 w-5" />
                </div>
              )}
              <input
                type="url"
                placeholder="https://drive.google.com/file/d/..."
                defaultValue={tutor.googleDriveLink}
                onChange={(e) => setGoogleDriveLink(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Make sure your Google Drive link is publicly accessible</p>
          </div>

          {isUploading && (
            <div className="mb-5">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Updating...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUploading}
            className={`w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 font-medium transition-all flex items-center justify-center gap-2 ${
              isUploading && "opacity-50 cursor-not-allowed"
            }`}
          >
            {isUploading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Updating...
              </>
            ) : (
              <>
                <FiUploadCloud className="w-5 h-5" />
                Update Material
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default UpdateMetarialModal
