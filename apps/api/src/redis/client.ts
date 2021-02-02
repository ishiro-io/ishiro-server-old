import "@ishiro/libs/utils/env";

import Redis from "ioredis";

const { REDIS_URL } = process.env;

export const redisClient = new Redis(REDIS_URL);

redisClient.on("error", (error) => {
  console.error(error);
});
