// src/auth/RequireAuth.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext"; 
import { ADMIN_EMAIL } from "./constants";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const loc = useLocation();

  if (loading) return <div className="p-8 text-center">Loading…</div>;
  if (!user || user.email !== ADMIN_EMAIL) {
    return <Navigate to="/login" replace state={{ from: loc }} />;
  }
  return <>{children}</>;
}
