import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Helmet } from "react-helmet-async"
import { useNavigate, useParams } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import { useState } from "react"
import useAxiosPublic from "../../hook/useAxiosPublic"
import useAxiosSecure from "../../hook/useAxiosSecure"

const image_hosting_key = import.meta.env.VITE_IMAGE_API
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`

const UpdateMetarials = () => {
  const { id } = useParams()
  const axiosPublic = useAxiosPublic()
  const navigate = useNavigate()
  const axiosSecure = useAxiosSecure()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)

  const { data: tutors, isLoading } = useQuery({
    queryKey: ["totor", id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await axios.get(`https://study-hive-server-three.vercel.app/veiwMetarial/tutors/${id}`)
      if (data?.sessionImage) {
        setPreviewImage(data.sessionImage)
      }
      return data
    },
  })

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = e.target
    const sessionTitle = form.sessionTitle.value
    const sessionDescription = form.sessionDescription.value
    const sessionImage = form.sessionImage.files[0]
    const registrationStartDate = form.registrationStartDate.value
    const registrationEndDate = form.registrationEndDate.value
    const classStartTime = form.classStartTime.value
    const classEndTime = form.classEndTime.value
    const sessionDuration = form.sessionDuration.value
    const registrationFee = form.registrationFee.value

    let imageUrl = tutors?.sessionImage || ""
    if (sessionImage) {
      const imageFile = new FormData()
      imageFile.append("image", sessionImage)

      try {
        const imageRes = await axiosPublic.post(image_hosting_api, imageFile, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        if (imageRes.data.success) {
          imageUrl = imageRes.data.data.display_url
        } else {
          throw new Error(`Image upload failed: ${imageRes.data.message}`)
        }
      } catch (err) {
        toast.error(`Image upload failed! ${err.message}`)
        setIsSubmitting(false)
        return
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
    }

    try {
      const res = await axiosSecure.put(
        `https://study-hive-server-three.vercel.app/updateMetarials/${id}`,
        updatedTutorData,
      )

      if (res.data.modifiedCount > 0) {
        toast.success("Session updated successfully!")
        setTimeout(() => {
          navigate("/dashboard/viewMaterials")
        }, 1500)
      } else {
        toast.info("No changes made or update failed")
      }
    } catch (err) {
      toast.error(`Error updating session: ${err.message || "Unknown error"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading session data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className=" py-8 px-4">
      <Helmet>
        <title>Dashboard | Update Study Session</title>
      </Helmet>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold ">
            Update Your <span className="text-blue-600">Study Session</span>
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            This intuitive tool allows you to design and share in-depth study sessions, creating valuable resources for
            your students and fellow tutors.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-5 bg-blue-600 text-white">
            <h3 className="text-xl font-semibold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              Session Information
            </h3>
            <p className="text-sm text-blue-100 mt-1">
              You're updating session ID: <span className="font-mono">{id}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Session Title */}
              <div className="col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">Session Title:</label>
                <input
                  type="text"
                  name="sessionTitle"
                  placeholder="Enter an engaging title for your session"
                  defaultValue={tutors?.sessionTitle}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Tutor Information - Read Only */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <span className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Tutor Name:
                  </span>
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={tutors?.name || ""}
                  readOnly
                  className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <span className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Tutor Email:
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={tutors?.email || ""}
                  readOnly
                  className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>

              {/* Session Image */}
              <div className="col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">
                  <span className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Session Image:
                  </span>
                </label>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        name="sessionImage"
                        id="sessionImage"
                        onChange={handleImageChange}
                        className="hidden"
                        accept="image/*"
                      />
                      <label htmlFor="sessionImage" className="cursor-pointer block">
                        <div className="flex flex-col items-center justify-center py-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 text-gray-400 mb-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="font-medium text-gray-700">Click to upload a new image</p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {previewImage && (
                    <div className="w-full md:w-1/3">
                      <div className="rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={previewImage || "/placeholder.svg"}
                          alt="Session preview"
                          className="w-full h-40 object-cover"
                        />
                        <div className="p-2 bg-gray-50 text-xs text-gray-500 text-center">
                          {previewImage !== tutors?.sessionImage ? "New image preview" : "Current image"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Session Description */}
              <div className="col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">Session Description:</label>
                <textarea
                  name="sessionDescription"
                  placeholder="Provide a detailed description of what students will learn in this session"
                  defaultValue={tutors?.sessionDescription}
                  required
                  rows={5}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <hr className="col-span-2 border-t border-gray-200 my-2" />

              {/* Registration Dates */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <span className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Registration Start Date:
                  </span>
                </label>
                <input
                  type="date"
                  name="registrationStartDate"
                  defaultValue={tutors?.registrationStartDate}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <span className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Registration End Date:
                  </span>
                </label>
                <input
                  type="date"
                  name="registrationEndDate"
                  defaultValue={tutors?.registrationEndDate}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Class Times */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <span className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Class Start Time:
                  </span>
                </label>
                <input
                  type="time"
                  name="classStartTime"
                  defaultValue={tutors?.classStartTime}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <span className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Class End Time:
                  </span>
                </label>
                <input
                  type="time"
                  name="classEndTime"
                  defaultValue={tutors?.classEndTime}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Duration and Fee */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <span className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Session Duration (hours):
                  </span>
                </label>
                <input
                  type="number"
                  name="sessionDuration"
                  defaultValue={tutors?.sessionDuration}
                  min="0.5"
                  step="0.5"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <span className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6c.304 0 .792.193 1.264.979a1 1 0 001.715-1.029C12.279 4.784 11.232 4 10 4s-2.279.784-2.979 1.95c-.285.475-.507 1-.67 1.55H6a1 1 0 000 2h.013a9.358 9.358 0 000 1H6a1 1 0 100 2h.351c.163.55.385 1.075.67 1.55C7.721 15.216 8.768 16 10 16s2.279-.784 2.979-1.95a1 1 0 10-1.715-1.029c-.472.786-.96.979-1.264.979-.304 0-.792-.193-1.264-.979a4.265 4.265 0 01-.264-.521H10a1 1 0 100-2H8.017a7.36 7.36 0 010-1H10a1 1 0 100-2H8.472c.08-.185.167-.36.264-.521z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Registration Fee:
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    name="registrationFee"
                    defaultValue={tutors?.registrationFee}
                    readOnly
                    className="w-full pl-8 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Registration fee cannot be modified after creation</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                  isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating Session...
                  </div>
                ) : (
                  "Update Study Session"
                )}
              </button>

              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/viewMaterials")}
                  className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                >
                  Cancel and return to materials
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UpdateMetarials
