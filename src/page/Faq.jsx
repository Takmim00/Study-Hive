import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const faqs = [
  {
    question: "How do I find a tutor?",
    answer:
      "You can browse our tutor profiles and book sessions based on ratings and subjects.",
  },
  {
    question: "Are the tutoring sessions live?",
    answer:
      "Yes, all sessions are conducted in real-time with interactive tools.",
  },
  {
    question: "What subjects do tutors cover?",
    answer:
      "Our tutors cover a wide range of subjects, from math and science to arts and languages.",
  },
  {
    question: "How do I schedule a session?",
    answer:
      "Simply select a tutor, pick a time slot, and confirm your booking.",
  },
];
const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 ">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Frequently <span className="text-blue-400">Asked Questions</span>
        </h2>
      </div>

      <div className="w-11/12 mx-auto grid md:grid-cols-2 grid-cols-1 gap-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-lg shadow-md cursor-pointer"
            onClick={() => toggleFAQ(index)}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg text-gray-800">
                {faq.question}
              </h3>
              <FaChevronDown
                className={`transition-transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </div>
            {openIndex === index && (
              <p className="text-gray-600 mt-3">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faq;
