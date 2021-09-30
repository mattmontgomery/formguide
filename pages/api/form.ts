import { subHours } from "date-fns";
import { format } from "util";
import { NextApiRequest, NextApiResponse } from "next";

const URL_BASE = `https://${process.env.API_FOOTBALL_BASE}`;
const ENDPOINT = `/v3/fixtures?from=%s&to=%s&season=%s&league=253`;
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
};

function getEndpoint(year = 2021): string {
  return format(ENDPOINT, `${year}-01-01`, `${year}-12-31`, year);
}

const IN_MEMORY_CACHE: {
  cachedData: Record<number, Results.ParsedData>;
  expires: Date | null;
  refetching: boolean;
} = {
  cachedData: {},
  expires: null,
  refetching: false,
};

export default async function Form(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  let year = 2021;
  if (!API_BASE || !API_KEY) {
    res.status(500);
    res.json({
      errors: [{ message: "Application not properly configured" }],
    });
    return;
  }
  if (req.query.year && process.env.NODE_ENV !== "development") {
    res.status(403);
    res.json({
      errors: [
        {
          message: "Cannot make year requests in non-development environments",
        },
      ],
    });
    return;
  } else if (req.query.year) {
    year = Number(req.query.year?.toString() || 2021) || 2021;
    year = isNaN(year) ? 2021 : year;
  }
  if (!(year >= 2012 && year <= 2021)) {
    res.status(404);
    res.json({
      errors: [
        {
          message:
            "No data for years before 2012, and no data for years in the future",
        },
      ],
    });
    return;
  }
  const headers = new Headers({
    "x-rapidapi-host": API_BASE,
    "x-rapidapi-key": API_KEY,
    useQueryString: "true",
  });
  let matchData;
  let fromCache: boolean;
  let fromFileCache = false;
  const expiresTime = IN_MEMORY_CACHE.expires?.getTime() || Date.now();
  if (year <= 2020 && !IN_MEMORY_CACHE.cachedData[year]) {
    /* eslint-disable-next-line @typescript-eslint/no-var-requires */
    fromCache = true;
    fromFileCache = true;
    matchData = DataSwitch[year];
  } else if (
    !IN_MEMORY_CACHE.cachedData[year] ||
    (Date.now() >= expiresTime && IN_MEMORY_CACHE.refetching === false)
  ) {
    IN_MEMORY_CACHE.refetching = true; // expire in 30 mintues
    const response = await fetch(`${URL_BASE}${getEndpoint(year)}`, {
      headers,
    });
    matchData = parseRawData((await response.json()) as Results.RawData);
    fromCache = false;
    IN_MEMORY_CACHE.cachedData[year] = matchData;
    IN_MEMORY_CACHE.expires = new Date(Date.now() + 30 * 60 * 1000); // expire in 30 mintues
    IN_MEMORY_CACHE.refetching = false; // expire in 30 mintues
  } else {
    fromCache = true;
    matchData = IN_MEMORY_CACHE.cachedData[year];
  }
  res.setHeader(`Cache-Control`, `s-maxage=${30 * 60}, stale-while-revalidate`);
  res.status(200);
  res.json({
    meta: {
      fromCache,
      fromFileCache,
      expires: IN_MEMORY_CACHE.expires,
      refetching: IN_MEMORY_CACHE.refetching,
    },
    data: matchData,
  });
}

function getResult(goalsA: number, goalsB: number): Results.ResultType {
  if (goalsA > goalsB) {
    return "W";
  } else if (goalsB > goalsA) {
    return "L";
  }
  return "D";
}

function parseRawData(data: Results.RawData): Results.ParsedData {
  const teams = data.response?.reduce(
    (previousValue: Results.ParsedData["teams"], curr) => {
      const homeTeam = curr.teams.home.name;
      const awayTeam = curr.teams.away.name;
      return {
        ...previousValue,
        [homeTeam]: [
          ...(previousValue[homeTeam] || []),
          curr.fixture.status.short === "FT"
            ? {
                date: formatDate(curr.fixture.date),
                scoreline: `${curr.goals.home}-${curr.goals.away}`,
                result: getResult(curr.goals.home, curr.goals.away),
                home: true,
                team: homeTeam,
                opponent: awayTeam,
                opponentLogo: curr.teams.away.logo,
                gd: curr.goals.home - curr.goals.away,
                goalsScored: curr.goals.home,
                goalsConceded: curr.goals.away,
                firstHalf: {
                  goalsScored: curr.score.halftime.home,
                  goalsConceded: curr.score.halftime.away,
                  result: getResult(
                    curr.score.halftime.home,
                    curr.score.halftime.away
                  ),
                },
                secondHalf: {
                  goalsScored:
                    curr.score.fulltime.home - curr.score.halftime.home,
                  goalsConceded:
                    curr.score.fulltime.away - curr.score.halftime.away,
                  result: getResult(
                    curr.score.fulltime.home - curr.score.halftime.home,
                    curr.score.fulltime.away - curr.score.halftime.away
                  ),
                },
              }
            : {
                date: formatDate(curr.fixture.date),
                scoreline: null,
                result: null,
                home: true,
                team: homeTeam,
                opponent: awayTeam,
                opponentLogo: curr.teams.away.logo,
              },
        ],
        [awayTeam]: [
          ...(previousValue[awayTeam] || []),
          curr.fixture.status.short === "FT"
            ? {
                date: formatDate(curr.fixture.date),
                scoreline: `${curr.goals.away}-${curr.goals.home}`,
                result: getResult(curr.goals.away, curr.goals.home),
                home: false,
                team: awayTeam,
                opponent: homeTeam,
                opponentLogo: curr.teams.home.logo,
                gd: curr.goals.away - curr.goals.home,
                goalsScored: curr.goals.away,
                goalsConceded: curr.goals.home,
                firstHalf: {
                  goalsScored: curr.score.halftime.away,
                  goalsConceded: curr.score.halftime.home,
                  result: getResult(
                    curr.score.halftime.away,
                    curr.score.halftime.home
                  ),
                },
                secondHalf: {
                  goalsScored:
                    curr.score.fulltime.away - curr.score.halftime.away,
                  goalsConceded:
                    curr.score.fulltime.home - curr.score.halftime.home,
                  result: getResult(
                    curr.score.fulltime.away - curr.score.halftime.away,
                    curr.score.fulltime.home - curr.score.halftime.home
                  ),
                },
              }
            : {
                date: formatDate(curr.fixture.date),
                scoreline: null,
                result: null,
                home: false,
                team: awayTeam,
                opponent: homeTeam,
                opponentLogo: curr.teams.home.logo,
              },
        ],
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
