import {
  fetchCachedOrFreshV2,
  getHash,
  getKey,
  getKeyFromParts,
} from "@/utils/cache";
import getAllFixtureIds from "@/utils/getAllFixtureIds";
import { LeagueCodes } from "@/utils/LeagueCodes";
import { NextApiRequest, NextApiResponse } from "next";
import type { SlimMatch } from "@/utils/getAllFixtureIds";

import getExpires, { getExpiresWeek } from "@/utils/getExpires";

import getFixtureData, { FIXTURE_KEY_PREFIX } from "@/utils/api/getFixtureData";
import { chunk } from "@/utils/array";
import redisClient from "@/utils/redis";

const FORM_API = process.env.FORM_API;

export default async function Stats(
  req: NextApiRequest,
  res: NextApiResponse<
    FormGuideAPI.Responses.StatsEndpoint | FormGuideAPI.Responses.ErrorResponse
  >
): Promise<void> {
  const league = String(req.query.league);
  const year = String(req.query.year ?? new Date().getFullYear());

  if (!(league in LeagueCodes)) {
    res.status(500);
    res.json({
      errors: [{ message: "Requested league not available" }],
    });
    return;
  }
  const response = await fetch(
    `${FORM_API}?year=${year}&league=${league || "mls"}`
  );
  res.setHeader(
    `Cache-Control`,
    `s-maxage=${getExpires(Number(year))}, stale-while-revalidate`
  );

  const { data }: { data: Results.ParsedData } = await response.json();

  const matches = getAllFixtureIds(data);

  const totalKey = getKeyFromParts(
    FIXTURE_KEY_PREFIX,
    "ALL",
    "STATS_v3",
    "COMPRESSED",
    "WITH_REFEREE",
    matches.length,
    getHash(matches)
  );

  const keys = await redisClient().keys(`${FIXTURE_KEY_PREFIX}*`);

  const from = new Date();

  const {
    data: prepared = [],
    fromCache: preparedFromCache,
    compressed,
    error: errors,
  } = await fetchCachedOrFreshV2(
    totalKey,
    async () => {
      const prepared: WithStats[] = [];

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
        prepared.push(...(matches as WithStats[]));
      }
      for await (const matchChunk of notCachedChunks) {
        const matches = (
          await Promise.all(matchChunk.map(fetchFixture))
        ).filter((m) => m !== null);
        prepared.push(...(matches as WithStats[]));
      }

      return prepared;
    },
    getExpiresWeek(Number(year)), // long cache time; when match statuses change, the fixtures hex in the key will change, negating a need to cache for a shorter time
    {
      allowCompression: true,
    }
  );

  const teamsData = data
    ? Object.entries(data.teams).reduce(
        (
          previousValue: FormGuideAPI.Data.StatsEndpoint["teams"],
          [team, matches]
        ) => {
          return {
            ...previousValue,
            [team]: matches.map((m): FormGuideAPI.Data.StatsMatch => {
              const fixture = prepared?.find(
                (f) => m.fixtureId === f?.fixtureId
              );
              const match = {
                ...m,
                referee: fixture?.referee ?? "",
                stats: fixture?.stats ?? undefined,
              };
              delete match.league;
              return match;
            }),
          };
        },
        {}
      )
    : null;
  if (errors) {
    res.json({
      errors: [
        {
          message: String(errors),
        },
      ],
    });
  } else if (data !== null) {
    res.json({
      data: {
        teams: teamsData as FormGuideAPI.Data.StatsEndpoint["teams"],
      },
      meta: {
        fixtureIds: matches.map((f) => f.fixtureId),
        preparedFromCache,
        took: Number(new Date()) - Number(from),
        compressed,
      },
    });
  } else {
    res.json({
      errors: [{ message: "Data could not be generated" }],
    });
  }
}

async function fetchFixture(fixture: SlimMatch): Promise<WithStats | null> {
  try {
    const { data, fromCache } = await getFixtureData(fixture.fixtureId);

    if (data?.fixtureData?.[0]) {
      return {
        fixtureId: fixture.fixtureId,
        fromCache,
        referee: data?.fixtureData[0].fixture.referee,
        stats: reduceStats(data?.fixtureData[0].statistics),
      };
    }
    return {
      fixtureId: fixture.fixtureId,
      referee: null,
      fromCache,
      stats: {},
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}

export function reduceStats(team: Results.FixtureApi["statistics"] = []): {
  [team: string]: Record<string, string | number>;
} {
  return team.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.team.name]: curr.statistics.reduce((acc, curr) => {
        return {
          ...acc,
          [curr.type]: curr.value,
        };
      }, {}),
    };
  }, {});
}

export type WithStats = {
  fixtureId: number;
  fromCache: boolean;
  referee: string | null;
  stats: { [team: string]: Record<string, number | string> };
};
