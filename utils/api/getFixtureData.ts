import { FetchCachedOrFreshReturnType, fetchCachedOrFreshV2 } from "../cache";

const ENDPOINT = process.env.PREDICTIONS_API;

export default async function getFixtureData(
  fixture: number
): Promise<FetchCachedOrFreshReturnType<FormGuideAPI.Responses.Fixture>> {
  return fetchCachedOrFreshV2<FormGuideAPI.Responses.Fixture>(
    `fixture-data:v1.0.10:${fixture}`,
    async () => {
      const response = await fetch(`${ENDPOINT}?fixture=${fixture}`);
      if (response.status !== 200) {
        throw `function response: ${response.statusText}`;
      }
      const responseJson = await response.json();
      if (responseJson.errors.length) {
        throw `function errors: ${JSON.stringify(responseJson.errors)}`;
      }
      return responseJson.data;
    },
    (data: FormGuideAPI.Responses.Fixture) =>
      data.fixtureData?.[0].fixture.status.long === "Match Finished"
        ? 0
        : 60 * 60 * 24, // 24 hour cache for incomplete matches
    {
      checkEmpty: (data) => {
        if (!data) return true;
        try {
          const d = JSON.parse(data) as FormGuideAPI.Responses.Fixture;
          if (
            !d ||
            !d.fixtureData ||
            (typeof d.fixtureData === "object" &&
              Object.keys(d.fixtureData).length === 0)
          ) {
            return true;
          }
          return false;
        } catch (e) {
          return true;
        }
      },
      retryOnEmptyData: true,
    }
  );
}
