import getFixtureData from "@/utils/api/getFixtureData";
import { chunk } from "@/utils/array";
import { fetchCachedOrFreshV2, getHash, getKeyFromParts } from "@/utils/cache";
import { NextApiRequest, NextApiResponse } from "next";

export default async function form(
  req: NextApiRequest,
  res: NextApiResponse<
    | FormGuideAPI.Responses.FixturesEndpoint
    | FormGuideAPI.Responses.ErrorResponse
  >
): Promise<void> {
  const fixtures = String(req.query.fixture)
    .split(",")
    .map((f) => Number(f));
  const chunks = chunk(fixtures, 10);
  const key = getKeyFromParts("fixtures", "chunks", 10, getHash(fixtures));
  const { data: matches } = await fetchCachedOrFreshV2(
    key,
    async () => {
      const prepared: (FormGuideAPI.Data.Fixtures | null)[] = [];
      for await (const chunk of chunks) {
        const matches = (await Promise.all(chunk.map(getFixtureData))).filter(
          (m) => m !== null
        );
        prepared.push(
          ...matches
            .map((f) => f.data?.fixtureData?.[0] ?? null)
            .filter(Boolean)
        );
      }
      return prepared;
    },
    60 * 60 * 24
  );
  if (!matches) {
    res.json({
      errors: [{ message: "No matching fixtures found" }],
    });
    return;
  }
  res.setHeader(`Cache-Control`, `s-maxage=${60 * 60}, stale-while-revalidate`);
  res.json({
    data: matches.reduce(
      (acc: FormGuideAPI.Responses.FixturesEndpoint["data"], curr) => {
        if (curr) {
          return {
            ...acc,
            [curr.fixture.id]: curr,
          };
        } else {
          return acc;
        }
      },
      {}
    ),
    meta: {},
  });
}
