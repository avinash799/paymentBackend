import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { app } from "./app.js";
import connectDb from "./db/index.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await connectDb();
    console.log("DB connected");

    await connectRabbitMQ();
    console.log("RabbitMQ connected");

    app.get("/", (req, res) => {
      res.send("Server is ready 🚀");
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (err) {
    console.log("Startup failed:", err);
    process.exit(1);
  }
};

startServer();