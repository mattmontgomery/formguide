import { NextApiRequest, NextApiResponse } from "next";
import { getAllFixtures } from "@/utils/getAllFixtureIds";
import { parseISO } from "date-fns";
const FORM_API = process.env.FORM_API;

export type Possibility = {
  home: string;
  away: string;
  homePoints: 3 | 1 | 0;
  awayPoints: 3 | 1 | 0;
  date: Date;
};

export default async function LoadFixturesEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<FormGuideAPI.BaseAPIV2<unknown[]>>
): Promise<void> {
  const league = String(req.query.league ?? "mls");

  const response = await fetch(`${FORM_API}?year=2022&league=${league}`);

  const { data } = await response.json();

  const fixtureIds = getAllFixtures(
    data,
    (m) => m.status.long !== "Match Finished"
  );

  const possibilities: Possibility[][] = fixtureIds
    .map((m) => ({ ...m, home: m.home, away: m.away, date: parseISO(m.date) }))
    .map((m): Possibility[] => {
      return [
        {
          home: m.home,
          away: m.away,
          date: m.date,
          homePoints: 3,
          awayPoints: 0,
        },
        {
          home: m.home,
          away: m.away,
          date: m.date,
          homePoints: 1,
          awayPoints: 1,
        },
        {
          home: m.home,
          away: m.away,
          date: m.date,
          homePoints: 0,
          awayPoints: 3,
        },
      ];
    })
    .reduce((acc: Possibility[][], curr) => {
      return [...acc, curr];
    }, []);

  res.json({
    data: possibilities,
    errors: [],
    meta: {},
  });
}
