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

export type FetchCachedOrFreshReturnType<T> = {
  data: T | null;
  fromCache: boolean;
  compressed: boolean;
  error?: Error | string | null;
};
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
    const { data, empty, compressed } = await fetchFromCache<T>(
      redisKey,
      checkEmpty
    );

    if (exists && empty && !retryOnEmptyData) {
      return {
        data: null,
        compressed,
        fromCache: true,
      };
    } else if (exists && !empty) {
      return {
        data: data,
        compressed,
        fromCache: true,
      };
    }

    try {
      const data = await fetch();
      if (
        typeof checkEmpty === "function" &&
        checkEmpty(JSON.stringify(data))
      ) {
        throw `Data for ${redisKey} could not be found`; // error instead of setting data improperly
      }
      const { compressed } = await setInCache<T>({
        key: redisKey,
        data,
        expire,
        allowCompression,
      });
      return {
        data,
        compressed,
        fromCache: false,
      };
      // return [data, false, false];
    } catch (e) {
      console.error(e);
      return {
        data: null,
        compressed: false,
        fromCache: false,
        error: String(e),
      };
    }
  } catch (e) {
    console.error(e);
    return {
      data: null,
      compressed: false,
      fromCache: false,
      error: String(e),
    };
  }
}

export async function fetchFromCache<T>(
  key: string,
  checkEmpty: (arg0: string | null) => boolean = () => false
): Promise<{ data: T | null; empty: boolean; compressed: boolean }> {
  const data = await redisClient().get(key);
  if (!data || (data && checkEmpty(data))) {
    return { data: null, empty: true, compressed: false };
  }
  const parsed = JSON.parse(data) as {
    compressed: boolean;
    compressedData: string;
  };
  if (typeof parsed?.compressed !== "undefined") {
    const decompressed: string = !parsed.compressed
      ? parsed.compressedData
      : await decompressString(parsed.compressedData);
    return {
      data: JSON.parse(decompressed) as T,
      empty: false,
      compressed: true,
    };
  } else {
    return { data: JSON.parse(data) as T, empty: false, compressed: false };
  }
}

export async function setInCache<T>({
  key,
  data,
  expire,
  allowCompression = false,
}: {
  key: string;
  data: T;
  expire: number | ((data: T) => number);
  allowCompression: boolean;
}): Promise<{ compressed: boolean }> {
  const stringifiedData = JSON.stringify(data);
  const dataSize = Buffer.byteLength(stringifiedData, "utf8");
  const shouldCompress = allowCompression && dataSize > 300000;
  // 800 KB
  if (shouldCompress) {
    const compressed = await compressString(stringifiedData);
    await redisClient().set(
      key,
      JSON.stringify({ compressed: true, compressedData: compressed })
    );
  } else {
    await redisClient().set(key, stringifiedData);
  }
  const expireTime = typeof expire === "number" ? expire : expire(data);
  if (expireTime) {
    await redisClient().expire(key, expireTime);
  }
  return {
    compressed: shouldCompress,
  };
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
