import React from "react";

import { useOpponentToggle } from "@/components/Toggle/OpponentToggle";
import BaseRollingPageV2 from "@/components/BaseRollingPageV2";

export default function RollingEarliestSubstitute(): React.ReactElement {
  const { value: showOpponent, renderComponent: renderOpponentToggle } =
    useOpponentToggle();
  return (
    <BaseRollingPageV2<Results.MatchWithGoalData>
      max={90}
      isStaticHeight={false}
      renderControls={() => <>{renderOpponentToggle()}</>}
      pageTitle={`Earliest Substitute — Rolling %s-game`}
      getValue={(match) =>
        match.goalsData?.substitutions.find(
          (e) =>
            e.team.name ===
            (showOpponent === "opponent" ? match.opponent : match.team)
        )?.time.elapsed
      }
      getEndpoint={(year, league) => `/api/goals/${league}?year=${year}`}
    ></BaseRollingPageV2>
  );
}
