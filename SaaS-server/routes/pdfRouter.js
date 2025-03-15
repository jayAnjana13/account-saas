import express from "express";
import { invoicePdf } from "../controllers/pdfController.js";

const pdfRouter = express.Router();

pdfRouter.post(`/api/invoice-pdf/:invoiceId`, invoicePdf);

export default pdfRouter;
