import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return <Navigate to="/login" />;
  }

  try {
    // 🔥 decode JWT
    const payload = JSON.parse(atob(parts[1]));

    console.log("JWT PAYLOAD:", payload);

    // 🔥 expiry check
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      console.log("Token expired");
      localStorage.removeItem("token");
      return <Navigate to="/login" />;
    }

  } catch (err) {
    console.log("Invalid token");
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;