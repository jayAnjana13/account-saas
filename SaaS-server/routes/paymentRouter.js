import express from "express";
import {
  createCheckoutSession,
  deletePaymentReq,
  getPayment,
  paymentStatus,
  verifypayment,
} from "../controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-checkout-session", createCheckoutSession);
paymentRouter.get("/verify-payment", verifypayment);
paymentRouter.get("/get-payments", getPayment);
paymentRouter.get("/payment-status/:id", paymentStatus);
paymentRouter.delete("/cancel-payment-request/:invoiceId", deletePaymentReq);

export default paymentRouter;
