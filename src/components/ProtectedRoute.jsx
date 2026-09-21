import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRole }) {
  const { user, isLoggedIn } = useAuth();

  // Not logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role
  if (allowedRole && user?.role !== allowedRole) {
    if (user?.role === "developer") {
      return <Navigate to="/developer/dashboard" replace />;
    }

    if (user?.role === "tester") {
      return <Navigate to="/tester/dashboard" replace />;
    }

    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;