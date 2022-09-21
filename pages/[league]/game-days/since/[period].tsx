import { differenceInDays } from "date-fns";

import { useRouter } from "next/router";

import ColorKey from "@/components/ColorKey";
import BaseRollingPage from "@/components/BaseRollingPage";
import { getArrayAverage } from "@/utils/array";
import {
  PeriodLengthOptions,
  usePeriodLength,
} from "@/components/Toggle/PeriodLength";

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
      pageTitle={`Average days between games (%s game rolling)`}
      parser={parseChartData}
      periodLength={periodLength}
      getBackgroundColor={(pointValue) =>
        typeof pointValue !== "number"
          ? "background.paper"
          : pointValue > 8
          ? "warning.main"
          : pointValue < 5.5
          ? "error.main"
          : "success.main"
      }
      isWide
    >
      <ColorKey
        successText="5.5-8 days between games"
        warningText="More than 5.5–8 days between days"
        errorText="Less than 5.5 days between games"
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
            const results = resultSet.map((match, matchIdx) => {
              return teams[team][idx - 1]?.date
                ? differenceInDays(
                    new Date(teams[team][idx + matchIdx].date),
                    new Date(teams[team][idx + matchIdx - 1].date)
                  )
                : 0;
            });
            const value =
              results.length !== periodLength ? null : getArrayAverage(results);
            return { value, matches: resultSet };
          }),
      ];
    });
}
