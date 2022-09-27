import BaseGridPage from "@/components/Grid/Base";
import React from "react";

import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import {
  compareStats,
  getStats,
  getStatsName,
  ValidStats,
} from "@/components/Stats";

export default function StatsComparisons(): React.ReactElement {
  const router = useRouter();
  const type = String(router.query.type ?? "shots") as ValidStats;
  return (
    <BaseGridPage<Results.MatchWithStatsData>
      pageTitle={`Statistic view: ${getStatsName(type)} compared to opponent`}
      getValue={(match) => compareStats(getStats(match, type)) ?? "-"}
      getEndpoint={(year, league) => `/api/stats/${league}?year=${year}`}
      gridClass={styles.gridExtraWide}
    />
  );
}
