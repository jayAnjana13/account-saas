import axios from "axios";
import React, { useEffect } from "react";
import Loading from "../../../components/loader/Loading";
import { toast } from "react-toastify";
import { Row, Col, Table, Button } from "react-bootstrap";

const ClientInvoices = () => {
  const [invoices, setInvoices] = React.useState([]);
  const [payments, setPayments] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  // open the pdf
  const openPdfInNewWindow = async (invoiceId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/invoice-pdf/${invoiceId}`,
        {
          method: "POST", // Change to POST to send data
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch PDF");

      const pdfBlob = await response.blob();
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error opening PDF:", error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred in generating pdf.");
      }
    }
  };

  // fetch the invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/invoice/client-invoices/${localStorage.getItem("id")}`
        );

        if (Array.isArray(response.data.invoices)) {
          setInvoices(response.data.invoices);
        } else {
          console.log("Unexpected error in fetching client invoices");
          setInvoices([]);
        }
      } catch (error) {
        console.log("Error in fetching client invoices", error);
      }
    };
    fetchInvoices();
  }, []);

  // fetch the payment
  const fetchPayments = (invoiceId) => {
    fetch(
      `${
        import.meta.env.VITE_API_URL
      }/payment/get-payments?invoiceId=${invoiceId}`
    )
      .then((response) => response.json())
      .then((data) => {
        setPayments((prevPayments) => ({
          ...prevPayments,
          [invoiceId]: data,
        }));
      })
      .catch((error) => console.error("Error fetching payments:", error));
  };
  useEffect(() => {
    invoices.forEach((invoice) => {
      fetchPayments(invoice._id);
    });
  }, [invoices]);

  //handle pay now button
  const handlePayNow = (event, sessionUrl) => {
    event.preventDefault();
    window.location.href = sessionUrl;
  };

  return (
    <React.Fragment>
      <Row>
        {loading && <Loading />}
        <Col md={2}>
          <h5>
            <b>Invoices</b>
          </h5>
        </Col>
      </Row>

      <hr />
      <Row>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Invoice Date</th>
              <th>Invoice #</th>
              <th>Due Date</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          {invoices.length === 0 ? (
            <p>No invoices found.</p>
          ) : (
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice._id}>
                  <td>{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                  <td>
                    <a
                      style={{
                        cursor: "pointer",
                        color: "blue",
                        textDecoration: "none",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.textDecoration = "underline")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.textDecoration = "none")
                      }
                      onClick={() => openPdfInNewWindow(invoice._id)}
                    >
                      {invoice.invoiceNumber}
                    </a>
                  </td>
                  <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                  <td>
                    <b> $ {invoice.grandTotal.toFixed(2)}</b>
                  </td>
                  <td>
                    {payments[invoice._id]?.length > 0 ? (
                      payments[invoice._id].map((payment) => {
                        return payment.status === "pending" ? (
                          <Button
                            key={payment.sessionUrl}
                            onClick={(event) =>
                              handlePayNow(event, payment.sessionUrl)
                            }
                            className="btn btn-sm"
                          >
                            Pay Now
                          </Button>
                        ) : (
                          <p>Paid</p>
                        );
                      })
                    ) : (
                      <p>No payments found</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </Table>
      </Row>
    </React.Fragment>
  );
};

export default ClientInvoices;
