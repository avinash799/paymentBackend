import { getChannel } from "../config/rabbitmq.js";

export const publishPaymentJob = async (paymentId) => {
  const channel = getChannel();

console.log("CHANNEL CHECK:", !!channel);

  if (!channel) {
    throw new Error("RabbitMQ channel not ready");
  }

  channel.sendToQueue(
    "payment-processing",
    Buffer.from(JSON.stringify({ paymentId })),
    {
      persistent: true,
    }
  );

  console.log("Payment job published:", paymentId);
};