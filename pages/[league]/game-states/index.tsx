import BaseGridPage from "@/components/BaseGridPage";
import MatchCell from "@/components/MatchCell";
import React from "react";

import styles from "@/styles/Home.module.css";

export default function GameStates(): React.ReactElement {
  return (
    <BaseGridPage<Results.ParsedDataGoals>
      pageTitle="Worst Game States"
      dataParser={(data) => dataParser(data, "worst")}
      getEndpoint={(year, league) => `/api/goals/${league}?year=${year}`}
      gridClass={styles.gridExtraWide}
    ></BaseGridPage>
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
                console.log({ last, next, isFirst });
                return [...previousValue, next];
              },
              [[0, 0]]
            );

            if (gameStates.length > 1)
              console.log({ gameStates: [...gameStates], g: match.goalsData });

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
            // const points = getArrayAverage(
            //   teamPoints[match.opponent]
            //     .filter(
            //       (opponentMatch) => opponentMatch.date < new Date(match.date)
            //     )
            //     .map((opponentPoints) => opponentPoints.points)
            // );
            // const ownPoints = getArrayAverage(
            //   teamPoints[match.team]
            //     .filter(
            //       (opponentMatch) => opponentMatch.date < new Date(match.date)
            //     )
            //     .map((opponentPoints) => opponentPoints.points)
            // );
            // if (!match.result) {
            //   return "-";
            // } else {
            //   return (points - ownPoints).toFixed(2);
            // }
          }}
        />
      )),
  ]);
}
