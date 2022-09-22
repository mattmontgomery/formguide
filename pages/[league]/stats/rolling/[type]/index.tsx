import { useRouter } from "next/router";

import BaseRollingPage from "@/components/BaseRollingPage";
import { getArrayAverage } from "@/utils/array";
import { Options } from "@/components/Toggle/HomeAwayToggle";
import {
  getStats,
  getStatsMax,
  getStatsName,
  ValidStats,
} from "@/components/Stats";
import { usePeriodLength } from "@/components/Toggle/PeriodLength";
import { Box } from "@mui/material";
import {
  OpponentToggleOptions,
  useOpponentToggle,
} from "@/components/Toggle/OpponentToggle";

export default function Chart(): React.ReactElement {
  const router = useRouter();
  const { type = "shots" } = router.query;
  const statType: ValidStats = String(type) as ValidStats;
  const max = getStatsMax(statType);
  const { value: periodLength, renderComponent: renderPeriodLength } =
    usePeriodLength();
  const { value: showOpponent, renderComponent: renderOpponentToggle } =
    useOpponentToggle();
  return (
    <BaseRollingPage
      renderControls={() => (
        <Box>
          {renderPeriodLength()}
          {renderOpponentToggle()}
        </Box>
      )}
      isWide
      getEndpoint={(year, league) => `/api/stats/${league}?year=${year}`}
      isStaticHeight={false}
      pageTitle={`Rolling ${getStatsName(statType)} (%s game rolling)`}
      parser={(teams, periodLength, homeAway) =>
        parseChartData({
          teams,
          periodLength,
          homeAway,
          statType,
          showOpponent,
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
  statType,
  showOpponent,
}: {
  teams: Results.ParsedData["teams"];
  periodLength: number;
  homeAway: Options;
  statType: ValidStats;
  showOpponent: OpponentToggleOptions;
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
            const results = resultSet.map(
              (match) =>
                getStats(match, statType)[
                  showOpponent === "opponent" ? 1 : 0
                ] ?? 0
            );
            return {
              value:
                results.length !== periodLength
                  ? null
                  : getArrayAverage(
                      results.filter((m) => typeof m === "number") as number[]
                    ),
              matches: resultSet,
            };
          }),
      ];
    });
}
