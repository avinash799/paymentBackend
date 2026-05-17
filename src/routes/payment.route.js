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
 *     description: Creates a payment and sends it for processing. Requires idempotency key to avoid duplicate payments.
 *     tags:
 *       - Payments
 *     parameters:
 *       - in: header
 *         name: idempotency-key
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique key to ensure idempotent request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - currency
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
 *       400:
 *         description: Missing required fields or idempotency key
 *       409:
 *         description: Duplicate payment request
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
 *         description: Payments fetched successfully
 *       500:
 *         description: Server error
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
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment found
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error
 */
router.get("/payments/:id", getPaymentById);

/**
 * @openapi
 * /api/payments/{id}/retry:
 *   post:
 *     summary: Retry failed payment
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
 *         description: Payment retry initiated
 *       400:
 *         description: Payment not eligible for retry
 *       404:
 *         description: Payment not found
 */
router.post("/payments/:id/retry", retryPayment);

/**
 * @openapi
 * /api/payments/{id}/status:
 *   patch:
 *     summary: Update payment status
 *     tags:
 *       - Payments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: SUCCESS
 *     responses:
 *       200:
 *         description: Payment status updated
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Payment not found
 */
router.patch("/payments/:id/status", updatePaymentStatus);

/**
 * @openapi
 * /api/payments/{id}/logs:
 *   get:
 *     summary: Get payment logs
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
 *         description: Logs fetched successfully
 *       404:
 *         description: Payment not found
 */
router.get("/payments/:id/logs", getPaymentLogs);

/**
 * @openapi
 * /api/payments/{id}/process:
 *   post:
 *     summary: Manually process payment
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
 *         description: Payment processing started
 *       404:
 *         description: Payment not found
 */
router.post("/payments/:id/process", processPaymentManually);

/**
 * @openapi
 * /api/metrics:
 *   get:
 *     summary: Get system metrics
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: Metrics fetched successfully
 */
router.get("/metrics", getMetrics);

/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: Service is healthy
 */
router.get("/health", healthCheck);

export default router;
