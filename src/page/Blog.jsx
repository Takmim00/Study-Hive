const Blog = () => {
  return (
    <div className="w-11/12 mx-auto">
      <section className="py-12 ">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Blog <span className="text-blue-400">& Resources</span></h2>
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
    </div>
  );
};

export default Blog;
