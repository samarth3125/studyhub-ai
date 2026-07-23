import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppShell from "../components/layout/AppShell";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  return <AppShell>{children}</AppShell>;
};

export default ProtectedRoute;
