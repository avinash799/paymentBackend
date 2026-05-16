import Payment from
  "../models/payment.model.js";

import {
  publishPaymentJob,
} from "../queues/payment.publisher.js";

const MAX_RETRIES = 3;

export const handleRetry =
  async (paymentId) => {

    const payment =
      await Payment.findById(
        paymentId
      );

    if (!payment) {

      console.log(
        "Payment not found"
      );

      return;
    }

    if (
      payment.status ===
      "SUCCESS"
    ) {

      return;
    }

    if (
      payment.retryCount >=
      MAX_RETRIES
    ) {

      payment.status =
        "FAILED";

      await payment.save();

      return;
    }

    payment.retryCount += 1;

    await payment.save();

    const delay =
      2000 *
      Math.pow(
        2,
        payment.retryCount
      );

    setTimeout(
      async () => {

        await publishPaymentJob(
          paymentId
        );

      },
      delay
    );
  };