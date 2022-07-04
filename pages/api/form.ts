import { NextApiRequest, NextApiResponse } from "next";

const FORM_API = process.env.FORM_API;

const thisYear = new Date().getFullYear();

export default async function form(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const year = +String(req.query.year) || 2022;
  try {
    const response = await fetch(
      `${FORM_API}?year=${year}&league=${
        (req.query.league as Results.Leagues) || "mls"
      }`
    );
    res.setHeader(
      `Cache-Control`,
      `s-maxage=${getExpires(year)}, stale-while-revalidate`
    );
    if (response.status !== 200) {
      throw `function response: ${response.statusText}`;
    }
    res.json(await response.json());
  } catch (e) {
    res.status(500);
    res.json({
      data: {},
      errors: [String(e)],
    });
  }
}

function getExpires(year: number) {
  return year === thisYear ? 60 * 60 : 60 * 60 * 24 * 7 * 4;
}
