import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../../components/loader/Loading";

const VerifyAccount = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying your account...");
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        setLoading(true);
        // Verify the token by sending a GET request to the server
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/verify/${token}`
        );
        if (response.status === 200) {
          const { token: jwtToken, user, resetToken } = response.data;

          // Store the token and user ID in localStorage
          localStorage.setItem("token", jwtToken);
          localStorage.setItem("id", user.id);
          // localStorage.setItem('role', user.role);

          setStatus(
            "Your account has been verified successfully! Redirecting..."
          );
          // const userRole = localStorage.getItem('role');
          setTimeout(() => {
            if (user.role === "CA") {
              navigate("/clients/client-list");
            } else if (user.role === "Client" && resetToken) {
              localStorage.removeItem("token");
              navigate(`/auth/reset-password/${resetToken}`);
            } else {
              navigate("/inbox");
            }
          }, 1000);
        } else {
          setLoading(false);
          setStatus("Verification failed. Invalid or expired token.");
          toast.error("Verification failed. Please try again.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setLoading(false);

        if (error.response && error.response.data) {
          setStatus(
            error.response.data.message ||
              "Verification failed. Please try again later."
          );
          toast.error(
            error.response.data.message ||
              "An error occurred during verification."
          );
          navigate("/auth/signin");
        } else {
          setStatus("An unexpected error occurred. Please try again later.");
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    };

    verifyAccount();
  }, [token, navigate]);

  return (
    <div>
      {loading && <Loading />}

      <div className="verifyy">
        {/* <h2>{status}</h2> */}
        <div className="spinnery"></div>
      </div>
    </div>
  );
};

export default VerifyAccount;
