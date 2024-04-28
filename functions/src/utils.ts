import { subHours } from "date-fns";
import Redis from "ioredis";
import { format } from "util";
import { ENDPOINT } from "./constants";
import { LeagueCodes } from "./constants";
import { gzip, gunzip } from "zlib";

const redisClient = new Redis(process.env.REDIS_URL || "redis://localhost");

export function formatDate(date: string) {
  const d = subHours(new Date(date), 8);

  return d.toDateString();
}

export function getExpires(year: number, data: Results.ParsedData) {
  if (year !== thisYear) {
    return 60 * 60 * 24 * 7 * 4;
  } else {
    return 60 * 15; // default 30 minutes
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
  league: Results.Leagues = "mls",
): string {
  const leagueCode = LeagueCodes[league] || 253;
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
  homeOrAway: "home" | "away",
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
                  curr.score.fulltime.away - curr.score.halftime.away,
                )
              : getResult(
                  curr.score.fulltime.away - curr.score.halftime.away,
                  curr.score.fulltime.home - curr.score.halftime.home,
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
    {},
  );
  return {
    teams,
  };
}

export async function fetchCachedOrFresh<T>(
  key: string,
  fetch: () => Promise<T>,
  expire: number | ((data: T) => number),
): Promise<[T | null, boolean]> {
  // keys differentiate by year and league
  const redisKey = getKey(key);
  const data = await redisClient.get(redisKey);

  if (data) {
    return [JSON.parse(data) as T, true];
  } else {
    const data = await fetch();
    await redisClient.set(redisKey, JSON.stringify(data));
    const expireTime = typeof expire === "number" ? expire : expire(data);
    if (expireTime > 0) {
      await redisClient.expire(
        redisKey,
        typeof expire === "number" ? expire : expire(data),
      );
    }
    return [data, false];
  }
}

export function getKey(key: string): string {
  const APP_VERSION = process.env.APP_VERSION || "v3.0.3";
  return `${key}:${APP_VERSION}`;
}

export function getKeyFromParts(
  ...parts: (string | number | undefined)[]
): string {
  return `${parts
    .filter(Boolean)
    .map((p) => String(p).toUpperCase())
    .join(":")}`;
}

export type FetchCachedOrFreshReturnType<T> = {
  data: T | null;
  fromCache: boolean;
  compressed: boolean;
  error?: Error | string | null;
};
export async function fetchCachedOrFreshV2<T>(
  key: string,
  fetch: () => Promise<T>,
  expire: number | ((data: T) => number),
  {
    checkEmpty,
    retryOnEmptyData = true,
    allowCompression = true,
  }: {
    checkEmpty?: (arg0: string | null) => boolean;
    retryOnEmptyData?: boolean;
    allowCompression?: boolean;
  } = {},
): Promise<FetchCachedOrFreshReturnType<T>> {
  try {
    const REDIS_URL = process.env.REDIS_URL;
    if (!REDIS_URL) {
      throw "Application is not properly configured";
    }

    // keys differentiate by year and league
    const redisKey = getKeyFromParts(
      key,
      allowCompression ? "compressed" : undefined,
    );
    const exists = await redisClient.exists(redisKey);
    const { data, empty, compressed } = await fetchFromCache<T>(
      redisKey,
      checkEmpty,
    );

    if (exists && empty && !retryOnEmptyData) {
      return {
        data: null,
        compressed,
        fromCache: true,
      };
    } else if (exists && !empty) {
      return {
        data: data,
        compressed,
        fromCache: true,
      };
    }

    try {
      const data = await fetch();
      if (
        typeof checkEmpty === "function" &&
        checkEmpty(JSON.stringify(data))
      ) {
        throw `Data for ${redisKey} could not be found`; // error instead of setting data improperly
      }
      const { compressed } = await setInCache<T>({
        key: redisKey,
        data,
        expire,
        allowCompression,
      });
      return {
        data,
        compressed,
        fromCache: false,
      };
      // return [data, false, false];
    } catch (e) {
      console.error(e);
      return {
        data: null,
        compressed: false,
        fromCache: false,
        error: String(e),
      };
    }
  } catch (e) {
    console.error(e);
    return {
      data: null,
      compressed: false,
      fromCache: false,
      error: String(e),
    };
  }
}
export async function fetchFromCache<T>(
  key: string,
  checkEmpty: (arg0: string | null) => boolean = () => false,
): Promise<{ data: T | null; empty: boolean; compressed: boolean }> {
  const data = await redisClient.get(key);
  if (!data || (data && checkEmpty(data))) {
    return { data: null, empty: true, compressed: false };
  }
  const parsed = JSON.parse(data) as {
    compressed: boolean;
    compressedData: string;
  };
  if (typeof parsed?.compressed !== "undefined") {
    const decompressed: string = !parsed.compressed
      ? parsed.compressedData
      : await decompressString(parsed.compressedData);
    return {
      data: JSON.parse(decompressed) as T,
      empty: false,
      compressed: true,
    };
  } else {
    return { data: JSON.parse(data) as T, empty: false, compressed: false };
  }
}
export async function compressString(data: string): Promise<string> {
  return new Promise((resolve, reject) => {
    gzip(Buffer.from(data), (err, compressed) => {
      if (err) {
        reject(err);
      } else {
        resolve(compressed.toString("hex"));
      }
    });
  });
}
export async function decompressString(compressed: string): Promise<string> {
  return new Promise((resolve, reject) => {
    gunzip(Buffer.from(compressed, "hex"), (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.toString());
      }
    });
  });
}

export async function setInCache<T>({
  key,
  data,
  expire,
  allowCompression = false,
}: {
  key: string;
  data: T;
  expire: number | ((data: T) => number);
  allowCompression: boolean;
}): Promise<{ compressed: boolean }> {
  const stringifiedData = JSON.stringify(data);
  const dataSize = Buffer.byteLength(stringifiedData, "utf8");
  const shouldCompress = allowCompression && dataSize > 300000;
  // 800 KB
  if (shouldCompress) {
    const compressed = await compressString(stringifiedData);
    await redisClient.set(
      key,
      JSON.stringify({ compressed: true, compressedData: compressed }),
    );
  } else {
    await redisClient.set(key, stringifiedData);
  }
  const expireTime = typeof expire === "number" ? expire : expire(data);
  if (expireTime) {
    await redisClient.expire(key, expireTime);
  }
  return {
    compressed: shouldCompress,
  };
}
