import { useRouter } from "next/router";

import BaseRollingPage from "@/components/BaseRollingPage";
import { getFirstGoalConceded, getFirstGoalScored } from "@/utils/getGoals";
import { getArrayAverage } from "@/utils/array";
import { useHomeAway, Options } from "@/components/Toggle/HomeAwayToggle";

export default function Chart(): React.ReactElement {
  const router = useRouter();
  const { period = 5, type = "gf" } = router.query;
  const periodLength: number =
    +period.toString() > 0 && +period.toString() < 34 ? +period.toString() : 5;
  const goalType: "gf" | "ga" = String(type) as "gf" | "ga";
  const { value: homeAway, renderComponent } = useHomeAway();
  return (
    <BaseRollingPage
      getEndpoint={(year, league) => `/api/goals/${league}?year=${year}`}
      isStaticHeight={false}
      pageTitle={`Rolling first ${type} (%s game rolling)`}
      parser={(teams, periodLength) =>
        parseChartData(teams, periodLength, homeAway, goalType)
      }
      periodLength={periodLength}
      heightCalc={(value) => `${value ? 100 - Math.round(value) : 100}%`}
    >
      {renderComponent()}
    </BaseRollingPage>
  );
}

function parseChartData(
  teams: Results.ParsedData["teams"],
  periodLength = 5,
  homeAway: Options = "all",
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
