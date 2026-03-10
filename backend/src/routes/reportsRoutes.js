import express from "express";
import { downloadCustomerLedger } from "../controllers/reportsController.js";

const router = express.Router();

router.get("/customer-ledger/:id", downloadCustomerLedger);

export default router;