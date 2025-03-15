// /middleware/authenticateToken.js
import jwt from "jsonwebtoken";

// Middleware to authenticate the token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization token missing or invalid." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.userId = { _id: decoded.id };
    next();
  } catch (error) {
    console.error("Error decoding token:", error);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};
