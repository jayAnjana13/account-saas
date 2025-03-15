import express from "express";
import {
  allInvoices,
  clientInvoices,
  createInvoice,
  deleteInvoice,
  fetchInvoice,
  generateInvoiceNumber,
  updateInvoice,
} from "../controllers/invoiceController.js";

const invoiceRouter = express.Router();

invoiceRouter.get("/generate-invoice-number/:id", generateInvoiceNumber);
invoiceRouter.post("/create-invoice", createInvoice);
invoiceRouter.get("/all-invoices/:id", allInvoices);
invoiceRouter.get("/client-invoices/:id", clientInvoices);
invoiceRouter.delete("/delete/:id", deleteInvoice);
invoiceRouter.get("/fetch-invoice/:id", fetchInvoice);
invoiceRouter.put("/update-invoice/:id", updateInvoice);

export default invoiceRouter;
