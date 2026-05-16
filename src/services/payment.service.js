import Payment from "../models/payment.model.js";
import redis from "../config/redis.js";
import { processGatewayPayment } from "./gateway.service.js";
import { handleRetry } from "./retry.service.js";

export const processPayment = async (paymentId) => {
  const Payment = (await import("../models/payment.model.js")).default;

  const lockKey = `lock:${paymentId}`;

  const lock = await redis.set(lockKey, "locked", "NX", "EX", 30);

  if (!lock) {
    console.log("Already processing:", paymentId);
    return;
  }

  try {
    const payment = await Payment.findById(paymentId);

    if (!payment) return;

    if (payment.status === "SUCCESS") return;

    payment.status = "PROCESSING";
    await payment.save();

    const result = await processGatewayPayment();

    if (result.success) {
      payment.status = "SUCCESS";
      payment.gatewayTransactionId = result.transactionId;
    } else {
      payment.status = "FAILED";
    }

    await payment.save();

    if (!result.success) {
      await handleRetry(paymentId);
    }

  } catch (err) {
    console.log("Payment error:", err.message);
    await handleRetry(paymentId);
  } finally {
    await redis.del(lockKey);
  }
};

export const processWebhook =
  async ({
    paymentId,
    status,
    transactionId,
    
  }) => {

    if (
      !paymentId ||
      !status
    ) {

      throw new Error(
        "paymentId and status required"
      );
    }

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

    // invalid transition protection
    if (
      payment.status ===
        "FAILED" &&
      status === "PROCESSING"
    ) {

      throw new Error(
        "Invalid status transition"
      );
    }

    payment.status = status;

    if (transactionId) {

      payment.gatewayTransactionId =
        transactionId;
    }

    await payment.save();

    return {

      message:
        "Webhook processed successfully",

      payment,
    };
  };

  export const updatePaymentStatus =
  async (id, status) => {

    const payment =
      await Payment.findById(id);

    if (!payment) {

      throw new Error(
        "Payment not found"
      );
    }

    payment.status = status;

    await payment.save();

    return payment;
  };

  export const getPayments =
  async () => {

    return await Payment.find()
      .sort({
        createdAt: -1,
      });
  };
  export const getPaymentById =
  async (id) => {

    return await Payment.findById(
      id
    );
  };
  export const retryPayment =
  async (id) => {

    const payment =
      await Payment.findById(id);

    if (!payment) {

      throw new Error(
        "Payment not found"
      );
    }

    payment.retryCount += 1;

    payment.status =
      "PENDING";

    await payment.save();

    return "Retry initiated";
  };
export const getPaymentLogs =
  async (id) => {

    const payment =
      await Payment.findById(id);

    if (!payment) {

      throw new Error(
        "Payment not found"
      );
    }

    return [

      {
        event:
          "PAYMENT_CREATED",

        status:
          payment.status,

        createdAt:
          payment.createdAt,
      },

      {
        event:
          "LAST_UPDATED",

        status:
          payment.status,

        updatedAt:
          payment.updatedAt,
      },
    ];
  };

export const processPaymentManually =
  async (id) => {

    await processPayment(id);

    return "Payment processing started";
  };

export const getMetrics =
  async () => {

    const totalPayments =
      await Payment.countDocuments();

    const successPayments =
      await Payment.countDocuments({
        status: "SUCCESS",
      });

    const failedPayments =
      await Payment.countDocuments({
        status: "FAILED",
      });

    const pendingPayments =
      await Payment.countDocuments({
        status: "PENDING",
      });

    return {

      totalPayments,

      successPayments,

      failedPayments,

      pendingPayments,
    };
  };