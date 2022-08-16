import { LeagueCodes } from "@/utils/LeagueCodes";

export function transformXGMatchIntoASAMatch(
  match: ASA.XGWithGame & ASA.HomeAway
): Results.Match {
  return {
    date: match.date_time_utc,
    rawDate: new Date(match.date_time_utc).toISOString(),
    fixtureId: -1,
    home: match.isHome,
    opponent: match.isHome ? match.awayTeam : match.homeTeam,
    status: {
      short: "ft",
      elapsed: 90,
      long: "Match Finished",
    },
    opponentLogo: "",
    result: match.isHome
      ? match.home_goals > match.away_goals
        ? "W"
        : match.home_goals < match.away_goals
        ? "L"
        : "D"
      : match.away_goals > match.home_goals
      ? "W"
      : match.home_goals === match.away_goals
      ? "D"
      : "L",

    score: {
      halftime: {
        away: 0,
        home: 0,
      },
      extratime: {
        away: 0,
        home: 0,
      },
      penalty: {
        away: 0,
        home: 0,
      },
      fulltime: {
        away: match.away_goals,
        home: match.home_goals,
      },
    },
    scoreline: `${match.home_goals}-${match.away_goals}`,
    team: match.isHome ? match.homeTeam : match.awayTeam,
    league: {
      country: "USA",
      flag: "",
      id: LeagueCodes.mls,
      logo: "",
      name: "Major League Soccer",
      season: -1,
    },
  };
}
