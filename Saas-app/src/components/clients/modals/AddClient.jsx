import React, { useRef } from "react";
import {
  Button,
  ListGroup,
  Container,
  ButtonGroup,
  Card,
  Col,
  FloatingLabel,
  Modal,
  Row,
  Form,
} from "react-bootstrap";
// import PropTypes from "prop-types";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Loading from "../../../components/loader/Loading";

// Validation Schema using Yup
const validationSchema = Yup.object().shape({
  clientType: Yup.string().notRequired(),
  firstName: Yup.string().required("Client name is required"),
  lastName: Yup.string().required("Client name is required"),
  clientOwner: Yup.string().notRequired(),
  email: Yup.string().required("Email is required"),
  filingStatus: Yup.string().notRequired(),
  source: Yup.string().notRequired(),
  clientSince: Yup.date().notRequired().nullable(),
  clientStatus: Yup.string().notRequired(),
  isActive: Yup.boolean().required(),
  customFields: Yup.string().notRequired(),
  roles: Yup.string().notRequired(),
  tags: Yup.string().notRequired(),
  contacts: Yup.array()
    .of(
      Yup.object().shape({
        contact: Yup.string().notRequired("Contact is required"),
        type: Yup.string().notRequired(),
        description: Yup.string().notRequired(),
      })
    )
    .required("Client must have a primary contact"),
});

const AddClient = (props) => {
  // const [activeSection, setActiveSection] = useState(null);
  const [loading, setLoading] = React.useState(false);
  const sectionRefs = useRef([]);

  const handleSubmit = (values, { setSubmitting }) => {
    setLoading(true);

    const data = {
      ...values,
    };

    // Send POST request to create a client
    axios
      .post(`${import.meta.env.VITE_API_URL}/user/add-client`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        toast.success(response.data.message);
        setLoading(false);
        setSubmitting(false);
        props.onHide(); // 🛠 Ensure this is executed after setting loading state
      })
      .catch((error) => {
        console.error("Error during submission:", error);
        setLoading(false);
        setSubmitting(false);
        if (error.response && error.response.data) {
          toast.error(error.response.data.message);
        } else {
          toast.error("An unexpected error occurred.");
        }
      })
      .finally(() => {
        setLoading(false);
        setSubmitting(false);
      });
  };

  return (
    <>
      {loading && <Loading />}

      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Formik
          initialValues={{
            clientType: "Individual",
            firstName: "",
            lastName: "",
            clientOwner: "",
            email: "",
            filingStatus: "",
            source: "",
            clientSince: "",
            clientStatus: "Prospect",
            isActive: true,
            customFields: "",
            roles: "",
            tags: "",
            password: "123456",
            contacts: [{ contact: "", type: "", description: "" }],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isSubmitting,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            // touched,
          }) => (
            <Form onSubmit={handleSubmit} className="p-3">
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                  Create Client
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Container fluid>
                  <Row>
                    {/* Content Sections */}
                    <Col md={12} className="content-sections">
                      <div
                        id="section1"
                        ref={(el) => (sectionRefs.current[0] = el)}
                        className="section"
                      >
                        <Form.Group className="border border-ternary rounded p-4 mb-4">
                          <h6>
                            <b>Client Type</b>
                          </h6>
                          <div className="d-flex gap-4">
                            <Form.Check
                              label="Individual"
                              name="clientType"
                              type="radio"
                              value="Individual"
                              onChange={() =>
                                setFieldValue("clientType", "Individual")
                              }
                              checked={values.clientType === "Individual"}
                            />
                            <Form.Check
                              label="Business"
                              name="clientType"
                              type="radio"
                              value="Business"
                              onChange={() =>
                                setFieldValue("clientType", "Business")
                              }
                              checked={values.clientType === "Business"}
                              // Show invalid state
                            />
                          </div>
                        </Form.Group>
                      </div>

                      <div
                        id="section2"
                        ref={(el) => (sectionRefs.current[1] = el)}
                        className="section"
                      >
                        <Form.Group className="border border-ternary rounded p-4 mb-4">
                          <h6>
                            <b>Client Info</b>
                          </h6>
                          <Row>
                            <Col md={6}>
                              <Form.Label>Client First Name*</Form.Label>
                              <Form.Control
                                type="text"
                                name="firstName"
                                value={values.firstName}
                                onChange={(e) => {
                                  const capitalizedValue =
                                    e.target.value.charAt(0).toUpperCase() +
                                    e.target.value.slice(1);
                                  setFieldValue("firstName", capitalizedValue);
                                }}
                                size="sm"
                              />
                              {errors.firstName && (
                                <div
                                  className="text-danger"
                                  style={{
                                    fontSize: "0.895em",
                                    marginTop: ".5em",
                                  }}
                                >
                                  {errors.firstName}
                                </div>
                              )}{" "}
                            </Col>
                            <Col md={6}>
                              <Form.Label>Client Last Name*</Form.Label>
                              <Form.Control
                                type="text"
                                name="lastName"
                                value={values.lastName}
                                onChange={(e) => {
                                  const capitalizedValue =
                                    e.target.value.charAt(0).toUpperCase() +
                                    e.target.value.slice(1);
                                  setFieldValue("lastName", capitalizedValue);
                                }}
                                size="sm"
                              />
                              {errors.lastName && (
                                <div
                                  className="text-danger"
                                  style={{
                                    fontSize: "0.895em",
                                    marginTop: ".5em",
                                  }}
                                >
                                  {errors.lastName}
                                </div>
                              )}{" "}
                            </Col>
                          </Row>

                          <Row className="mt-3">
                            <Col md={6}>
                              <Form.Label>Client owner</Form.Label>
                              <Form.Select
                                name="clientOwner"
                                value={values.clientOwner}
                                onChange={(e) =>
                                  setFieldValue("clientOwner", e.target.value)
                                }
                                size="sm"
                              >
                                <option value="">Select</option>
                                <option value="Owner 1">Owner 1</option>
                                <option value="Owner 2">Owner 2</option>
                              </Form.Select>
                            </Col>
                            <Col md={6}>
                              <Form.Label>Email ID</Form.Label>
                              <Form.Control
                                type="mail"
                                name="email"
                                value={values.email}
                                onChange={(e) =>
                                  setFieldValue("email", e.target.value)
                                }
                                size="sm"
                              />
                              {errors.email && (
                                <div
                                  className="text-danger"
                                  style={{
                                    fontSize: "0.895em",
                                    marginTop: ".5em",
                                  }}
                                >
                                  {errors.email}
                                </div>
                              )}{" "}
                            </Col>
                          </Row>

                          <Row className="mt-3">
                            <Col md={6}>
                              <Form.Label>Filing Status</Form.Label>
                              <Form.Select
                                name="filingStatus"
                                value={values.filingStatus}
                                onChange={(e) =>
                                  setFieldValue("filingStatus", e.target.value)
                                }
                                size="sm"
                              >
                                <option value="">Select</option>
                                <option value="Single">Single</option>
                                <option value="Married filing jointly">
                                  Married filing jointly
                                </option>
                                <option value="Married filing separately">
                                  Married filing separately
                                </option>
                                <option value="Head of household">
                                  Head of household
                                </option>
                              </Form.Select>
                            </Col>
                            <Col md={6}>
                              <Form.Label>Source</Form.Label>
                              <Form.Select
                                name="source"
                                value={values.source}
                                onChange={(e) =>
                                  setFieldValue("source", e.target.value)
                                }
                                size="sm"
                              >
                                <option value="">Select</option>
                                <option value="Mailer">Mailer</option>
                                <option value="Radio">Radio</option>
                                <option value="Website">Website</option>
                                <option value="Referral">Referral</option>
                              </Form.Select>
                            </Col>
                          </Row>

                          <Row className="mt-3 border border-ternary rounded m-0 p-2">
                            <Col md={12}>
                              <div className="d-flex justify-content-between">
                                <Form.Label>
                                  <b>Is Active</b>
                                </Form.Label>
                                <Form.Switch
                                  type="switch"
                                  name="isActive"
                                  checked={values.isActive}
                                  onChange={(e) =>
                                    setFieldValue("isActive", e.target.checked)
                                  }
                                />
                              </div>
                              <Row>
                                <p>
                                  When turned off, client functionality is
                                  reduced to client record information, notes,
                                  and email sync. Client portal access will be
                                  deactivated. Only active clients count towards
                                  your client billing tier.
                                </p>
                              </Row>
                            </Col>
                          </Row>
                        </Form.Group>
                      </div>
                    </Col>
                  </Row>
                </Container>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default AddClient;
