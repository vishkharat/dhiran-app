import Payment from "../models/Payment.js";
import Dhiran from "../models/Dhiran.js";

const calculateInterest = (amount, rate, fromDate, toDate) => {

  const start = new Date(fromDate);
  const end = new Date(toDate);

  const diffTime = end - start;

  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (days <= 0) return 0;

  const monthlyInterest = (amount * rate) / 100;

  const dailyInterest = monthlyInterest / 30;

  return Math.round(days * dailyInterest);

};

// ADD PAYMENT

export const addPayment = async (req, res) => {

  try {

    const { dhiranId, principalPaid, paymentDate } = req.body;

    const payDate = paymentDate ? new Date(paymentDate) : new Date();

    const dhiran = await Dhiran.findById(dhiranId);

    if (!dhiran) {
      return res.status(404).json({ message: "Dhiran not found" });
    }

    // BLOCK IF CLOSED

    if (dhiran.status === "CLOSED") {
      return res.status(400).json({
        message: "This dhiran is already closed"
      });
    }

    const lastPayment = await Payment.findOne({
      dhiran: dhiranId
    }).sort({ paymentDate: -1 });

    const interestFromDate = lastPayment
      ? lastPayment.paymentDate
      : dhiran.startDate;

    const interest = calculateInterest(
      dhiran.remainingAmount,
      dhiran.interestRate,
      interestFromDate,
      payDate
    );

    let interestPaid = 0;
    let principalAmount = 0;

    if (principalPaid < interest) {

      interestPaid = principalPaid;
      principalAmount = 0;

    } else {

      interestPaid = interest;
      principalAmount = principalPaid - interest;

    }

    dhiran.remainingAmount -= principalAmount;

    dhiran.totalInterest += interestPaid;

    // AUTO CLOSE IF FULL PAID

    if (dhiran.remainingAmount <= 0) {
      dhiran.remainingAmount = 0;
      dhiran.status = "CLOSED";
    }

    await dhiran.save();

    const remainingPrincipal = dhiran.remainingAmount;

    const remainingInterest = interest - interestPaid;

    const totalPaid = principalPaid;

    const formattedDate = payDate.toLocaleDateString("en-GB");

    const note = `
${formattedDate}

આ દિવસે તમે ₹${totalPaid} ચુકવ્યા.

તેમાંથી ₹${interestPaid} વ્યાજમાં કપાયા.
₹${principalAmount} મૂડીમાં જમા થયા.

હજુ ચૂકવવાનું બાકી:
વ્યાજ: ₹${remainingInterest}
મૂડી: ₹${remainingPrincipal}
`;

    const payment = new Payment({
      dhiran: dhiranId,
      principalPaid: principalAmount,
      interestPaid: interestPaid,
      paymentDate: payDate,
      note: note
    });

    await payment.save();

    res.json(payment);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


// GET PAYMENTS

export const getPaymentsByDhiran = async (req, res) => {

  try {

    const payments = await Payment.find({
      dhiran: req.params.id
    }).sort({ paymentDate: 1 });

    res.json(payments);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


// TOTAL PAID

export const getTotalPaid = async (req, res) => {

  try {

    const payments = await Payment.find({
      dhiran: req.params.dhiranId
    });

    let totalPrincipal = 0;

    payments.forEach(p => {
      totalPrincipal += p.principalPaid;
    });

    res.json({
      totalPrincipal
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};