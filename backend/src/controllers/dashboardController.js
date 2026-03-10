import Customer from "../models/Customer.js";
import Dhiran from "../models/Dhiran.js";
import Payment from "../models/Payment.js";

export const getDashboardData = async (req, res) => {
  try {

    const totalCustomers = await Customer.countDocuments();

    const dhirans = await Dhiran.find();
    const payments = await Payment.find();

    // TOTAL DHIRAN AMOUNT
    let totalLoanAmount = 0;

    dhirans.forEach((d) => {
      totalLoanAmount += Number(d.amount) || 0;
    });


    // TOTAL PRINCIPAL PAID
    let totalPrincipalPaid = 0;

    payments.forEach((p) => {
      totalPrincipalPaid += Number(p.principalPaid) || 0;
    });


    // TOTAL INTEREST EARNED
    let totalInterestEarned = 0;

    payments.forEach((p) => {
      totalInterestEarned += Number(p.interestPaid) || 0;
    });


    // TOTAL PAID
    const totalPaid = totalPrincipalPaid + totalInterestEarned;


    // TOTAL REMAINING
    const totalRemaining = totalLoanAmount - totalPrincipalPaid;


    res.json({
      totalCustomers,
      totalLoanAmount,
      totalPrincipalPaid,
      totalInterestEarned,
      totalPaid,
      totalRemaining,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message
    });

  }
};