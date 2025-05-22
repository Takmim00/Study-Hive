"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Helmet } from "react-helmet-async"
import { useNavigate, useParams } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import useAxiosSecure from "../../hook/useAxiosSecure"

const UpdateNote = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const axiosSecure = useAxiosSecure()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [noteContent, setNoteContent] = useState("")
  const [characterCount, setCharacterCount] = useState(0)

  const {
    data: notes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await axios.get(`https://study-hive-server-three.vercel.app/veiwNotes/notes/${id}`)
      setNoteContent(data.note)
      setCharacterCount(data.note.length)
      return data
    },
  })

  const handleNoteChange = (e) => {
    setNoteContent(e.target.value)
    setCharacterCount(e.target.value.length)
  }

  const handleUpdateNote = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = e.target
    const title = form.title.value
    const note = form.note.value

    const updatedNoteData = {
      title,
      note,
    }

    try {
      const res = await axiosSecure.put(`https://study-hive-server-three.vercel.app/updateNotes/${id}`, updatedNoteData)

      if (res.data.modifiedCount > 0) {
        toast.success("Note updated successfully!")
        setTimeout(() => {
          navigate("/dashboard/manageNotes")
        }, 1500)
      } else {
        toast.error("No changes made or update failed")
        setIsSubmitting(false)
      }
    } catch (err) {
      toast.error("Error updating note!")
      console.error(err)
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
          <h3 className="text-lg font-semibold">Error Loading Note</h3>
          <p>We couldn't load the note data. Please try again.</p>
        </div>
        <button
          onClick={() => navigate("/dashboard/manageNotes")}
          className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors"
        >
          Return to Notes
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Helmet>
        <title>Dashboard || Update notes</title>
      </Helmet>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Update Your <span className="text-blue-600">Notes</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          This intuitive tool allows you to design and share in-depth study sessions, creating valuable resources for
          your students and fellow tutors.
        </p>
      </div>

      {/* Card Container */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-blue-50 to-white p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800">Edit Your Note</h3>
          <p className="text-sm text-gray-500 mt-1">Make changes to your note content below</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleUpdateNote} className="p-6 space-y-6">
          {/* Student Email */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium" htmlFor="studentEmail">
              Student Email
            </label>
            <div className="relative">
              <input
                id="studentEmail"
                defaultValue={notes?.studentEmail}
                type="email"
                placeholder="student@gmail.com"
                disabled
                className="w-full bg-gray-50 border cursor-not-allowed border-gray-200 rounded-lg px-4 py-3 focus:outline-none"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Read only</span>
              </div>
            </div>
            <p className="text-xs text-gray-500">Email address cannot be modified</p>
          </div>

          {/* Note Title */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium" htmlFor="title">
              Note Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={notes?.title}
              placeholder="Enter a descriptive title..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Note Descriptions */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium" htmlFor="note">
              Note Content
            </label>
            <div className="relative">
              <textarea
                id="note"
                name="note"
                value={noteContent}
                onChange={handleNoteChange}
                placeholder="Write your detailed notes here..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[200px]"
                rows="8"
                required
              ></textarea>
              <div className="absolute bottom-3 right-3 text-xs text-gray-500 bg-white px-2 py-1 rounded-md border">
                {characterCount} characters
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate("/dashboard/manageNotes")}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Updating...
                </div>
              ) : (
                "Update Note"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-blue-50 rounded-lg p-4 border border-blue-100">
        <h4 className="font-medium text-blue-800 mb-2">Tips for Great Notes:</h4>
        <ul className="text-sm text-blue-700 space-y-1 pl-5 list-disc">
          <li>Use clear, concise language for better understanding</li>
          <li>Include relevant examples to illustrate concepts</li>
          <li>Organize content with headings and bullet points</li>
          <li>Review for accuracy before submitting</li>
        </ul>
      </div>
    </div>
  )
}

export default UpdateNote
