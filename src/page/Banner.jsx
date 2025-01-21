import { FaLocationDot } from "react-icons/fa6";
import bannerImg from "../assets/tutor.jpg";

const Banner = () => {
  return (
    <div
      className="bg-cover bg-center bg-no-repeat lg:h-[70vh] mb-6 py-16 px-6 md:px-20 flex flex-col md:flex-row items-center justify-between"
      style={{
        backgroundImage: `url(${bannerImg})`,
      }}
    >
      {/* Left Content */}
      <div className="text-center md:text-left  space-y-4  bg-opacity-70 p-6 rounded-md">
        <h1 className="text-4xl md:text-5xl font-bold text-purple-800">
          Best Tutoring Platform <br />
          <span className="text-blue-600">for Home & Online Tuitions</span>
        </h1>
        <p className="text-gray-200 flex items-center justify-center md:justify-start gap-2">
        <FaLocationDot />
          Find the Right Tutor in Your Area
        </p>
        <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full shadow-md hover:opacity-90 transition">
          🔍 FIND A TUTOR & BEST SESSION
        </button>
      </div>
    </div>
  );
};

export default Banner;
