
import Payment from "../models/payment.model.js";
import * as paymentService from "../services/payment.service.js";
import { publishPaymentJob } from "../queues/payment.publisher.js";
import redis from "../config/redis.js";


const IDEMPOTENCY_TTL = 3600; 
const LOCK_TTL = 10; 

export const createPayment = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const idempotencyKey = req.headers["idempotency-key"];

    if (!idempotencyKey) {
      return res.status(400).json({
        success: false,
        message: "Idempotency key required",
      });
    }

  
    const lockKey = `lock:${idempotencyKey}`;

    const lock = await redis.set(lockKey, "1", "NX", "EX", LOCK_TTL);

    if (!lock) {
      const cached = await redis.get(idempotencyKey);

      return res.status(200).json({
        success: true,
        message: "Duplicate request (lock)",
        payment: cached ? JSON.parse(cached) : null,
      });
    }

    const cachedPayment = await redis.get(idempotencyKey);

    if (cachedPayment) {
      return res.status(200).json({
        success: true,
        message: "Duplicate request (Redis)",
        payment: JSON.parse(cachedPayment),
      });
    }

    const payment = await Payment.create({
      amount,
      currency,
      idempotencyKey,
      status: "PENDING",
    });

  
    await redis.set(
      idempotencyKey,
      JSON.stringify(payment),
      "EX",
      IDEMPOTENCY_TTL
    );


    await publishPaymentJob(payment._id.toString());

    return res.status(201).json({
      success: true,
      payment,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getPayments = async (req, res) => {
  try {
    const payments = await paymentService.getPayments();

    return res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const getPaymentById = async (req, res) => {
  try {
    const payment = await paymentService.getPaymentById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    return res.status(200).json({
      success: true,
      payment,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const processPaymentManually = async (req, res) => {
  try {
    const result = await paymentService.processPaymentManually(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const retryPayment = async (req, res) => {
  try {
    const result = await paymentService.retryPayment(req.params.id);

    return res.status(200).json({
      success: true,
      message: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const updatePaymentStatus = async (req, res) => {
  try {
    const payment = await paymentService.updatePaymentStatus(
      req.params.id,
      req.body.status
    );


    if (payment?.idempotencyKey) {
      await redis.del(payment.idempotencyKey);
    }

    return res.status(200).json({
      success: true,
      payment,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getPaymentLogs = async (req, res) => {
  try {
    const logs = await paymentService.getPaymentLogs(req.params.id);

    return res.status(200).json({
      success: true,
      logs,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const getMetrics = async (req, res) => {
  try {
    const metrics = await paymentService.getMetrics();

    return res.status(200).json({
      success: true,
      metrics,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const healthCheck = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server healthy",
  });
};