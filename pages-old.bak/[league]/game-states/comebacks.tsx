import BaseGridPage from "@/components/Grid/Base";
import React from "react";

import styles from "@/styles/Home.module.css";
import { getExtremeGameState } from "@/utils/gameStates";

export default function Comebacks(): React.ReactElement {
  return (
    <BaseGridPage<Results.MatchWithGoalData>
      pageTitle={`Positions Leading to Comebacks`}
      getEndpoint={(year, league) => `/api/goals/${league}?year=${year}`}
      getShaded={(match) => {
        if (match.result === "L") {
          return true;
        }
        const extreme = getExtremeGameState(match, "worst");
        return extreme ? extreme[0] >= extreme[1] : true;
      }}
      gridClass={styles.gridExtraWide}
      getValue={(match) => {
        if (!match.goalsData) {
          console.error("Missing", match.fixtureId);
          return "X";
        }
        if (match.result === "L") {
          return "-"; // no comeback in place
        }
        const extreme = getExtremeGameState(match, "worst");
        return extreme && extreme[0] < extreme[1] ? extreme.join("-") : "-";
      }}
    ></BaseGridPage>
  );
}
