import { http } from "@google-cloud/functions-framework";
import { config } from "dotenv";
import Redis from "ioredis";
import fetch from "node-fetch-commonjs";

import {
  fetchCachedOrFresh,
  getEndpoint,
  getExpires,
  parseRawData,
  thisYear,
} from "./utils";

config();

const URL_BASE = `https://${process.env.API_FOOTBALL_BASE}`;
const REDIS_URL = process.env.REDIS_URL;
const API_BASE = process.env.API_FOOTBALL_BASE;
const API_KEY = process.env.API_FOOTBALL_KEY;
const APP_VERSION = process.env.APP_VERSION || "v2.0.3";
const defaultLeague: Results.Leagues = "mls";

http("form", async (req, res) => {
  res.header("Content-Type", "application/json");
  const year = req.query.year ? Number(req.query.year) : thisYear;
  const league: Results.Leagues = req.query.league
    ? (String(req.query.league).slice(0, 5) as Results.Leagues)
    : defaultLeague;
  try {
    const data = await fetchData({ year, league });
    res.setHeader(
      `Cache-Control`,
      `s-maxage=${getExpires(year)}, stale-while-revalidate`
    );
    res.json({
      data,
    });
  } catch (e) {
    console.error(e);
    res.json({
      errors: [e],
    });
  }
});

async function fetchData({
  year,
  league = "mls",
}: {
  year: number;
  league?: Results.Leagues;
}): Promise<Results.ParsedData> {
  if (
    typeof REDIS_URL !== "string" ||
    typeof API_BASE !== "string" ||
    typeof API_KEY !== "string"
  ) {
    throw "Application not properly configured";
  }

  // keys differentiate by year and league
  const redisKey = `formguide:${APP_VERSION}:${league}:${year}`;
  const matchData = await fetchCachedOrFresh(
    redisKey,
    async (): Promise<Results.ParsedData> => {
      const headers = {
        "x-rapidapi-host": API_BASE,
        "x-rapidapi-key": API_KEY,
        useQueryString: "true",
      };
      // cache for four weeks if it's not the current year. no need to hit the API
      const response = await fetch(`${URL_BASE}${getEndpoint(year, league)}`, {
        headers,
      });
      return parseRawData((await response.json()) as Results.RawData);
    },
    getExpires(year)
  );
  if (!matchData) {
    throw "no data found";
  }
  return matchData;
}
