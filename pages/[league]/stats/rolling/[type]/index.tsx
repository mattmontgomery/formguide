import { useRouter } from "next/router";

import BaseRollingPage from "@/components/Rolling/Base";
import {
  getStats,
  getStatsMax,
  getStatsName,
  ValidStats,
} from "@/components/Stats";
import { Box } from "@mui/material";
import { useOpponentToggle } from "@/components/Toggle/OpponentToggle";

export default function Chart(): React.ReactElement {
  const router = useRouter();
  const { type = "shots" } = router.query;
  const statType: ValidStats = String(type) as ValidStats;
  const max = getStatsMax(statType);
  const { value: showOpponent, renderComponent: renderOpponentToggle } =
    useOpponentToggle();
  return (
    <BaseRollingPage<Results.MatchWithStatsData>
      renderControls={() => <Box>{renderOpponentToggle()}</Box>}
      isWide
      getEndpoint={(year, league) => `/api/stats/${league}?year=${year}`}
      pageTitle={`Rolling ${getStatsName(statType)} (%s game rolling)`}
      getBoxHeight={(value) => {
        return `${value ? (value / max) * 100 : 0}%`;
      }}
      getValue={(match) => {
        return Number(
          getStats(match, statType)[showOpponent === "opponent" ? 1 : 0] ?? 0,
        );
      }}
    />
  );
}
