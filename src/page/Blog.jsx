const Blog = () => {
  return (
    <div>
      

      <section className="py-12 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-100 rounded-lg">
              <h3 className="font-semibold text-lg">1. Sign Up</h3>
              <p className="text-gray-700">
                Create an account as a student or tutor.
              </p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg">
              <h3 className="font-semibold text-lg">2. Choose a Session</h3>
              <p className="text-gray-700">
                Browse and book the best tutoring sessions.
              </p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg">
              <h3 className="font-semibold text-lg">3. Start Learning</h3>
              <p className="text-gray-700">
                Join sessions and enhance your skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Blog & Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <h3 className="font-semibold text-lg">
                5 Tips to Improve Study Habits
              </h3>
              <p className="text-gray-700">
                Learn how to stay focused and retain information effectively.
              </p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <h3 className="font-semibold text-lg">
                Best Online Learning Strategies
              </h3>
              <p className="text-gray-700">
                Discover how to make the most of online tutoring.
              </p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <h3 className="font-semibold text-lg">
                Top Resources for Competitive Exams
              </h3>
              <p className="text-gray-700">
                Find the best materials for acing competitive tests.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="p-6 bg-gray-100 rounded-lg">
              <h3 className="font-semibold text-lg">How do I find a tutor?</h3>
              <p className="text-gray-700">
                You can browse our tutor profiles and book sessions based on
                ratings and subjects.
              </p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg">
              <h3 className="font-semibold text-lg">
                Are the tutoring sessions live?
              </h3>
              <p className="text-gray-700">
                Yes, all sessions are conducted in real-time with interactive
                tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Our Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <h3 className="text-3xl font-bold text-blue-600">25,000+</h3>
              <p className="text-gray-700">Tutors Available</p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <h3 className="text-3xl font-bold text-blue-600">30,000+</h3>
              <p className="text-gray-700">Satisfied Students</p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <h3 className="text-3xl font-bold text-blue-600">50,000+</h3>
              <p className="text-gray-700">Sessions Completed</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
