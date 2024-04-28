import fetch from "node-fetch-commonjs";
import { config } from "dotenv";

config();

const URL_BASE = `https://${process.env.API_FOOTBALL_BASE}`;
const REDIS_URL = process.env.REDIS_URL;
const API_BASE = process.env.API_FOOTBALL_BASE;
const API_KEY = process.env.API_FOOTBALL_KEY;

export async function getFixture(
  fixtureId: number,
): Promise<Results.FixtureApi[]> {
  const authHeaders = await getAuthenticationHeaders();
  const resp = await fetch(`${URL_BASE}/v3/fixtures?id=${fixtureId}`, {
    headers: authHeaders,
  });
  return ((await resp.json()) as { response: Results.FixtureApi[] })?.response;
}
export async function getPredictionsForFixture(
  fixtureId: number,
): Promise<Results.PredictionApi[]> {
  const authHeaders = await getAuthenticationHeaders();
  const resp = await fetch(`${URL_BASE}/v3/predictions?fixture=${fixtureId}`, {
    headers: authHeaders,
  });
  return ((await resp.json()) as { response: Results.PredictionApi[] })
    ?.response;
}

async function getAuthenticationHeaders(): Promise<{
  "x-rapidapi-host": string;
  "x-rapidapi-key": string;
  useQueryString: string;
}> {
  if (
    typeof REDIS_URL !== "string" ||
    typeof API_BASE !== "string" ||
    typeof API_KEY !== "string"
  ) {
    throw "Application not properly configured";
  }
  return {
    "x-rapidapi-host": API_BASE,
    "x-rapidapi-key": API_KEY,
    useQueryString: "true",
  };
}
