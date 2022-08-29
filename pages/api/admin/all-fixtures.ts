import { NextApiRequest, NextApiResponse } from "next";
import redisClient from "@/utils/redis";

export default async function LoadFixturesEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<FormGuideAPI.BaseAPIV2<number[]>>
): Promise<void> {
  if (process.env.NODE_ENV !== "development") {
    res.json({
      data: null,
      meta: null,
      errors: [
        {
          message: "Incorrect environment to access this endpoint",
        },
      ],
    });
    return;
  }

  const keys = await redisClient.keys("fixture-data:v1.0.10:*");

  res.json({
    data: keys.map((k) => Number(k.match(/\d{6,7}/)?.[0]) ?? 0).filter(Boolean),
    errors: [],
    meta: {},
  });
}
