import BaseGridPage from "@/components/Grid/Base";
import React from "react";

import styles from "@/styles/Home.module.css";

export default function EarliestSubstitute(): React.ReactElement {
  return (
    <BaseGridPage<Results.MatchWithGoalData>
      pageTitle={`Earliest Substitute`}
      getEndpoint={(year, league) => `/api/goals/${league}?year=${year}`}
      getValue={(match) =>
        match.goalsData
          ? match.goalsData.substitutions.find(
              (t) => t.team.name === match.team
            )?.time.elapsed ?? "-"
          : "-"
      }
      gridClass={styles.gridExtraWide}
    />
  );
}
