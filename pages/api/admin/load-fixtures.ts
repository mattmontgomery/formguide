import { NextApiRequest, NextApiResponse } from "next";

const ENDPOINT = process.env.PREDICTIONS_API;

export default async function LoadFixturesEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<FormGuideAPI.BaseAPIV2<string[]>>
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
  const fixtures: string[] = Array.isArray(req.query.fixtureIds)
    ? req.query.fixtureIds
    : req.query.fixtureIds
    ? [...req.query.fixtureIds.split(",")]
    : [];

  const responses = [];

  for await (const fixture of fixtures) {
    const response = await fetch(`${ENDPOINT}?fixture=${fixture}`);
    responses.push(response);
  }

  const json = await Promise.all(
    responses
      .filter((r: Response) => typeof r.json === "function")
      .map((r: Response) => r.json())
  );
  res.json({
    data: json.map((match) => match.meta.fixture),
    meta: {
      fixtures,
    },
  });
}
