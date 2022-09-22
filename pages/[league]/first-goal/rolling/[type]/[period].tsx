import { useRouter } from "next/router";

import BaseRollingPage from "@/components/BaseRollingPage";
import { getFirstGoalConceded, getFirstGoalScored } from "@/utils/getGoals";
import { getArrayAverage } from "@/utils/array";
import { Options } from "@/components/Toggle/HomeAwayToggle";
import { usePeriodLength } from "@/components/Toggle/PeriodLength";

export default function Chart(): React.ReactElement {
  const router = useRouter();
  const { period = 5, type = "gf" } = router.query;
  const defaultPeriodLength: number =
    +period.toString() > 0 && +period.toString() < 34 ? +period.toString() : 5;
  const { value: periodLength, renderComponent: renderPeriodLength } =
    usePeriodLength(defaultPeriodLength);
  const goalType: "gf" | "ga" = String(type) as "gf" | "ga";
  return (
    <BaseRollingPage
      renderControls={renderPeriodLength}
      getEndpoint={(year, league) => `/api/goals/${league}?year=${year}`}
      getBackgroundColor={(value) => {
        if (goalType === "gf" && value && value > 45) {
          return "warning.light";
        }
        if (goalType === "ga" && value && value < 45) {
          return "warning.light";
        }
        return "success.light";
      }}
      isStaticHeight={false}
      pageTitle={`Rolling first ${type} (%s game rolling)`}
      parser={(teams, periodLength, homeAway) =>
        parseChartData(teams, periodLength, homeAway, goalType)
      }
      periodLength={periodLength}
      heightCalc={(value) => `${value ? 100 - Math.round(value) : 100}%`}
    />
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
