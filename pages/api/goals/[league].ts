import { fetchCachedOrFreshV2 } from "@/utils/cache";
import getAllFixtureIds from "@/utils/getAllFixtureIds";
import { LeagueCodes } from "@/utils/LeagueCodes";
import { NextApiRequest, NextApiResponse } from "next";

import getExpires from "@/utils/getExpires";

import { createHash } from "crypto";

const FORM_API = process.env.FORM_API;
const FIXTURES_ENDPOINT = process.env.PREDICTIONS_API;

export default async function Goals(
  req: NextApiRequest,
  res: NextApiResponse<FormGuideAPI.Responses.Goals>
): Promise<void> {
  const league = String(req.query.league);
  const year = String(req.query.year ?? new Date().getFullYear());

  if (!(league in LeagueCodes)) {
    res.status(500);
    res.json({
      errors: [{ message: "Requested league not available " }],
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

  const interval = setInterval(() => console.log("fetching"), 5000);

  const hash = createHash("md5");
  const key = `fixture-data:v1.0.3#${hash
    .update(JSON.stringify(matches))
    .digest("hex")}`;

  console.log({ key });

  const [prepared, preparedFromCache] = await fetchCachedOrFreshV2(
    key,
    async () => {
      const prepared: {
        fixtureId: number;
        goals: Results.FixtureEvent[];
        fromCache: boolean;
      }[] = [];

      for await (const fixture of matches) {
        const [data, fromCache] = await fetchCachedOrFreshV2<{
          fixtureData: Results.FixtureApi[];
          predictionsData: Results.PredictionApi[];
        }>(
          `fixture-data:v1.0.4:${fixture.fixtureId}`,
          async () => {
            const response = await fetch(
              `${FIXTURES_ENDPOINT}?fixture=${fixture.fixtureId}`
            );
            const { data } = await response.json();
            return data;
          },
          fixture.status.long === "Match Finished" ? 0 : 60 * 60 * 6 // six hours if completed, no expiration if not
        );

        if (data?.fixtureData?.[0]) {
          prepared.push({
            fixtureId: fixture.fixtureId,
            fromCache,
            goals: data?.fixtureData[0].events.filter(
              (event) => event.type === "Goal"
            ),
          });
        }
      }
      return prepared;
    },
    60 * 60 * 4
  );

  clearInterval(interval);

  res.json({
    data: {
      teams: Object.entries(data.teams).reduce(
        (previousValue, [team, matches]) => {
          return {
            ...previousValue,
            [team]: matches.map((m) => ({
              ...m,
              goalsData: prepared.find((f) => m.fixtureId === f.fixtureId),
            })),
          };
        },
        {}
      ),
    },
    meta: {
      fixtureIds: matches.map((f) => f.fixtureId),
    },
  });
}
