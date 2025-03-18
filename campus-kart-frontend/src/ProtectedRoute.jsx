import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const authToken = sessionStorage.getItem('authToken');

  if (!authToken) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
