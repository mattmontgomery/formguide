import { fetchCachedOrFresh } from "@/utils/cache";
import { NextApiRequest, NextApiResponse } from "next";

const ALLOWED_LEAGUES: Results.Leagues[] = ["mls"];

const TheOddsMapping: Partial<Record<Results.Leagues, string>> = {
  mls: "soccer_usa_mls",
};

const getEndpoint = (
  sport: string,
  regions: "us" | "uk" | "au" | "eu" = "us",
  markets: ("h2h" | "spreads" | "totals" | "outrights")[] = [
    "h2h",
    "spreads",
    "totals",
  ]
) =>
  `https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=${
    process.env.THEODDS_API_KEY
  }&regions=${regions}&markets=${markets.join(",")}`;

export default async function LeagueOdds(
  req: NextApiRequest,
  res: NextApiResponse<FormGuideAPI.BaseAPIV2<TheOdds.Entry[]>>
): Promise<void> {
  const league = String(req.query.league) as Results.Leagues;
  if (
    !ALLOWED_LEAGUES.includes(league) ||
    typeof TheOddsMapping[league] !== "string"
  ) {
    res.json({
      data: null,
      meta: null,
      errors: [{ message: "League not supported" }],
    });
    return;
  }
  const leagueCode = TheOddsMapping[league] ?? `${TheOddsMapping["mls"]}`;

  const data = await fetchCachedOrFresh(
    `odds:${leagueCode}:v1`,
    async () => {
      const endpoint = getEndpoint(leagueCode);
      const res = await fetch(endpoint);
      return res.json();
    },
    60 * 60 * 1 // cache for 1 hour
  );
  res.json({
    data: data,
    errors: [],
    meta: {
      leagueCode,
    },
  });
  return;
}
