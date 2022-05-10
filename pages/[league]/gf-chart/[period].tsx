import { useRouter } from "next/router";

import ColorKey from "@/components/ColorKey";
import BaseRollingPage from "@/components/BaseRollingPage";
import { parseISO } from "date-fns";

export default function Chart(): React.ReactElement {
  const router = useRouter();
  const { period = 5 } = router.query;
  const periodLength: number =
    +period.toString() > 0 && +period.toString() < 34 ? +period.toString() : 5;
  return (
    <BaseRollingPage
      pageTitle={`Rolling GF (%s game rolling)`}
      parser={parseChartData}
      periodLength={periodLength}
      getBackgroundColor={(pointValue, periodLength) =>
        typeof pointValue !== "number"
          ? "background.primary"
          : pointValue >= periodLength * 2
          ? "success.main"
          : pointValue >= periodLength
          ? "warning.main"
          : "error.main"
      }
    >
      <ColorKey
        successText="Scoring more than 2 goals per game"
        warningText="Scoring more than 1 goal per game"
        errorText="Scoring less than than 1 goal per game"
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
            const results = resultSet.map((match) => match.goalsScored || 0);
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
