import { useRouter } from "next/router";

import BaseRollingPage from "@/components/BaseRollingPage";
import { Options } from "@/components/Toggle/HomeAwayToggle";
import {
  PeriodLengthOptions,
  usePeriodLength,
} from "@/components/Toggle/PeriodLength";
import ColorKey from "@/components/ColorKey";

export default function Chart(): React.ReactElement {
  const router = useRouter();
  const { period = 5 } = router.query;
  const defaultPeriodLength: PeriodLengthOptions =
    +period.toString() > 0 && +period.toString() < 34 ? +period.toString() : 5;

  const { value: periodLength, renderComponent } = usePeriodLength(
    defaultPeriodLength,
    true
  );
  return (
    <BaseRollingPage
      renderControls={renderComponent}
      pageTitle={`Rolling GD (%s game rolling)`}
      parser={parseChartData}
      periodLength={periodLength}
      getBackgroundColor={(pointValue) =>
        typeof pointValue !== "number"
          ? "background.paper"
          : pointValue === 0
          ? "warning.main"
          : pointValue > 0
          ? "success.main"
          : "error.main"
      }
    >
      <ColorKey
        successText="> 0 GD per game"
        warningText="0 GD per game"
        errorText="< 0 GD per game"
      />
    </BaseRollingPage>
  );
}

function parseChartData(
  teams: Results.ParsedData["teams"],
  periodLength = 5,
  homeAway: Options
): ReturnType<Render.RollingParser> {
  return Object.keys(teams)
    .sort()
    .map((team) => {
      return [
        team,
        ...teams[team]
          .filter((m) =>
            homeAway === "home" ? m.home : homeAway === "away" ? !m.home : true
          )
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
