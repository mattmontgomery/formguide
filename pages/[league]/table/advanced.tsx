import BaseDataPage from "@/components/BaseDataPage";
import { useDateFilter } from "@/components/DateFilter";
import { Options, useHomeAway } from "@/components/Toggle/HomeAwayToggle";
import LeagueContext from "@/components/LeagueContext";
import Table from "@/components/Table";
import YearContext from "@/components/YearContext";
import { getEarliestMatch, getLatestMatch, getMatchDate } from "@/utils/data";
import { getRecord } from "@/utils/getRecord";
import { getConferenceDisplayName } from "@/utils/Leagues";
import {
  getConferences,
  getGamesWithPositions,
  getGoalsConceded,
  getGoalsScored,
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

type AdvancedTableRow = {
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
};

export default function AdvancedTablePage() {
  const { value, renderComponent: renderHomeAway } = useHomeAway();
  return (
    <BaseDataPage<Results.ParsedDataGoals>
      controls={<Box>{renderHomeAway()}</Box>}
      getEndpoint={(year, league) => `/api/goals/${league}?year=${year}`}
      pageTitle="Advanced Table"
      renderComponent={(data) => {
        return <AdvancedTableWrapper data={data} homeAway={value} />;
      }}
    />
  );
}

export function AdvancedTableWrapper({
  data,
  homeAway,
}: {
  data: Results.ParsedDataGoals;
  homeAway: Options;
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
  conference,
  data,
  league,
  year,
  homeAway,
  from,
  to,
}: {
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
  return (
    <Table<AdvancedTableRow>
      gridProps={{
        experimentalFeatures: { columnGrouping: true },
        columnGroupingModel: [
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
        ],
      }}
      data={Object.entries(data.teams)
        .filter(([team]) => {
          return conference === "all"
            ? true
            : getTeamConference(team, league, year) === conference;
        })
        .map(([team, matches]): AdvancedTableRow => {
          const playedMatches = getPlayedMatches(matches.filter(filterFn));
          const losingMatches = getGamesWithPositions(
            matches.filter(filterFn),
            ["L"]
          );
          const winningMatches = getGamesWithPositions(
            matches.filter(filterFn),
            ["W"]
          );
          const points = getPoints(matches.filter(filterFn));
          const uniqueScorers = getUniqueGoalscorers(
            matches.filter(filterFn)
          ).sort((a, b) =>
            a.goals > b.goals ? -1 : b.goals > a.goals ? 1 : 0
          );
          const winningScorers = getUniqueGoalscorers(
            winningMatches.filter(filterFn)
          ).sort((a, b) =>
            a.goals > b.goals ? -1 : b.goals > a.goals ? 1 : 0
          );
          const losingScorers = getUniqueGoalscorers(
            losingMatches.filter(filterFn)
          ).sort((a, b) =>
            a.goals > b.goals ? -1 : b.goals > a.goals ? 1 : 0
          );
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
          };
        })
        .sort(getSortStrategy(league))
        .reverse()}
      columns={() => {
        return [
          { field: "team", width: 200 },
          { field: "matches" },
          { field: "points" },
          { field: "w", width: 50 },
          { field: "d", width: 50 },
          { field: "l", width: 50 },
          { field: "gf", width: 50 },
          { field: "ga", width: 50 },
          { field: "gd", width: 50 },
          { field: "ppg", valueFormatter: (n) => Number(n.value).toFixed(2) },
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
            valueFormatter: (n) => Number(n.value).toFixed(2),
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
            valueFormatter: (n) => Number(n.value).toFixed(2),
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
        ];
      }}
    />
  );
}
