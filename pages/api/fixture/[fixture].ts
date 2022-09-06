import getFixtureData from "@/utils/api/getFixtureData";
import { NextApiRequest, NextApiResponse } from "next";

export default async function form(
  req: NextApiRequest,
  res: NextApiResponse<
    | FormGuideAPI.Responses.FixtureEndpoint
    | FormGuideAPI.Responses.ErrorResponse
  >
): Promise<void> {
  const fixture = +String(req.query.fixture);
  const [data, preparedFromCache, error] = await getFixtureData(fixture);
  if (error) {
    res.status(500);
    res.json({
      errors: [{ message: String(error) }],
    });
  }
  if (data) {
    res.setHeader(
      `Cache-Control`,
      `s-maxage=${60 * 60}, stale-while-revalidate`
    );
    res.json({
      data,
      meta: { preparedFromCache },
    });
  }
}
