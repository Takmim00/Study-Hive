import axios from "axios";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import useAuth from "../../hook/useAuth";

const CreateNote = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [charCount, setCharCount] = useState(0);

  const handleNoteChange = (e) => {
    const text = e.target.value;
    setNote(text);
    setCharCount(text.length);
  };

  const handleNote = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const noteData = {
      studentEmail: user?.email,
      title,
      note,
      createdAt: new Date().toISOString(),
    };

    try {
      const { data } = await axios.post(
        "https://study-hive-server-three.vercel.app/notes",
        noteData
      );

      if (data.insertedId) {
        toast.success("Note added successfully!");
        setTimeout(() => {
          navigate("/dashboard/manageNotes");
        }, 1500);
      } else {
        toast.error("Failed to add the note.");
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error("Error submitting note: " + (error.message || "Unknown error"));
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" min-h-screen pb-12">
      <Helmet>
        <title>Create Notes | Study Hive</title>
      </Helmet>
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="bg-white shadow-sm py-6 px-4 mb-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800">
            Create <span className="text-blue-500">Notes</span>
          </h2>
          <p className="text-gray-600 mt-1">
            Capture your thoughts, ideas, and study materials in one place
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8">
            {/* Note Creation Form */}
            <form onSubmit={handleNote} className="space-y-6">
              {/* Student Information */}
              <div className="bg-blue-50 rounded-lg p-4 flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-blue-800">Student Information</h3>
                  <p className="text-blue-600 text-sm mt-1">{user?.email}</p>
                  <input type="hidden" value={user?.email} />
                </div>
              </div>

              {/* Note Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                  Note Title
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a descriptive title..."
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Note Content */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="note">
                    Note Content
                  </label>
                  <span className="text-xs text-gray-500">{charCount} characters</span>
                </div>
                <div className="relative">
                  <textarea
                    id="note"
                    name="note"
                    value={note}
                    onChange={handleNoteChange}
                    placeholder="Write your note here... You can include study materials, important points, or any information you want to remember."
                    className="block w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="8"
                    required
                  ></textarea>
                </div>
              </div>

              {/* Formatting Tips */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Formatting Tips
                </h4>
                <ul className="text-xs text-gray-600 space-y-1 ml-5 list-disc">
                  <li>Use clear, concise language for better readability</li>
                  <li>Break down complex topics into smaller sections</li>
                  <li>Include examples to illustrate difficult concepts</li>
                  <li>Add questions you want to explore further</li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !title || !note}
                  className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white ${
                    isSubmitting || !title || !note
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Note...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Create Note
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <button 
            onClick={() => navigate("/dashboard/manageNotes")}
            className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            View All Notes
          </button>
          <button 
            onClick={() => {setTitle(""); setNote(""); setCharCount(0);}}
            className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNote;