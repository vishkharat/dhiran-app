import Dhiran from "../models/Dhiran.js";

const calculateInterest = (amount, rate, createdDate) => {

  const now = new Date();

  const months =
    (now.getFullYear() - createdDate.getFullYear()) * 12 +
    (now.getMonth() - createdDate.getMonth());

  const monthlyInterest = (amount * rate) / 100;

  return monthlyInterest * months;

};

// GET DHIRAN BY CUSTOMER

export const getDhiranByCustomer = async (req, res) => {

  try {

    const dhiranList = await Dhiran.find({
      customer: req.params.id
    }).sort({ createdAt: -1 });

    const updated = dhiranList.map((d) => {

      const interest = calculateInterest(
        d.remainingAmount,
        d.interestRate,
        d.createdAt
      );

      const total = d.remainingAmount + interest;

      return {
        ...d._doc,
        runningInterest: Math.round(interest),
        totalAmount: Math.round(total)
      };

    });

    res.json(updated);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// CLOSE DHIRAN

export const closeDhiran = async (req, res) => {

  try {

    const dhiran = await Dhiran.findById(req.params.id);

    if (!dhiran) {
      return res.status(404).json({ message: "Dhiran not found" });
    }

    if (dhiran.remainingAmount > 0) {
      return res.status(400).json({
        message: "Cannot close. Principal still remaining."
      });
    }

    dhiran.status = "CLOSED";

    await dhiran.save();

    res.json({
      message: "Dhiran closed successfully"
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};