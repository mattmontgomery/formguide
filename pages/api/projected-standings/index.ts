import { NextApiRequest, NextApiResponse } from "next";
import { getAllFixtures, MatchWithTeams } from "@/utils/getAllFixtureIds";
import { getRow, getTeamRank, Row } from "@/utils/table";
import { fetchCachedOrFreshV2, getHash } from "@/utils/cache";
import { LeagueProbabilities, LeagueYearOffset } from "@/utils/Leagues";
import { ConferencesByYear } from "@/utils/LeagueConferences";
const FORM_API = process.env.FORM_API;

export type Possibility = {
  fixtureId: number;
  home: string;
  away: string;
  homePoints: number | 3 | 1 | 0;
  awayPoints: number | 3 | 1 | 0;
  homeResult: Results.ResultTypes;
  awayResult: Results.ResultTypes;
};

export default async function LoadFixturesEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<
    | FormGuideAPI.Responses.SimulationsEndpoint
    | FormGuideAPI.Responses.ErrorResponse
  >
): Promise<void> {
  const league: Results.Leagues = String(
    req.query.league ?? "mls"
  ) as Results.Leagues;

  const year = Number(req.query.year ?? 2022);
  const yearOffset = LeagueYearOffset[league] ?? 0;

  const response = await fetch(
    `${FORM_API}?year=${year + yearOffset}&league=${league}`
  );

  const { data } = (await response.json()) as { data: Results.ParsedData };

  const fixtureIds = getAllFixtures(
    data,
    (m) => m.status.long !== "Match Finished"
  );
  const { homeWin = 0.4, awayWin = 0.3 } = LeagueProbabilities[league] ?? {};

  const simulations =
    fixtureIds.length > 0
      ? fixtureIds.length > 300
        ? 1000
        : fixtureIds.length > 200
        ? 2000
        : fixtureIds.length > 150
        ? 3000
        : fixtureIds.length > 100
        ? 5000
        : fixtureIds.length > 50
        ? 10100
        : 15000
      : 1;

  const _from = new Date();

  const [projectedStandingsData, fromCache] =
    await fetchCachedOrFreshV2<FormGuideAPI.Data.Simulations>(
      `projected-standings:v1.0.2:${simulations}:${getHash([
        fixtureIds,
        ConferencesByYear[league]?.[year],
      ])}`,
      async () => {
        const possibleTables = [];

        for (let i = 0; i < simulations; i++) {
          const possibilities: Possibility[] = fixtureIds.map((m) =>
            getMatchOutcome(m, homeWin, awayWin)
          );

          const table = Object.entries(data.teams).reduce(
            (acc: Record<string, Row>, [team, results]) => {
              const projectedResults = results.map((r) => {
                const pR = possibilities.find(
                  (p) => p.fixtureId === r.fixtureId
                );
                if (!pR) {
                  return r;
                }
                return {
                  ...r,
                  status: {
                    ...r.status,
                    long: "Match Finished",
                  },
                  result: pR.home === r.team ? pR.homeResult : pR.awayResult,
                };
              });
              return { ...acc, [team]: getRow(team, projectedResults) };
            },
            {}
          );

          possibleTables.push(
            getTeamRank(Object.values(table), league as Results.Leagues)
          );
        }
        const possibilities: FormGuideAPI.Data.Simulations =
          possibleTables.reduce((acc: FormGuideAPI.Data.Simulations, curr) => {
            return {
              ...acc,
              ...curr.reduce((_acc, row) => {
                const rank = row.conferenceRank ?? row.rank;
                if (!rank) {
                  return _acc;
                }
                return {
                  ..._acc,
                  [row.team]: {
                    ...(acc[row.team] || {}),
                    [rank]: (acc[row.team]?.[rank] ?? 0) + 1,
                  },
                };
              }, {}),
            };
          }, {});
        return possibilities;
      },
      60 * 60 * 24 * 7 // keep projections around for a week — new ones will be generated and these will clear out because of the hash of remaining matches in the key
    );

  if (!projectedStandingsData) {
    res.json({
      errors: [{ message: "Projected standings data not gathered" }],
    });
  } else {
    res.json({
      data: projectedStandingsData,
      errors: [],
      meta: {
        simulations,
        fromCache,
        took: Number(new Date()) - Number(_from),
      },
    });
  }
}

function getMatchOutcome(
  m: MatchWithTeams,
  homeWin: number,
  awayWin: number
): Possibility {
  const r = Math.random();
  const projectedResult =
    r <= homeWin ? 0 : r > homeWin && r <= awayWin + homeWin ? 2 : 1;
  return [
    {
      fixtureId: m.fixtureId,
      home: m.home,
      away: m.away,
      homeResult: "W" as Results.ResultTypes,
      awayResult: "L" as Results.ResultTypes,
      homePoints: 3,
      awayPoints: 0,
    },
    {
      fixtureId: m.fixtureId,
      home: m.home,
      away: m.away,
      homeResult: "D" as Results.ResultTypes,
      awayResult: "D" as Results.ResultTypes,
      homePoints: 1,
      awayPoints: 1,
    },
    {
      fixtureId: m.fixtureId,
      home: m.home,
      away: m.away,
      homeResult: "L" as Results.ResultTypes,
      awayResult: "W" as Results.ResultTypes,
      homePoints: 0,
      awayPoints: 3,
    },
  ][projectedResult];
}
