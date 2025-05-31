import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hook/useAuth";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-8 border-blue-200 rounded-full animate-ping opacity-75"></div>
          <div className="absolute top-0 left-0 w-full h-full border-8 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  if (!user) {
    return (
      <Navigate state={{ from: location }} to="/login" replace></Navigate>
    );
  }
  return children;
};

export default PrivateRoute;
