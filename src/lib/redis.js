const { Redis } = require("@upstash/redis");

let client = null;

const getRedis = () => {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    throw new Error("UPSTASH_REDIS_REST_URL ose UPSTASH_REDIS_REST_TOKEN mungon në .env");
  }
  if (!client) {
    client = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return client;
};

module.exports = getRedis;
