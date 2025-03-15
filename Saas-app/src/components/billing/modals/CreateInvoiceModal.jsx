import React, { useEffect } from "react";
import {
  Button,
  Col,
  Modal,
  Row,
  Form as BootstrapForm,
  Table,
  Card,
} from "react-bootstrap";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import axios from "axios";
import { toast } from "react-toastify";
import qs from "qs";
import * as Yup from "yup";
import Select from "react-select";
import { FiArchive } from "react-icons/fi";
import Loading from "../../loader/Loading";

const CreateInvoiceModal = ({
  show,
  onHide,
  invoiceNumber,
  invoiceData,
  setProfileData,
}) => {
  // const [tnCisChecked, setTnCisChecked] = React.useState(false);
  const [clients, setClients] = React.useState([]);
  const [services, setServices] = React.useState([]);
  const [tnC, setTnC] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const today = new Date().toISOString().split("T")[0];
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  const validationSchema = Yup.object({
    client: Yup.string().required("Client is Required"),
    invoiceNumber: Yup.string(),
    invoiceDate: Yup.date().required("Date Required"),
    dueDate: Yup.date().required("Due Date Required"),
    tableData: Yup.array().of(
      Yup.object({
        service: Yup.string().required("Service Required"),
        description: Yup.string().required("Description Required"),
        quantity: Yup.number()
          .typeError("Must be a number")
          .positive("Must be positive")
          .required("Qty Required"),
        rateType: Yup.string(),
        rate: Yup.number()
          .typeError("Must be a number")
          .positive("Must be positive")
          .required("Rate Required"),
        amount: Yup.number(),
        wuwd: Yup.string(),
        assignee: Yup.string(),
        date: Yup.date(),
        discount: Yup.number(),
        tax: Yup.number()
          .typeError("Must be a number")
          .required("Tax Required"),
        total: Yup.number(),
      })
    ),
  });

  const initialValues = {
    client: invoiceData?.client || "",
    clientId: invoiceData?.clientId || "",
    invoiceNumber: invoiceData?.invoiceNumber || "",
    invoiceDate: formatDate(invoiceData?.invoiceDate) || "",
    dueDate: formatDate(invoiceData?.dueDate) || "",
    tnCisChecked: invoiceData?.tnCisChecked || false,
    tableData:
      invoiceData?.tableData?.length > 0
        ? invoiceData.tableData.map((row) => ({
            service: row.service || "",
            description: row.description || "",
            quantity: row.quantity || "",
            rateType: row.rateType || "",
            rate: row.rate || "",
            amount: row.amount || 0,
            wuwd: row.wuwd || "",
            assignee: row.assignee || "",
            date: formatDate(row.date) || "",
            discount: row.discount || "",
            tax: row.tax || "",
            total: row.total || 0,
          }))
        : [
            {
              service: "",
              description: "",
              quantity: "",
              rateType: "",
              rate: "",
              amount: 0,
              wuwd: "",
              assignee: "",
              date: "",
              discount: "",
              tax: "",
              total: 0,
            },
          ],
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/clients/all-clients/${localStorage.getItem("id")}`
        );

        if (Array.isArray(response.data.clients)) {
          setClients(response.data.clients);
        } else {
          console.error("Unexpected data format:", response.data);
          setClients([]);
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
        setClients([]);
      }
    };
    fetchClients();
    fetchServices();
  }, []);

  // fetch services offered by CA
  const fetchServices = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/profile/profile-data/${localStorage.getItem("id")}`
      );

      if (Array.isArray(response.data.profileInfo.services)) {
        setServices(response.data.profileInfo.services);
        setTnC(response.data.profileInfo.termsAndConditions);
        setProfileData(response.data.profileInfo);
      } else {
        console.log("Unexpected  data fromate", response.data);
      }
    } catch (error) {
      console.log("Error in fetching profile data", error);
    }
  };

  // form handleSubmit
  const handleSubmit = (values, { setSubmitting }) => {
    setLoading(true);
    const data = {
      ...values,
      tableData: values.tableData.map((row) => {
        const amount =
          parseFloat(row.quantity || 0) * parseFloat(row.rate || 0);
        const discountAmount = (parseFloat(row.discount || 0) / 100) * amount;
        const discountedAmount = amount - discountAmount;
        const taxAmount = (parseFloat(row.tax || 0) / 100) * discountedAmount;
        const total = discountedAmount + taxAmount;

        return {
          ...row,
          amount: amount.toFixed(2),
          discount: `${row.discount}`,
          tax: `${row.tax}`,
          total: total.toFixed(2),
        };
      }),
      totalDiscount: `${values.tableData
        .reduce((sum, row) => {
          const amount =
            parseFloat(row.quantity || 0) * parseFloat(row.rate || 0);
          const discountAmount = (parseFloat(row.discount || 0) / 100) * amount;
          return sum + discountAmount;
        }, 0)
        .toFixed(2)}`,
      totalTax: values.tableData
        .reduce((sum, row) => {
          const amount =
            parseFloat(row.quantity || 0) * parseFloat(row.rate || 0);
          const discountAmount = (parseFloat(row.discount || 0) / 100) * amount;
          const discountedAmount = amount - discountAmount;
          return sum + (parseFloat(row.tax || 0) / 100) * discountedAmount;
        }, 0)
        .toFixed(2),
      subTotal: values.tableData
        .reduce((sum, row) => {
          const amount =
            parseFloat(row.quantity || 0) * parseFloat(row.rate || 0);
          return sum + amount;
        }, 0)
        .toFixed(2),
      grandTotal: values.tableData
        .reduce((sum, row) => {
          const amount =
            parseFloat(row.quantity || 0) * parseFloat(row.rate || 0);
          const discountAmount = (parseFloat(row.discount || 0) / 100) * amount;
          const discountedAmount = amount - discountAmount;
          const taxAmount = (parseFloat(row.tax || 0) / 100) * discountedAmount;
          return sum + (discountedAmount + taxAmount);
        }, 0)
        .toFixed(2),
      caId: localStorage.getItem("id"),
    };
    // Convert the data to URL-encoded format
    const encodedData = qs.stringify(data);

    const apiUrl = invoiceData
      ? `${import.meta.env.VITE_API_URL}/invoice/update-invoice/${
          invoiceData._id
        }`
      : `${import.meta.env.VITE_API_URL}/invoice/create-invoice`;
    const method = invoiceData ? "put" : "post";

    axios({
      method,
      url: apiUrl,
      data: encodedData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        onHide();
        if (response.status === 200) {
          toast.success(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error during submission:", error);
      })
      .finally(() => {
        setSubmitting(false);
        setLoading(false);
      });
  };

  return (
    <>
      {loading && <Loading />}
      <Modal show={show} onHide={onHide} size="xl">
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
          {({ values, handleSubmit, setFieldValue }) => {
            useEffect(() => {
              setFieldValue("invoiceDate", today);
              setFieldValue("invoiceNumber", invoiceNumber);
            }, [setFieldValue, today]);
            const totalTax = values.tableData
              .reduce((sum, row) => {
                const amount =
                  parseFloat(row.quantity || 0) * parseFloat(row.rate || 0);
                const discountAmount =
                  (parseFloat(row.discount || 0) / 100) * amount;
                const discountedAmount = amount - discountAmount;
                return (
                  sum + (parseFloat(row.tax || 0) / 100) * discountedAmount
                );
              }, 0)
              .toFixed(2);
            const subTotal = values.tableData
              .reduce((sum, row) => {
                const amount =
                  parseFloat(row.quantity || 0) * parseFloat(row.rate || 0);
                return sum + amount;
              }, 0)
              .toFixed(2);
            const grandTotal = values.tableData
              .reduce((sum, row) => {
                const amount =
                  parseFloat(row.quantity || 0) * parseFloat(row.rate || 0);
                const discountAmount =
                  (parseFloat(row.discount || 0) / 100) * amount;
                const discountedAmount = amount - discountAmount;
                const taxAmount =
                  (parseFloat(row.tax || 0) / 100) * discountedAmount;
                return sum + (discountedAmount + taxAmount);
              }, 0)
              .toFixed(2);

            return (
              <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                  <Modal.Title>
                    {invoiceData ? "Update Invoice" : "INVOICE"}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: "70vh" }}>
                  {/* Invoice Details */}
                  <Row>
                    <Col xl={2} lg={3} md={3} sm={4}>
                      <BootstrapForm.Group>
                        <BootstrapForm.Label>Clients</BootstrapForm.Label>
                        <Select
                          options={clients.map((client) => ({
                            value: client._id,
                            label: client.clientName,
                          }))}
                          value={
                            values.clientId
                              ? { value: values.clientId, label: values.client }
                              : null
                          }
                          isDisabled={!!invoiceData}
                          onChange={(selectedOption) => {
                            if (!invoiceData) {
                              setFieldValue("client", selectedOption.label);
                              setFieldValue("clientId", selectedOption.value);
                            }
                          }}
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                        />

                        <ErrorMessage
                          name="client"
                          component="div"
                          className="text-danger small"
                        />
                      </BootstrapForm.Group>
                    </Col>
                    <Col xl={2} lg={3} md={3} sm={4}>
                      <BootstrapForm.Group>
                        <BootstrapForm.Label>Invoice</BootstrapForm.Label>
                        <Field
                          name="invoiceNumber"
                          type="text"
                          readOnly
                          className="form-control form-control-sm"
                        />
                        <ErrorMessage
                          name="invoiceNumber"
                          component="div"
                          className="text-danger small"
                        />
                      </BootstrapForm.Group>
                    </Col>
                    <Col xl={2} lg={3} md={3} sm={4}>
                      <BootstrapForm.Group>
                        <BootstrapForm.Label>Invoice Date</BootstrapForm.Label>
                        <Field
                          name="invoiceDate"
                          type="date"
                          className="form-control form-control-sm"
                          min={today}
                        />
                        <ErrorMessage
                          name="invoiceDate"
                          component="div"
                          className="text-danger small"
                        />
                      </BootstrapForm.Group>
                    </Col>
                    <Col xl={2} lg={3} md={3} sm={4}>
                      <BootstrapForm.Group>
                        <BootstrapForm.Label>Due Date</BootstrapForm.Label>
                        <Field
                          name="dueDate"
                          type="date"
                          className="form-control form-control-sm"
                          min={today}
                        />
                        <ErrorMessage
                          name="dueDate"
                          component="div"
                          className="text-danger small"
                        />
                      </BootstrapForm.Group>
                    </Col>
                  </Row>

                  <hr />

                  {/* Table Section */}
                  <FieldArray name="tableData">
                    {({ push, remove }) => (
                      <div className="scrollable-table">
                        <Table bordered>
                          <thead>
                            <tr>
                              <th
                                className="sticky-column"
                                style={{ minWidth: "200px" }}
                              >
                                Service
                              </th>
                              <th style={{ minWidth: "220px" }}>Description</th>
                              <th style={{ minWidth: "150px" }}>Quantity</th>
                              {/* <th style={{ minWidth: '150px' }}>Rate Type</th> */}
                              <th style={{ minWidth: "150px" }}>Rate</th>
                              <th style={{ minWidth: "120px" }}>
                                Amount <small>($)</small>
                              </th>
                              {/* <th style={{ minWidth: '100px' }}>WUWD</th> */}
                              {/* <th style={{ minWidth: '150px' }}>Assignee</th> */}
                              {/* <th style={{ minWidth: '150px' }}>Date</th> */}
                              <th style={{ minWidth: "150px" }}>
                                Discount <small>(%)</small>
                              </th>
                              <th style={{ minWidth: "150px" }}>
                                Tax <small>(%)</small>
                              </th>
                              <th
                                className="sticky-column-right"
                                style={{ minWidth: "130px" }}
                              >
                                Total
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {values.tableData.map((row, index) => {
                              const quantity = parseFloat(row.quantity) || 0;
                              const rate = parseFloat(row.rate) || 0;
                              const amount = quantity * rate;
                              const discountAmount =
                                (parseFloat(row.discount || 0) / 100) * amount;
                              const discountedAmount = amount - discountAmount;
                              const taxAmount =
                                (parseFloat(row.tax || 0) / 100) *
                                discountedAmount;
                              const total = discountedAmount + taxAmount;

                              return (
                                <tr key={index}>
                                  <td className="sticky-column">
                                    <Select
                                      options={services.map((service) => ({
                                        value: service,
                                        label: service,
                                      }))}
                                      value={{
                                        value: values.tableData[index].service,
                                        label: values.tableData[index].service,
                                      }}
                                      onChange={(selectedOption) =>
                                        setFieldValue(
                                          `tableData.${index}.service`,
                                          selectedOption.value
                                        )
                                      }
                                      menuPortalTarget={document.body}
                                      styles={{
                                        menuPortal: (base) => ({
                                          ...base,
                                          zIndex: 9999,
                                        }),
                                      }}
                                    />
                                    <div className="error-container">
                                      <ErrorMessage
                                        name={`tableData.${index}.service`}
                                        component="div"
                                        className="text-danger small"
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <Field
                                      name={`tableData.${index}.description`}
                                      type="text"
                                      className="form-control form-control-sm"
                                      onChange={(e) => {
                                        const capitalizedValue =
                                          e.target.value
                                            .charAt(0)
                                            .toUpperCase() +
                                          e.target.value.slice(1);
                                        setFieldValue(
                                          `tableData.${index}.description`,
                                          capitalizedValue
                                        );
                                      }}
                                    />
                                    <div className="error-container">
                                      <ErrorMessage
                                        name={`tableData.${index}.description`}
                                        component="div"
                                        className="text-danger small"
                                      />
                                    </div>{" "}
                                  </td>
                                  <td>
                                    <Field
                                      name={`tableData.${index}.quantity`}
                                      type="number"
                                      className="form-control form-control-sm"
                                    />
                                    <div className="error-container">
                                      <ErrorMessage
                                        name={`tableData.${index}.quantity`}
                                        component="div"
                                        className="text-danger small"
                                      />
                                    </div>
                                  </td>
                                  {/* <td>
                                    <Select
                                      options={[
                                        { value: 'Rupee', label: 'Rupee' },
                                        { value: 'USD', label: 'USD' },
                                        { value: 'Other', label: 'Other' }
                                      ]}
                                      value={{
                                        value: values.tableData[index].rateType,
                                        label: values.tableData[index].rateType
                                      }}
                                      onChange={(selectedOption) => setFieldValue(`tableData.${index}.rateType`, selectedOption.value)}
                                    />
                                    <div className="error-container"></div>
                                  </td> */}
                                  <td>
                                    <Field
                                      name={`tableData.${index}.rate`}
                                      type="number"
                                      className="form-control form-control-sm"
                                    />
                                    <div className="error-container">
                                      <ErrorMessage
                                        name={`tableData.${index}.rate`}
                                        component="div"
                                        className="text-danger small"
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    {/* <span className="fw-bold">$ {amount.toFixed(2)}</span> */}
                                    <Field
                                      className="form-control form-control-sm fw-bold"
                                      readOnly
                                      value={amount}
                                    />
                                    <div className="error-container"></div>
                                  </td>
                                  {/* <td>
                                    <Field name={`tableData.${index}.wuwd`} type="text" className="form-control form-control-sm" />
                                    <div className="error-container"></div>
                                  </td> */}
                                  {/* <td>
                                    <Field name={`tableData.${index}.assignee`} type="text" className="form-control form-control-sm" />
                                    <div className="error-container"></div>
                                  </td> */}
                                  {/* <td>
                                    <Field name={`tableData.${index}.date`} type="date" className="form-control form-control-sm" />
                                    <div className="error-container"></div>
                                  </td> */}
                                  <td>
                                    <Field
                                      name={`tableData.${index}.discount`}
                                      type="number"
                                      className="form-control form-control-sm"
                                    />
                                    <div className="error-container"></div>
                                  </td>
                                  <td>
                                    <Field
                                      name={`tableData.${index}.tax`}
                                      type="number"
                                      className="form-control form-control-sm"
                                    />
                                    <div className="error-container">
                                      <ErrorMessage
                                        name={`tableData.${index}.tax`}
                                        component="div"
                                        className="text-danger small"
                                      />
                                    </div>
                                  </td>
                                  <td className="sticky-column-right  ">
                                    <div className="d-flex justify-content-between">
                                      <p className="fw-bold m-0 d-flex align-items-center">
                                        $ {total.toFixed(2)}
                                      </p>
                                      <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="btn  btn-sm"
                                      >
                                        <FiArchive
                                          size={16}
                                          style={{ color: "red" }}
                                        />
                                      </button>
                                    </div>
                                    <div className="error-container"></div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td className="sticky-column">
                                <button
                                  type="button"
                                  onClick={() =>
                                    push({
                                      service: "",
                                      description: "",
                                      quantity: "",
                                      rateType: "",
                                      rate: "",
                                      amount: 0,
                                      wuwd: "",
                                      assignee: "",
                                      date: "",
                                      discount: "",
                                      tax: "",
                                      total: 0,
                                    })
                                  }
                                  className="btn"
                                  style={{ marginTop: "10px" }}
                                  onMouseEnter={(e) =>
                                    (e.target.style.textDecoration =
                                      "underline")
                                  }
                                  onMouseLeave={(e) =>
                                    (e.target.style.textDecoration = "none")
                                  }
                                >
                                  ➕ Add line item
                                </button>
                              </td>
                              <td colSpan={6}></td>
                              <td className="sticky-column-right d-flex flex-column text-end">
                                {" "}
                                Tax{" "}
                                <span className="fw-bold">
                                  $ {totalTax}
                                </span>{" "}
                                subTotal{" "}
                                <span className="fw-bold"> $ {subTotal}</span>
                              </td>
                            </tr>
                          </tfoot>
                        </Table>
                      </div>
                    )}
                  </FieldArray>

                  <hr />

                  <Row>
                    <Col md={12}>
                      <Card className="border border-ternary">
                        <Card.Body>
                          <div className="d-flex justify-content-between">
                            <Card.Title>
                              <b>Terms & Conditions</b>
                            </Card.Title>

                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="termsSwitch"
                                checked={values.tnCisChecked}
                                onChange={(e) =>
                                  setFieldValue(
                                    "tnCisChecked",
                                    e.target.checked
                                  )
                                } // ✅ Update Formik's state

                                // onChange={(e) => setTnCisChecked(e.target.checked)}
                              />
                            </div>
                          </div>
                          <Card.Text>
                            {values.tnCisChecked && tnC?.length > 0 ? (
                              <ol>
                                {tnC.map((term, index) => (
                                  <li key={index}>{term}</li>
                                ))}
                              </ol>
                            ) : (
                              values.tnCisChecked && (
                                <p>No terms and conditions available.</p>
                              )
                            )}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Modal.Body>
                <Modal.Footer style={{ justifyContent: "space-between" }}>
                  <p className="fw-bold" style={{ alignItems: "left" }}>
                    {" "}
                    Grandtotal: <span> $ {grandTotal}</span>
                  </p>
                  <div>
                    <Button
                      variant="secondary"
                      onClick={onHide}
                      className="btn-sm"
                    >
                      Close
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading}
                      className="btn-sm"
                    >
                      {loading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : invoiceData ? (
                        "Update Invoice"
                      ) : (
                        "Create Invoice"
                      )}
                    </Button>
                  </div>
                </Modal.Footer>
              </Form>
            );
          }}
        </Formik>
      </Modal>
    </>
  );
};

export default CreateInvoiceModal;
