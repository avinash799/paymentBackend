import amqp from "amqplib";

let channel;
let connection;

export const connectRabbitMQ = async () => {
  connection = await amqp.connect("amqp://localhost");

  channel = await connection.createChannel();

  await channel.assertQueue("payment-processing", {
    durable: true,
  });

  console.log("RabbitMQ Connected");
};

export const getChannel = () => {
  if (!channel) {
    throw new Error("RabbitMQ channel not initialized");
  }
  return channel;
};