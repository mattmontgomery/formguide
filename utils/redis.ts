import Redis from "ioredis";

let redisClient: Redis;

export function getClient() {
  if (!redisClient) {
    redisClient = new Redis(process.env.REDIS_URL || "redis://localhost");
  }
  return redisClient;
}

export default getClient;
export { redisClient };
