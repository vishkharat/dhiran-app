import express from "express";
import Dhiran from "../models/Dhiran.js";
import Payment from "../models/Payment.js";
import { closeDhiran } from "../controllers/dhiranController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

const calculateInterest = (amount, rate, fromDate, toDate) => {

  const start = new Date(fromDate);
  const end = new Date(toDate);

  const diffTime = end - start;

  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const monthlyInterest = (amount * rate) / 100;

  const dailyInterest = monthlyInterest / 30;

  return Math.round(days * dailyInterest);

};


// ADD DHIRAN

router.post("/", verifyToken, async (req, res) => {

  try {

    const {
      customer,
      amount,
      purity,
      weight,
      interestRate,
      description,
      startDate
    } = req.body;

    const dhiran = new Dhiran({
      customer,
      amount,
      purity,
      weight,
      interestRate,
      description,
      startDate
    });

    const saved = await dhiran.save();

    res.status(201).json(saved);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// GET DHIRAN

router.get("/:customerId", verifyToken, async (req, res) => {

  try {

    const dhirans = await Dhiran.find({
      customer: req.params.customerId
    }).sort({ startDate: -1 });

    const result = [];

    for (let d of dhirans) {

      const lastPayment = await Payment.findOne({
        dhiran: d._id
      }).sort({ paymentDate: -1 });

      const fromDate = lastPayment
        ? lastPayment.paymentDate
        : d.startDate;

      const today = new Date();

      const liveInterest = calculateInterest(
        d.remainingAmount,
        d.interestRate,
        fromDate,
        today
      );

      result.push({
        ...d.toObject(),
        liveInterest
      });

    }

    res.json(result);

  } catch (error) {

    res.status(500).json(error);

  }

});


// CLOSE DHIRAN

router.put("/close/:id", verifyToken, closeDhiran);

export default router;