import BaseGridPage from "@/components/Grid/Base";
import React from "react";

import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import { getStats, getStatsName, ValidStats } from "@/components/Stats";
import { useOpponentToggle } from "@/components/Toggle/OpponentToggle";

export default function StatsByMatch(): React.ReactElement {
  const router = useRouter();
  const type = String(router.query.type ?? "shots") as ValidStats;
  const { renderComponent, value: opponent } = useOpponentToggle();
  return (
    <BaseGridPage<Results.MatchWithStatsData>
      getEndpoint={(year, league) => `/api/stats/${league}?year=${year}`}
      getValue={(match) =>
        getStats(match, type)[opponent === "opponent" ? 1 : 0] ?? "-"
      }
      gridClass={styles.gridExtraWide}
      pageTitle={`Statistic view: ${getStatsName(type)}`}
      renderControls={renderComponent}
    ></BaseGridPage>
  );
}
