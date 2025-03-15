import Invoice from "../models/invoiceModel.js";

// API that handles the PDF generation and sending
const invoicePdf = async (req, res) => {
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
};

export { invoicePdf };
