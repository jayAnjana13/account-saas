import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { Header, Footer } from "./email_content.js";

dotenv.config();

const sendResetEmail = async (email, Main) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: "gmail", // Use your email provider
    auth: {
      user: "jayanjana13@gmail.com",
      pass: "nigz tkay ohxr hhkn",
      //   user: process.env.EMAIL_USER, // Your email address
      //   pass: process.env.EMAIL_PASS, // Your email password or app password
    },
  });

  // HTML email template
  const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Password Reset Email</title>
            <style>
                body, table, td, a {
                    font-family: Arial, sans-serif;
                    text-size-adjust: 100%;
                    -webkit-text-size-adjust: 100%;
                    -ms-text-size-adjust: 100%;
                }
                table, td {
                    border-collapse: collapse;
                }
                img {
                    border: 0;
                    height: auto;
                    line-height: 100%;
                    outline: none;
                    text-decoration: none;
                }
                body {
                    width: 100% !important;
                    height: 100% !important;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }
                /* Main Container */
                .email-container {
                    width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    border: 1px solid #dddddd;
                }
                /* Header Section */
                .email-header {
                    background-color: #1dc4e9; /* Dark header background */
                    padding: 20px;
                    text-align: left;
                    color: #ffffff;
                    font-size:24px;
                }
                /* Content Section */
                .email-content {
                    padding: 30px;
                    text-align: center;
                }
                .email-content h2 {
                    font-size: 24px;
                    color: #333333;
                }
                .email-content p {
                    font-size: 16px;
                    color: #666666;
                    line-height: 1.5;
                }
                .email-content .button {
                    display: inline-block;
                    margin: 20px 0;
                    padding: 12px 20px;
                    background-color: #1dc4e9; /* Button color */
                    color: #ffffff;
                    text-decoration: none;
                    font-size: 16px;
                    border-radius: 5px;
                }
                .email-footer {
                    text-align: center;
                    padding: 20px;
                    font-size: 12px;
                    color: #777777;
                }
                .email-footer a {
                    color: #1dc4e9;
                    text-decoration: none;
                }
                .social-icons img {
                    width: 24px; /* Adjust the size of the icons */
                    height: 24px;
                    margin: 0 5px;
                }
            </style>
        </head>
        <body>
            <!-- Email Container -->
            <table class="email-container" cellpadding="0" cellspacing="0" width="600">
                <!-- Header Section -->
              ${Header}
                <!-- Content Section -->
               ${Main}
                <!-- Footer Section -->
              ${Footer}
            </table>
        </body>
        </html>
    `;

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    html: htmlContent, // Use the HTML template
  };

  // Send the email
  return transporter.sendMail(mailOptions);
};

// email template
const SignupMainContent = (firstName, lastName, token) => {
  return `
    <tr>
        <td class="email-content">
            <h2>Welcome to Taxify</h2>
            <p><strong>${firstName} ${lastName},</strong></p>
            <p>
                We are excited to help you connect with your clients, get paid faster, and streamline tax resolution cases. You're almost there - just click the button below to activate your account and login to Taxify.
            </p>
            <!-- Button -->
            <a href="${process.env.VITE_APP_URL}/auth/verifying/${token}" class="button">Activate my account</a>
            <p>Cheers,</p>
            <p>
            <strong>The Taxify Team</strong>
            </p>
        </td>
    </tr>`;
};

export { sendResetEmail, SignupMainContent };
