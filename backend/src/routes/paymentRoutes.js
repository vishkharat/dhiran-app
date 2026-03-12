import express from "express";

import {
  addPayment,
  getPaymentsByDhiran,
  getTotalPaid
} from "../controllers/paymentController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, addPayment);

router.get("/dhiran/:id", verifyToken, getPaymentsByDhiran);

router.get("/total/:dhiranId", verifyToken, getTotalPaid);

export default router;