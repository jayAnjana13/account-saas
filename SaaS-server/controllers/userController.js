import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/userModel.js";
import { generateToken } from "../middleware/generateToken.js";
import { sendResetEmail, SignupMainContent } from "../utils/email.js";
dotenv.config();

// Function to generate a sequential CA Code
const generateCaCode = async () => {
  const lastCA = await User.findOne({ role: "CA" }).sort({ caCode: -1 });
  let newCodeNumber = 1;
  if (lastCA && lastCA.caCode) {
    const lastNumber = parseInt(lastCA.caCode.replace("INV", ""), 10);
    newCodeNumber = lastNumber + 1;
  }

  return `INV${String(newCodeNumber).padStart(3, "0")}`;
};

// CA Signup API
const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = generateToken({ email });

    // If user is CA, generate a sequential CA Code
    let caCode = null;

    caCode = await generateCaCode();
    // Create CA user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "CA",
      caCode,
      isVerified: false,
    });
    // Save CA to DB
    await newUser.save();

    const emailContent = SignupMainContent(firstName, lastName, token);
    await sendResetEmail(email, emailContent);

    res.status(200).json({
      message: "User registered successfully. Please verify your email.",
    });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ message: "Something went wrong.", error });
  }
};

// Sign-in
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter your email and password." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message:
          "Your account is not verified. Please check your email for the verification link.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: "User signed in successfully!",
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Error during user signin:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

//add client
const addClient = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const caId = req.userId._id; // Extracted from the middleware
  try {
    const ca = await User.findById(caId);
    if (!ca || ca.role !== "CA" || !ca.isVerified) {
      return res.status(400).json({ message: "Invalid or unverified CA." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const token = generateToken({ email });

    // Create client user
    const newClient = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "Client",
      isVerified: false,
      linkedCA: caId,
    });

    const client = await newClient.save();

    const emailContent = SignupMainContent(firstName, lastName, token);
    await sendResetEmail(email, emailContent);

    // Add client to CA's clients list
    ca.clients.push(client._id);
    await ca.save();

    res.status(200).json({ message: "Client added successfully.", client });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ message: "Something went wrong.", error });
  }
};

// Verification Route
const verifyUser = async (req, res) => {
  const { token } = req.params;
  try {
    // Find the user by token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.email) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(400).json({ message: "User not Found." });
    }
    if (user.isVerified) {
      return res
        .status(400)
        .json({ message: "Your account is already verified." });
    }

    // Mark the user as verified
    user.isVerified = true;

    let jwtToken = null;
    let resetToken = null;

    if (user.role === "CA") {
      // ✅ Only generate JWT for CAs
      jwtToken = generateToken(user);
    } else if (user.role === "Client") {
      // ✅ Only generate reset token for Clients
      resetToken = crypto.randomBytes(20).toString("hex");
      user.passwordResetToken = resetToken;
      user.passwordResetExpires = Date.now() + 3600000; // Expires in 1 hour
    }

    await user.save();

    // Redirect the user to the dashboard
    res.status(200).json({
      token: user.role === "CA" ? jwtToken : null,
      user: { id: user._id, email: user.email, role: user.role },
      resetToken: user.role === "Client" ? resetToken : null,
      message: "Account verified successfully!",
    });
  } catch (error) {
    console.error("Error during account verification:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

// forget password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  // Generate a password reset token
  const resetToken = crypto.randomBytes(20).toString("hex");
  const ForgotPasswordMainContent = `
                  <tr>
                      <td class="email-content">
                          <h2>Reset Password</h2>
                          <p><strong>Somebody requested to reset your password</strong></p>
                          <p>
                              If you requested to reset your password, click on the button below to create a new password. If this wasn’t you, please disregard this email.
                          </p>
                          <!-- Button -->
                          <a href="${process.env.VITE_APP_URL}/auth/reset-password/${resetToken}" class="button">Reset password</a>
                      </td>
                  </tr>`;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "No user found with that email address." });
    }

    // Set token and expiration in user document
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 3600000; // Token valid for 1 hour
    await user.save();

    // Send the reset token to the user's email
    await sendResetEmail(email, ForgotPasswordMainContent);

    res.status(201).json({
      message: "Reset link sent! Check your email for further instructions.",
    });
  } catch (error) {
    console.error("Error during forgot password:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

// Reset Password Route
const resetPassword = async (req, res) => {
  const { password } = req.body;
  const resetToken = req.params.token;

  try {
    // Find user by reset token and check if it is expired
    const user = await User.findOne({
      passwordResetToken: resetToken,
      passwordResetExpires: { $gt: Date.now() }, // Token must be valid
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear reset token and expiration
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password has been reset successfully!" });
  } catch (error) {
    console.error("Error during reset password:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

// user name
const userData = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("firstName lastName");

    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    // Combine firstName and lastName
    const fullName = `${user.firstName} ${user.lastName}`;

    res.status(200).json({ success: true, fullName });
  } catch (error) {
    console.log("Error in fetching user data", error);
    res.status(500).json({ message: "Error in fetching user data" });
  }
};

export {
  registerUser,
  loginUser,
  addClient,
  verifyUser,
  forgotPassword,
  resetPassword,
  userData,
};
