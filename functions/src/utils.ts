import { addMinutes, differenceInSeconds, isAfter, subHours } from "date-fns";
import Redis from "ioredis";
import { format } from "util";
import { ENDPOINT } from "./constants";
import { LeagueCodes } from "./constants";

const redisClient = new Redis(process.env.REDIS_URL || "redis://localhost");

export function formatDate(date: string) {
  const d = subHours(new Date(date), 8);

  return d.toDateString();
}

export function getExpires(year: number, data: Results.ParsedData) {
  if (year !== thisYear) {
    return 60 * 60 * 24 * 7 * 4;
  } else {
    return 60 * 60; // default 60 minutes
    // const nextMatches = Object.keys(data.teams).map((t) =>
    //   data.teams[t]
    //     .filter((match) => match.status.long !== "Match Finished")
    //     .find(() => true)
    // );
    // const nextMatch: Results.Match | undefined = nextMatches
    //   .sort((a, b) =>
    //     a &&
    //     b &&
    //     isAfter(new Date(String(a.rawDate)), new Date(String(b.rawDate)))
    //       ? 1
    //       : a &&
    //         b &&
    //         isAfter(new Date(String(a.rawDate)), new Date(String(b.rawDate)))
    //       ? -1
    //       : 0
    //   )
    //   .find((m) => m);
    // // expires 90 minutes + 15 minutes with a padding of 15 minutes after the next match ... should be a little nicer than what's currently in place
    // const diff = nextMatch
    //   ? differenceInSeconds(
    //       addMinutes(new Date(String(nextMatch.rawDate)), 90 + 15 + 15),
    //       new Date()
    //     )
    //   : 60 * 60;
    // return diff;
  }
  // return year === thisYear ? 60 * 60 : 60 * 60 * 24 * 7 * 4;
}

export const thisYear = new Date().getFullYear(); // we are gonna make it

export function getEndpoint(
  year = 2022,
  league: Results.Leagues = "mls"
): string {
  const leagueCode = LeagueCodes[league] || 253;
  // non-summer leagues
  if (league === "epl") {
    year = year - 1;
  }
  return format(ENDPOINT, year, leagueCode);
}

export function getResult(goalsA: number, goalsB: number): Results.ResultType {
  if (goalsA > goalsB) {
    return "W";
  } else if (goalsB > goalsA) {
    return "L";
  }
  return "D";
}

export function getData(
  curr: Results.RawResponse,
  homeOrAway: "home" | "away"
): Results.Match {
  const homeTeam = curr.teams.home.name;
  const awayTeam = curr.teams.away.name;
  const base = {
    fixtureId: curr.fixture.id,
    league: curr.league,
    score: curr.score,
    date: formatDate(curr.fixture.date),
    rawDate: curr.fixture.date,
    scoreline: null,
    result: null,
    status: curr.fixture.status,
    home: homeOrAway === "home",
    team: homeOrAway === "home" ? homeTeam : awayTeam,
    opponent: homeOrAway === "home" ? awayTeam : homeTeam,
    opponentLogo:
      homeOrAway === "home" ? curr.teams.away.logo : curr.teams.home.logo,
  };
  return curr.fixture.status.long === "Match Finished"
    ? {
        ...base,
        scoreline:
          homeOrAway === "home"
            ? `${curr.goals.home}-${curr.goals.away}`
            : `${curr.goals.away}-${curr.goals.home}`,
        result:
          homeOrAway === "home"
            ? getResult(curr.goals.home, curr.goals.away)
            : getResult(curr.goals.away, curr.goals.home),
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
        ...base,
      };
}

export function parseRawData(data: Results.RawData): Results.ParsedData {
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

export async function fetchCachedOrFresh<T>(
  key: string,
  fetch: () => Promise<T>,
  expire: number | ((data: T) => number)
): Promise<T | null> {
  const REDIS_URL = process.env.REDIS_URL;
  const APP_VERSION = process.env.APP_VERSION || "v3.0.3";
  if (!REDIS_URL) {
    throw "Application is not properly configured";
  }

  // keys differentiate by year and league
  const redisKey = `${key}:${APP_VERSION}`;
  const data = await redisClient.get(redisKey);

  if (data) {
    return data ? (JSON.parse(data) as T) : null;
  } else {
    const data = await fetch();
    await redisClient.set(redisKey, JSON.stringify(data));
    const expireTime = typeof expire === "number" ? expire : expire(data);
    if (expireTime > 0) {
      await redisClient.expire(
        redisKey,
        typeof expire === "number" ? expire : expire(data)
      );
    }
    return data;
  }
}
