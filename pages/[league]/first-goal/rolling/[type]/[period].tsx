import { useState } from "react";
import { useRouter } from "next/router";

import getMatchPoints from "@/utils/getMatchPoints";
import BaseRollingPage from "@/components/BaseRollingPage";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { getFirstGoalConceded, getFirstGoalScored } from "@/utils/getGoals";
import { getArrayAverage } from "@/utils/array";

type HomeAway = "home" | "away" | "all";

export default function Chart(): React.ReactElement {
  const router = useRouter();
  const { period = 5, type = "gf" } = router.query;
  const periodLength: number =
    +period.toString() > 0 && +period.toString() < 34 ? +period.toString() : 5;
  const goalType: "gf" | "ga" = String(type) as "gf" | "ga";
  const [homeAway, setHomeAway] = useState<HomeAway>("all");
  return (
    <BaseRollingPage
      getEndpoint={(year, league) => `/api/goals/${league}?year=${year}`}
      isStaticHeight={false}
      pageTitle={`Rolling first ${type} (%s game rolling)`}
      parser={(teams, periodLength) =>
        parseChartData(teams, periodLength, homeAway, goalType)
      }
      periodLength={periodLength}
      heightCalc={(value) => {
        console.log({ value });
        return `${value ? 100 - Math.round(value) : 100}%`;
      }}
    >
      <ToggleButtonGroup
        value={homeAway}
        exclusive
        onChange={(_, value) => {
          setHomeAway(value ?? "all");
        }}
      >
        <ToggleButton value="all">All</ToggleButton>,
        <ToggleButton value="home">Home</ToggleButton>,
        <ToggleButton value="away">Away</ToggleButton>,
      </ToggleButtonGroup>
    </BaseRollingPage>
  );
}

function parseChartData(
  teams: Results.ParsedData["teams"],
  periodLength = 5,
  homeAway: HomeAway = "all",
  goalType: "gf" | "ga" = "gf"
): ReturnType<Render.RollingParser> {
  return Object.keys(teams)
    .sort()
    .map((team) => {
      return [
        team,
        ...teams[team]
          .slice(0, teams[team].length - periodLength)
          .map((_, idx) => {
            const resultSet = teams[team]
              .sort((a, b) => {
                return new Date(a.date) > new Date(b.date) ? 1 : -1;
              })
              .filter((m) =>
                homeAway === "all" ? true : m.home === (homeAway === "home")
              )
              .slice(idx, idx + periodLength)
              .filter((match) => match.result !== null);
            const results = resultSet.map((match) =>
              goalType === "gf"
                ? getFirstGoalScored(match)?.time.elapsed
                : getFirstGoalConceded(match)?.time.elapsed
            );

            return {
              value:
                results.length !== periodLength
                  ? null
                  : getArrayAverage(
                      results.filter((m) => typeof m === "number") as number[]
                    ),
              matches: resultSet,
            };
          }),
      ];
    });
}
