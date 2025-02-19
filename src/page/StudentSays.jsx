const StudentSays = () => {
  return (
    <div className="w-11/12 mx-auto">
      <section className="py-8">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">What Our Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <p className="text-gray-700">
                "This platform helped me improve my math skills tremendously!
                Highly recommend."
              </p>
              <h4 className="font-semibold mt-4">- Alex Johnson</h4>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <p className="text-gray-700">
                "The tutors are knowledgeable and friendly. I aced my exams!"
              </p>
              <h4 className="font-semibold mt-4">- Sarah Lee</h4>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <p className="text-gray-700">
                "Great learning experience with flexible scheduling options."
              </p>
              <h4 className="font-semibold mt-4">- Mark Wilson</h4>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudentSays;
