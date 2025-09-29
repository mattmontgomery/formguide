import BaseGridPage from "@/components/Grid/Base";
import React from "react";

import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import { getFirstGoalConceded, getFirstGoalScored } from "@/utils/getGoals";

export default function LostLeads(): React.ReactElement {
  const router = useRouter();
  const type = String(router.query.type ?? "gf") as "gf" | "ga";
  return (
    <BaseGridPage<Results.MatchWithGoalData>
      pageTitle={`First goal ${type === "gf" ? "scored" : "conceded"}`}
      getValue={(match) => {
        const goal =
          type === "gf"
            ? getFirstGoalScored(match)
            : getFirstGoalConceded(match);
        return goal?.time.elapsed ?? "-";
      }}
      getEndpoint={(year, league) => `/api/goals/${league}?year=${year}`}
      gridClass={styles.gridExtraWide}
    />
  );
}
