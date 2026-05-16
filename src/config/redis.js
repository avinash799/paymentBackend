

import Redis from "ioredis";

const redis = new Redis(
  process.env.REDIS_URL,
  {
    retryStrategy: (times) => {
      return Math.min(
        times * 50,
        2000
      );
    },
  }
);

redis.on("connect", () => {
  console.log(
    "Redis Connected"
  );
});

redis.on("error", (err) => {
  console.log(
    "Redis Error:",
    err.message
  );
});

export default redis;