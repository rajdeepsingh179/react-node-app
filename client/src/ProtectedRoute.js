import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  console.log("PROTECTED TOKEN:", token);

  if (!token || token === "undefined" || token.split(".").length !== 3) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;