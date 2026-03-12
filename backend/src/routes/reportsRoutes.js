import express from "express";
import { downloadCustomerLedger } from "../controllers/reportsController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/customer-ledger/:id", verifyToken, downloadCustomerLedger);

export default router;