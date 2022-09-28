import BaseDataPage from "@/components/BaseDataPage";
import { useDateFilter } from "@/components/DateFilter";
import { Options, useHomeAway } from "@/components/Toggle/HomeAwayToggle";
import LeagueContext from "@/components/Context/League";
import Table from "@/components/Table";
import YearContext from "@/components/Context/Year";
import { getEarliestMatch, getLatestMatch, getMatchDate } from "@/utils/data";
import { getRecord } from "@/utils/getRecord";
import { getConferenceDisplayName } from "@/utils/Leagues";
import {
  getConferences,
  getGamesWithPositions,
  getGoalsConceded,
  getGoalsScored,
  getPenalties,
  getPlayedMatches,
  getPoints,
  getSortStrategy,
  getTeamConference,
  getUniqueGoalscorers,
} from "@/utils/table";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { addWeeks, isAfter, isBefore, parseISO } from "date-fns";
import React, { useContext } from "react";
import { useToggle } from "@/components/Toggle/Toggle";
import { GridColumnGroupingModel, GridColumns, isLeaf } from "@mui/x-data-grid";

type AdvancedTableRow = {
  rank: number;
  id: string;
  team: string;
  matches: number;
  points: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  gd: number;
  ppg: number;
  shutouts: number;
  times_shutout: number;

  // goalscorers
  goalscorers: number;
  topScorer: string;
  topScorerGoals: number;

  // losing positions
  gamesLosing: number;
  losingGoals: number;
  losingGoalsConceded: number;
  losingRecord: string;
  losingScorers: number;
  losingTopScorer: string;
  losingTopScorerGoals: number;
  pointsLosingPosition: number;
  pointsDroppedLosingPosition: number;
  ppgLosing: number;

  // winning position
  gamesWinning: number;
  pointsWinningPosition: number;
  pointsDroppedWinningPosition: number;
  ppgWinning: number;
  winningGoals: number;
  winningGoalsConceded: number;
  winningRecord: string;
  winningScorers: number;
  winningTopScorer: string;
  winningTopScorerGoals: number;

  // penalties
  penaltiesTaken: number;
  penaltiesScored: number;
  penaltiesConceded: number;
  penaltiesDifference: number;
};

const GROUP_MODEL: GridColumnGroupingModel = [
  {
    groupId: "Record",
    children: [
      { field: "w" },
      { field: "d" },
      { field: "l" },
      { field: "gf" },
      { field: "ga" },
      { field: "gd" },
      { field: "ppg" },
      { field: "matches" },
      { field: "points" },
      { field: "shutouts" },
      { field: "times_shutout" },
    ],
  },
  {
    groupId: "Goal Scorers",
    children: [
      { field: "goalscorers" },
      { field: "topScorer" },
      { field: "topScorerGoals" },
    ],
  },
  {
    groupId: "losingPosition",
    headerName: "Games w/ Losing Position",
    children: [
      { field: "gamesLosing" },
      { field: "pointsLosingPosition" },
      { field: "pointsDroppedLosingPosition" },
      { field: "ppgLosing" },
      { field: "losingGoals" },
      { field: "losingRecord" },
      { field: "losingScorers" },
      { field: "losingTopScorer" },
      { field: "losingTopScorerGoals" },
    ],
  },
  {
    groupId: "winningPosition",
    headerName: "Games w/ Winning Position",
    children: [
      { field: "gamesWinning" },
      { field: "pointsWinningPosition" },
      { field: "pointsDroppedWinningPosition" },
      { field: "ppgWinning" },
      { field: "winningGoals" },
      { field: "winningRecord" },
      { field: "winningScorers" },
      { field: "winningTopScorer" },
      { field: "winningTopScorerGoals" },
    ],
  },
  {
    groupId: "penalties",
    headerName: "Penalties",
    children: [
      { field: "penaltiesTaken" },
      { field: "penaltiesScored" },
      { field: "penaltiesConceded" },
      { field: "penaltiesDifference" },
    ],
  },
];

function getColumns(groupIds: string[]): GridColumns<AdvancedTableRow> {
  return [
    { field: "rank", width: 50 },
    { field: "team", width: 200 },
    { field: "matches" },
    { field: "points" },
    { field: "w", width: 50 },
    { field: "d", width: 50 },
    { field: "l", width: 50 },
    { field: "gf", width: 50 },
    { field: "ga", width: 50 },
    { field: "gd", width: 50 },
    {
      field: "ppg",
      valueFormatter: (n: { value: string }) => Number(n.value).toFixed(2),
    },
    {
      field: "shutouts",
      headerName: "Shutouts",
      width: 80,
    },
    {
      field: "times_shutout",
      headerName: "Shut Out",
      width: 80,
    },
    {
      field: "goalscorers",
      headerName: "Unique Scorers",
    },
    {
      field: "topScorer",
      headerName: "Top Scorer",
      width: 250,
    },
    {
      field: "topScorerGoals",
      headerName: "Top Scorer",
      width: 100,
    },
    { field: "gamesLosing", headerName: "Games" },
    {
      field: "pointsLosingPosition",
      headerName: "Pts",
      width: 100,
    },
    {
      field: "pointsDroppedLosingPosition",
      headerName: "Pts Dropped",
      width: 100,
    },
    {
      field: "ppgLosing",
      headerName: "PPG",
      valueFormatter: (n: { value: string }) => Number(n.value).toFixed(2),
    },
    {
      field: "losingGoals",
      headerName: "GF",
    },
    {
      field: "losingRecord",
      headerName: "Record",
    },
    {
      field: "losingScorers",
      headerName: "Scorers",
    },
    {
      field: "losingTopScorer",
      headerName: "Top Scorer",
      width: 250,
    },
    {
      field: "losingTopScorerGoals",
      headerName: "Top Scorer",
      width: 100,
    },
    {
      field: "gamesWinning",
      headerName: "Games",
    },
    {
      field: "pointsWinningPosition",
      headerName: "Pts",
      width: 100,
    },
    {
      field: "pointsDroppedWinningPosition",
      headerName: "Pts Dropped",
      width: 100,
    },
    {
      field: "ppgWinning",
      headerName: "PPG",
      valueFormatter: (n: { value: string }) => Number(n.value).toFixed(2),
    },
    {
      field: "winningGoals",
      headerName: "GF",
    },
    {
      field: "winningRecord",
      headerName: "Record",
    },
    {
      field: "winningScorers",
      headerName: "Unique Scorers",
    },
    {
      field: "winningTopScorer",
      headerName: "Top Scorer",
      width: 250,
    },
    {
      field: "winningTopScorerGoals",
      headerName: "Top Scorer",
      width: 100,
    },
    {
      field: "penaltiesTaken",
      headerName: "Taken",
    },
    {
      field: "penaltiesConceded",
      headerName: "Conceded",
    },
    {
      field: "penaltiesDifference",
      headerName: "Diff",
    },
    {
      field: "penaltiesScored",
      headerName: "Scored",
    },
    {
      field: "team",
    },
  ].filter((column) => {
    if (groupIds.length === 0) {
      return true;
    }
    const inGroup = GROUP_MODEL.find((g) =>
      g.children.some((c) => isLeaf(c) && c.field === column.field)
    );
    return (inGroup && groupIds.includes(inGroup.groupId)) || !inGroup;
  });
}

export default function AdvancedTablePage() {
  const { value, renderComponent: renderHomeAway } = useHomeAway();
  const { value: groups, renderComponent: renderGroups } = useToggle<string[]>(
    GROUP_MODEL.map((g) => ({
      label: g.groupId.replace(/([A-Z])/, " $1"),
      value: g.groupId,
    })),
    [],
    {
      exclusive: false,
    }
  );
  return (
    <BaseDataPage<Results.ParsedDataGoals>
      renderControls={() => (
        <>
          <Box>{renderHomeAway()}</Box>
          <Box>{renderGroups()}</Box>
        </>
      )}
      getEndpoint={(year, league) => `/api/goals/${league}?year=${year}`}
      pageTitle="Advanced Table"
      renderComponent={(data) => {
        return (
          <AdvancedTableWrapper data={data} homeAway={value} groups={groups} />
        );
      }}
    />
  );
}

export function AdvancedTableWrapper({
  data,
  homeAway,
  groups = [],
}: {
  data: Results.ParsedDataGoals;
  homeAway: Options;
  groups: string[];
}): React.ReactElement {
  const league = useContext(LeagueContext);
  const year = useContext(YearContext);
  const conferences = getConferences(league, year);
  const {
    from,
    to,
    renderComponent: renderDatePicker,
  } = useDateFilter(
    addWeeks(getMatchDate(getEarliestMatch(data)), -1),
    addWeeks(getMatchDate(getLatestMatch(data)), 1)
  );
  return (
    <Box>
      <Box my={2}>{renderDatePicker()}</Box>
      {conferences.map((conference, idx) => {
        return (
          <Box key={idx}>
            <Typography variant="h5">
              {getConferenceDisplayName(conference)}
            </Typography>
            <AdvancedTable
              groups={groups}
              from={from}
              to={to}
              homeAway={homeAway}
              conference={conference}
              data={data}
              league={league}
              year={year}
            />
          </Box>
        );
      })}
    </Box>
  );
}

export function AdvancedTable({
  groups,
  conference,
  data,
  league,
  year,
  homeAway,
  from,
  to,
}: {
  groups: string[];
  conference: string;
  data: Results.ParsedDataGoals;
  league: Results.Leagues;
  year: number;
  homeAway: Options;
  from: Date;
  to: Date;
}): React.ReactElement {
  const filterFn =
    homeAway === "home"
      ? (match: Results.Match) =>
          match.home &&
          isAfter(parseISO(match.rawDate), from) &&
          isBefore(parseISO(match.rawDate), to)
      : homeAway === "away"
      ? (match: Results.Match) =>
          !match.home &&
          isAfter(parseISO(match.rawDate), from) &&
          isBefore(parseISO(match.rawDate), to)
      : (match: Results.Match) =>
          isAfter(parseISO(match.rawDate), from) &&
          isBefore(parseISO(match.rawDate), to);
  const rows: Omit<AdvancedTableRow, "rank">[] = Object.entries(data.teams)
    .filter(([team]) => {
      return conference === "all"
        ? true
        : getTeamConference(team, league, year) === conference;
    })
    .map(([team, matches]) => {
      const playedMatches = getPlayedMatches(matches.filter(filterFn));
      const losingMatches = getGamesWithPositions(matches.filter(filterFn), [
        "L",
      ]);
      const winningMatches = getGamesWithPositions(matches.filter(filterFn), [
        "W",
      ]);
      const points = getPoints(matches.filter(filterFn));
      const uniqueScorers = getUniqueGoalscorers(matches.filter(filterFn)).sort(
        (a, b) => (a.goals > b.goals ? -1 : b.goals > a.goals ? 1 : 0)
      );
      const winningScorers = getUniqueGoalscorers(
        winningMatches.filter(filterFn)
      ).sort((a, b) => (a.goals > b.goals ? -1 : b.goals > a.goals ? 1 : 0));
      const losingScorers = getUniqueGoalscorers(
        losingMatches.filter(filterFn)
      ).sort((a, b) => (a.goals > b.goals ? -1 : b.goals > a.goals ? 1 : 0));
      const penalties = getPenalties(matches);
      return {
        id: team,
        team,
        matches: playedMatches.length,
        points,
        gf: getGoalsScored(playedMatches),
        ga: getGoalsConceded(playedMatches),
        gd: getGoalsScored(playedMatches) - getGoalsConceded(playedMatches),
        w: playedMatches.filter((m) => m.result === "W").length,
        d: playedMatches.filter((m) => m.result === "D").length,
        l: playedMatches.filter((m) => m.result === "L").length,
        shutouts: playedMatches.filter((m) => m.goalsConceded === 0).length,
        times_shutout: playedMatches.filter((m) => m.goalsScored === 0).length,
        gamesWinning: winningMatches.length,
        gamesLosing: losingMatches.length,
        goalscorers: uniqueScorers.length,
        losingGoals: getGoalsScored(losingMatches),
        losingGoalsConceded: getGoalsConceded(losingMatches),
        losingRecord: getRecord(losingMatches).join("-"),
        losingScorers: losingScorers.length,
        losingTopScorer: losingScorers[0]?.name,
        losingTopScorerGoals: losingScorers[0]?.goals,
        pointsLosingPosition: getPoints(losingMatches),
        pointsDroppedLosingPosition:
          losingMatches.length * 3 - getPoints(losingMatches),
        pointsWinningPosition: getPoints(winningMatches),
        pointsDroppedWinningPosition:
          winningMatches.length * 3 - getPoints(winningMatches),
        ppg: points / playedMatches.length,
        ppgLosing: getPoints(losingMatches) / losingMatches.length,
        ppgWinning: getPoints(winningMatches) / winningMatches.length,
        topScorer: uniqueScorers[0]?.name,
        topScorerGoals: uniqueScorers[0]?.goals,
        winningGoals: getGoalsScored(winningMatches),
        winningGoalsConceded: getGoalsConceded(winningMatches),
        winningRecord: getRecord(winningMatches).join("-"),
        winningScorers: winningScorers.length,
        winningTopScorer: winningScorers[0]?.name,
        winningTopScorerGoals: winningScorers[0]?.goals,
        penaltiesTaken: penalties.taken,
        penaltiesConceded: penalties.opponentTaken,
        penaltiesDifference: penalties.taken - penalties.opponentTaken,
        penaltiesScored: penalties.scored,
      };
    });
  return (
    <Table<AdvancedTableRow>
      gridProps={{
        experimentalFeatures: { columnGrouping: true },
        columnGroupingModel: GROUP_MODEL,
      }}
      data={rows
        .sort(getSortStrategy(league))
        .reverse()
        .map((row, idx) => ({ ...row, rank: idx + 1 }))}
      columns={() => {
        return getColumns(groups);
      }}
    />
  );
}
