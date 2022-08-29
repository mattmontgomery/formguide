import Redis from "ioredis";

const redisClient = new Redis(process.env.REDIS_URL || "redis://localhost");

export default redisClient;
