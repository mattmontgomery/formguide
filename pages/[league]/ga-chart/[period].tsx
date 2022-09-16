import { useRouter } from "next/router";

import ColorKey from "@/components/ColorKey";
import BaseRollingPage from "@/components/BaseRollingPage";

export default function Chart(): React.ReactElement {
  const router = useRouter();
  const { period = 5 } = router.query;
  const periodLength: number =
    +period.toString() > 0 && +period.toString() < 34 ? +period.toString() : 5;
  return (
    <BaseRollingPage
      pageTitle={`Rolling GA (%s game rolling)`}
      parser={parseChartData}
      periodLength={periodLength}
      getBackgroundColor={(pointValue, periodLength) =>
        typeof pointValue !== "number"
          ? "background.paper"
          : pointValue < periodLength
          ? "success.main"
          : pointValue < periodLength * 2
          ? "warning.main"
          : "error.main"
      }
    >
      <ColorKey
        successText="Giving up less than 1 goal per game"
        warningText="Giving up less than 2 goals per game"
        errorText="Giving up more than 2 goals per game"
      />
    </BaseRollingPage>
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
            const results = resultSet.map((match) => match.goalsConceded || 0);
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
