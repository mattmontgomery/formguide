import Redis from "ioredis";

const redisClient = new Redis(process.env.REDIS_URL || "redis://localhost");

export async function fetchCachedOrFresh<T>(
  key: string,
  fetch: () => Promise<T>,
  expire: number | ((data: T) => number)
): Promise<T | null> {
  const REDIS_URL = process.env.REDIS_URL;
  const APP_VERSION = process.env.APP_VERSION || "v3.0.3";
  if (!REDIS_URL) {
    throw "Application is not properly configured";
  }

  // keys differentiate by year and league
  const redisKey = `${key}:${APP_VERSION}`;
  const exists = await redisClient.exists(redisKey);

  if (exists) {
    const data = await redisClient.get(redisKey);
    return data ? (JSON.parse(data) as T) : null;
  } else {
    const data = await fetch();
    await redisClient.set(redisKey, JSON.stringify(data));
    await redisClient.expire(
      redisKey,
      typeof expire === "number" ? expire : expire(data)
    );
    return data;
  }
}
