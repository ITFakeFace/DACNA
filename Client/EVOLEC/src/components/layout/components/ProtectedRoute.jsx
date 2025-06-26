import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { getRoleFromToken, isTokenValid } from "../../../services/authService";

export default function ProtectedRoute({ requiredRole }) {
  const token = localStorage.getItem("token");

  if (!token || !isTokenValid(token)) {
    return <Navigate to="/login" />;
  }

  const role = getRoleFromToken(token)?.toUpperCase();
  if (requiredRole && role !== requiredRole.toUpperCase()) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}