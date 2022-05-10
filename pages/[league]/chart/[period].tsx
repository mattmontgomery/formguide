import { useRouter } from "next/router";

import getMatchPoints from "@/utils/getMatchPoints";
import { parseISO } from "date-fns";
import BaseRollingPage from "@/components/BaseRollingPage";
import { getMatchDescriptor } from "@/utils/getMatchResultString";

export default function Chart(): React.ReactElement {
  const router = useRouter();
  const { period = 5 } = router.query;
  const periodLength: number =
    +period.toString() > 0 && +period.toString() < 34 ? +period.toString() : 5;
  return (
    <BaseRollingPage
      isStaticHeight={false}
      pageTitle={`Rolling points (%s game rolling)`}
      parser={parseChartData}
      periodLength={periodLength}
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
            const results = resultSet.map((match) => getMatchPoints(match));
            const matches = resultSet.map((match) => ({
              date: parseISO(match.rawDate),
              title: getMatchDescriptor(match),
            }));
            return {
              value:
                results.length !== periodLength
                  ? null
                  : results.reduce((prev, currentValue): number => {
                      return prev + currentValue;
                    }, 0),
              matches,
            };
          }),
      ];
    });
}
