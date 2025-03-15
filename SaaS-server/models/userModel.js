import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["CA", "Client"],
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    clients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // References client users
      },
    ],
    linkedCA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the CA user
    },
    caCode: { type: String, unique: true, sparse: true },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },

    profile: {
      organizationName: { type: String, trim: true },
      officeAddress: {
        addressLine1: { type: String, trim: true }, // Street, Area, City
        addressLine2: { type: String, trim: true }, // District, Pincode
        addressLine3: { type: String, trim: true }, // Country
      },
      officeNumber: { type: String, trim: true },
      officeEmail: { type: String, trim: true, lowercase: true },
      websiteUrl: { type: String, trim: true },
      logoUrl: { type: String, trim: true }, // File path for logo
      eSignUrl: { type: String, trim: true }, // File path for e-signature
      services: [{ type: String, trim: true }], // Array of services
      termsAndConditions: [{ type: String, trim: true }], // Array of T&C
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
