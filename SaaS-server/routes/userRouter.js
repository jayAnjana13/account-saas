import express from "express";
import {
  addClient,
  forgotPassword,
  loginUser,
  registerUser,
  resetPassword,
  userData,
  verifyUser,
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const userRouter = express.Router();

userRouter.post("/signup", registerUser);
userRouter.post("/signin", loginUser);
userRouter.post("/add-client", authenticateToken, addClient);
userRouter.get("/verify/:token", verifyUser);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);
userRouter.get("/user-data/:id", userData);

export default userRouter;
