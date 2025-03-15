import express from "express";
import { fetchProfile, profileData } from "../controllers/profileController.js";

const profileRouter = express.Router();

profileRouter.get("/profile-data/:id", profileData);
profileRouter.get("/fetch-profile/:id", fetchProfile);

export default profileRouter;
