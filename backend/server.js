import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import customerRoutes from "./src/routes/customerRoutes.js";
import dhiranRoutes from "./src/routes/dhiranRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import ledgerRoutes from "./src/routes/ledgerRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import reportsRoutes from "./src/routes/reportsRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import cors from "cors";
dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(cors());



// DB connect
connectDB();


app.use("/api/customers", customerRoutes);
app.use("/api/dhiran", dhiranRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/ledger", ledgerRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/auth", authRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});