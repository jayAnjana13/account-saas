import React from "react";
import { Row, Col, Alert, Button, Card } from "react-bootstrap";
import * as Yup from "yup";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { VALIDATION_MSG } from "../../../config/constant"; // Ensure this is defined in your project
import { useParams } from "react-router-dom";
import axios from "axios"; // Import axios
import { toast } from "react-toastify";
// import Loading from 'components/Loader/Loading';

const ResetPassword = () => {
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const { token } = useParams(); // Get token from URL params

  const handleSubmit = async (values, { setErrors, setSubmitting }) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/reset-password/${token}`,
        {
          password: values.newPassword, // Send the new password
        }
      );

      if (response.status === 200) {
        setLoading(false);
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/auth/signin"); // Redirect to login page after successful reset
        }, 4000);
      } else {
        setLoading(false);
        toast.error("Please fill in all fields.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Reset password error:", error);
      toast.error(error.response.data.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {loading && <Loading />}

      <Formik
        initialValues={{
          newPassword: "",
          confirmPassword: "",
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          newPassword: Yup.string()
            .min(6, VALIDATION_MSG.min_password)
            .max(100, VALIDATION_MSG.max_password)
            .required(VALIDATION_MSG.empty_password),
          confirmPassword: Yup.string()
            .oneOf(
              [Yup.ref("newPassword"), null],
              VALIDATION_MSG.passwords_must_match
            )
            .required(VALIDATION_MSG.empty_confirm_password),
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
                      <h3 className="mb-4 text-center">Reset Password</h3>

                      <form noValidate onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                          <label
                            className="form-group-label"
                            htmlFor="newPassword"
                          >
                            New Password*
                          </label>
                          <input
                            className="form-control"
                            name="newPassword"
                            type="password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.newPassword}
                          />
                          {touched.newPassword && errors.newPassword && (
                            <small className="text-danger form-text">
                              {errors.newPassword}
                            </small>
                          )}
                        </div>

                        <div className="form-group mb-3">
                          <label
                            className="form-group-label"
                            htmlFor="confirmPassword"
                          >
                            Confirm Password*
                          </label>
                          <input
                            className="form-control"
                            name="confirmPassword"
                            type="password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.confirmPassword}
                          />
                          {touched.confirmPassword &&
                            errors.confirmPassword && (
                              <small className="text-danger form-text">
                                {errors.confirmPassword}
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
                              Reset Password
                            </Button>
                          </Col>
                        </Row>
                      </form>
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

export default ResetPassword;
