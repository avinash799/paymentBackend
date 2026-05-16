import mongoose from "mongoose";
import Payment from "../models/payment.model.js";
import {
  connectRabbitMQ,
  getChannel,
} from "../config/rabbitmq.js";
import { env } from "../config/env.js";


import  {processPayment}  from "../services/payment.service.js";

const startWorker = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    await connectRabbitMQ();

    const channel = getChannel();

    await channel.assertQueue("payment-processing", {
      durable: true,
    });

    console.log("🚀 Worker Started");

    channel.consume(
      "payment-processing",
      async (msg) => {
        if (!msg) return;

        try {
          const data = JSON.parse(msg.content.toString());

          await processPayment(data.paymentId); 

          channel.ack(msg);
        } catch (err) {
          console.log("Worker error:", err.message);

          channel.nack(msg, false, true);
        }
      },
      { noAck: false }
    );
  } catch (err) {
    console.log("Worker startup failed:", err.message);
  }
};

startWorker();