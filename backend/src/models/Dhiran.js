import mongoose from "mongoose";

const dhiranSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    purity: {
      type: String,
      required: true,
    },
     weight: {
      type: Number,
      required: true,
    },

    interestRate: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    remainingAmount: {
      type: Number,
      default: function () {
        return this.amount;
      },
    },

    totalInterest: {
      type: Number,
      default: 0,
    },

    // NEW FIELD
    status: {
      type: String,
      enum: ["ACTIVE", "CLOSED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Dhiran", dhiranSchema);