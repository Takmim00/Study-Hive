import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa6";
import logo from "../../assets/studyHive.png";
const Footer = () => {
  return (
    <div>
      <footer className="bg-gray-100 text-gray-700">
        <div className="w-11/12 mx-auto px-4 py-8 grid grid-cols-1  md:grid-cols-3 justify-around ">
          <div className="">
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
                <a href="#" className="hover:text-blue-600">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Our Team
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Products
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-center font-semibold mb-4">More</h5>
            <ul className="space-y-2 text-sm text-center">
              <li>
                <a href="#" className="hover:text-blue-600">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Help
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Pay Now
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 py-4 text-center text-sm text-gray-500">
          <p>Copyright © 2022. Study Hive all rights reserved</p>
          <div className="mt-2">
            <a href="#" className="mr-4 hover:text-blue-600">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-blue-600">
              Security
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
