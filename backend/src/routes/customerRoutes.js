import express from "express";
import {
  addCustomer,
  getCustomers,
  searchCustomers
} from "../controllers/customerController.js";

import Customer from "../models/Customer.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();


// ================= ADD CUSTOMER =================
router.post("/", verifyToken, addCustomer);


// ================= GET ALL CUSTOMERS =================
router.get("/", verifyToken, getCustomers);


// ================= SEARCH CUSTOMER =================
router.get("/search", verifyToken, searchCustomers);


// ================= GET SINGLE CUSTOMER =================
router.get("/:id", verifyToken, async (req, res) => {

  try {

    const customer = await Customer.findById(req.params.id);

    res.json(customer);

  } catch (error) {

    console.error(error);

    res.status(500).json(error);

  }

});

export default router;