import Payment from
  "../models/payment.model.js";

import redis from
  "../config/redis.js";

// import {
//   processGatewayPayment,
// } from "./gateway.service.js";
import { processGatewayPayment } from "./gateway.service.js";

import {
  handleRetry,
} from "./retry.service.js";

export const processPayment =
  async (paymentId) => {

    const lockKey =
      `lock:${paymentId}`;

    const lock =
      await redis.set(
        lockKey,
        "locked",
        "NX",
        "EX",
        30
      );

    if (!lock) {

      console.log(
        "Already processing"
      );

      return;
    }

    try {

      const payment =
        await Payment.findById(
          paymentId
        );

      if (!payment) {
        return;
      }

      if (
        payment.status ===
        "SUCCESS"
      ) {
        return;
      }

      payment.status =
        "PROCESSING";

      await payment.save();

      const result =
        await processGatewayPayment();

      if (result.success) {

        payment.status =
          "SUCCESS";

        payment.gatewayTransactionId =
          result.transactionId;

      } else {

        payment.status =
          "FAILED";
      }

      await payment.save();

    } catch (err) {

      console.log(err.message);

      await handleRetry(
        paymentId
      );

    } finally {

      await redis.del(lockKey);
    }
  };