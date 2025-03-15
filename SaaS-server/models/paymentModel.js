import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  invoiceId: { type: String, required: true },
  caId: { type: String, required: true },
  clientId: { type: String, required: true },
  sessionId: { type: String, required: true },
  sessionUrl: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, required: true, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Payment", PaymentSchema);
