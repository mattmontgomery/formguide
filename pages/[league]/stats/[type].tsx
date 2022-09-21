import BaseGridPage from "@/components/BaseGridPage";
import MatchCell from "@/components/MatchCell";
import React from "react";

import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import { sortByDate } from "@/utils/sort";

type ValidStats = "shots";

export default function LostLeads(): React.ReactElement {
  const router = useRouter();
  const type = String(router.query.type ?? "shots") as ValidStats;
  return (
    <BaseGridPage<FormGuideAPI.Data.StatsEndpoint>
      pageTitle={`Statistic view: ${type}`}
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
          return compareStats(getStats(match, getStatsName(type)), type);
        }}
      />
    )),
  ]);
}

function getStats(
  match: Results.MatchWithStatsData,
  stat: string
): [number | string, number | string] {
  return [match.stats[match.team]?.[stat], match.stats[match.opponent]?.[stat]];
}

function getStatsName(stat: ValidStats): string {
  return {
    shots: "Total Shots",
  }[stat];
}

function compareStats(
  stats: [number | string, number | string],
  type: ValidStats
) {
  return typeof stats[0] === "number" && typeof stats[1] === "number"
    ? stats[0] - stats[1]
    : "???";
}
