import mongoose from "mongoose";

const paymentSchema =
  new mongoose.Schema(
    {
      amount: {
        type: Number,
        required: true,
      },

      currency: {
        type: String,
        default: "INR",
      },

      status: {
        type: String,
        enum: [
          "PENDING",
          "PROCESSING",
          "SUCCESS",
          "FAILED",
        ],
        default: "PENDING",
      },

      retryCount: {
        type: Number,
        default: 0,
      },

      gatewayTransactionId: {
        type: String,
      },

      idempotencyKey: {
        type: String,
        unique: true,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

const Payments = mongoose.model(
  "Payments",
  paymentSchema
);

export default Payments;