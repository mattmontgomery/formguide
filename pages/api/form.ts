import getExpires from "@/utils/getExpires";
import { getCurrentYear, LeagueYearOffset } from "@/utils/Leagues";
import { NextApiRequest, NextApiResponse } from "next";

const FORM_API = process.env.FORM_API;

export default async function form(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const league = String(req.query.league) as Results.Leagues;
  const year = +String(req.query.year) || getCurrentYear(league);
  const yearOffset = LeagueYearOffset[league] ?? 0;
  const args = `year=${year + yearOffset}&league=${league || "mls"}`;
  if (!FORM_API) {
    console.error({ error: "Missing environment variables" });
    res.status(500);
    res.json({
      data: {},
      errors: ["Application not properly configured"],
    });
    return;
  }
  try {
    const response = await fetch(`${FORM_API}?${args}`);
    res.setHeader(
      `Cache-Control`,
      `s-maxage=${getExpires(year)}, stale-while-revalidate`,
    );
    if (response.status !== 200) {
      throw `function response: ${response.statusText}`;
    }
    const responseBody = await response.json();
    res.json({
      ...responseBody,
      meta: { ...(responseBody.meta || {}), year, league, args },
    });
  } catch (e) {
    console.error(JSON.stringify({ error: e }));
    res.status(500);
    res.json({
      data: {},
      errors: [String(e)],
    });
  }
}
