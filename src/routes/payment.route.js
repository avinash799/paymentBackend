import express from "express";

import {
  createPayment,
  getPayments,
  getPaymentById,
  retryPayment,
  updatePaymentStatus,
  getPaymentLogs,
  getMetrics,
  processPaymentManually,
  healthCheck
} from "../controllers/payment.controller.js";

const router = express.Router();

/**
 * @openapi
 * /api/payments:
 *   post:
 *     summary: Create a new payment
 *     description: Creates a payment and sends it for processing
 *     tags:
 *       - Payments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 1000
 *               currency:
 *                 type: string
 *                 example: INR
 *     responses:
 *       201:
 *         description: Payment created successfully
 *       500:
 *         description: Server error
 */
router.post("/payments", createPayment);

/**
 * @openapi
 * /api/payments:
 *   get:
 *     summary: Get all payments
 *     tags:
 *       - Payments
 *     responses:
 *       200:
 *         description: List of payments
 */
router.get("/payments", getPayments);

/**
 * @openapi
 * /api/payments/{id}:
 *   get:
 *     summary: Get payment by ID
 *     tags:
 *       - Payments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment found
 *       404:
 *         description: Payment not found
 */
router.get("/payments/:id", getPaymentById);

/**
 * @openapi
 * /api/payments/{id}/retry:
 *   post:
 *     summary: Retry failed payment
 *     tags:
 *       - Payments
 */
router.post("/payments/:id/retry", retryPayment);

/**
 * @openapi
 * /api/payments/{id}/status:
 *   patch:
 *     summary: Update payment status
 *     tags:
 *       - Payments
 */
router.patch("/payments/:id/status", updatePaymentStatus);

/**
 * @openapi
 * /api/payments/{id}/logs:
 *   get:
 *     summary: Get payment logs
 *     tags:
 *       - Payments
 */
router.get("/payments/:id/logs", getPaymentLogs);

/**
 * @openapi
 * /api/payments/{id}/process:
 *   post:
 *     summary: Manually process payment
 *     tags:
 *       - Payments
 */
router.post("/payments/:id/process", processPaymentManually);

/**
 * @openapi
 * /api/metrics:
 *   get:
 *     summary: Get system metrics
 *     tags:
 *       - System
 */
router.get("/metrics", getMetrics);

/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     tags:
 *       - System
 */
router.get("/health", healthCheck);

export default router;