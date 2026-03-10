import express from "express";
import { getDhiranLedger,downloadLedgerPDF } from "../controllers/ledgerController.js";

const router = express.Router();

router.get("/dhiran/:id", getDhiranLedger);
router.get("/pdf/:id", downloadLedgerPDF);

export default router;