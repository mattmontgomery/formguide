import Redis from "ioredis";

export function getClient() {
  const self = globalThis as unknown as { __redisClient: Redis };
  if (!self.__redisClient) {
    self.__redisClient = new Redis(
      process.env.REDIS_URL || "redis://localhost"
    );
  }
  return self.__redisClient;
}

export default getClient;
