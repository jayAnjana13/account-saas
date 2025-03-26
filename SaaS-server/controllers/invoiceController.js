import dotenv from "dotenv";
import User from "../models/userModel.js";
import Invoice from "../models/invoiceModel.js";

dotenv.config();

// Generate invoice number without saving it
const generateInvoiceNumber = async (req, res) => {
  try {
    const { id } = req.params;
    const caId = id;

    // Find the CA to get the CA code
    const ca = await User.findById(caId);
    if (!ca || ca.role !== "CA") {
      return res.status(400).json({ success: false, message: "Invalid CA" });
    }
    // Find last invoice for this CA
    const lastInvoice = await Invoice.findOne({ caCode: ca.caCode }).sort({
      invoiceNumber: -1,
    });

    let newInvoiceNumber = 1;
    if (lastInvoice && lastInvoice.invoiceNumber) {
      const lastNumber = parseInt(lastInvoice.invoiceNumber.split("-")[1], 10);
      newInvoiceNumber = lastNumber + 1;
    }

    const generatedInvoiceNumber = `${ca.caCode}-${String(
      newInvoiceNumber
    ).padStart(4, "0")}`;
    res.status(200).json({
      success: true,
      invoiceNumber: generatedInvoiceNumber,
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error generating invoice", error });
  }
};

// create invoice
const createInvoice = async (req, res) => {
  try {
    const { caId } = req.body;

    const ca = await User.findById(caId);
    if (!ca || ca.role !== "CA") {
      return res.status(400).json({ success: false, message: "Invalid CA" });
    }
    const caCode = ca.caCode;

    const newInvoice = new Invoice({ ...req.body, caCode: caCode });
    await newInvoice.save();
    res.status(200).json({
      success: true,
      invoice: newInvoice,
      message: "Invoice Generated",
    });
  } catch (error) {
    console.error(" ERROR:", error);
    res.status(500).json({ message: "Error in creating invoice", error });
  }
};

// fetch all invoices of CA
const allInvoices = async (req, res) => {
  const { id } = req.params;
  const caId = id;
  try {
    const invoices = await Invoice.find({ caId });

    if (!invoices) {
      return res.status(404).json({ message: "No invoices found for this CA" });
    }
    res.status(200).json({ success: true, invoices });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ mssage: "Error in fetching invoices" });
  }
};

// fetch invoices of the client
const clientInvoices = async (req, res) => {
  const { id } = req.params;
  const clientId = id;

  try {
    const invoices = await Invoice.find({ clientId }).populate(
      "clientId"
      // "client invoice"
    );

    if (!invoices) {
      return res
        .status(404)
        .json({ message: "No invoices found for this client" });
    }

    res.status(200).json({ success: true, invoices });
  } catch (error) {
    console.log("Error in fetching clients invoices", error);
    res.status(500).json({ message: "Error in fetching client invoices" });
  }
};

// delete invoice
const deleteInvoice = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteInvoice = await Invoice.findByIdAndDelete(id);

    if (!deleteInvoice) {
      return res.status(404).json({ message: "  Invoice Not Found" });
    }

    res.status(200).json({ message: "Invoice Deleted Successfully" });
  } catch (error) {
    console.log("Error in Deleting Invoice", error);
    res.status(500).json({ message: "Error in Deleting Invoice" });
  }
};

// feching invoice for update
const fetchInvoice = async (req, res) => {
  const { id } = req.params;
  try {
    const invoice = await Invoice.findById(id);

    if (!invoice) {
      return res.status(404).json({ message: "No invoices found " });
    }

    res.status(200).json({ success: true, invoice });
  } catch (error) {
    console.log("Error in fetching single invoices", error);
    res.status(500).json({ message: "Error in fetching single invoices" });
  }
};

// Update Existing Invoice
const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedInvoice = await Invoice.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res
      .status(200)
      .json({ message: "Invoice updated successfully", updatedInvoice });
  } catch (error) {
    console.error("Error updating invoice:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export {
  generateInvoiceNumber,
  createInvoice,
  allInvoices,
  clientInvoices,
  deleteInvoice,
  fetchInvoice,
  updateInvoice,
};
