import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If role is specified, check if user has the required role
  if (role && user?.role !== role) {
    // Redirect to appropriate dashboard based on user role
    if (user?.role === 'ADMIN') {
      return <Navigate to="/dashboard" replace />;
    } else if (user?.role === 'USER') {
      return <Navigate to="/user/dashboard" replace />;
    }
    // If role is neither admin nor user, redirect to login
    return <Navigate to="/login" replace />;
  }

  return children;
}
