import { NextApiRequest, NextApiResponse } from "next";
import getRedisClient from "@/utils/redis";
import { FIXTURE_KEY_PREFIX } from "@/utils/api/getFixtureData";

export default async function LoadFixturesEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<
    FormGuideAPI.BaseAPIV2<number[]> | FormGuideAPI.Responses.ErrorResponse
  >
): Promise<void> {
  if (process.env.NODE_ENV !== "development") {
    res.json({
      errors: [
        {
          message: "Incorrect environment to access this endpoint",
        },
      ],
    });
    return;
  }

  const keys = await getRedisClient().scan(`${FIXTURE_KEY_PREFIX}*`);

  res.json({
    data: keys
      .map((k) => Number(String(k).match(/\d{6,7}/)?.[0]) ?? 0)
      .filter(Boolean),
    errors: [],
    meta: {},
  });
}
