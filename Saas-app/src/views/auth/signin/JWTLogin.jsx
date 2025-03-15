import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import * as Yup from "yup";
import { Formik } from "formik";
import axios from "axios"; // Import axios for API requests
// import { VALIDATION_MSG } from "../../../config/constant.js"; // Ensure this is defined in your project
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
// import Loading from "../../../components/Loader/Loading";

const JWTLogin = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setErrors, setSubmitting }) => {
    console.log("hey");
    try {
      // Sending login credentials via POST request to the backend API
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/signin`,
        {
          email: values.email,
          password: values.password,
        }
      );

      // Assuming the backend sends a token and a status of success
      if (response.status === 200) {
        toast.success(response.data.message);
        const { token } = response.data;
        const { id } = response.data.user;

        localStorage.setItem("token", token);
        localStorage.setItem("id", id);
        const decodedToken = jwtDecode(token);
        const role = decodedToken.role;
        localStorage.setItem("role", decodedToken.role);

        navigate("/dashboard");
      } else {
        toast.error("Invalid email address or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
        setErrors({
          submit: "An unexpected error occurred. Please try again later.",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          email: "",
          password: "",
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            // .email(VALIDATION_MSG.invalid_email)
            .max(255),
          // .required(VALIDATION_MSG.empty_email),
          password: Yup.string(),
          // .min(6, VALIDATION_MSG.min_password)
          // .max(255, VALIDATION_MSG.max_password)
          // .required(VALIDATION_MSG.empty_password),
        })}
        onSubmit={handleSubmit}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
        }) => (
          <form noValidate onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label className="form-group-label" htmlFor="email">
                Email Address*
              </label>
              <input
                className="form-control"
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                type="email"
                value={values.email}
              />
              {touched.email && errors.email && (
                <small className="text-danger form-text">{errors.email}</small>
              )}
            </div>

            <div className="form-group mb-4">
              <label className="form-group-label" htmlFor="password">
                Password*
              </label>
              <input
                className="form-control"
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                type="password"
                value={values.password}
              />
              {touched.password && errors.password && (
                <small className="text-danger form-text">
                  {errors.password}
                </small>
              )}
            </div>

            <Row>
              <Col mt={2}>
                <Button
                  className="btn-block mb-4"
                  disabled={isSubmitting}
                  size="large"
                  type="submit"
                  variant="primary"
                >
                  Sign in
                </Button>
              </Col>
            </Row>
          </form>
        )}
      </Formik>
    </>
  );
};

export default JWTLogin;
