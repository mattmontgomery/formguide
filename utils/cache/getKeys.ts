import redisClient from "@/utils/redis";

export default async function getKeys(pattern: string): Promise<string[]> {
  const keys: string[] = [];
  return new Promise((resolve) => {
    const stream = redisClient().scanStream({
      match: `${pattern}*`,
      count: 1000,
    });
    stream.on("data", function (resultKeys) {
      keys.push(...resultKeys);
    });
    stream.on("end", function () {
      resolve(keys);
    });
  });
}
