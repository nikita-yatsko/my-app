import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import React from "react";

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
