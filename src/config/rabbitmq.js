import amqp from "amqplib";

let connection;
let channel;

export const connectRabbitMQ = async () => {

  try {

    connection = await amqp.connect(
      process.env.RABBITMQ_URL
    );

    channel = await connection.createChannel();

    console.log(
      "RabbitMQ connected"
    );

  } catch (error) {

    console.log(
      "RabbitMQ connection error:",
      error.message
    );

    throw error;
  }
};

export const getChannel = () => {
  return channel;
};
