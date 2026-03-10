import express from "express";

import {
  addPayment,
  getPaymentsByDhiran,
  getTotalPaid
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/", addPayment);

router.get("/dhiran/:id", getPaymentsByDhiran);

router.get("/total/:dhiranId", getTotalPaid);

export default router;