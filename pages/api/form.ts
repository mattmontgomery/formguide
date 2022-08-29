import getExpires from "@/utils/getExpires";
import { NextApiRequest, NextApiResponse } from "next";

const FORM_API = process.env.FORM_API;

export default async function form(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const year = +String(req.query.year) || 2022;
  const league = String(req.query.league) as Results.Leagues;
  try {
    const response = await fetch(
      `${FORM_API}?year=${year}&league=${league || "mls"}`
    );
    res.setHeader(
      `Cache-Control`,
      `s-maxage=${getExpires(year)}, stale-while-revalidate`
    );
    if (response.status !== 200) {
      throw `function response: ${response.statusText}`;
    }
    const responseBody = await response.json();
    res.json({
      ...responseBody,
      meta: { ...(responseBody.meta || {}), year, league },
    });
  } catch (e) {
    res.status(500);
    res.json({
      data: {},
      errors: [String(e)],
    });
  }
}
