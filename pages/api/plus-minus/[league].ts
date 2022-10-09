import getFixtureData, { FIXTURE_KEY_PREFIX } from "@/utils/api/getFixtureData";
import { chunk } from "@/utils/array";
import {
  fetchCachedOrFreshV2,
  getHash,
  getKey,
  getKeyFromParts,
} from "@/utils/cache";
import getKeys from "@/utils/cache/getKeys";
import getAllFixtureIds, { SlimMatch } from "@/utils/getAllFixtureIds";
import getExpires, { getExpiresWeek } from "@/utils/getExpires";
import { getPlusMinus } from "@/utils/match";
import { getClient } from "@/utils/redis";
import { NextApiRequest, NextApiResponse } from "next";

const FORM_API = process.env.FORM_API;

export default async function PlusMinusEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<FormGuideAPI.Responses.PlusMinusEndpoint>
): Promise<void> {
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

  const matches = getAllFixtureIds(data);

  const keys = await getKeys(`${FIXTURE_KEY_PREFIX}*`);

  const key = getKeyFromParts(
    FIXTURE_KEY_PREFIX,
    "ALL",
    "PLUS_MINUS",
    getHash([matches, league])
  );
  const {
    data: plusMinus = [],
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

      const perMatchData = prepared.filter(Boolean).map((p) =>
        p
          ? {
              fixtureId: p.fixture.id,
              score: p.score,
              teams: p.teams,
              plusMinus: getPlusMinus(p),
            }
          : null
      );
      const collectedPlayers: FormGuideAPI.Data.PlusMinusEndpoint = {};
      perMatchData.forEach((match) => {
        Object.entries(match?.plusMinus ?? {}).forEach(([team, players]) => {
          Object.entries(players).forEach(([player, plusMinus]) => {
            if (!collectedPlayers[team]) {
              collectedPlayers[team] = {};
            }
            collectedPlayers[team][player] = {
              onGF:
                (collectedPlayers[team][player]?.onGF ?? 0) +
                (plusMinus.goalsOn ?? 0),
              onGA:
                (collectedPlayers[team][player]?.onGA ?? 0) +
                (plusMinus.goalsOnOpp ?? 0),
              offGF:
                (collectedPlayers[team][player]?.offGF ?? 0) +
                (plusMinus.goalsOff ?? 0),
              offGA:
                (collectedPlayers[team][player]?.offGA ?? 0) +
                (plusMinus.goalsOffOpp ?? 0),
              minutes:
                (collectedPlayers[team][player]?.minutes ?? 0) +
                (plusMinus.minutes ?? 0),
              matches: (collectedPlayers[team][player]?.matches ?? 0) + 1,
            };
          });
        });
      });
      return collectedPlayers;
    },
    getExpiresWeek(Number(year)), // long cache time; when match statuses change, the fixtures hex in the key will change, negating a need to cache for a shorter time
    {
      allowCompression: true,
    }
  );

  res.json({
    data: plusMinus,
    meta: {
      compressed,
      errors,
      preparedFromCache,
    },
  });
}

async function fetchFixture(
  fixture: SlimMatch
): Promise<Results.FixtureApi | null> {
  try {
    const { data } = await getFixtureData(fixture.fixtureId);

    return data?.fixtureData[0] ?? null;
  } catch (e) {
    console.error(e);
    return null;
  }
}
