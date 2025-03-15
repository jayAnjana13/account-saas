import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import {
  Form as BootstrapForm,
  Button,
  Card,
  CardTitle,
  Col,
  Row,
} from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { FiArchive } from "react-icons/fi";
import Loading from "../../components/loader/Loading";

const Profile = () => {
  const [loading, setLoading] = React.useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [eSignPreview, setESignPreview] = useState(null);

  const [initialValues, setInitialValues] = useState({
    organizationName: "",
    officeAddress: {
      addressLine1: "",
      addressLine2: "",
      addressLine3: "",
    },
    officeNumber: "",
    officeEmail: "",
    websiteUrl: "",
    services: [],
    termsAndConditions: [],
    logo: null,
    eSign: null,
  });

  const validationSchema = Yup.object().shape({
    organizationName: Yup.string().required("Organization Name is required"),
    officeAddress: Yup.object().shape({
      addressLine1: Yup.string()
        .required("Street, Area, City is required")
        .trim(),
      addressLine2: Yup.string()
        .required("District, Pincode is required")
        .trim(),
      addressLine3: Yup.string().required("Country is required").trim(),
    }),
    officeNumber: Yup.string().required("Office Number is required"),
    officeEmail: Yup.string()
      .email("Invalid email format")
      .required("Office Email is required"),
    websiteUrl: Yup.string().url("Invalid URL format"),
    services: Yup.array().of(Yup.string().required("Service cannot be empty")),
    termsAndConditions: Yup.array().of(
      Yup.string().required("Terms & Condition cannot be empty")
    ),
    logo: Yup.mixed().required("Logo is required"),
    eSign: Yup.mixed().required("E-Sign is required"),
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/profile/fetch-profile/${localStorage.getItem("id")}`
        );

        if (response.data.success) {
          const profileData = response.data.profile;
          console.log("profile data==", profileData);

          // Convert relative paths to full URLs
          const baseUrl = import.meta.env.VITE_NEW_SOCKET_URL; // Adjust if needed
          const logoFullUrl = profileData.logoUrl
            ? `${baseUrl}/${profileData.logoUrl.replace(/\\/g, "/")}`
            : null;
          const eSignFullUrl = profileData.eSignUrl
            ? `${baseUrl}/${profileData.eSignUrl.replace(/\\/g, "/")}`
            : null;

          setInitialValues({
            organizationName: profileData.organizationName || "",
            officeAddress: {
              addressLine1: profileData.officeAddress?.addressLine1 || "",
              addressLine2: profileData.officeAddress?.addressLine2 || "",
              addressLine3: profileData.officeAddress?.addressLine3 || "",
            },
            officeNumber: profileData.officeNumber || "",
            officeEmail: profileData.officeEmail || "",
            websiteUrl: profileData.websiteUrl || "",
            services: profileData.services || [],
            termsAndConditions: profileData.termsAndConditions || [],
            logo: logoFullUrl,
            eSign: eSignFullUrl,
          });
          console.log("Fetched logo URL:", logoFullUrl); // Debugging

          setLogoPreview(logoFullUrl);
          setESignPreview(eSignFullUrl);
        } else {
          console.log("Unexpected data format", response.data);
        }
      } catch (error) {
        console.error("Error in fetching profile data:", error);

        if (error.response) {
          console.error("Server Response:", error.response.data);
        } else if (error.request) {
          console.error("No response received from server");
        } else {
          console.error("Request failed:", error.message);
        }
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("organizationName", values.organizationName);
    formData.append("officeAddress", JSON.stringify(values.officeAddress));
    formData.append("officeNumber", values.officeNumber);
    formData.append("officeEmail", values.officeEmail);
    formData.append("websiteUrl", values.websiteUrl);
    // formData.append('logo', values.logo);
    // formData.append('eSign', values.eSign);
    formData.append("services", JSON.stringify(values.services));
    formData.append(
      "termsAndConditions",
      JSON.stringify(values.termsAndConditions)
    );

    // ✅ Only append if a new file is selected
    if (values.logo instanceof File) {
      formData.append("logo", values.logo); // Append only if new file is uploaded
    }

    // Handle eSign (new file or keep existing URL)
    if (values.eSign instanceof File) {
      formData.append("eSign", values.eSign);
    }
    // console.log([...formData.entries()]);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/ca-profile/${localStorage.getItem(
          "id"
        )}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("profile data:", response.data.profile);
      setLoading(false);
      if (response.status === 200) {
        toast.success(response.data.message);
      } else {
        setLoading(false);
        toast.error("Error Occured");
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
    setSubmitting(false);
  };

  // to capitalize each word of address field
  const capitalizeWords = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <>
      {loading && <Loading />}

      <Row>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ setFieldValue, isSubmitting, values }) => (
            <Form>
              <Row>
                <Col md={2}>
                  <h5>
                    <b>Profile</b>
                  </h5>
                </Col>
                <Col md={8}></Col>
                <Col md={2}>
                  <Button type="submit" disabled={isSubmitting}>
                    Update
                  </Button>
                </Col>
              </Row>

              <hr />
              <Row>
                <Col md={5}>
                  <Card className="mb-3 border border-ternary">
                    <Card.Body>
                      <BootstrapForm.Group controlId="organizationName">
                        <Card.Title>
                          <b>Name</b>
                          {/* <BootstrapForm.Label>Organization Name</BootstrapForm.Label> */}
                        </Card.Title>
                        <Field name="organizationName">
                          {({ field, form }) => (
                            <input
                              {...field}
                              className="form-control"
                              placeholder="Enter Organization Name"
                              onChange={(e) =>
                                form.setFieldValue(
                                  field.name,
                                  capitalizeWords(e.target.value)
                                )
                              }
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="organizationName"
                          component="div"
                          className="text-danger"
                        />
                      </BootstrapForm.Group>
                    </Card.Body>
                  </Card>

                  <Card className="mb-3 border border-ternary">
                    <Card.Body>
                      <BootstrapForm.Group controlId="officeAddress">
                        <Card.Title>
                          <b>Address</b>
                        </Card.Title>

                        {/* Address Line 1: Street, Area, City */}
                        <Field name="officeAddress.addressLine1">
                          {({ field, form }) => (
                            <input
                              {...field}
                              className="form-control mb-2"
                              placeholder="Street, Area, City"
                              onChange={(e) =>
                                form.setFieldValue(
                                  field.name,
                                  capitalizeWords(e.target.value)
                                )
                              }
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="officeAddress.addressLine1"
                          component="div"
                          className="text-danger"
                        />

                        {/* Address Line 2: District, Pincode */}
                        <Field name="officeAddress.addressLine2">
                          {({ field, form }) => (
                            <input
                              {...field}
                              className="form-control mb-2"
                              placeholder="District, Pincode"
                              onChange={(e) =>
                                form.setFieldValue(
                                  field.name,
                                  capitalizeWords(e.target.value)
                                )
                              }
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="officeAddress.addressLine2"
                          component="div"
                          className="text-danger"
                        />

                        {/* Address Line 3: Country */}
                        <Field name="officeAddress.addressLine3">
                          {({ field, form }) => (
                            <input
                              {...field}
                              className="form-control"
                              placeholder="Country"
                              onChange={(e) =>
                                form.setFieldValue(
                                  field.name,
                                  capitalizeWords(e.target.value)
                                )
                              }
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="officeAddress.addressLine3"
                          component="div"
                          className="text-danger"
                        />
                      </BootstrapForm.Group>
                    </Card.Body>
                  </Card>

                  <Card className="mb-3 border border-ternary">
                    <Card.Body>
                      <BootstrapForm.Group controlId="officeNumber">
                        <CardTitle>
                          <b>Contact</b>
                          {/* <BootstrapForm.Label>Office Number</BootstrapForm.Label> */}
                        </CardTitle>
                        <Field name="officeNumber" className="form-control" />
                        <ErrorMessage
                          name="officeNumber"
                          component="div"
                          className="text-danger"
                        />
                      </BootstrapForm.Group>
                    </Card.Body>
                  </Card>

                  <Card className="mb-3 border border-ternary">
                    <Card.Body>
                      <BootstrapForm.Group controlId="officeEmail">
                        <Card.Title>
                          <b>Email</b>
                          {/* <BootstrapForm.Label>Office Email</BootstrapForm.Label> */}
                        </Card.Title>
                        <Field
                          name="officeEmail"
                          type="email"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="officeEmail"
                          component="div"
                          className="text-danger"
                        />
                      </BootstrapForm.Group>
                    </Card.Body>
                  </Card>

                  <Card className="mb-3 border border-ternary">
                    <Card.Body>
                      <BootstrapForm.Group controlId="websiteUrl">
                        <CardTitle>
                          <b>Website</b>
                          {/* <BootstrapForm.Label>Website URL</BootstrapForm.Label> */}
                        </CardTitle>
                        <Field
                          name="websiteUrl"
                          type="url"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="websiteUrl"
                          component="div"
                          className="text-danger"
                        />
                      </BootstrapForm.Group>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Right Section */}

                <Col md={7}>
                  {/* ✅ File Upload - Logo */}
                  <Card className="mb-3 border border-ternary">
                    <Card.Body>
                      <BootstrapForm.Group controlId="logo">
                        {/* <BootstrapForm.Label>Upload Logo</BootstrapForm.Label> */}
                        <CardTitle>
                          <b>Logo</b>
                        </CardTitle>
                        <hr />
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={(event) => {
                              setFieldValue(
                                "logo",
                                event.currentTarget.files[0]
                              );
                              setLogoPreview(
                                URL.createObjectURL(
                                  event.currentTarget.files[0]
                                )
                              );
                            }}
                            // onChange={(event) => {
                            //   const file = event.target.files[0];
                            //   if (file) {
                            //     setFieldValue('logo', file);
                            //     setLogoPreview(URL.createObjectURL(file)); // Show preview of new file
                            //   }
                            // }}
                          />
                          {logoPreview && (
                            <img
                              src={logoPreview}
                              alt="Logo Preview"
                              style={{
                                width: "40%",
                                height: "auto",
                                borderRadius: "8px",
                              }}
                            />
                          )}
                        </div>
                        <ErrorMessage
                          name="logo"
                          component="div"
                          className="text-danger"
                        />
                      </BootstrapForm.Group>
                    </Card.Body>
                  </Card>

                  {/* ✅ File Upload - E-Sign */}
                  <Card className="mb-3 border border-ternary">
                    <Card.Body>
                      <BootstrapForm.Group controlId="eSign">
                        {/* <BootstrapForm.Label>Upload E-Sign</BootstrapForm.Label> */}
                        <CardTitle>
                          <b>eSignature</b>
                        </CardTitle>
                        <hr />
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={(event) => {
                              setFieldValue(
                                "eSign",
                                event.currentTarget.files[0]
                              );
                              setESignPreview(
                                URL.createObjectURL(
                                  event.currentTarget.files[0]
                                )
                              );
                            }}
                          />
                          {eSignPreview && (
                            <img
                              src={eSignPreview}
                              alt="E-Sign Preview"
                              style={{
                                width: "40%",
                                height: "auto",
                                borderRadius: "8px",
                              }}
                            />
                          )}
                        </div>
                        <ErrorMessage
                          name="eSign"
                          component="div"
                          className="text-danger"
                        />
                      </BootstrapForm.Group>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col md={5}>
                  {/* ✅ Services Section - Dynamic Input Fields */}
                  <Card className="mb-3 border border-ternary">
                    <Card.Body>
                      <BootstrapForm.Group controlId="services">
                        <FieldArray name="services">
                          {({ push, remove }) => (
                            <>
                              <div className="d-flex justify-content-between align-items-center">
                                <CardTitle>
                                  <b>Services</b>
                                  {/* <BootstrapForm.Label>Services</BootstrapForm.Label> */}
                                </CardTitle>
                                <Button
                                  variant="secondary"
                                  className="btn-sm"
                                  onClick={() => push("")}
                                >
                                  Add Service
                                </Button>
                              </div>
                              <hr />

                              {values.services.map((_, index) => (
                                <div key={index} className="d-flex mb-2">
                                  {/* <Button variant="transparent">{index + 1}.</Button> */}

                                  <Field
                                    name={`services.${index}`}
                                    className="form-control me-2"
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      const capitalizedValue =
                                        inputValue.charAt(0).toUpperCase() +
                                        inputValue.slice(1);
                                      setFieldValue(
                                        `services.${index}`,
                                        capitalizedValue
                                      );
                                    }}
                                  />
                                  <Button
                                    variant="transparent"
                                    onClick={() => remove(index)}
                                    disabled={values.services.length === 1}
                                  >
                                    <FiArchive
                                      size={16}
                                      style={{ color: "red" }}
                                    />
                                  </Button>
                                </div>
                              ))}
                            </>
                          )}
                        </FieldArray>
                        <ErrorMessage
                          name="services"
                          component="div"
                          className="text-danger"
                        />
                      </BootstrapForm.Group>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={7}>
                  {/* ✅ Terms & Conditions Section - Dynamic Input Fields */}
                  <Card className="mb-3 border border-ternary">
                    <Card.Body>
                      <BootstrapForm.Group controlId="termsAndConditions">
                        {/* <BootstrapForm.Label>Terms & Conditions</BootstrapForm.Label> */}
                        <FieldArray name="termsAndConditions">
                          {({ push, remove }) => (
                            <>
                              <div className="d-flex justify-content-between align-items-center">
                                <CardTitle>
                                  <b>Terms & Conditions</b>
                                </CardTitle>
                                <Button
                                  variant="secondary"
                                  className="btn-sm"
                                  onClick={() => push("")}
                                >
                                  Add T<small>&</small>C
                                </Button>
                              </div>
                              <hr />
                              {values.termsAndConditions.map((_, index) => (
                                <div key={index} className="d-flex mb-2">
                                  <Field
                                    name={`termsAndConditions.${index}`}
                                    className="form-control me-2"
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      const capitalizedValue =
                                        inputValue.charAt(0).toUpperCase() +
                                        inputValue.slice(1);
                                      setFieldValue(
                                        `termsAndConditions.${index}`,
                                        capitalizedValue
                                      );
                                    }}
                                  />
                                  <Button
                                    variant="transparent"
                                    onClick={() => remove(index)}
                                    disabled={
                                      values.termsAndConditions.length === 1
                                    }
                                  >
                                    <FiArchive
                                      size={16}
                                      style={{ color: "red" }}
                                    />
                                  </Button>
                                </div>
                              ))}
                            </>
                          )}
                        </FieldArray>
                        <ErrorMessage
                          name="termsAndConditions"
                          component="div"
                          className="text-danger"
                        />
                      </BootstrapForm.Group>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Row>
    </>
  );
};

export default Profile;
