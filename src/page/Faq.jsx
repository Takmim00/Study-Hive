"use client"

import { useState } from "react"

const FaqSection = () => {
  const [activeIndex, setActiveIndex] = useState(null)

  const faqs = [
    {
      question: "How do I find the right tutor for my needs?",
      answer:
        "You can browse our tutor profiles based on subject, availability, and ratings. We recommend reading reviews from other students and scheduling an initial consultation to ensure a good fit.",
    },
    {
      question: "What subjects do you offer tutoring for?",
      answer:
        "We offer tutoring across a wide range of subjects including Mathematics, Science, English, Computer Science, Foreign Languages, History, and Test Preparation for standardized exams.",
    },
    {
      question: "How much does tutoring cost?",
      answer:
        "Tutoring rates vary depending on the subject, tutor experience, and session duration. You can view the specific rates on each tutor's profile. We also offer package discounts for booking multiple sessions.",
    },
    {
      question: "Can I change my tutor if I'm not satisfied?",
      answer:
        "Yes, we want to ensure you have the best learning experience. If you're not satisfied with your current tutor, you can request a change at any time and we'll help you find a better match.",
    },
    {
      question: "How do online sessions work?",
      answer:
        "Online sessions take place through our secure video platform. You'll need a computer with internet access, a webcam, and a microphone. Our platform also includes interactive tools like a digital whiteboard and document sharing.",
    },
    {
      question: "What is your cancellation policy?",
      answer:
        "We understand that schedules can change. You can cancel or reschedule a session up to 24 hours before the scheduled time without any charge. Cancellations with less than 24 hours notice may incur a fee.",
    },
  ]

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <div className=" mb-12">
      <div className="w-11/12  mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">
            Frequently Asked <span className="text-blue-500">Questions</span>
          </h2>
          <div className="w-16 h-1 bg-blue-500 mx-auto mt-2"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                className="w-full px-6 py-4 text-left font-medium flex justify-between items-center focus:outline-none"
                onClick={() => toggleFaq(index)}
              >
                <span className="text-gray-800">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-blue-500 transform transition-transform ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`px-6 pb-4 transition-all duration-300 ${
                  activeIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </div>
  )
}

export default FaqSection
