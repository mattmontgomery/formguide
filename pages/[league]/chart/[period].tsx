import { useRouter } from "next/router";

import getMatchPoints from "@/utils/getMatchPoints";
import BaseRollingPage from "@/components/BaseRollingPage";
import { useHomeAway } from "@/components/Toggle/HomeAwayToggle";

type HomeAway = "home" | "away" | "all";

export default function Chart(): React.ReactElement {
  const router = useRouter();
  const { period = 5 } = router.query;
  const periodLength: number =
    +period.toString() > 0 && +period.toString() < 34 ? +period.toString() : 5;
  const { value: homeAway, renderComponent } = useHomeAway();
  return (
    <BaseRollingPage
      isStaticHeight={false}
      pageTitle={`Rolling points (%s game rolling)`}
      parser={(teams, periodLength) =>
        parseChartData(teams, periodLength, homeAway)
      }
      periodLength={periodLength}
    >
      {renderComponent()}
    </BaseRollingPage>
    /**
     * {
    value: alignment,
    onChange: handleChange,
    exclusive: true,
  };
     */
  );
}

function parseChartData(
  teams: Results.ParsedData["teams"],
  periodLength = 5,
  homeAway: HomeAway = "all"
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
            const results = resultSet.map((match) => getMatchPoints(match));
            return {
              value:
                results.length !== periodLength
                  ? null
                  : results.reduce((prev, currentValue): number => {
                      return prev + currentValue;
                    }, 0),
              matches: resultSet,
            };
          }),
      ];
    });
}
