import { subHours } from "date-fns";
import { NextApiRequest, NextApiResponse } from "next";

const URL_BASE = `https://${process.env.API_FOOTBALL_BASE}`;
const ENDPOINT = `/v3/fixtures?from=2021-01-01&to=2021-12-31&season=2021&league=253`;
const API_BASE = process.env.API_FOOTBALL_BASE;
const API_KEY = process.env.API_FOOTBALL_KEY;

const IN_MEMORY_CACHE: {
  cachedData: Results.RawData | null;
  expires: Date | null;
  refetching: boolean;
} = {
  cachedData: null,
  expires: null,
  refetching: false,
};

export default async function Form(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (!API_BASE || !API_KEY) {
    res.status(500);
    res.json({
      errors: [{ message: "Application not properly configured" }],
    });
    return;
  }
  const headers = new Headers({
    "x-rapidapi-host": API_BASE,
    "x-rapidapi-key": API_KEY,
    useQueryString: "true",
  });
  let matchData;
  let fromCache;
  const expiresTime = IN_MEMORY_CACHE.expires?.getTime() || Date.now();
  if (
    !IN_MEMORY_CACHE.cachedData ||
    (Date.now() >= expiresTime && IN_MEMORY_CACHE.refetching === false)
  ) {
    IN_MEMORY_CACHE.refetching = true; // expire in 30 mintues
    const response = await fetch(`${URL_BASE}${ENDPOINT}`, {
      headers,
    });
    matchData = (await response.json()) as Results.RawData;
    fromCache = false;
    IN_MEMORY_CACHE.cachedData = matchData;
    IN_MEMORY_CACHE.expires = new Date(Date.now() + 30 * 60 * 1000); // expire in 30 mintues
    IN_MEMORY_CACHE.refetching = false; // expire in 30 mintues
  } else {
    fromCache = true;
    matchData = IN_MEMORY_CACHE.cachedData;
  }
  res.setHeader(`Cache-Control`, `s-maxage=${30 * 60}, stale-while-revalidate`);
  res.status(200);
  res.json({
    meta: {
      fromCache,
      expires: IN_MEMORY_CACHE.expires,
      refetching: IN_MEMORY_CACHE.refetching,
    },
    data: parseRawData(matchData),
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
  const teams = data.response.reduce(
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
