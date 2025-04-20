import React from "react";
import { Navigate } from "react-router";
import { useAtomValue } from "jotai";
import { userAccessToken } from "../store/authAtoms";

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredAuth: boolean;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredAuth,
  fallback,
}) => {
  const authValue = useAtomValue(userAccessToken);

  // Determine if the user is authenticated by checking if a token exists.
  const isAuthenticated = authValue !== null;

  // (Optional) If you had an async auth check, you might have a loading state here.
  // For this example, we assume that the auth check is synchronous.

  if (requiredAuth && !isAuthenticated) {
    return fallback ? <>{fallback}</> : <Navigate to="/" replace />;
  }

  if (!requiredAuth && isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
