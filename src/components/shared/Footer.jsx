import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa6";
import logo from "../../assets/studyHive.png";
const Footer = () => {
  return (
    <div>
      <footer className=" bg-blue-50  text-gray-700">
        <div className="w-11/12 mx-auto px-4 py-8 grid grid-cols-1  md:grid-cols-3 justify-around ">
          <div className="text-gray-800">
            <div className="flex items-center gap-2">
              <p className="text-2xl font-semibold text-gray-800">StudyHive</p>
              <img src={logo} alt="Tutor Sheba" className="w-12 mb-4" />
            </div>
            <p className="text-sm">
              StudyHive.com is a platform where parents, students, and tutors
              can easily connect with each other. We provide qualified
              Home/Online tutors to help your child with studies and perform
              better in exams. We are a group of 2,50,000+ Tutors and 30,000+
              satisfied parents/students in various cities for different
              academic and professional subjects.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-blue-500 text-2xl">
                <FaFacebook />
              </a>
              <a href="#" className="text-green-500 text-2xl">
                <FaWhatsapp />
              </a>
              <a href="#" className="text-red-500 text-2xl">
                <FaInstagram />
              </a>
            </div>
          </div>

          <div>
            <h5 className="text-center font-semibold mb-4">Resources</h5>
            <ul className="space-y-2 text-sm text-center">
              <li>
                <p href="#" className="hover:text-blue-600 text-gray-700">
                  About us
                </p>
              </li>
              <li>
                <p href="#" className="hover:text-blue-600 text-gray-700">
                  Our Team
                </p>
              </li>
              <li>
                <p href="#" className="hover:text-blue-600 text-gray-700">
                  Products
                </p>
              </li>
              <li>
                <p href="#" className="hover:text-blue-600 text-gray-700">
                  Contact
                </p>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-center font-semibold mb-4">More</h5>
            <ul className="space-y-2 text-sm text-center">
              <li>
                <p href="#" className="hover:text-blue-600">
                  Privacy
                </p>
              </li>
              <li>
                <p href="#" className="hover:text-blue-600">
                  Help
                </p>
              </li>
              <li>
                <p href="#" className="hover:text-blue-600">
                  Terms
                </p>
              </li>
              <li>
                <p href="#" className="hover:text-blue-600">
                  FAQ
                </p>
              </li>
              <li>
                <p href="#" className="hover:text-blue-600">
                  Pay Now
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 py-4 text-center text-sm text-gray-500">
          <p>Copyright © 2022. Study Hive all rights reserved</p>
          <div className="mt-2">
            <p href="#" className="mr-4 hover:text-blue-600">
              Privacy Policy
            </p>
            <p href="#" className="hover:text-blue-600">
              Security
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
