import {
  processWebhook,
} from "../services/webhook.service.js";

export const handleWebhook =
  async (req, res) => {

    try {

      const response =
        await processWebhook(
          req.body
        );

      return res.status(200).json({

        success: true,

        message:
          response.message,

        payment:
          response.payment,
      });

    } catch (err) {

      console.log(
        "Webhook Error:",
        err.message
      );

      return res.status(500).json({

        success: false,

        message: err.message,
      });
    }
  };