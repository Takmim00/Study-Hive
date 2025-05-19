const StudentSays = () => {
  const testimonials = [
    {
      id: 1,
      name: "Alex Johnson",
      quote:
        "This platform helped me improve my math skills tremendously! Highly recommend.",
    },
    {
      id: 2,
      name: "Sarah Lee",
      quote: "The tutors are knowledgeable and friendly. I aced my exams!",
    },
    {
      id: 3,
      name: "Mark Wilson",
      quote: "Great learning experience with flexible scheduling options.",
    },
    {
      id: 4,
      name: "Emily Chen",
      quote:
        "The personalized attention from tutors made all the difference in my studies.",
    },
  ];

  return (
    <div className=" mb-12">
      <div className="w-11/12  mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">
            What Our <span className="text-blue-500">Students Say</span>
          </h2>
          <div className="w-16 h-1 bg-blue-500 mx-auto mt-2"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="mb-4">
                <svg
                  className="w-8 h-8 text-blue-200 mb-2"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                >
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <p className="text-gray-700">{testimonial.quote}</p>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <p className="font-medium text-gray-800">
                  - {testimonial.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentSays;
