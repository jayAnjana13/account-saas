import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import userRouter from "./routes/userRouter.js";
import clientRouter from "./routes/clientRouter.js";
import invoiceRouter from "./routes/invoiceRouter.js";
import paymentRouter from "./routes/paymentRouter.js";
import profileRouter from "./routes/profileRouter.js";
import pdfRouter from "./routes/pdfRouter.js";
import User from "./models/userModel.js";
import Invoice from "./models/invoiceModel.js";
import { generateInvoicePDF } from "./utils/invoice-pdf.js";

dotenv.config();
const app = express();

//
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log("__dirname", __dirname);
// Set up storage for files (e.g., in a folder called "uploads")
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name with extension
    // const filePath = `/${Date.now()}${path.extname(file.originalname)}`;
    // cb(null, filePath);
  },
});

const upload = multer({ storage: storage });

// Create the upload folder if it doesn't exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("db connected"))
  .catch((err) => console.error("db connection failed", err));
//
//
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
console.log(path.join(__dirname, "uploads"));

// api routes
app.use("/api/user", userRouter);
app.use("/api/profile", profileRouter);
app.use("/api/clients", clientRouter);
app.use("/api/invoice", invoiceRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/pdf", pdfRouter);
app.use("/api/profile", profileRouter);

// API that handles the PDF generation and sending
app.post(`/api/invoice-pdf/:invoiceId`, async (req, res) => {
  const { invoiceId } = req.params;
  let { profileData } = req.body; // Receive profile data

  try {
    const invoiceData = await Invoice.findById(invoiceId);
    if (!invoiceData)
      return res.status(404).json({ error: "Invoice not found" });

    // If profileData is not sent (Client viewing), fetch it from the CA's profile
    if (!profileData) {
      const user = await User.findById(invoiceData.caId); // Assuming `User` is the CA model

      if (!user) {
        return res.status(404).json({ error: "CA profile not found" });
      }
      profileData = {
        logoUrl: user.profile.logoUrl,
        eSignUrl: user.profile.eSignUrl,
        organizationName: user.profile.organizationName,
        officeNumber: user.profile.officeNumber,
        officeEmail: user.profile.officeEmail,
        officeAddress: user.profile.officeAddress,
        websiteUrl: user.profile.websiteUrl,
        termsAndConditions: user.profile.termsAndConditions,
      };
    }

    const pdfBuffer = await generateInvoicePDF(
      invoiceData,
      profileData,
      invoiceId
    );

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=invoice.pdf",
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// profile api
app.post(
  "/api/ca-profile/:id",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "eSign", maxCount: 1 },
  ]),

  async (req, res) => {
    const { id } = req.params;

    try {
      const {
        organizationName,
        officeAddress,
        officeNumber,
        officeEmail,
        websiteUrl,
        services,
        termsAndConditions,
      } = req.body;

      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.role !== "CA") {
        return res
          .status(403)
          .json({ error: "Unauthorized: Only CAs can update this profile" });
      }

      // Parse officeAddress JSON
      const parsedOfficeAddress = officeAddress
        ? JSON.parse(officeAddress)
        : user.profile?.officeAddress;

      user.profile = {
        organizationName,
        officeAddress: parsedOfficeAddress,
        officeNumber,
        officeEmail,
        websiteUrl,
        logoUrl: req.files?.logo
          ? req.files.logo[0].path
          : user.profile?.logoUrl,
        eSignUrl: req.files?.eSign
          ? req.files.eSign[0].path
          : user.profile?.eSignUrl,
        services: services ? JSON.parse(services) : user.profile?.services,
        termsAndConditions: termsAndConditions
          ? JSON.parse(termsAndConditions)
          : user.profile?.termsAndConditions,
      };
      await user.save();

      res.status(200).json({
        message: "Profile updated successfully",
        profile: user.profile,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to update profile", error });
    }
  }
);

// Sample Route
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port "http://localhost:${PORT}"`);
});
