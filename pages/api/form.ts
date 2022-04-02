import { subHours } from "date-fns";
import { format } from "util";
import { NextApiRequest, NextApiResponse } from "next";

const URL_BASE = `https://${process.env.API_FOOTBALL_BASE}`;
const ENDPOINT = `/v3/fixtures?from=%s&to=%s&season=%s&league=%d`;
const API_BASE = process.env.API_FOOTBALL_BASE;
const API_KEY = process.env.API_FOOTBALL_KEY;

import Data2012 from "../../data/2012.json";
import Data2013 from "../../data/2013.json";
import Data2014 from "../../data/2014.json";
import Data2015 from "../../data/2015.json";
import Data2016 from "../../data/2016.json";
import Data2017 from "../../data/2017.json";
import Data2018 from "../../data/2018.json";
import Data2019 from "../../data/2019.json";
import Data2020 from "../../data/2020.json";
import Data2021 from "../../data/2021.json";

const thisYear = new Date().getFullYear(); // we are gonna make it

import Redis from "ioredis";

async function fetchData({
  year,
  league = "mls",
}: {
  year: number;
  league?: Results.Leagues;
}): Promise<Results.ParsedData> {
  if (
    typeof process.env.REDIS_URL !== "string" ||
    typeof API_BASE !== "string" ||
    typeof API_KEY !== "string"
  ) {
    throw "Application not properly configured";
  }
  const client = new Redis(process.env.REDIS_URL);

  // keys differentiate by year and league
  const redisKey = `formguide:${league}:${year}`;
  const exists = await client.exists(redisKey);
  // cache for four weeks if it's not the current year. no need to hit the API
  const expires = year === thisYear ? 60 * 60 : 60 * 60 * 24 * 7 * 4;

  if (!exists) {
    const headers = new Headers({
      "x-rapidapi-host": API_BASE,
      "x-rapidapi-key": API_KEY,
      useQueryString: "true",
    });
    const response = await fetch(`${URL_BASE}${getEndpoint(year, league)}`, {
      headers,
    });
    const matchData = parseRawData((await response.json()) as Results.RawData);
    await client.set(redisKey, JSON.stringify(matchData));
    return matchData;
  } else {
    const data = await client.get(redisKey);
    await client.expire(redisKey, expires);
    if (!data) {
      throw "No data found";
    }
    return JSON.parse(data) as Results.ParsedData;
  }
}

const DataSwitch: Record<number, Results.ParsedData> = {
  2012: { teams: Data2012.data.teams as Results.ParsedData["teams"] },
  2013: { teams: Data2013.data.teams as Results.ParsedData["teams"] },
  2014: { teams: Data2014.data.teams as Results.ParsedData["teams"] },
  2015: { teams: Data2015.data.teams as Results.ParsedData["teams"] },
  2016: { teams: Data2016.data.teams as Results.ParsedData["teams"] },
  2017: { teams: Data2017.data.teams as Results.ParsedData["teams"] },
  2018: { teams: Data2018.data.teams as Results.ParsedData["teams"] },
  2019: { teams: Data2019.data.teams as Results.ParsedData["teams"] },
  2020: { teams: Data2020.data.teams as Results.ParsedData["teams"] },
  2021: { teams: Data2021.data.teams as Results.ParsedData["teams"] },
};

const LeagueCodes: Record<Results.Leagues, number> = {
  mls: 253,
  nwsl: 254,
  mlsnp: 909,
  usl1: 489,
  usl2: 256,
  uslc: 255,
  nisa: 523,
};

function getEndpoint(year = 2022, league: Results.Leagues = "mls"): string {
  const leagueCode = LeagueCodes[league] || 253;
  return format(ENDPOINT, `${year}-01-01`, `${year}-12-31`, year, leagueCode);
}

export default async function Form(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  let year = 2022;
  const league: Results.Leagues =
    (req.query.league?.toString() as Results.Leagues) || "mls";
  if (req.query.year) {
    year = Number(req.query.year?.toString() || 2022) || 2022;
    year = isNaN(year) ? 2022 : year;
  }
  if (!(year >= 2012 && year <= 2022)) {
    res.status(404);
    res.json({
      errors: [
        {
          message:
            "No data for years before 2012, and no data for years in the future",
        },
      ],
    });
  }

  try {
    let matchData;
    let fromCache = false;
    let fromFileCache = false;
    if (DataSwitch[year] && league === "mls") {
      /* eslint-disable-next-line @typescript-eslint/no-var-requires */
      fromCache = true;
      fromFileCache = true;
      matchData = DataSwitch[year];
    } else if (year > 2012) {
      matchData = await fetchData({
        year,
        league,
      });
    }
    res.setHeader(
      `Cache-Control`,
      `s-maxage=${30 * 60}, stale-while-revalidate`
    );
    res.status(200);
    res.json({
      meta: {
        fromFileCache,
        fromCache,
      },
      data: matchData,
    });
  } catch (e) {
    res.status(500);
    res.json({
      errors: [e],
    });
  }
}

function getResult(goalsA: number, goalsB: number): Results.ResultType {
  if (goalsA > goalsB) {
    return "W";
  } else if (goalsB > goalsA) {
    return "L";
  }
  return "D";
}

function getData(
  curr: Results.RawResponse,
  homeOrAway: "home" | "away"
): Results.Match {
  const homeTeam = curr.teams.home.name;
  const awayTeam = curr.teams.away.name;
  return curr.fixture.status.short === "FT"
    ? {
        date: formatDate(curr.fixture.date),
        rawDate: new Date(curr.fixture.date),
        scoreline:
          homeOrAway === "home"
            ? `${curr.goals.home}-${curr.goals.away}`
            : `${curr.goals.away}-${curr.goals.home}`,
        result:
          homeOrAway === "home"
            ? getResult(curr.goals.home, curr.goals.away)
            : getResult(curr.goals.away, curr.goals.home),
        home: homeOrAway === "home",
        team: homeOrAway === "home" ? homeTeam : awayTeam,
        opponent: homeOrAway === "home" ? awayTeam : homeTeam,
        opponentLogo:
          homeOrAway === "home" ? curr.teams.away.logo : curr.teams.home.logo,
        gd:
          homeOrAway === "home"
            ? curr.goals.home - curr.goals.away
            : curr.goals.away - curr.goals.home,
        goalsScored: homeOrAway === "home" ? curr.goals.home : curr.goals.away,
        goalsConceded:
          homeOrAway === "home" ? curr.goals.away : curr.goals.home,
        firstHalf: {
          goalsScored:
            homeOrAway === "home"
              ? curr.score.halftime.home
              : curr.score.halftime.away,
          goalsConceded:
            homeOrAway === "home"
              ? curr.score.halftime.away
              : curr.score.halftime.home,
          result:
            homeOrAway === "home"
              ? getResult(curr.score.halftime.home, curr.score.halftime.away)
              : getResult(curr.score.halftime.away, curr.score.halftime.home),
        },
        secondHalf: {
          goalsScored:
            homeOrAway === "home"
              ? curr.score.fulltime.home
              : curr.score.fulltime.away,
          goalsConceded:
            homeOrAway === "home"
              ? curr.score.fulltime.away
              : curr.score.fulltime.home,
          result:
            homeOrAway === "home"
              ? getResult(
                  curr.score.fulltime.home - curr.score.halftime.home,
                  curr.score.fulltime.away - curr.score.halftime.away
                )
              : getResult(
                  curr.score.fulltime.away - curr.score.halftime.away,
                  curr.score.fulltime.home - curr.score.halftime.home
                ),
        },
      }
    : {
        date: formatDate(curr.fixture.date),
        rawDate: curr.fixture.date,
        scoreline: null,
        result: null,
        home: homeOrAway === "home",
        team: homeOrAway === "home" ? homeTeam : awayTeam,
        opponent: homeOrAway === "home" ? awayTeam : homeTeam,
        opponentLogo:
          homeOrAway === "home" ? curr.teams.away.logo : curr.teams.home.logo,
      };
}

function parseRawData(data: Results.RawData): Results.ParsedData {
  const teams = data.response?.reduce(
    (previousValue: Results.ParsedData["teams"], curr) => {
      const homeTeam = curr.teams.home.name;
      const awayTeam = curr.teams.away.name;
      const prevHomeTeamValue: Results.Match[] = previousValue[homeTeam] || [];
      return {
        ...previousValue,
        [homeTeam]: [...prevHomeTeamValue, getData(curr, "home")],
        [awayTeam]: [...(previousValue[awayTeam] || []), getData(curr, "away")],
      };
    },
    {}
  );
  return {
    teams,
  };
}

function formatDate(date: string) {
  const d = subHours(new Date(date), 8);

  return d.toDateString();
}
