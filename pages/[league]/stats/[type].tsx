import BaseGridPage from "@/components/BaseGridPage";
import MatchCell from "@/components/MatchCell";
import React from "react";

import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import { sortByDate } from "@/utils/sort";
import { getStats, getStatsName, ValidStats } from "@/components/Stats";

export default function StatsByMatch(): React.ReactElement {
  const router = useRouter();
  const type = String(router.query.type ?? "shots") as ValidStats;
  return (
    <BaseGridPage<FormGuideAPI.Data.StatsEndpoint>
      pageTitle={`Statistic view: ${getStatsName(type)}`}
      dataParser={(data) => dataParser(data, type)}
      getEndpoint={(year, league) => `/api/stats/${league}?year=${year}`}
      gridClass={styles.gridExtraWide}
    ></BaseGridPage>
  );
}

function dataParser(
  data: FormGuideAPI.Data.StatsEndpoint["teams"],
  type: ValidStats
): Render.RenderReadyData {
  return Object.keys(data).map((team) => [
    team,
    ...data[team].sort(sortByDate).map((match, idx) => (
      <MatchCell
        match={match}
        key={idx}
        renderValue={() => {
          if (!match.stats || Object.keys(match.stats).length === 0) {
            console.info("Missing", match.fixtureId);
            return "X";
          }
          return getStats(match, type)[0] ?? "-";
        }}
      />
    )),
  ]);
}
