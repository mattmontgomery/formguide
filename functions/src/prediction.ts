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
      `fixtures:${fixture}`,
      async () => getFixture(fixture),
      60 * 60 * 24
    );
    const predictionData = await fetchCachedOrFresh<Results.PredictionApi[]>(
      `predictions:${fixture}`,
      async () => getPredictionsForFixture(fixture),
      60 * 60 * 24
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
