import { fetchFixture, FIXTURE_KEY_PREFIX } from "@/utils/api/getFixtureData";
import { chunk } from "@/utils/array";
import {
  fetchCachedOrFreshV2,
  getHash,
  getKey,
  getKeyFromParts,
} from "@/utils/cache";
import getKeys from "@/utils/cache/getKeys";
import getAllFixtureIds from "@/utils/getAllFixtureIds";
import getExpires, { getExpiresWeek } from "@/utils/getExpires";
import { getSingleTeamPlayerMinutes } from "@/utils/match";
import { NextApiRequest, NextApiResponse } from "next";

const FORM_API = process.env.FORM_API;

export default async function PlayersTeamEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<
    | FormGuideAPI.Responses.PlayerMinutesEndpoint
    | FormGuideAPI.Responses.ErrorResponse
  >
): Promise<void> {
  const team = String(req.query.team);
  const league = String(req.query.league) as Results.Leagues;
  const year = req.query.year
    ? Number(req.query.year)
    : new Date().getFullYear();
  const response = await fetch(
    `${FORM_API}?year=${year}&league=${league || "mls"}`
  );
  res.setHeader(
    `Cache-Control`,
    `s-maxage=${getExpires(Number(year))}, stale-while-revalidate`
  );

  const { data }: { data: Results.ParsedData } = await response.json();

  const matches = getAllFixtureIds(data, team);

  const keys = await getKeys(`${FIXTURE_KEY_PREFIX}*`);

  const key = getKeyFromParts(
    FIXTURE_KEY_PREFIX,
    team,
    "ALL",
    "WITH_GOALS",
    "PLAYER_MINUTES_v2",
    getHash([matches, league])
  );
  const {
    data: playersData = [],
    fromCache: preparedFromCache,
    compressed,
    error: errors,
  } = await fetchCachedOrFreshV2(
    key,
    async () => {
      const prepared: (Results.FixtureApi | null)[] = [];

      const availableInCache = matches.filter((m) => {
        return keys.includes(getKey(`${FIXTURE_KEY_PREFIX}${m.fixtureId}`));
      });
      const notAvailableInCache = matches.filter((m) => {
        return !keys.includes(getKey(`${FIXTURE_KEY_PREFIX}${m.fixtureId}`));
      });

      const fromCacheChunks = chunk(availableInCache, 20);
      const notCachedChunks = chunk(notAvailableInCache, 5);

      for await (const matchChunk of fromCacheChunks) {
        const matches = (
          await Promise.all(matchChunk.map(fetchFixture))
        ).filter((m) => m !== null);
        prepared.push(...(matches as Results.FixtureApi[]));
      }
      for await (const matchChunk of notCachedChunks) {
        const matches = (
          await Promise.all(matchChunk.map(fetchFixture))
        ).filter((m) => m !== null);
        prepared.push(...matches);
      }

      return prepared.filter(Boolean).map((p) =>
        p
          ? {
              fixtureId: p.fixture.id,
              date: p.fixture.date,
              rawDate: p.fixture.date,
              score: p.score,
              teams: p.teams,
              fixture: p.fixture,
              playerMinutes: getSingleTeamPlayerMinutes(p, team),
              goals: p.events.filter((e) => e.type === "Goal"),
            }
          : null
      );
    },
    getExpiresWeek(Number(year)), // long cache time; when match statuses change, the fixtures hex in the key will change, negating a need to cache for a shorter time
    {
      allowCompression: true,
    }
  );
  if (errors) {
    res.json({
      errors: [{ message: String(errors) }],
    });
    return;
  }
  res.json({
    data:
      (playersData?.filter(
        Boolean
      ) as FormGuideAPI.Data.PlayerMinutesEndpoint[]) ?? [],
    meta: { team, league, year, compressed, preparedFromCache },
  });
}
