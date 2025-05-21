"use client"

import { useState, useRef, useEffect } from "react"
import { FiUploadCloud, FiX, FiImage, FiLink, FiInfo } from "react-icons/fi"
import { toast } from "react-toastify"
import useAxiosPublic from "../hook/useAxiosPublic"
import useAxiosSecure from "../hook/useAxiosSecure"

const image_hosting_key = import.meta.env.VITE_IMAGE_API
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`

const UploadMetarialModal = ({ isOpen, onClose, onSubmit, tutor }) => {
  const axiosPublic = useAxiosPublic()
  const axiosSecure = useAxiosSecure()
  const [materialImage, setMaterialImage] = useState(null)
  const [googleDriveLink, setGoogleDriveLink] = useState("")
  const [previewImage, setPreviewImage] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)

  const fileInputRef = useRef(null)

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
        sessionId: tutor._id,
        sessionTitle: tutor.sessionTitle,
        tutorEmail: tutor.email,
        materialImage: materialImageUrl,
        googleDriveLink,
      }

      // Send data to server
      const res = await axiosSecure.post("https://study-hive-server-three.vercel.app/metarial", materialData)

      setUploadProgress(100)
      if (res.data.insertedId) {
        toast.success("Material uploaded successfully!")
        onSubmit(materialData)
        resetForm()
        onClose()
      }
    } catch (error) {
      toast.error(error.message || "Failed to upload material")
    } finally {
      setIsUploading(false)
    }
  }

  const resetForm = () => {
    setMaterialImage(null)
    setGoogleDriveLink("")
    setPreviewImage(null)
    setUploadProgress(0)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
      <div
        className={`bg-white rounded-lg shadow-lg relative max-w-md w-full mx-4 transition-all duration-300 transform ${
          modalVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-200">
          <button
            className="absolute top-3 right-3 text-gray-500 border-2 rounded-full w-8 h-8 flex items-center justify-center hover:text-red-500 hover:bg-red-50 transition-colors bg-red-100"
            onClick={onClose}
          >
            <FiX className="text-xl" />
          </button>
          <h3 className="text-center text-xl font-semibold text-gray-800">Upload Your Material</h3>
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
              <p>
                <span className="font-bold">Session ID:</span>{" "}
                <span className="text-gray-500 text-xs">{tutor._id}</span>
              </p>
              <p>
                <span className="font-bold">Tutor Email:</span> <span className="text-gray-700">{tutor.email}</span>
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Material Image:</label>
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
                  <img
                    src={previewImage || "/placeholder.svg"}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg mb-3"
                  />
                  <p className="text-sm font-medium text-gray-900">{materialImage.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{(materialImage.size / 1024).toFixed(1)} KB</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setMaterialImage(null)
                      setPreviewImage(null)
                    }}
                    className="mt-2 text-xs text-red-500 hover:text-red-700"
                  >
                    Remove image
                  </button>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Material Google Drive Link:</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLink className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="url"
                placeholder="https://drive.google.com/file/d/..."
                value={googleDriveLink}
                onChange={(e) => setGoogleDriveLink(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Make sure your Google Drive link is publicly accessible</p>
          </div>

          {isUploading && (
            <div className="mb-5">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUploading || (!materialImage && !googleDriveLink)}
            className={`w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center justify-center gap-2 ${
              (isUploading || (!materialImage && !googleDriveLink)) && "opacity-50 cursor-not-allowed"
            }`}
          >
            <FiUploadCloud className="w-5 h-5" />
            {isUploading ? "Uploading..." : "Upload Material"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default UploadMetarialModal
