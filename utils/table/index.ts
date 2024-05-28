import { getRecord, getGoals, getRecordPoints } from "@/utils/getRecord";
import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import { getArraySum } from "../array";
import { getTeamPointsArray } from "../getTeamPoints";
import {
  Conferences,
  ConferencesByYear,
  DefaultLeagueSort,
  LeagueSorts,
} from "../LeagueConferences";

export type Row = GridValidRowModel & {
  id: string;
  team: string;
  gp: number;
  points: number;
  pointsDropped: number;
  ppg: string;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  gd: number;
  homeRecord: string;
  awayRecord: string;
  homePoints: number;
  homePointsDropped: number;
  awayPoints: number;
  awayPointsDropped: number;
  rank?: number;
  conferenceRank?: number;
};

export function getRow(
  team: string,
  matches: Results.Match[],
  from?: Date,
  to?: Date,
): Row {
  const [w, d, l] = getRecord(matches, {
    from,
    to,
  });
  const [hw, hd, hl] = getRecord(matches, {
    home: true,
    away: false,
    from,
    to,
  });
  const [aw, ad, al] = getRecord(matches, {
    home: false,
    away: true,
    from,
    to,
  });
  const [gf, ga, gd] = getGoals(matches);
  const points = getRecordPoints([w, d, l]);
  const gp = w + d + l;
  return {
    id: team,
    team: team,
    gp,
    points: points,
    pointsDropped: gp * 3 - points,
    ppg: gp > 0 ? (points / gp).toFixed(2) : "-",
    w,
    d,
    l,
    gf,
    ga,
    gd,
    homeRecord: `${hw}-${hd}-${hl}`,
    awayRecord: `${aw}-${ad}-${al}`,
    homePoints: getRecordPoints([hw, hd, hl]),
    homePointsDropped: (hw + hd + hl) * 3 - getRecordPoints([hw, hd, hl]),
    awayPoints: getRecordPoints([aw, ad, al]),
    awayPointsDropped: (aw + ad + al) * 3 - getRecordPoints([aw, ad, al]),
  };
}

export function getColumns(): GridColDef[] {
  return [
    { field: "rank", headerName: "Rank", width: 100 },
    { field: "id", headerName: "Team", width: 250 },
    {
      field: "points",
      headerName: "Points",
      width: 100,
    },
    {
      field: "pointsDropped",
      headerName: "Pts Dropped",
      width: 125,
    },
    {
      field: "gp",
      headerName: "GP",
      width: 100,
    },
    {
      field: "ppg",
      headerName: "Points Per Game",
      width: 100,
    },
    {
      field: "w",
      headerName: "W",
      width: 100,
    },
    {
      field: "d",
      headerName: "D",
      width: 100,
    },
    {
      field: "l",
      headerName: "L",
      width: 100,
    },
    {
      field: "gf",
      headerName: "GF",
      width: 100,
    },
    {
      field: "ga",
      headerName: "GA",
      width: 100,
    },
    {
      field: "gd",
      headerName: "GD",
      width: 100,
    },
    {
      field: "homeRecord",
      headerName: "Home",
      width: 100,
    },
    {
      field: "homePoints",
      headerName: "Home Points",
      width: 100,
    },
    {
      field: "homePointsDropped",
      headerName: "Home Dropped",
      width: 125,
    },
    {
      field: "awayRecord",
      headerName: "Away",
      width: 100,
    },
    {
      field: "awayPoints",
      headerName: "Away Points",
      width: 100,
    },
    {
      field: "awayPointsDropped",
      headerName: "Away Dropped",
      width: 125,
    },
  ];
}

export function getConferences(
  league: Results.Leagues,
  year: number,
): string[] {
  return (
    (ConferencesByYear[league]?.[year] ? Conferences[league] : null) ?? ["All"]
  );
}

export function getTeams(
  conferences: ReturnType<typeof getConferences> = [],
  teamsData: Results.ParsedData["teams"],
  {
    league,
    year,
  }: {
    league: Results.Leagues;
    year: number;
  },
): Record<string, string> {
  return (
    (conferences.length > 1
      ? ConferencesByYear[league]?.[year]
      : Object.keys(teamsData).reduce(
          (acc, curr) => ({
            ...acc,
            [curr]: "All",
          }),
          {},
        )) ??
    Object.keys(teamsData).reduce(
      (acc, curr) => ({
        ...acc,
        [curr]: "All",
      }),
      {},
    )
  );
}

export function getTable(
  teamsData: Results.ParsedData["teams"],
  {
    league,
    year,
    useConferences = true,
    from,
    to,
  }: {
    league: Results.Leagues;
    year: number;
    useConferences?: boolean;
    from?: Date;
    to?: Date;
  },
): {
  conferences: ReturnType<typeof getConferences>;
  table: Row[][];
} {
  const conferences = useConferences ? getConferences(league, year) : ["All"];
  const teams: Record<string, string> = getTeams(conferences, teamsData, {
    year: year,
    league: league,
  });
  const table = conferences.map((conference) => {
    return Object.keys(teams)
      ?.filter((t: string) => teams[t] === conference || conference === "All")
      .map((t) =>
        getRow(
          t,
          teamsData[t]?.filter((tD) => {
            return !tD.league?.round?.includes("MLS Cup");
            true;
          }),
          from,
          to,
        ),
      )
      .sort(getSortStrategy(league))
      .reverse()
      .map((record, idx) => ({
        ...record,
        rank: idx + 1,
      }));
  });
  return { conferences, table };
}

export function sortRows(rows: Row[], league: Results.Leagues) {
  const sortStrategy = getSortStrategy(league);

  return [...rows].sort(sortStrategy).reverse();
}
export function getSortStrategy(league: Results.Leagues) {
  return league &&
    typeof LeagueSorts[league] === "function" &&
    LeagueSorts[league]
    ? LeagueSorts[league]
    : DefaultLeagueSort;
}

export function getTeamRank(
  rows: Row[],
  league: Results.Leagues,
  year = new Date().getFullYear(),
): Row[] {
  const conferencesByYear = ConferencesByYear[league]?.[year] ?? {};
  const sorted = [...rows].sort(getSortStrategy(league)).reverse();
  return sorted.map((row, idx) => ({
    ...row,
    rank: idx + 1,
    conferenceRank:
      Object.keys(conferencesByYear).length > 0
        ? sorted
            .filter(
              (sR) =>
                conferencesByYear[row.team] === conferencesByYear[sR.team],
            )
            .findIndex((sR) => sR.team === row.team) + 1
        : undefined, //
  }));
}

export function getTeamConference(
  team: string,
  league: Results.Leagues,
  year: number,
): string | null {
  return ConferencesByYear[league]?.[year]?.[team] ?? null;
}

export function getConferenceSize(
  conference: string,
  league: Results.Leagues,
  year: number,
): number {
  return getConferenceTeams(conference, league, year).length;
}

export function getConferenceTeams(
  conference: string,
  league: Results.Leagues,
  year: number,
): string[] {
  return Object.entries(ConferencesByYear[league]?.[year] || {})
    .filter(([, c]) => c === conference)
    .map(([team]) => team);
}

export function getPoints<T extends Results.Match = Results.Match>(
  matches: T[],
): number {
  return getArraySum(getTeamPointsArray(matches));
}
export function getPlayedMatches<T extends Results.Match = Results.Match>(
  matches: T[],
): T[] {
  return matches.filter((m) => m.status.long === "Match Finished");
}

export function getGamesWithPositions(
  matches: Results.MatchWithGoalData[],
  positions: ("W" | "D" | "L")[] = [],
): Results.MatchWithGoalData[] {
  return matches.filter((match) => {
    const gameStates = (match.goalsData?.goals ?? []).reduce(
      (previousValue: number[][], currentValue) => {
        const last: number[] = [...previousValue].reverse()?.[0] ?? [0, 0];
        const isFirst = match.team === currentValue.team.name;
        const next: [number, number] = [
          isFirst ? last[0] + 1 : last[0],
          isFirst ? last[1] : last[1] + 1,
        ];
        return [...previousValue, next];
      },
      [[0, 0]],
    );
    return gameStates.some(([team, opponent]) => {
      if (positions.includes("W") && team > opponent) {
        return true;
      } else if (positions.includes("L") && team < opponent) {
        return true;
      } else if (positions.includes("D") && team === opponent && team > 0) {
        return true;
      }
      return false;
    });
  });
}

export function getUniqueGoalscorers(
  matches: Results.MatchWithGoalData[],
): { name: string; goals: number }[] {
  return matches.reduce(
    (acc: ReturnType<typeof getUniqueGoalscorers>, match) => {
      const goalscorers = [...acc];
      match.goalsData?.goals.forEach((goal) => {
        if (
          goal.team.name === match.team &&
          !goalscorers.some((g) => g.name === goal.player.name)
        ) {
          goalscorers.push({ name: goal.player.name, goals: 1 });
        } else if (goal.team.name === match.team) {
          const idx = goalscorers.findIndex((g) => g.name === goal.player.name);
          goalscorers[idx].goals = goalscorers[idx].goals + 1;
        }
      });
      return goalscorers;
    },
    [],
  );
}

export function getGoalsScored(matches: Results.Match[]): number {
  return matches.reduce((acc: number, match) => {
    return acc + (match.goalsScored ?? 0);
  }, 0);
}
export function getGoalsConceded(matches: Results.Match[]): number {
  return matches.reduce((acc: number, match) => {
    return acc + (match.goalsConceded ?? 0);
  }, 0);
}

export function getPenalties(matches: Results.MatchWithGoalData[]) {
  const taken = getArraySum(
    matches.map((match) => {
      return (
        (match.goalsData?.penalties?.[match.team]?.scored ?? 0) +
        (match.goalsData?.penalties?.[match.team]?.missed ?? 0)
      );
    }),
  );
  const opponentTaken = getArraySum(
    matches.map((match) => {
      return (
        (match.goalsData?.penalties?.[match.opponent]?.scored ?? 0) +
        (match.goalsData?.penalties?.[match.opponent]?.missed ?? 0)
      );
    }),
  );
  const scored = getArraySum(
    matches.map((match) => {
      return match.goalsData?.penalties?.[match.team]?.scored ?? 0;
    }),
  );
  const opponentScored = getArraySum(
    matches.map((match) => {
      return match.goalsData?.penalties?.[match.opponent]?.scored ?? 0;
    }),
  );
  return { taken, scored, opponentTaken, opponentScored };
}
