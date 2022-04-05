import { http } from "@google-cloud/functions-framework";
import { config } from "dotenv";
import Redis from "ioredis";
import fetch from "node-fetch-commonjs";

config();

import { getEndpoint, getExpires, parseRawData, thisYear } from "./utils";

const URL_BASE = `https://${process.env.API_FOOTBALL_BASE}`;
const REDIS_URL = process.env.REDIS_URL;
const API_BASE = process.env.API_FOOTBALL_BASE;
const API_KEY = process.env.API_FOOTBALL_KEY;
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
  const client = new Redis(REDIS_URL);

  // keys differentiate by year and league
  const redisKey = `formguide:v1.0.8:${league}:${year}`;
  const exists = await client.exists(redisKey);
  // cache for four weeks if it's not the current year. no need to hit the API

  if (!exists) {
    const headers = {
      "x-rapidapi-host": API_BASE,
      "x-rapidapi-key": API_KEY,
      useQueryString: "true",
    };
    const response = await fetch(`${URL_BASE}${getEndpoint(year, league)}`, {
      headers,
    });
    const matchData = parseRawData((await response.json()) as Results.RawData);
    await client.set(redisKey, JSON.stringify(matchData));
    return matchData;
  } else {
    const data = await client.get(redisKey);
    await client.expire(redisKey, getExpires(year));
    if (!data) {
      throw "No data found";
    }
    return JSON.parse(data) as Results.ParsedData;
  }
}
