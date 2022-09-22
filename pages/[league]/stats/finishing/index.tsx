import BaseGridPage from "@/components/BaseGridPage";
import MatchCell from "@/components/MatchCell";
import React from "react";

import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import { sortByDate } from "@/utils/sort";
import { getStats, ValidStats } from "@/components/Stats";
import { isComplete } from "@/utils/match";
import {
  useOpponentToggle,
  OpponentToggleOptions,
} from "@/components/Toggle/OpponentToggle";

export default function FinishingStatsByMatch(): React.ReactElement {
  const router = useRouter();
  const type = String(router.query.type ?? "shots") as ValidStats;
  const { renderComponent, value } = useOpponentToggle();
  return (
    <BaseGridPage<FormGuideAPI.Data.StatsEndpoint>
      renderControls={renderComponent}
      pageTitle={`Statistic view: Finishing Rate`}
      dataParser={(data) => dataParser(data, type, value)}
      getEndpoint={(year, league) => `/api/stats/${league}?year=${year}`}
      gridClass={styles.gridExtraWide}
    ></BaseGridPage>
  );
}

function dataParser(
  data: FormGuideAPI.Data.StatsEndpoint["teams"],
  type: ValidStats,
  opponent: OpponentToggleOptions
): Render.RenderReadyData {
  return Object.keys(data).map((team) => [
    team,
    ...data[team].sort(sortByDate).map((match, idx) => (
      <MatchCell
        match={match}
        key={idx}
        renderValue={() => {
          if (
            (!match.stats || Object.keys(match.stats).length === 0) &&
            isComplete(match)
          ) {
            console.info("Missing", match.fixtureId);
            return "X";
          }
          const shots = getStats(match, "shots")[
            opponent === "opponent" ? 1 : 0
          ];
          const goals =
            opponent !== "opponent" ? match.goalsScored : match.goalsConceded;
          return shots && shots > 0
            ? Number((goals ?? 0) / Number(shots)).toFixed(2)
            : "-";
        }}
      />
    )),
  ]);
}
