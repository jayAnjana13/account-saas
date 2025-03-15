import mongoose from "mongoose";

const serviceTableSchema = new mongoose.Schema(
  {
    service: { type: String, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    rateType: { type: String },
    rate: { type: Number, required: true },
    amount: { type: Number },
    wuwd: { type: String },
    assignee: { type: String },
    date: { type: Date },
    discount: { type: String },
    tax: { type: String, required: true },
    total: { type: Number, required: true },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    client: { type: String, required: true },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    caId: { type: mongoose.Schema.Types.ObjectId, ref: "CA", required: true },
    caCode: { type: String, required: true }, // The CA issuing the invoice
    invoiceNumber: { type: String, required: true, unique: true },
    invoiceDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    tableData: [serviceTableSchema],
    totalDiscount: { type: Number, required: true },
    totalTax: { type: Number, required: true },
    subTotal: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
    tnCisChecked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Invoice", invoiceSchema);
