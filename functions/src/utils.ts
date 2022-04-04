import { subHours } from "date-fns";
import { format } from "util";
import { ENDPOINT, LeagueCodes } from "./constants";

export function formatDate(date: string) {
  const d = subHours(new Date(date), 8);

  return d.toDateString();
}

export function getExpires(year: number) {
  return year === thisYear ? 60 * 60 : 60 * 60 * 24 * 7 * 4;
}

export const thisYear = new Date().getFullYear(); // we are gonna make it

export function getEndpoint(
  year = 2022,
  league: Results.Leagues = "mls"
): string {
  const leagueCode = LeagueCodes[league] || 253;
  return format(ENDPOINT, `${year}-01-01`, `${year}-12-31`, year, leagueCode);
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
