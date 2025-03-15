import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Dropdown,
  FormControl,
  InputGroup,
  Row,
} from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import CreateInvoiceModal from "../../../components/billing/modals/CreateInvoiceModal";
import InvoiceTable from "../../../components/billing/tables/InvoiceTable";
import growth from "../../../assets/images/growth.svg";
import donutchart from "../../../assets/images/donutchart.svg";
import { LuUser } from "react-icons/lu";
import { IoReceiptOutline } from "react-icons/io5";
import { MdOutlineRequestQuote } from "react-icons/md";
import { CiCalendarDate } from "react-icons/ci";
import { BsCalendar2Date } from "react-icons/bs";
import { MdOutlineRefresh } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import Loading from "../../../components/loader/Loading";

const Invoices = () => {
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [paymentStatus, setPaymentStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [clientSearch, setClientSearch] = useState("");
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [amountRange, setAmountRange] = useState({ min: "", max: "" });
  const [dueDateRange, setDueDateRange] = useState({ start: "", end: "" });
  const [invoiceDateRange, setInvoiceDateRange] = useState({
    start: "",
    end: "",
  });

  // Fetch all invoices
  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/invoice/all-invoices/${localStorage.getItem("id")}`
      );
      if (Array.isArray(response.data.invoices)) {
        setInvoices(response.data.invoices);
        setFilteredInvoices(response.data.invoices);
      } else {
        console.error("Unexpected data format:", response.data);
        setInvoices([]);
        setFilteredInvoices([]);
      }
    } catch (error) {
      console.log("Error in fetching invoices", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch latest invoice number
  const fetchInvoiceNumber = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/invoice/generate-invoice-number/${localStorage.getItem("id")}`
      );
      if (response.data.success) {
        setInvoiceNumber(response.data.invoiceNumber);
      }
    } catch (error) {
      console.error("Error fetching invoice number:", error);
    }
  };

  // Feth payment status
  const fetchPaymentStatus = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/payment/payment-status/${localStorage.getItem("id")}`
      );
      if (response.data.success) {
        setPaymentStatus(response.data.statuses);
      }
    } catch (error) {
      console.log("Error in fetching payment status", error);
    }
  };
  //
  useEffect(() => {
    fetchInvoices();
    fetchInvoiceNumber();
    fetchPaymentStatus();
  }, [showInvoiceModal]);

  // Delete invoice
  const handleDelete = async (invoiceId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/invoice/delete/${selectedInvoiceId}`
      );
      setInvoices((prevInvoices) =>
        prevInvoices.filter((invoice) => invoice._id !== invoiceId)
      );
      setFilteredInvoices((prevInvoices) =>
        prevInvoices.filter((invoice) => invoice._id !== invoiceId)
      );
      fetchInvoices();

      if (response.status === 200) {
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error(error.response?.data?.message || "Failed to delete invoice");
    }
  };

  // Search functionality
  useEffect(() => {
    let result = invoices;

    // **Step 1: Universal Search (All Fields)**
    if (searchQuery && filterType === "All") {
      result = invoices.filter(
        (invoice) =>
          invoice.client?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          invoice.invoiceNumber
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          invoice.grandTotal.toString().includes(searchQuery) ||
          invoice.invoiceDate.includes(searchQuery) ||
          invoice.dueDate.includes(searchQuery)
      );
    } else {
      // **Step 2: Specific Filters**
      if (filterType === "Client" && clientSearch) {
        result = invoices.filter((invoice) =>
          invoice.client?.toLowerCase().includes(clientSearch.toLowerCase())
        );
      }

      if (filterType === "Invoice" && invoiceSearch) {
        result = invoices.filter((invoice) =>
          invoice.invoiceNumber
            ?.toLowerCase()
            .includes(invoiceSearch.toLowerCase())
        );
      }

      if (filterType === "Amount" && amountRange.min && amountRange.max) {
        result = result.filter(
          (invoice) =>
            Number(invoice.grandTotal) >= Number(amountRange.min) &&
            Number(invoice.grandTotal) <= Number(amountRange.max)
        );
      }

      if (
        filterType === "Date" &&
        invoiceDateRange.start &&
        invoiceDateRange.end
      ) {
        result = result.filter((invoice) => {
          const invoiceDate = new Date(invoice.invoiceDate);
          const startDate = new Date(invoiceDateRange.start);
          const endDate = new Date(invoiceDateRange.end);
          return invoiceDate >= startDate && invoiceDate <= endDate;
        });
      }
      if (filterType === "Due-Date" && dueDateRange.start && dueDateRange.end) {
        result = result.filter((invoice) => {
          const invoiceDate = new Date(invoice.dueDate);
          const startDate = new Date(dueDateRange.start);
          const endDate = new Date(dueDateRange.end);
          return invoiceDate >= startDate && invoiceDate <= endDate;
        });
      }
    }

    setFilteredInvoices(result);
  }, [
    searchQuery,
    filterType,
    clientSearch,
    invoiceSearch,
    amountRange,
    invoiceDateRange,
    dueDateRange,
    invoices,
  ]);

  return (
    <>
      {loading && <Loading />}
      <Row>
        <Col md={2}>
          <h5>
            <b>Invoices</b>
          </h5>
        </Col>
      </Row>

      <hr />

      {/* Revenue and Insights Section */}
      <Row>
        <Col md={4}>
          <Card style={{ height: "200px", textAlign: "center" }}>
            <Card.Body>
              <div className="text-center mb-3">
                <img src={growth} alt="growth" />
              </div>
              <h6>
                <b>Track your Revenue</b>
              </h6>
              <p>
                <small>
                  The revenue chart will update every month with collected
                  revenue to show how quickly you are growing.
                </small>
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={5} style={{ textAlign: "center" }}>
          <Row>
            <Col>
              <Card style={{ height: "80px" }}>
                <Card.Body>
                  <h4>$ 0</h4>
                  <p>Total Past Due</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card style={{ height: "80px" }}>
                <Card.Body>
                  <h4>$ 0</h4>
                  <p>Total Outstanding</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col md={3}>
          <Card style={{ height: "200px", textAlign: "center" }}>
            <Card.Body>
              <div className="text-center mb-3">
                <img src={donutchart} alt="growth" />
              </div>
              <h6>
                <b>We need more information</b>
              </h6>
              <p>
                <small>Begin creating invoices now</small>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Invoice Section */}
      <Row>
        <Col md={12}>
          <Card>
            <Card.Body>
              <Row>
                <Col sm={3} md={3} lg={3}>
                  <Button onClick={() => setShowInvoiceModal(true)}>
                    Create Invoice
                  </Button>
                </Col>
                <Col sm={1} md={2} lg={3}></Col>
                <Col sm={8} md={7} lg={6}>
                  <Row>
                    {/* Dropdown for selecting filter type */}
                    <Col xs={4} sm={2} md={4} lg={4} xl={3}>
                      <Dropdown className="customize-dropdown ">
                        <Dropdown.Toggle
                          style={{ width: "100px" }}
                          variant="primary"
                        >
                          {filterType === "All" ? " All" : ` ${filterType}`}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => {
                              setFilterType("All");
                              setSearchQuery("");
                              setClientSearch("");
                              setInvoiceSearch("");
                              setAmountRange("");
                              setInvoiceDateRange("");
                              setDueDateRange("");
                            }}
                          >
                            <FiSearch size={18} className="mx-2" />
                            All
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => setFilterType("Client")}
                          >
                            <LuUser size={18} className="mx-2" />
                            Client
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => setFilterType("Invoice")}
                          >
                            <IoReceiptOutline size={18} className="mx-2" />
                            Invoice
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => setFilterType("Amount")}
                          >
                            <MdOutlineRequestQuote size={19} className="mx-2" />
                            Amount
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => setFilterType("Date")}>
                            <CiCalendarDate size={19} className="mx-2 " />
                            Date
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => setFilterType("Due-Date")}
                          >
                            <CiCalendarDate size={19} className="mx-2" />
                            Due Date
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Col>

                    {/* Search Input */}
                    <Col xs={8} sm={7} md={8} lg={7} xl={7}>
                      <InputGroup className="mb-3">
                        {filterType === "Date" ? (
                          <Row>
                            <Col xs={5} sm={5} md={5} lg={5} xl={5} xxl={5}>
                              <FormControl
                                type="date"
                                placeholder="Start Date"
                                value={invoiceDateRange.start}
                                onChange={(e) =>
                                  setInvoiceDateRange({
                                    ...invoiceDateRange,
                                    start: e.target.value,
                                  })
                                }
                              />
                            </Col>

                            <Col
                              xs={2}
                              sm={2}
                              md={2}
                              lg={2}
                              xl={2}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <FaArrowRightArrowLeft />
                            </Col>

                            <Col xs={5} sm={5} md={5} lg={5} xl={5} xxl={5}>
                              <FormControl
                                type="date"
                                placeholder="End Date"
                                value={invoiceDateRange.end}
                                onChange={(e) =>
                                  setInvoiceDateRange({
                                    ...invoiceDateRange,
                                    end: e.target.value,
                                  })
                                }
                              />
                            </Col>
                          </Row>
                        ) : filterType === "Due-Date" ? (
                          <Row>
                            <Col xs={5} sm={5} md={5} lg={5} xl={5} xxl={5}>
                              <FormControl
                                type="date"
                                placeholder="Start Date"
                                value={dueDateRange.start}
                                onChange={(e) =>
                                  setDueDateRange({
                                    ...dueDateRange,
                                    start: e.target.value,
                                  })
                                }
                              />
                            </Col>
                            <Col
                              xs={2}
                              sm={2}
                              md={2}
                              lg={2}
                              xl={2}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <FaArrowRightArrowLeft />
                            </Col>

                            <Col xs={5} sm={5} md={5} lg={5} xl={5} xxl={5}>
                              <FormControl
                                type="date"
                                placeholder="End Date"
                                value={dueDateRange.end}
                                onChange={(e) =>
                                  setDueDateRange({
                                    ...dueDateRange,
                                    end: e.target.value,
                                  })
                                }
                              />
                            </Col>
                          </Row>
                        ) : filterType === "Amount" ? (
                          <Row>
                            <Col xs={5} sm={5} md={5} lg={5} xl={5} xxl={5}>
                              <FormControl
                                type="number"
                                placeholder="Min Amount"
                                value={amountRange.min}
                                onChange={(e) =>
                                  setAmountRange({
                                    ...amountRange,
                                    min: e.target.value,
                                  })
                                }
                              />
                            </Col>
                            <Col
                              xs={2}
                              sm={2}
                              md={2}
                              lg={2}
                              xl={2}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <FaArrowRightArrowLeft />
                            </Col>

                            <Col xs={5} sm={5} md={5} lg={5} xl={5} xxl={5}>
                              <FormControl
                                type="number"
                                placeholder="Max Amount"
                                value={amountRange.max}
                                onChange={(e) =>
                                  setAmountRange({
                                    ...amountRange,
                                    max: e.target.value,
                                  })
                                }
                              />
                            </Col>
                          </Row>
                        ) : filterType === "Client" ? (
                          <FormControl
                            type="text"
                            placeholder="Search by Client Name"
                            value={clientSearch}
                            onChange={(e) => setClientSearch(e.target.value)}
                          />
                        ) : filterType === "Invoice" ? (
                          <FormControl
                            type="text"
                            placeholder="Search by Invoice Number"
                            value={invoiceSearch}
                            onChange={(e) => setInvoiceSearch(e.target.value)}
                          />
                        ) : (
                          <FormControl
                            type="text"
                            placeholder="Search here"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        )}
                        {/* <Button className=" btn-sm" variant="transparent" onClick={resetFilters}>
                          <MdOutlineRefresh size={28} />
                        </Button> */}
                      </InputGroup>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col>
                  <InvoiceTable
                    invoices={filteredInvoices}
                    setSelectedInvoiceId={setSelectedInvoiceId}
                    handleDelete={handleDelete}
                    fetchInvoices={fetchInvoices}
                    paymentStatus={paymentStatus}
                    refreshPaymentStatus={fetchPaymentStatus}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <CreateInvoiceModal
        invoiceNumber={invoiceNumber}
        show={showInvoiceModal}
        onHide={() => setShowInvoiceModal(false)}
      />
    </>
  );
};

export default Invoices;
