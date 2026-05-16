// src/services/webhook.service.js

import Payment from "../models/payment.model.js";

export const processWebhook =
  async ({
    paymentId,
    status,
    transactionId,
  }) => {

    // validation
    if (
      !paymentId ||
      !status
    ) {

      throw new Error(
        "paymentId and status required"
      );
    }

    // find payment
    const payment =
      await Payment.findById(
        paymentId
      );

    if (!payment) {

      throw new Error(
        "Payment not found"
      );
    }

    console.log(
      "Webhook received:",
      paymentId,
      status
    );

    // duplicate webhook protection
    if (
      payment.status ===
        "SUCCESS" &&
      status === "SUCCESS"
    ) {

      return {

        message:
          "Duplicate webhook ignored",

        payment,
      };
    }

    // invalid state protection
    if (
      payment.status ===
        "FAILED" &&
      status === "PROCESSING"
    ) {

      throw new Error(
        "Invalid status transition"
      );
    }

    // update payment
    payment.status = status;

    if (transactionId) {

      payment.gatewayTransactionId =
        transactionId;
    }

    await payment.save();

    console.log(
      "Payment updated:",
      payment._id,
      payment.status
    );

    return {

      message:
        "Webhook processed successfully",

      payment,
    };
  };