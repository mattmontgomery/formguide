import { NextApiRequest, NextApiResponse } from "next";

import Client from "itscalledsoccer";
import { sortByDate } from "@/utils/array";
import { fetchCachedOrFresh } from "@/utils/cache";

export default async function XGApi(
  req: NextApiRequest,
  res: NextApiResponse<ASA.XgByGameApi>
): Promise<void> {
  const { year, league } = req.query;
  const client = new Client();
  try {
    const [teams = [], teamsById = {}, xg = []] =
      (await fetchCachedOrFresh<
        [ASA.Team[], Record<string, ASA.Team>, ASA.XGWithGame[]]
      >(
        `asa:xg:v1.0.2:${league}:${year}`,
        async (): Promise<
          [ASA.Team[], Record<string, ASA.Team>, ASA.XGWithGame[]]
        > => {
          const teams: ASA.Team[] = await client.getTeams({
            leagues: [league],
          });
          const teamsById = teams.reduce(
            (acc: Record<string, ASA.Team>, curr) => {
              return {
                ...acc,
                [curr.team_id]: curr,
              };
            },
            {}
          );
          const xg: ASA.XGWithGame[] = await client.getGamesXgoals({
            leagues: [league],
            seasonName: String(year),
          });
          return [teams, teamsById, xg];
        },
        60 * 60
      )) ?? [];
    res.setHeader(
      `Cache-Control`,
      `s-maxage=${60 * 60}, stale-while-revalidate`
    );
    res.json({
      data: {
        teams,
        xg: xg.reduce((acc: ASA.XgByGameApi["data"]["xg"], curr) => {
          const homeTeamName: string =
            teamsById[curr.home_team_id]?.team_name ?? "undefined";
          const awayTeamName: string =
            teamsById[curr.away_team_id]?.team_name ?? "undefined";
          return {
            ...acc,
            [homeTeamName]: [
              ...(acc[homeTeamName] ?? []),
              {
                ...curr,
                isHome: true,
                homeTeam: homeTeamName,
                awayTeam: awayTeamName,
              },
            ].sort(sortByDate("date_time_utc")),
            [awayTeamName]: [
              ...(acc[awayTeamName] ?? []),
              {
                ...curr,
                isHome: false,
                homeTeam: homeTeamName,
                awayTeam: awayTeamName,
              },
            ].sort(sortByDate("date_time_utc")),
          };
        }, {}),
      },
      meta: {
        league,
        year,
      },
      errors: [],
    });
  } catch (e) {
    res.json({
      data: { teams: [], xg: {} },
      meta: {
        league,
        year,
      },
      errors: [{ message: String(e) }],
    });
  }
}
