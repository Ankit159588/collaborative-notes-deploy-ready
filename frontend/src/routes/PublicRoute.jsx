import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute() {
  const { accessToken } = useAuth();

  if (accessToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
