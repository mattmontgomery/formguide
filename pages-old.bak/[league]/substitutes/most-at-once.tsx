import BaseGridPage from "@/components/Grid/Base";
import React from "react";

import styles from "@/styles/Home.module.css";

function getMaximumSubstitutionsInOneMinuteForTeam(
  match: Results.MatchWithGoalData,
  team: string,
) {
  const substitutions = match.goalsData?.substitutions.filter(
    (e) => e.team.name === team,
  );
  if (!substitutions) {
    return 0;
  }
  const times = substitutions.map((e) => e.time.elapsed);
  let max = 0;
  for (let i = 0; i < times.length; i++) {
    let count = 1;
    for (let j = i + 1; j < times.length; j++) {
      if (times[j] - times[i] <= 1) {
        count++;
      }
    }
    max = Math.max(max, count);
  }
  return max;
}

export default function EarliestSubstitute(): React.ReactElement {
  return (
    <BaseGridPage<Results.MatchWithGoalData>
      pageTitle={`Most Substitutitions at Once`}
      getEndpoint={(year, league) => `/api/goals/${league}?year=${year}`}
      getValue={(match) =>
        getMaximumSubstitutionsInOneMinuteForTeam(match, match.team) ?? "-"
      }
      gridClass={styles.gridExtraWide}
    />
  );
}
