import BaseGridPage from "@/components/Grid/Base";
import React from "react";

import styles from "@/styles/Home.module.css";
import { getExtremeGameState } from "@/utils/gameStates";

export default function LostLeads(): React.ReactElement {
  return (
    <BaseGridPage<Results.MatchWithGoalData>
      pageTitle={`Positions Leading to Losses`}
      getEndpoint={(year, league) => `/api/goals/${league}?year=${year}`}
      getShaded={(match) => {
        if (match.result === "W") {
          return true;
        }
        const extreme = getExtremeGameState(match, "best");
        return extreme ? extreme[0] <= extreme[1] : true;
      }}
      gridClass={styles.gridExtraWide}
      getValue={(match) => {
        if (match.result === "W") {
          return "-"; // no lost lead in place
        }
        const extreme = getExtremeGameState(match, "best");
        return extreme && extreme[0] > extreme[1] ? extreme.join("-") : "-";
      }}
    ></BaseGridPage>
  );
}
