import express from "express";

import cors from "cors";

import cookieParser from "cookie-parser";

import paymentRouter
  from "./routes/payment.route.js";

import webhookRouter
from "./routes/webhook.route.js";
import redis from "./config/redis.js";
import { swaggerSpec ,swaggerUi } from "./config/swagger.js";


const testRedisConnection = async () => {
  try {
    await redis.set("test", "hello");
    const value = await redis.get("test");

    console.log("Redis test value:", value);
  } catch (err) {
    console.log("Redis connection failed:", err.message);
  }
};


const app = express();

app.use(cors({

  origin:
    process.env.CORS_ORIGIN,

  credentials: true,
}));

app.use(express.json({

  limit: "16kb",
}));

app.use(express.urlencoded({

  extended: true,
}));

app.use(cookieParser());

console.log("app.js loaded");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(
  "/api",
  paymentRouter
);

app.use(
  "/webhooks",
  webhookRouter
);

app.get("/", (req, res) => {

  res.send(
    "Server is ready 🚀"
  );
});

export { app };