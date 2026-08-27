import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated, getUser } from "../api/auth";

export default function ProtectedRoute({ role }) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;

  const user = getUser();
  if (role && user?.role !== role) {
    return <Navigate to={user?.role === "admin" ? "/admin" : "/student"} replace />;
  }
  return <Outlet />;
}