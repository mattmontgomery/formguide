import redisClient from "./redis";
import { createHash } from "crypto";
import { gzip, gunzip } from "zlib";

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
  const exists = await redisClient().exists(redisKey);

  if (exists) {
    const data = await redisClient().get(redisKey);
    return data ? (JSON.parse(data) as T) : null;
  } else {
    try {
      const data = await fetch();
      await redisClient().set(redisKey, JSON.stringify(data));
      if (expire !== 0) {
        await redisClient().expire(
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

export type FetchCachedOrFreshReturnType<T> = [
  T | null,
  boolean,
  boolean,
  (Error | string | unknown | null | undefined)?
];
export async function fetchCachedOrFreshV2<T>(
  key: string,
  fetch: () => Promise<T>,
  expire: number | ((data: T) => number),
  {
    checkEmpty,
    retryOnEmptyData = true,
    allowCompression = true,
  }: {
    checkEmpty?: (arg0: string | null) => boolean;
    retryOnEmptyData?: boolean;
    allowCompression?: boolean;
  } = {}
): Promise<FetchCachedOrFreshReturnType<T>> {
  try {
    const REDIS_URL = process.env.REDIS_URL;
    const APP_VERSION = process.env.APP_VERSION || "v3.0.3";
    if (!REDIS_URL) {
      throw "Application is not properly configured";
    }

    // keys differentiate by year and league
    const redisKey = `${key}:${APP_VERSION}`;
    const exists = await redisClient().exists(redisKey);
    const data = await redisClient().get(redisKey);

    const isEmpty = typeof checkEmpty === "function" ? checkEmpty(data) : !data;

    if (exists && (!isEmpty || !retryOnEmptyData)) {
      if (!data) {
        return [null, true, false];
      } else {
        const parsed = JSON.parse(data) as {
          compressed: boolean;
          compressedData: string;
        };
        if (typeof parsed?.compressed !== "undefined") {
          const decompressed: T = !parsed.compressed
            ? parsed.compressedData
            : JSON.parse(await decompressString(parsed.compressedData));
          return [data ? decompressed : null, true, true];
        } else {
          return [data ? (parsed as unknown as T) : null, true, false];
        }
      }
    }
    try {
      const data = await fetch();
      if (
        typeof checkEmpty === "function" &&
        checkEmpty(JSON.stringify(data))
      ) {
        throw `Data for ${redisKey} could not be found`; // error instead of setting data improperly
      }
      const stringifiedData = JSON.stringify(data);
      const dataSize = Buffer.byteLength(stringifiedData, "utf8");
      // 800 KB
      if (allowCompression && dataSize > 300000) {
        const compressed = await compressString(stringifiedData);
        await redisClient().set(
          redisKey,
          JSON.stringify({ compressed: true, compressedData: compressed })
        );
      } else {
        await redisClient().set(redisKey, stringifiedData);
      }
      const expireTime = typeof expire === "number" ? expire : expire(data);
      if (expireTime) {
        await redisClient().expire(redisKey, expireTime);
      }
      return [data, false, false];
    } catch (e) {
      console.error(e);
      return [null, false, false, e];
    }
  } catch (e) {
    console.error(e);
    return [null, false, false, e];
  }
}

export function getHash(data: unknown): string {
  const hash = createHash("md5");
  return hash.update(JSON.stringify(data)).digest("hex");
}

export function getKey(key: string): string {
  const APP_VERSION = process.env.APP_VERSION || "v3.0.3";
  return `${key}:${APP_VERSION}`;
}

export async function compressString(data: string): Promise<string> {
  return new Promise((resolve, reject) => {
    gzip(Buffer.from(data), (err, compressed) => {
      if (err) {
        reject(err);
      } else {
        resolve(compressed.toString("hex"));
      }
    });
  });
}
export async function decompressString(compressed: string): Promise<string> {
  return new Promise((resolve, reject) => {
    gunzip(Buffer.from(compressed, "hex"), (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.toString());
      }
    });
  });
}

export function getStringSize(data: string): number {
  return Buffer.byteLength(data, "utf8");
}
