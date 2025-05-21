import { Navigate } from "react-router-dom";
import useRole from "../hook/useRole";

const TutorRoute = ({ children }) => {
  const [role, isLoading] = useRole();

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-8 border-blue-200 rounded-full animate-ping opacity-75"></div>
          <div className="absolute top-0 left-0 w-full h-full border-8 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  if (role === "tutor") return children;
  return <Navigate to="/" replace="true" />;
};

export default TutorRoute;
