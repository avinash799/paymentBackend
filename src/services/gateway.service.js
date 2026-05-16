
const sleep = (ms) => {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
};

export const processGatewayPayment =
  async () => {

    const random = Math.random();

    await sleep(2000);

    if (random < 0.6) {

      return {
        success: true,
        transactionId:
          "TXN_" + Date.now(),
      };
    }

    if (random < 0.8) {
      throw new Error(
        "Gateway timeout"
      );
    }

    return {
      success: false,
    };
  };