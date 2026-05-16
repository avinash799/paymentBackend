// src/webhooks/webhook.route.js

import express from "express";

import {
  handleWebhook,
} from "../controllers/webhook.controller.js";

const router = express.Router();

router.post(
  "/payment",
  handleWebhook
);

export default router;