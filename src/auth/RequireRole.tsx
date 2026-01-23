import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface RequireRoleProps {
  roles: ("ADMIN" | "USER")[];
  children: React.ReactNode;
}

export default function RequireRole({ roles, children }: RequireRoleProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // не авторизован → на логин
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // роль не подходит → на профиль
  if (!roles.includes(user.role)) {
    return <Navigate to="/items" replace />;
  }

  return <>{children}</>;
}
