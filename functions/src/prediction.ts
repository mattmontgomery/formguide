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
    const fixtureData = await fetchCachedOrFresh<Results.FixtureApi[]>(
      `prediction-api:fixture:${fixture}`,
      async () => getFixture(fixture),
      (data) =>
        data?.[0].fixture.status.long === "Match Finished"
          ? 60 * 60 * 24 * 7 * 52
          : 60 * 60
    );
    const predictionData = await fetchCachedOrFresh<Results.PredictionApi[]>(
      `predictions:${fixture}`,
      async () => getPredictionsForFixture(fixture),
      (data) =>
        fixtureData?.[0].fixture.status.long === "Match Finished"
          ? 0 // store in perpetuity if match is finished
          : Boolean(data)
          ? 60 * 60 * 24
          : 60 * 60 // one minute if failed, 24 hours if not
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
