import React from "react";
import { Row, Col, Alert, Button, Card } from "react-bootstrap";
import * as Yup from "yup";
import { Formik } from "formik";
import axios from "axios";
import { VALIDATION_MSG } from "../../../config/constant"; // Ensure this is defined in your project
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
// import Loading from "components/Loader/Loading";

const SignUp = () => {
  const navigate = useNavigate();
  // const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values, { setErrors, setSubmitting }) => {
    try {
      // setLoading(true);
      // Post the form data to the backend sign-up endpoint
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/signup`,
        {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/auth/not-verified");
        }, 4000);
      } else {
        toast.error("Sign-up failed. Please check your details.");
        // setLoading(false);
      }
    } catch (error) {
      console.error("Sign-up error:", error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        setErrors({
          submit: "An unexpected error occurred. Please try again later.",
        });
      }
    } finally {
      setSubmitting(false);
      // setLoading(false);
    }
  };

  return (
    <>
      {/* {loading && <Loading />} */}

      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          firstName: Yup.string().required("First name is required"),
          lastName: Yup.string().required("Last name is required"),
          email: Yup.string()
            .email(VALIDATION_MSG.invalid_email)
            .max(255)
            .required(VALIDATION_MSG.empty_email),
          password: Yup.string()
            .min(6, VALIDATION_MSG.min_password)
            .max(255, VALIDATION_MSG.max_password)
            .required(VALIDATION_MSG.empty_password),
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
          <React.Fragment>
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
                        <div className="mb-4 text-center">
                          <i className="feather icon-user-plus auth-icon" />
                        </div>
                        <h3 className="mb-4 text-center">Sign Up</h3>

                        <form noValidate onSubmit={handleSubmit}>
                          <div className="form-group mb-3">
                            <label
                              className="form-group-label"
                              htmlFor="firstName"
                            >
                              First Name*
                            </label>
                            <input
                              className="form-control"
                              name="firstName"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              type="text"
                              value={values.firstName}
                            />
                            {touched.firstName && errors.firstName && (
                              <small className="text-danger form-text">
                                {errors.firstName}
                              </small>
                            )}
                          </div>

                          <div className="form-group mb-3">
                            <label
                              className="form-group-label"
                              htmlFor="lastName"
                            >
                              Last Name*
                            </label>
                            <input
                              className="form-control"
                              name="lastName"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              type="text"
                              value={values.lastName}
                            />
                            {touched.lastName && errors.lastName && (
                              <small className="text-danger form-text">
                                {errors.lastName}
                              </small>
                            )}
                          </div>

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

                          <div className="form-group mb-4">
                            <label
                              className="form-group-label"
                              htmlFor="password"
                            >
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

                          {/* {errors.submit && (
                          <Col sm={12}>
                            <MessageBox variant="danger">{errors.submit}</MessageBox>
                          </Col>
                        )} */}

                          <Row>
                            <Col mt={2}>
                              <Button
                                className="btn-block mb-4"
                                disabled={isSubmitting}
                                size="large"
                                type="submit"
                                variant="primary"
                              >
                                Sign Up
                              </Button>
                            </Col>
                          </Row>
                        </form>

                        <p className="mb-2">
                          Already have an account?{" "}
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
          </React.Fragment>
        )}
      </Formik>
    </>
  );
};

export default SignUp;
