import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const location = useLocation();

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If no user data yet, show loading
  if (!user) {
    return <div>Loading...</div>;
  }

  // If role is specified, check if user has the required role
  if (role && user.role !== role) {
    // If user doesn't have the required role, redirect to their dashboard
    if (user.role === 'ADMIN') {
      return <Navigate to="/dashboard" replace />;
    } else if (user.role === 'USER') {
      return <Navigate to="/user/dashboard" replace />;
    }
    // If role is neither admin nor user, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
