import Customer from "../models/Customer.js";

// ================= ADD CUSTOMER =================
export const addCustomer = async (req, res) => {
  try {
    const { name, mobile, address } = req.body;

    if (!name || !mobile) {
      return res.status(400).json({
        message: "Name and mobile are required",
      });
    }

    const customer = await Customer.create({
      name,
      mobile,
      address,
    });

    res.status(201).json(customer);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// ================= GET ALL CUSTOMERS =================
export const getCustomers = async (req, res) => {
  try {

    const customers = await Customer.find()
      .sort({ createdAt: -1 });

    res.json(customers);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// ================= SEARCH CUSTOMER =================
export const searchCustomers = async (req, res) => {

  try {

    const query = req.query.q;

    if (!query) {

      const recentCustomers = await Customer.find()
        .sort({ createdAt: -1 })
        .limit(5);

      return res.json(recentCustomers);

    }

    const customers = await Customer.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { mobile: { $regex: query, $options: "i" } },
      ],
    }).limit(10);

    res.json(customers);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};