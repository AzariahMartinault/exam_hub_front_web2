import { Navigate } from "react-router-dom";
import { isAuthenticated, getUser } from "../api/auth";

export default function ProtectedRoute({ children, allowedRole }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = getUser();

  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to={user?.role === "admin" ? "/admin" : "/student"} replace />;
  }

  return children;
}
