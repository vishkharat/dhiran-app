import express from "express";
import { getDhiranLedger, downloadLedgerPDF } from "../controllers/ledgerController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dhiran/:id", verifyToken, getDhiranLedger);
router.get("/pdf/:id", verifyToken, downloadLedgerPDF);

export default router;