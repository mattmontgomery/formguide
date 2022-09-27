import BaseRollingPage from "@/components/Rolling/Base";
import { getArraySum } from "@/utils/array";
import { getStats, ValidStats } from "@/components/Stats";
import { Box } from "@mui/material";
import { useOpponentToggle } from "@/components/Toggle/OpponentToggle";
import { useToggle } from "@/components/Toggle/Toggle";

export default function Chart(): React.ReactElement {
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
  const max = stat === "shots" ? 0.4 : 0.8;
  return (
    <BaseRollingPage<Results.MatchWithStatsData, [number, number]>
      renderControls={() => (
        <>
          <Box>{renderOpponentToggle()}</Box>
          <Box>{renderStatsToggle()}</Box>
        </>
      )}
      isWide
      getEndpoint={(year, league) => `/api/stats/${league}?year=${year}`}
      numberFormat={(n) => {
        if (n === null) {
          return "";
        }
        return Number(n).toPrecision(2);
      }}
      pageTitle={`Rolling finishing (%s game rolling)`}
      getValue={(match) => {
        const resultShots =
          getStats(match, stat)[showOpponent === "opponent" ? 1 : 0] ?? 0;
        const resultGoals =
          showOpponent === "opponent"
            ? match.goalsConceded ?? 0
            : match.goalsScored ?? 0;
        return [Number(resultGoals), Number(resultShots)];
      }}
      getSummaryValue={(value) => {
        return (
          getArraySum(value.map((v) => v[0])) /
          getArraySum(value.map((v) => v[1]))
        );
      }}
      getBoxHeight={(value) => {
        return `${value ? (value / max) * 100 : 0}%`;
      }}
    />
  );
}
