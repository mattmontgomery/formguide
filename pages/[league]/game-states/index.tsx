import BaseGridPage from "@/components/BaseGridPage";
import MatchCell from "@/components/MatchCell";
import React, { useState } from "react";

import styles from "@/styles/Home.module.css";
import { FormControlLabel, Switch } from "@mui/material";

export default function GameStates(): React.ReactElement {
  const [show, setShow] = useState<"worst" | "best">("best");
  return (
    <BaseGridPage<Results.ParsedDataGoals>
      pageTitle={`${show} game states`}
      dataParser={(data) => dataParser(data, show)}
      getEndpoint={(year, league) => `/api/goals/${league}?year=${year}`}
      gridClass={styles.gridExtraWide}
    >
      <FormControlLabel
        checked={show === "best"}
        label="Off: Worst, On: Best"
        control={
          <Switch
            onChange={(ev) =>
              setShow(ev.currentTarget.checked ? "best" : "worst")
            }
          />
        }
      ></FormControlLabel>
    </BaseGridPage>
  );
}

function dataParser(
  data: Results.ParsedDataGoals["teams"],
  show: "best" | "worst" = "best"
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
            const gameStates = (match.goalsData?.goals ?? []).reduce(
              (previousValue: number[][], currentValue) => {
                const last: number[] = [...previousValue].reverse()?.[0] ?? [
                  0, 0,
                ];
                const isFirst = match.team === currentValue.team.name;
                const next: [number, number] = [
                  isFirst ? last[0] + 1 : last[0],
                  isFirst ? last[1] : last[1] + 1,
                ];
                return [...previousValue, next];
              },
              [[0, 0]]
            );
            return gameStates
              .sort((a, b) => {
                const [aTeam, aOpp] = a;
                const [bTeam, bOpp] = b;
                const aDiff = aTeam - aOpp;
                const bDiff = bTeam - bOpp;
                return aDiff > bDiff
                  ? show === "best"
                    ? 1
                    : -1
                  : aDiff < bDiff
                  ? show === "best"
                    ? -1
                    : 1
                  : 0;
              })
              .reverse()?.[0]
              ?.join("-");
          }}
        />
      )),
  ]);
}
