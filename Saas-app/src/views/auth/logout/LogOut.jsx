import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the user data (like tokens) from local storage or session storage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("id");

    // Optionally, clear other data if needed
    // localStorage.removeItem('userData');

    // Redirect to the login page after logout
    navigate("/"); // Redirect to login page or home
  }, [navigate]);

  return null; // No need to render anything
};

export default Logout;
