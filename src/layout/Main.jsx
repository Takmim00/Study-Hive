import { Outlet } from "react-router-dom";
import Footer from "../components/shared/Footer";
import Navbar from "../components/shared/Navbar";

const Main = () => {
  return (
    <div>
      <div className="sticky top-0 z-50 ">
        <Navbar />
      </div>
      <div className="min-h-[calc(100vh-429px)]">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Main;
