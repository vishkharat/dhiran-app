import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    dhiran: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dhiran",
      required: true,
    },

    principalPaid: {
      type: Number,
      required: true,
      default: 0,
    },

    interestPaid: {
      type: Number,
      required: true,
      default: 0,
    },

    paymentDate: {
      type: Date,
      default: Date.now,
    },

    note: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Payment", paymentSchema);