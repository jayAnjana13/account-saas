import { setEngine } from "crypto";
import Payment from "../models/paymentModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Stripe Checkout Session
const createCheckoutSession = async (req, res) => {
  const { invoiceGrandTotal, invoiceId, invoiceCaId, invoiceClientId } =
    req.body;
  console.log("req for payment link", req.body);
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: invoiceGrandTotal },
            unit_amount: invoiceGrandTotal * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      metadata: { invoiceId },
    });

    // Save payment details in the database
    await Payment.create({
      invoiceId,
      caId: invoiceCaId,
      clientId: invoiceClientId,
      sessionId: session.id,
      sessionUrl: session.url,
      amount: invoiceGrandTotal,
      status: "pending",
    });
    console.log("payment ..", session.url);
    // res.json({ sessionId: session.id });
    res
      .status(200)
      .json({ url: session.url, message: "Payment link Generated" });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Verify Payment and Update Status
const verifypayment = async (req, res) => {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      // Update payment status in the database
      await Payment.findOneAndUpdate(
        { sessionId: session_id },
        { status: "done" },
        { new: true }
      );

      res.status(200).json({ success: true, message: "Payment Done." });
    } else {
      res.json({ success: false, message: "Payment not completed yet." });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Payments for Client
const getPayment = async (req, res) => {
  const { invoiceId, sessionUrl } = req.query;

  try {
    const payments = await Payment.find({ invoiceId: invoiceId });
    res.json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// get payment status for ca
const paymentStatus = async (req, res) => {
  const { id } = req.params;
  const caId = id;
  console.log("id for payment status", id);
  try {
    const payments = await Payment.find({ caId });
    if (!payments || payments.length === 0) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Extract status from each payment
    const statuses = payments.map((payment) => ({
      invoiceId: payment.invoiceId,
      status: payment.status,
    }));
    console.log("status", statuses);
    res.status(200).json({ success: true, statuses });
  } catch (error) {
    console.log("Error in getting payment status", error);
    res.status(500).json({ error: " Error in fetching payment status" });
  }
};

const deletePaymentReq = async (req, res) => {
  const { invoiceId } = req.params;
  console.log("delete req", invoiceId);
  try {
    // Find the payment record by invoiceId
    const payment = await Payment.deleteOne({ invoiceId });
    console.log("payent to be deleted", payment);
    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: "Payment request not found" });
    }

    res.status(200).json({
      success: true,
      message: "Payment request cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling payment request:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export {
  createCheckoutSession,
  verifypayment,
  getPayment,
  paymentStatus,
  deletePaymentReq,
};
