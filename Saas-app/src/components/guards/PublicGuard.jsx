import React from "react";
import { Navigate } from "react-router-dom";

const PublicGuard = ({ children }) => {
  const token = localStorage.getItem("token");

  // If the user has a token, redirect to the dashboard (or another protected page)
  if (token) {
    return <Navigate to="/dashboard" />;
  }

  // If no token, allow access to public routes
  return children;
};

export default PublicGuard;
