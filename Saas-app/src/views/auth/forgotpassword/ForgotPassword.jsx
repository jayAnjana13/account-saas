import React from "react";
import { Row, Col, Alert, Button, Card } from "react-bootstrap";
import * as Yup from "yup";
import { Formik } from "formik";
import axios from "axios"; // Import axios for API requests
import { VALIDATION_MSG } from "../../../config/constant"; // Ensure this is defined in your project
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../../components/loader/Loading";

const ForgotPassword = () => {
  const [loading, setLoading] = React.useState(false);

  //   const navigate = useNavigate();

  const handleSubmit = async (values, { setErrors, setSubmitting }) => {
    console.log("Form values:", values);
    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/forgot-password`,
        {
          email: values.email,
        }
      );

      if (response.status === 201) {
        setLoading(false);

        toast.success(response.data.message);
      } else {
        toast.error("Failed to send reset link. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Forgot password error:", error);
      if (error.response && error.response.data) {
        setErrors({ submit: error.response.data.message });
      } else {
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
      {loading && <Loading />}

      <Formik
        initialValues={{
          email: "",
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email(VALIDATION_MSG.invalid_email)
            .max(255)
            .required(VALIDATION_MSG.empty_email),
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
          <div className="auth-wrapper">
            <div className="auth-content">
              <div className="auth-bg">
                <span className="r" />
                <span className="r s" />
                <span className="r s" />
                <span className="r" />
              </div>
              <Card className="borderless">
                <Row className="align-items-center">
                  <Col>
                    <Card.Body className="text-left">
                      <h3 className="mb-4 text-center">Forgot Password</h3>

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
                            <small className="text-danger form-text">
                              {errors.email}
                            </small>
                          )}
                        </div>

                        {errors.submit && (
                          <Col sm={12}>
                            <Alert variant="danger">{errors.submit}</Alert>
                          </Col>
                        )}

                        <Row>
                          <Col mt={2}>
                            <Button
                              className="btn-block mb-4"
                              disabled={isSubmitting}
                              size="large"
                              type="submit"
                              variant="primary"
                            >
                              Send Reset Link
                            </Button>
                          </Col>
                        </Row>
                      </form>

                      <p className="mb-2">
                        Remembered your password?{" "}
                        <NavLink to="/auth/signin" className="f-w-400">
                          Login
                        </NavLink>
                      </p>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </div>
          </div>
        )}
      </Formik>
    </>
  );
};

export default ForgotPassword;
