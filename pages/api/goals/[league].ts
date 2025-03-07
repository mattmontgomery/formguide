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
import getKeys from "@/utils/cache/getKeys";

const FORM_API = process.env.FORM_API;

export default async function Goals(
  req: NextApiRequest,
  res: NextApiResponse<
    FormGuideAPI.Responses.GoalsEndpoint | FormGuideAPI.Responses.ErrorResponse
  >,
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
    `${FORM_API}?year=${year}&league=${league || "mls"}`,
  );
  res.setHeader(
    `Cache-Control`,
    `s-maxage=${getExpires(Number(year))}, stale-while-revalidate`,
  );

  const { data }: { data: Results.ParsedData } = await response.json();

  const matches = getAllFixtureIds(data);

  const totalKey = getKeyFromParts(
    FIXTURE_KEY_PREFIX,
    "ALL",
    "PENALTIES",
    "SUBSTITUTIONS",
    "COMPRESSED",
    matches.length,
    getHash(matches),
  );

  const keys = await getKeys(`${FIXTURE_KEY_PREFIX}`);

  const from = new Date();

  const {
    data: prepared = [],
    fromCache: preparedFromCache,
    compressed,
    error: errors,
  } = await fetchCachedOrFreshV2(
    totalKey,
    async () => {
      const prepared: (Results.MatchWithGoalData["goalsData"] | null)[] = [];

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
        ).filter(Boolean);
        prepared.push(...matches);
      }
      for await (const matchChunk of notCachedChunks) {
        const matches = (
          await Promise.all(matchChunk.map(fetchFixture))
        ).filter(Boolean);
        prepared.push(...matches);
      }

      return prepared;
    },
    getExpiresWeek(Number(year)), // long cache time; when match statuses change, the fixtures hex in the key will change, negating a need to cache for a shorter time
    {
      allowCompression: true,
    },
  );

  const teamsData = data
    ? Object.entries(data.teams).reduce(
        (
          previousValue: FormGuideAPI.Data.GoalsEndpoint["teams"],
          [team, matches],
        ) => {
          return {
            ...previousValue,
            [team]: matches.map(
              (m): FormGuideAPI.Data.GoalMatch => ({
                ...m,
                goalsData:
                  prepared?.find((f) => m.fixtureId === f?.fixtureId) ??
                  undefined,
              }),
            ),
          };
        },
        {},
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
        teams: teamsData,
      } as FormGuideAPI.Data.GoalsEndpoint,
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

async function fetchFixture(
  fixture: SlimMatch,
): Promise<Results.MatchWithGoalData["goalsData"] | null> {
  try {
    const { data, fromCache } = await getFixtureData(fixture.fixtureId);

    if (data?.fixtureData?.[0]) {
      return {
        fixtureId: fixture.fixtureId,
        fromCache,
        goals: data?.fixtureData[0].events.filter(
          (event) => event.type === "Goal",
        ),
        substitutions: data?.fixtureData[0].events.filter(
          (event) => event.type === "subst",
        ),
        penalties: data?.fixtureData[0].players.reduce((acc, teamPlayers) => {
          return {
            ...acc,
            [teamPlayers.team.name]: teamPlayers.players.reduce(
              (acc, player) => {
                return {
                  scored:
                    (player.statistics[0].penalty.scored ?? 0) + acc.scored,
                  missed:
                    (player.statistics[0].penalty.missed ?? 0) + acc.missed,
                };
              },
              {
                scored: 0,
                missed: 0,
              },
            ),
          };
        }, {}),
      };
    }
    return {
      fixtureId: fixture.fixtureId,
      fromCache,
      goals: [],
      penalties: {},
      substitutions: [],
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}

// EVAL "return redis.call('del', unpack(redis.call('keys', ARGV[1])))" 0 prefix:[expire:*]
