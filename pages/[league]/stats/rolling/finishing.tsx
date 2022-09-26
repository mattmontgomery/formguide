import BaseRollingPage from "@/components/BaseRollingPage";
import { getArraySum } from "@/utils/array";
import { Options } from "@/components/Toggle/HomeAwayToggle";
import { getStats, ValidStats } from "@/components/Stats";
import { usePeriodLength } from "@/components/Toggle/PeriodLength";
import { Box } from "@mui/material";
import {
  OpponentToggleOptions,
  useOpponentToggle,
} from "@/components/Toggle/OpponentToggle";
import { useToggle } from "@/components/Toggle/Toggle";

export default function Chart(): React.ReactElement {
  const { value: periodLength, renderComponent: renderPeriodLength } =
    usePeriodLength();
  const { value: showOpponent, renderComponent: renderOpponentToggle } =
    useOpponentToggle();
  const { value: stat, renderComponent: renderStatsToggle } =
    useToggle<ValidStats>(
      [
        { value: "shots", label: "Shots" },
        { value: "shots-on-goal", label: "SOT" },
      ],
      "shots"
    );
  const max = stat === "shots" ? 0.3 : 0.8;
  return (
    <BaseRollingPage
      renderControls={() => (
        <>
          <Box>{renderPeriodLength()}</Box>
          <Box>{renderOpponentToggle()}</Box>
          <Box>{renderStatsToggle()}</Box>
        </>
      )}
      isWide
      getEndpoint={(year, league) => `/api/stats/${league}?year=${year}`}
      isStaticHeight={false}
      numberFormat={(n) => {
        return Number(n).toPrecision(2);
      }}
      pageTitle={`Rolling finishing (%s game rolling)`}
      parser={(teams, periodLength, homeAway) =>
        parseChartData({
          teams,
          periodLength,
          homeAway,
          showOpponent,
          stat,
        })
      }
      periodLength={periodLength}
      heightCalc={(value) => {
        return `${value ? (value / max) * 100 : 0}%`;
      }}
    />
  );
}

function parseChartData({
  teams,
  periodLength = 5,
  homeAway = "all",
  showOpponent,
  stat = "shots",
}: {
  teams: Results.ParsedData["teams"];
  periodLength: number;
  homeAway: Options;
  showOpponent: OpponentToggleOptions;
  stat?: ValidStats;
}): ReturnType<Render.RollingParser> {
  return Object.keys(teams)
    .sort()
    .map((team) => {
      return [
        team,
        ...teams[team]
          .slice(0, teams[team].length - periodLength)
          .map((_, idx) => {
            const resultSet = teams[team]
              .sort((a, b) => {
                return new Date(a.date) > new Date(b.date) ? 1 : -1;
              })
              .filter((m) =>
                homeAway === "all" ? true : m.home === (homeAway === "home")
              )
              .slice(idx, idx + periodLength)
              .filter((match) => match.result !== null);
            const resultsShots = resultSet.map(
              (match) =>
                getStats(match, stat)[showOpponent === "opponent" ? 1 : 0] ?? 0
            );
            const resultsGoals = resultSet.map((match) =>
              showOpponent === "opponent"
                ? match.goalsConceded
                : match.goalsScored ?? 0
            );
            return {
              value:
                resultsShots.length !== periodLength
                  ? null
                  : getArraySum(
                      resultsGoals.filter(
                        (n) => typeof n === "number" && Number(n)
                      ) as number[]
                    ) /
                    getArraySum(
                      resultsShots.filter(
                        (n) => typeof n === "number" && Number(n)
                      ) as number[]
                    ),
              matches: resultSet,
            };
          }),
      ];
    });
}
