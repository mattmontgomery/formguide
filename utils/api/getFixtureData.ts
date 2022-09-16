import { isBefore, parseISO } from "date-fns";
import { fetchCachedOrFreshV2, getKeyFromParts } from "../cache";

const ENDPOINT = process.env.PREDICTIONS_API;

export const FIXTURE_KEY_PREFIX = `fixture-data:v1.0.10:`;

export default async function getFixtureData(fixture: number) {
  return fetchCachedOrFreshV2<FormGuideAPI.Data.Fixture>(
    getKeyFromParts(FIXTURE_KEY_PREFIX, fixture),
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
    (data) =>
      data.fixtureData?.[0].fixture.status.long === "Match Finished"
        ? 0 // no expiration for completed matches
        : isBefore(parseISO(data.fixtureData[0]?.fixture.date), new Date())
        ? 60 * 60 // 1 hour for matches from today forward
        : 60 * 60 * 24, // 24 hour cache for incomplete matches
    {
      checkEmpty: (data) => {
        if (!data) return true;
        try {
          const d = JSON.parse(data) as FormGuideAPI.Data.Fixture;
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
