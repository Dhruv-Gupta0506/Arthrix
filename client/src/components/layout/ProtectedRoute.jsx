import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute() {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-shell flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-volt" />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}