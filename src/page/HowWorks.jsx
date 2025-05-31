import { FaUserPlus, FaClipboardList, FaBell, FaMoneyBillWave } from "react-icons/fa";

const steps = [
  {
    id: 1,
    title: "CREATE TUTOR PROFILE",
    description: "Create your profile in minutes with sign-up information.",
    icon: <FaUserPlus className="text-white text-2xl" />,
  },
  {
    id: 2,
    title: "APPLY FOR JOBS",
    description: "Complete your profile and start browsing our latest TUITION JOBS page.",
    icon: <FaClipboardList className="text-white text-2xl" />,
  },
  {
    id: 3,
    title: "GET FREE TUTORING JOB ALERT",
    description: "Receive tutoring job alerts via SMS/CALL whenever new jobs are posted.",
    icon: <FaBell className="text-white text-2xl" />,
  },
  {
    id: 4,
    title: "START TUTORING AND GROW YOUR INCOME",
    description: "If parents like the demo session, you can continue tutoring and start earning.",
    icon: <FaMoneyBillWave className="text-white text-2xl" />,
  },
];

const HowItWorks = () => {
  return (
    <section className="py-4 px-6">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h2 className="text-3xl font-bold ">
          How <span className="text-blue-400">it Works?</span>
        </h2>
        <p className="">
          Here's how it works for <span className="text-blue-600 font-medium">Tutors</span>
        </p>
      </div>

      <div className="w-11/12 mx-auto grid md:grid-cols-2 grid-cols-1 gap-6">
        {steps.map((step) => (
          <div key={step.id} className="relative flex items-center  p-4 rounded-lg shadow-lg border">
            <div className="absolute -left-5 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-pink-400 text-white font-bold flex items-center justify-center rounded-full">
              {step.id}
            </div>
            <div className="w-16 h-16 flex items-center justify-center bg-blue-500 rounded-lg text-white">
              {step.icon}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-blue-700">{step.title}</h3>
              <p className="text-gray-500">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
