import { useRouter } from "next/router";

import BaseRollingPage from "@/components/BaseRollingPage";
import { parseISO } from "date-fns";

export default function Chart(): React.ReactElement {
  const router = useRouter();
  const { period = 5 } = router.query;
  const periodLength: number =
    +period.toString() > 0 && +period.toString() < 34 ? +period.toString() : 5;
  return (
    <BaseRollingPage
      pageTitle={`Rolling GD (%s game rolling)`}
      parser={parseChartData}
      periodLength={periodLength}
      getBackgroundColor={(pointValue) =>
        typeof pointValue !== "number"
          ? "background.primary"
          : pointValue === 0
          ? "warning.main"
          : pointValue > 0
          ? "success.main"
          : "error.main"
      }
    />
  );
}

function parseChartData(
  teams: Results.ParsedData["teams"],
  periodLength = 5
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
              .slice(idx, idx + periodLength)
              .filter((match) => match.result !== null);
            const results = resultSet.map(
              (match) => (match.goalsScored || 0) - (match.goalsConceded || 0)
            );
            const value =
              results.length !== periodLength
                ? null
                : results.reduce((prev, currentValue): number => {
                    return prev + currentValue;
                  }, 0);
            return { value, matches: resultSet };
          }),
      ];
    });
}
