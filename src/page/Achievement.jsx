const Achievement = () => {
  return (
    <div className="w-11/12 mx-auto">
      <section className="pb-12 ">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Our <span className="text-blue-500">Achievements</span></h2>
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

export default Achievement;
