import { Navigate } from "react-router-dom";
import useRole from "../hook/useRole";

const AdminRoute = ({ children }) => {
  const [role, isLoading] = useRole();

  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  if (role === "admin") return children;
  return <Navigate to="/" replace="true" />;
};

export default AdminRoute;
