import express from "express";
import { allClients } from "../controllers/clientController.js";

const clientRouter = express.Router();

clientRouter.get("/all-clients/:id", allClients);

export default clientRouter;
