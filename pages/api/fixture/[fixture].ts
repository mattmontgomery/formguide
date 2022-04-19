import { NextApiRequest, NextApiResponse } from "next";

const ENDPOINT = process.env.PREDICTIONS_API;

export default async function form(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const fixture = +req.query.fixture;
  try {
    const response = await fetch(`${ENDPOINT}?fixture=${fixture}`);
    res.setHeader(
      `Cache-Control`,
      `s-maxage=${60 * 60}, stale-while-revalidate`
    );
    if (response.status !== 200) {
      throw `function response: ${response.statusText}`;
    }
    const responseJson = await response.json();
    if (responseJson.errors.length) {
      throw `function errors: ${JSON.stringify(responseJson.errors)}`;
    }
    res.json(responseJson);
  } catch (e) {
    console.error(e);
    res.status(500);
    res.json({
      data: null,
      errors: [String(e)],
    });
  }
}

// function getExpires(year: number) {
//   return year === thisYear ? 60 * 60 : 60 * 60 * 24 * 7 * 4;
// }
