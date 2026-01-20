import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface RequireRoleProps {
  role: "ADMIN" | "USER";
  children: React.ReactNode;
}

export default function RequireRole({ role, children }: RequireRoleProps) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== role) return <Navigate to="/profile" replace />;

  return <>{children}</>;
}
