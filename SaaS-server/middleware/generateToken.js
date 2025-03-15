import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET, // Using the JWT secret from environment variables
    { expiresIn: "10h" } // Token expiry (1 hour)
  );
};
