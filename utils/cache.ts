import redisClient from "./redis";

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
    try {
      const data = await fetch();
      await redisClient.set(redisKey, JSON.stringify(data));
      if (expire !== 0) {
        await redisClient.expire(
          redisKey,
          typeof expire === "number" ? expire : expire(data)
        );
      }
      return data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

export type FetchCachedOrFreshReturnType<T> =
  | [T | null, boolean]
  | [null, boolean, Error | string | unknown];
export async function fetchCachedOrFreshV2<T>(
  key: string,
  fetch: () => Promise<T>,
  expire: number | ((data: T) => number),
  retryOnEmptyData = true
): Promise<FetchCachedOrFreshReturnType<T>> {
  try {
    const REDIS_URL = process.env.REDIS_URL;
    const APP_VERSION = process.env.APP_VERSION || "v3.0.3";
    if (!REDIS_URL) {
      throw "Application is not properly configured";
    }

    // keys differentiate by year and league
    const redisKey = `${key}:${APP_VERSION}`;
    const exists = await redisClient.exists(redisKey);
    const data = await redisClient.get(redisKey);

    if (exists && (data || !retryOnEmptyData)) {
      return [data ? (JSON.parse(data) as T) : null, true];
    } else {
      try {
        const data = await fetch();
        await redisClient.set(redisKey, JSON.stringify(data));
        if (expire !== 0) {
          await redisClient.expire(
            redisKey,
            typeof expire === "number" ? expire : expire(data)
          );
        }
        return [data, false];
      } catch (e) {
        console.error(e);
        throw e;
      }
    }
  } catch (e) {
    return [null, false, e];
  }
}

/**
 * Unsupported until upstash supports Redis 7
 * @param key
 * @param fetch
 * @param expire
 * @param grace
 * @returns
 */
export async function fetchCachedOrFreshGraceful<T>(
  key: string,
  fetch: () => Promise<T>,
  expire: number | ((data: T) => number),
  grace: number = 60 * 15 // 15-minute grace period
): Promise<[T | null, boolean]> {
  const REDIS_URL = process.env.REDIS_URL;
  const APP_VERSION = process.env.APP_VERSION || "v3.0.3";
  if (!REDIS_URL) {
    throw "Application is not properly configured";
  }

  // keys differentiate by year and league
  const redisKey = `${key}:${APP_VERSION}`;
  const exists = await redisClient.exists(redisKey);

  const expireTime = (await redisClient.expiretime(redisKey)) - grace;
  const data = await redisClient.get(redisKey);

  if (exists && data && expireTime > 0) {
    return [data ? (JSON.parse(data) as T) : null, true];
  } else {
    try {
      if (exists) {
        fetch().then(async (data) => {
          redisClient.set(redisKey, JSON.stringify(data));
          if (expire !== 0) {
            await redisClient.expireat(
              redisKey,
              Number(new Date()) +
                (typeof expire === "number" ? expire : expire(data)) +
                grace
            );
          }
        });
        return [data ? (JSON.parse(data) as T) : null, true];
      } else {
        const data = await fetch();
        await redisClient.set(redisKey, JSON.stringify(data));
        if (expire !== 0) {
          await redisClient.expireat(
            redisKey,
            Number(new Date()) +
              (typeof expire === "number" ? expire : expire(data)) +
              grace
          );
        }
        return [data, false];
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
