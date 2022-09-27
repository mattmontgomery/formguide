import BaseGridPage from "@/components/Grid/Base";
import React from "react";

import styles from "@/styles/Home.module.css";
import { getStats } from "@/components/Stats";
import { useOpponentToggle } from "@/components/Toggle/OpponentToggle";

export default function FinishingStatsByMatch(): React.ReactElement {
  const { renderComponent, value: opponent } = useOpponentToggle();
  return (
    <BaseGridPage<Results.MatchWithStatsData>
      renderControls={renderComponent}
      pageTitle={`Statistic view: Finishing Rate`}
      getEndpoint={(year, league) => `/api/stats/${league}?year=${year}`}
      getValue={(match) => {
        const shots = getStats(match, "shots")[opponent === "opponent" ? 1 : 0];
        const goals =
          opponent !== "opponent" ? match.goalsScored : match.goalsConceded;
        return shots && shots > 0
          ? Number((goals ?? 0) / Number(shots)).toFixed(2)
          : "-";
      }}
      gridClass={styles.gridExtraWide}
    ></BaseGridPage>
  );
}
