import axios from "axios";
import CreateInvoiceModal from "../../../components/billing/modals/CreateInvoiceModal";
import React, { useEffect } from "react";
import {
  Button,
  Dropdown,
  DropdownButton,
  Modal,
  Pagination,
  Table,
} from "react-bootstrap";
import { BsThreeDots } from "react-icons/bs";
import { FiArchive } from "react-icons/fi";
import { MdOutlineEdit } from "react-icons/md";
import { MdOutlineRequestQuote } from "react-icons/md";
import { MdOutlineArchive } from "react-icons/md";
import { toast } from "react-toastify";
import Loading from "../../loader/Loading";

const InvoiceTable = ({
  invoices,
  setSelectedInvoiceId,
  handleDelete,
  fetchInvoices,
  paymentStatus,
  refreshPaymentStatus,
}) => {
  const [showModal, setShowModal] = React.useState(false);
  const [showUpdateModal, setShowUpdateModal] = React.useState(false);
  const [invoiceData, setInvoiceData] = React.useState("");
  const [profileData, setProfileData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  // open pdf
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
          body: JSON.stringify({ profileData }), // Send profile data
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
    }
  };

  // handle payment link generation
  const handleGeneratePaymentLink = ({
    invoiceId,
    invoiceGrandTotal,
    invoiceCaId,
    invoiceClientId,
  }) => {
    createPaymentLink({
      invoiceId,
      invoiceGrandTotal,
      invoiceCaId,
      invoiceClientId,
    });
  };

  // create payment link func
  const createPaymentLink = async ({
    invoiceId,
    invoiceGrandTotal,
    invoiceCaId,
    invoiceClientId,
  }) => {
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/payment/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            invoiceGrandTotal,
            invoiceId,
            invoiceCaId,
            invoiceClientId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (response.status === 200) {
        refreshPaymentStatus();
        toast.success(data.message);
      }
    } catch (error) {
      console.error("Error creating payment link:", error);
      toast.error(error.response.data.message);
    }
    setLoading(false);
  };

  // handle cancel payment
  const handleCancelPaymentRequest = (invoiceId) => {
    cancelPaymentRequest(invoiceId);
  };
  // cancel payment request func
  const cancelPaymentRequest = async (invoiceId) => {
    setLoading(true);

    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_API_URL
        }/payment/cancel-payment-request/${invoiceId}`
      );

      if (response.data.success) {
        refreshPaymentStatus();
        setLoading(false);
        toast.success(response.data.message);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
      console.error("Error cancelling payment request:", error);
    }
  };

  // delete conformation modal
  const handleDeleteConfirmation = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setShowModal(true);
  };

  // update invoice
  const handleUpdateInvoice = async (invoiceId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/invoice/fetch-invoice/${invoiceId}`
      );
      if (response.data.success) {
        setInvoiceData(response.data.invoice);
      }
      setLoading(false);
      setShowUpdateModal(true);
    } catch (error) {
      console.error("Error fetching invoice:", error);
      toast.error(error.response?.data?.message || "Failed to fetch invoice");
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setShowUpdateModal(false);
  };

  useEffect(() => {
    fetchInvoices();
  }, [showUpdateModal]);

  // Pagination Logic
  const sortedData = () => {
    return [...invoices].sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();

      if (dateA === dateB) {
        return b._id.localeCompare(a._id);
      }
      return dateB - dateA;
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData().slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(sortedData().length / itemsPerPage);
  const emptyRows = itemsPerPage - currentItems.length; // Calculate empty rows needed

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <React.Fragment>
      {loading && <Loading />}
      <div className="scrollable-table">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ width: "50px" }}>S.No.</th>
              <th>Invoice Date</th>
              <th>Client</th>
              <th>Invoice#</th>
              <th>Due Date</th>
              <th>Total</th>
              <th style={{ width: "70px" }}>Action</th>
            </tr>
          </thead>
          {invoices.length === 0 ? (
            <p>No invoices found.</p>
          ) : (
            <tbody>
              {currentItems.map((invoice, index) => {
                const payment = paymentStatus.find(
                  (p) => p.invoiceId === invoice._id
                );
                const isPaymentDone = payment?.status === "done";
                const isPaymentPending = payment?.status === "pending";
                // const isRequestGenerated = paymentStatus.includes(invoice._id);

                return (
                  <tr key={invoice._id}>
                    <td>{indexOfFirstItem + index + 1}.</td>
                    <td>
                      {new Date(invoice.invoiceDate).toLocaleDateString()}
                    </td>
                    <td>{invoice.client}</td>
                    <td>
                      <Button
                        style={{ padding: "0px" }}
                        variant="link"
                        onMouseEnter={(e) =>
                          (e.target.style.textDecoration = "underline")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.textDecoration = "none")
                        }
                        onClick={() => openPdfInNewWindow(invoice._id)}
                      >
                        {invoice.invoiceNumber}
                      </Button>
                    </td>
                    <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                    <td>
                      <b>$ {invoice.grandTotal.toFixed(2)}</b>
                      {/* <div className="d-flex justify-content-between"> */}
                      {/* <p className="fw-bold m-0 d-flex align-items-center">$ {invoice.grandTotal.toFixed(2)}</p> */}
                      {/* </div> */}
                    </td>
                    <td
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <DropdownButton
                        className="custom-dropdown "
                        title={<BsThreeDots />}
                        align="start"
                        container="body"
                        menuPortalTarget={document.body} // Moves the dropdown outside the scrollable container
                        renderMenuOnMount
                      >
                        {/* Conditionally render buttons */}
                        {!isPaymentDone && (
                          <Dropdown.Item
                            eventKey="1"
                            onClick={() => {
                              isPaymentPending
                                ? null
                                : handleUpdateInvoice(invoice._id);
                            }}
                            style={{
                              pointerEvents: isPaymentPending ? "none" : "auto", // Disable interaction
                              opacity: isPaymentPending ? 0.5 : 1, // Make it visually disabled
                            }}
                          >
                            <MdOutlineEdit size={18} className="mx-2" /> Update
                          </Dropdown.Item>
                        )}

                        {/* Conditionally render buttons */}
                        {!isPaymentDone && (
                          <Dropdown.Item
                            eventKey="2"
                            onClick={() =>
                              isPaymentPending
                                ? handleCancelPaymentRequest(invoice._id)
                                : handleGeneratePaymentLink({
                                    invoiceId: invoice._id,
                                    invoiceGrandTotal: invoice.grandTotal,
                                    invoiceCaId: invoice.caId,
                                    invoiceClientId: invoice.clientId,
                                  })
                            }
                          >
                            <MdOutlineRequestQuote size={18} className="mx-2" />{" "}
                            {isPaymentPending
                              ? "Cancel Request"
                              : "Request Payment"}
                          </Dropdown.Item>
                        )}

                        <Dropdown.Item eventKey="3">
                          <MdOutlineArchive size={19} className="mx-2" />{" "}
                          Archieve
                        </Dropdown.Item>
                        <Dropdown.Item
                          eventKey="4"
                          onClick={() => handleDeleteConfirmation(invoice._id)}
                        >
                          <FiArchive size={17} className="mx-2" /> Delete
                        </Dropdown.Item>
                      </DropdownButton>
                    </td>
                  </tr>
                );
              })}
              {/* Add empty rows if necessary */}
              {emptyRows > 0 &&
                Array.from({ length: emptyRows }).map((_, idx) => (
                  <tr key={`empty-${idx}`} style={{ height: "54.4px" }}>
                    <td colSpan="1"></td>
                    <td colSpan="1"></td>
                    <td colSpan="1"></td>
                    <td colSpan="1"></td>
                    <td colSpan="1"></td>
                    <td colSpan="1"></td>
                    <td colSpan="1"></td>
                  </tr>
                ))}
            </tbody>
          )}
        </Table>
      </div>
      <Pagination className="mt-3 d-flex justify-content-center">
        <Pagination.First
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        />
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {[...Array(totalPages).keys()].map((pageNumber) => (
          <Pagination.Item
            key={pageNumber + 1}
            active={pageNumber + 1 === currentPage}
            onClick={() => handlePageChange(pageNumber + 1)}
          >
            {pageNumber + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>

      {/* Update Modal */}
      <CreateInvoiceModal
        invoiceData={invoiceData}
        setProfileData={setProfileData}
        show={showUpdateModal}
        onHide={handleModalClose}
      />

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this invoice? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              handleDelete();
              handleModalClose();
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default InvoiceTable;
