import React from "react";
import { Navigate } from "react-router-dom";

const AuthGuard = ({ children }) => {
  const token = localStorage.getItem("token");

  // If token is not present or invalid, redirect to the login page
  if (!token) {
    return <Navigate to="/" />;
  }

  // If the token is valid, render the child components
  return children;
};

export default AuthGuard;
