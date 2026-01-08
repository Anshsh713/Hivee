import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/UserContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  if (!isAuthenticated) return <Navigate to="/authpage" replace />;

  return children;
}
