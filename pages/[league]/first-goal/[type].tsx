import BaseGridPage from "@/components/BaseGridPage";
import MatchCell from "@/components/MatchCell";
import React from "react";

import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import { getFirstGoalConceded, getFirstGoalScored } from "@/utils/getGoals";

export default function LostLeads(): React.ReactElement {
  const router = useRouter();
  const type = String(router.query.type ?? "gf") as "gf" | "ga";
  return (
    <BaseGridPage<Results.ParsedDataGoals>
      pageTitle={`First goal ${type === "gf" ? "scored" : "conceded"}`}
      dataParser={(data) => dataParser(data, type)}
      getEndpoint={(year, league) => `/api/goals/${league}?year=${year}`}
      gridClass={styles.gridExtraWide}
    ></BaseGridPage>
  );
}

function dataParser(
  data: Results.ParsedDataGoals["teams"],
  type: "gf" | "ga" = "gf"
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
          renderValue={() => {
            if (!match.goalsData) {
              console.log("Missing", match.fixtureId);
              return "X";
            }
            const goal =
              type === "gf"
                ? getFirstGoalScored(match)
                : getFirstGoalConceded(match);
            return goal?.time.elapsed ?? "-";
          }}
        />
      )),
  ]);
}
