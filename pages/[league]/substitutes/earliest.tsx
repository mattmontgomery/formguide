import BaseGridPage from "@/components/BaseGridPage";
import MatchCell from "@/components/MatchCell";
import React from "react";

import styles from "@/styles/Home.module.css";

export default function EarliestSubstitute(): React.ReactElement {
  return (
    <BaseGridPage<Results.ParsedDataGoals>
      pageTitle={`Earliest Substitute`}
      dataParser={(data) => dataParser(data)}
      getEndpoint={(year, league) => `/api/goals/${league}?year=${year}`}
      gridClass={styles.gridExtraWide}
    ></BaseGridPage>
  );
}

function dataParser(
  data: Results.ParsedDataGoals["teams"]
): Render.RenderReadyData {
  return Object.keys(data).map((team) => [
    team,
    ...data[team]
      .sort((a, b) => {
        return new Date(a.date) > new Date(b.date) ? 1 : -1;
      })
      .map((match, idx) => (
        <MatchCell
          match={match}
          key={idx}
          shadeEmpty
          renderValue={() => {
            if (!match.goalsData) {
              console.error("Missing", match.fixtureId);
              return "X";
            }
            return match.goalsData.substitutions.find(
              (t) => t.team.name === team
            )?.time.elapsed;
          }}
        />
      )),
  ]);
}
