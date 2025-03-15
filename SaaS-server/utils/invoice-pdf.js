import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatePath = path.join(__dirname, "invoice.html");
const pdfFolderPath = path.join(__dirname, "../allinvoices");

const encodeImageToBase64 = (imagePath) => {
  const absolutePath = path.join(
    __dirname,
    "..",
    "uploads",
    path.basename(imagePath)
  );
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${absolutePath}`);
  }
  const imageBuffer = fs.readFileSync(absolutePath);
  return `data:image/png;base64,${imageBuffer.toString("base64")}`;
};

// Function to generate invoice HTML dynamically
const generateInvoiceHTML = (invoiceData, profileData) => {
  const templatePath = path.join(__dirname, "invoice.html");
  console.log("profliedata..", profileData);

  const logoUrl = encodeImageToBase64(
    path.join(__dirname, profileData?.logoUrl)
  );
  // console.log("logo url'", logoUrl);
  const eSignUrl = encodeImageToBase64(
    path.join(__dirname, profileData?.eSignUrl)
  );
  // console.log("esign".eSignUrl);

  if (!fs.existsSync(templatePath)) {
    throw new Error(" invoice.html file not found!");
  }

  let template = fs.readFileSync(templatePath, "utf8");

  // Replace basic placeholders
  template = template.replace("{{logo}}", logoUrl);
  template = template.replace(
    "{{organizationName}}",
    profileData.organizationName
  );

  template = template.replace("{{officeNumber}}", profileData.officeNumber);
  template = template.replace("{{officeEmail}}", profileData.officeEmail);
  template = template.replace("{{invoiceNumber}}", invoiceData.invoiceNumber);
  template = template.replace(
    "{{invoiceDate}}",
    new Date(invoiceData.invoiceDate).toLocaleDateString()
  );
  template = template.replace(
    "{{dueDate}}",
    new Date(invoiceData.dueDate).toLocaleDateString()
  );
  template = template.replace("{{clientName}}", invoiceData.client);
  template = template.replace("{{senderName}}", invoiceData.senderName);
  template = template.replace("{{esign}}", eSignUrl);

  const formattedAddress = `
  ${profileData.officeAddress.addressLine1 || ""} <br>
  ${profileData.officeAddress.addressLine2 || ""} <br>
  ${profileData.officeAddress.addressLine3 || ""}
`.trim();
  template = template.replace("{{officeAddress}}", formattedAddress);

  // Add Website URL as a clickable hyperlink
  const websiteLink = profileData.websiteUrl
    ? `<a href="${profileData.websiteUrl}" target="_blank">${profileData.websiteUrl}</a>`
    : "";
  template = template.replace("{{websiteUrl}}", websiteLink);

  // Conditionally add Terms & Conditions
  let formattedTerms = "";
  if (invoiceData.tnCisChecked && profileData.termsAndConditions?.length > 0) {
    formattedTerms = `
      <h3>Terms & Conditions</h3>
      <ol>
        ${profileData.termsAndConditions
          .map((term) => `<li>${term}</li>`)
          .join("")}
      </ol>
    `;
  }
  template = template.replace("{{termsAndConditions}}", formattedTerms);

  // Generate table rows dynamically
  let itemsHTML = invoiceData.tableData
    .map(
      (item) => `
        <tr>
            <td>${item.service}</td>
            <td>${item.description}</td>
            <td>${item.quantity}</td>
            <td>${item.rate}</td>
            <td>${item.discount || 0}</td>
            <td>${item.tax}</td>
            <td>${item.total}</td> 
    `
    )
    .join("");

  template = template.replace("{{invoiceItems}}", itemsHTML);

  // Replace totals
  template = template.replace(
    "{{subTotal}}",
    `$${invoiceData.subTotal.toFixed(2)}`
  );
  template = template.replace(
    "{{totalDiscount}}",
    `$${invoiceData.totalDiscount.toFixed(2)}`
  );
  template = template.replace(
    "{{totalTax}}",
    `$${invoiceData.totalTax.toFixed(2)}`
  );
  template = template.replace(
    "{{grandTotal}}",
    `$${invoiceData.grandTotal.toFixed(2)}`
  );

  return template;
};

// Puppeteer PDF Generation
export const generateInvoicePDF = async (
  invoiceData,
  profileData,
  invoiceId
) => {
  try {
    console.log("⏳ Launching Puppeteer...");
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    console.log("✅ Generating Invoice HTML...");
    const invoiceHTML = generateInvoiceHTML(invoiceData, profileData);
    await page.setContent(invoiceHTML, { waitUntil: "load" });

    // Generate PDF
    // const pdfPath = path.join(pdfFolderPath, `invoice-${invoiceId}.pdf`);

    const pdfBuffer = await page.pdf({
      // path: pdfPath,
      format: "A4",
      printBackground: true,
      timeout: 60000,
      margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
    });

    await browser.close();
    console.log("✅ Invoice PDF generated successfully:");
    return pdfBuffer;
  } catch (error) {
    console.error("❌ Error generating PDF:", error);
  }
};
