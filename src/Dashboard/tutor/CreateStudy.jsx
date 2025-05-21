import { useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import useAuth from "../../hook/useAuth"
import useAxiosPublic from "../../hook/useAxiosPublic"
import useAxiosSecure from "../../hook/useAxiosSecure"
import useRole from "../../hook/useRole"

const image_hosting_key = import.meta.env.VITE_IMAGE_API
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`

const CreateStudy = () => {
  const [role, isLoading] = useRole()
  const { user } = useAuth()
  const axiosPublic = useAxiosPublic()
  const axiosSecure = useAxiosSecure()
  const navigate = useNavigate()
  const [previewImage, setPreviewImage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    sessionTitle: "",
    name: user?.displayName || "",
    email: user?.email || "",
    role: role,
    sessionDescription: "",
    sessionImage: null,
    category: "",
    registrationStartDate: "",
    registrationEndDate: "",
    classStartTime: "",
    classEndTime: "",
    sessionDuration: 0,
    registrationFee: 0,
    status: "Pending",
  })

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.displayName || "",
        email: user.email || "",
      }))
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, sessionImage: file })

      // Create preview URL
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

    try {
      // Upload image to imgbb
      let imageUrl = ""
      if (formData.sessionImage) {
        const imageFile = new FormData()
        imageFile.append("image", formData.sessionImage)

        try {
          const imageRes = await axiosPublic.post(image_hosting_api, imageFile, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          if (imageRes.data.success) {
            imageUrl = imageRes.data.data.display_url
          } else {
            throw new Error("Image upload failed")
          }
        } catch (err) {
          toast.error("Image upload failed!")
          setIsSubmitting(false)
          return
        }
      }

      const tutorData = {
        sessionTitle: formData.sessionTitle,
        name: formData.name,
        email: formData.email,
        sessionDescription: formData.sessionDescription,
        sessionImage: imageUrl,
        category: formData.category,
        registrationStartDate: formData.registrationStartDate,
        registrationEndDate: formData.registrationEndDate,
        classStartTime: formData.classStartTime,
        classEndTime: formData.classEndTime,
        sessionDuration: Number.parseFloat(formData.sessionDuration),
        registrationFee: formData.registrationFee,
        status: formData.status,
        role: role,
      }

      // Send the data to the server
      const res = await axiosSecure.post("https://study-hive-server-three.vercel.app/tutors", tutorData)

      if (res.data.insertedId) {
        toast.success("Session created successfully!")
        setTimeout(() => {
          navigate("/dashboard/viewSession")
        }, 2000)
      }
    } catch (err) {
      toast.error(err.message || "Failed to create session")
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.sessionTitle || !formData.sessionDescription || !formData.category) {
        toast.error("Please fill in all required fields")
        return
      }
    }
    setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const categoryOptions = [
    "Mathematics",
    "Science",
    "Computer Science",
    "Language Arts",
    "Foreign Languages",
    "History",
    "Geography",
    "Art & Design",
    "Music",
    "Physical Education",
    "Business Studies",
    "Economics",
    "Other",
  ]

  return (
    <div className=" py-8 px-4">
      <Helmet>
        <title>Dashboard | Create Study Session</title>
      </Helmet>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Create a <span className="text-blue-600">New Study Session</span>
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Design engaging study sessions that inspire learning and collaboration. Your expertise, transformed into
            valuable educational experiences.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center w-full max-w-3xl">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"} transition-colors`}
              >
                1
              </div>
              <div className={`flex-1 h-1 ${currentStep >= 2 ? "bg-blue-600" : "bg-gray-200"} transition-colors`}></div>
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"} transition-colors`}
              >
                2
              </div>
              <div className={`flex-1 h-1 ${currentStep >= 3 ? "bg-blue-600" : "bg-gray-200"} transition-colors`}></div>
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 3 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"} transition-colors`}
              >
                3
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-2 max-w-3xl mx-auto">
            <div className="w-1/3 text-center text-sm font-medium text-gray-600">Session Details</div>
            <div className="w-1/3 text-center text-sm font-medium text-gray-600">Schedule</div>
            <div className="w-1/3 text-center text-sm font-medium text-gray-600">Review & Submit</div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Session Details */}
            {currentStep === 1 && (
              <div className="p-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 text-sm">
                    1
                  </span>
                  Session Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Session Title*</label>
                    <input
                      type="text"
                      name="sessionTitle"
                      placeholder="Enter an engaging title for your session"
                      value={formData.sessionTitle}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="col-span-2  ">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Select a category</option>
                      {categoryOptions.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Session Image</label>
                    <div className="flex items-center">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-3 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            ></path>
                          </svg>
                          <p className="mb-1 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 2MB)</p>
                        </div>
                        <input
                          type="file"
                          name="sessionImage"
                          onChange={handleFileChange}
                          className="hidden"
                          accept="image/*"
                        />
                      </label>
                      {previewImage && (
                        <div className="ml-4 relative">
                          <img
                            src={previewImage || "/placeholder.svg"}
                            alt="Preview"
                            className="h-32 w-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewImage(null)
                              setFormData({ ...formData, sessionImage: null })
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Session Description*</label>
                    <textarea
                      name="sessionDescription"
                      placeholder="Provide a detailed description of what students will learn in this session"
                      value={formData.sessionDescription}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Continue to Schedule
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Schedule */}
            {currentStep === 2 && (
              <div className="p-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 text-sm">
                    2
                  </span>
                  Schedule & Timing
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration Start Date*</label>
                    <input
                      type="date"
                      name="registrationStartDate"
                      value={formData.registrationStartDate}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration End Date*</label>
                    <input
                      type="date"
                      name="registrationEndDate"
                      value={formData.registrationEndDate}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class Start Time*</label>
                    <input
                      type="time"
                      name="classStartTime"
                      value={formData.classStartTime}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class End Time*</label>
                    <input
                      type="time"
                      name="classEndTime"
                      value={formData.classEndTime}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Session Duration (hours)*</label>
                    <input
                      type="number"
                      name="sessionDuration"
                      value={formData.sessionDuration}
                      onChange={handleChange}
                      required
                      min="0.5"
                      step="0.5"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration Fee ($)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        type="number"
                        name="registrationFee"
                        value={formData.registrationFee}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Leave at 0 for free sessions</p>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Review Session
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review & Submit */}
            {currentStep === 3 && (
              <div className="p-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 text-sm">
                    3
                  </span>
                  Review & Submit
                </h2>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                  <div className="flex items-center text-blue-700 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium">Important</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Your session will be reviewed by our team before it becomes available to students. Please ensure all
                    information is accurate.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Session Summary</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Session Title</h4>
                      <p className="text-gray-800">{formData.sessionTitle}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Category</h4>
                      <p className="text-gray-800">{formData.category || "Not specified"}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Tutor</h4>
                      <p className="text-gray-800">{formData.name}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Duration</h4>
                      <p className="text-gray-800">{formData.sessionDuration} hours</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Registration Period</h4>
                      <p className="text-gray-800">
                        {formData.registrationStartDate} to {formData.registrationEndDate}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Class Time</h4>
                      <p className="text-gray-800">
                        {formData.classStartTime} - {formData.classEndTime}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Registration Fee</h4>
                      <p className="text-gray-800">
                        {formData.registrationFee > 0 ? `$${formData.registrationFee}` : "Free"}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Status</h4>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending Review
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-500">Session Description</h4>
                    <p className="text-gray-800 mt-1">{formData.sessionDescription}</p>
                  </div>

                  {previewImage && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-500">Session Image</h4>
                      <div className="mt-1">
                        <img
                          src={previewImage || "/placeholder.svg"}
                          alt="Session"
                          className="h-40 w-auto rounded-lg object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""}`}
                  >
                    {isSubmitting ? (
                      <>
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
                        Creating Session...
                      </>
                    ) : (
                      "Create Study Session"
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateStudy
