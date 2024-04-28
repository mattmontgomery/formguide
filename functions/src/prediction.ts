import { http } from "@google-cloud/functions-framework";
import { config } from "dotenv";
import { getFixture, getPredictionsForFixture } from "./football-api";
import { fetchCachedOrFresh } from "./utils";

config();

http("prediction", async (req, res) => {
  res.header("Content-Type", "application/json");
  const fixture = Number(req.query.fixture?.toString());
  if (!fixture || Number.isNaN(fixture)) {
    res.json({
      meta: { fixture },
      errors: [
        {
          message: "query param `fixture` must be a number",
        },
      ],
      data: null,
    });
    return;
  }
  try {
    const [fixtureData, fromCache] = await fetchCachedOrFresh<
      Results.FixtureApi[]
    >(
      `prediction-api:v2:fixture:${fixture}`,
      async () => getFixture(fixture),
      (data) =>
        !data
          ? 30
          : data?.[0].fixture.status.long === "Match Finished"
            ? 0
            : data?.[0].fixture.status.short === "NS"
              ? 60 * 60 * 4 // 4 hours if the match has not started
              : 60 * 15, // 15 minutes if the match has started
    );
    console.info("Fetching data", fixture, Boolean(fixtureData), fromCache);
    const [predictionData] = await fetchCachedOrFresh<Results.PredictionApi[]>(
      `prediction-api:v2:predictions:${fixture}`,
      async () => getPredictionsForFixture(fixture),
      (data) =>
        fixtureData?.[0].fixture.status.long === "Match Finished"
          ? 0 // store in perpetuity if match is finished
          : Boolean(data)
            ? 60 * 60 * 24
            : 60 * 60, // one minute if failed, 24 hours if not
    );
    res.json({
      errors: [],
      data: { fixtureData, predictionData },
      meta: { fixture },
    });
  } catch (e) {
    res.json({
      errors: [e],
    });
  }
});
