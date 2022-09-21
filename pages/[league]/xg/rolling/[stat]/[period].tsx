import { useRouter } from "next/router";

import BaseASARollingPage, {
  DataParserProps,
} from "@/components/BaseASARollingPage";
import RollingBox from "@/components/Rolling/Box";
import { transformXGMatchIntoASAMatch } from "@/utils/transform";
import { Options } from "@/components/Toggle/HomeAwayToggle";
import { OptionsAll as ResultOptions } from "@/components/Toggle/ResultToggle";
import {
  PeriodLengthOptions,
  usePeriodLength,
} from "@/components/Toggle/PeriodLength";

const VALID_STATS: ASA.ValidStats[] = [
  "xpoints",
  "for",
  "against",
  "difference",
  "xpointsDifference",
];

const statMap: Record<
  ASA.ValidStats,
  (asa: ASA.XGWithGame, isHome: boolean) => number
> = {
  xpoints: (asa, isHome) => (isHome ? asa.home_xpoints : asa.away_xpoints),
  xpointsDifference: (asa, isHome) => {
    const actualPoints = isHome
      ? asa.home_goals > asa.away_goals
        ? 3
        : asa.home_goals === asa.away_goals
        ? 0
        : 1
      : asa.away_goals > asa.home_goals
      ? 3
      : asa.away_goals === asa.home_goals
      ? 0
      : 1;
    return actualPoints - (isHome ? asa.home_xpoints : asa.away_xpoints);
  },
  for: (asa, isHome) => (isHome ? asa.home_team_xgoals : asa.away_team_xgoals),

  against: (asa, isHome) =>
    isHome ? asa.away_team_xgoals : asa.home_team_xgoals,
  difference: (asa, isHome) =>
    isHome
      ? asa.home_team_xgoals - asa.away_team_xgoals
      : asa.away_team_xgoals - asa.home_team_xgoals,
};

const titleMap: Record<ASA.ValidStats, string> = {
  xpoints: "Expected Points",
  for: "Expected Goals For",
  against: "Expected Goals Against",
  difference: "Expected Goal Difference",
  xpointsDifference: "Expected Points Difference",
};
const statHeightMap: Record<ASA.ValidStats, number> = {
  xpoints: 3,
  for: 4,
  against: 4,
  difference: 2,
  xpointsDifference: 1.5,
};
const statHeightCalc: Partial<
  Record<ASA.ValidStats, (value: number | null, periodLength: number) => string>
> = {
  xpointsDifference: (value, periodLength) =>
    `${(((value || 0) + 8) / (periodLength * 3)) * 100}%`,
};

export default function Chart(): React.ReactElement {
  const router = useRouter();
  const { period = 5, stat = "for" } = router.query;
  const defaultPeriodLength: PeriodLengthOptions =
    +period.toString() > 0 && +period.toString() < 34 ? +period.toString() : 5;

  const { value: periodLength, renderComponent } = usePeriodLength(
    defaultPeriodLength,
    true
  );
  if (
    typeof stat !== "string" ||
    !VALID_STATS.includes(String(stat) as ASA.ValidStats)
  ) {
    return <>{"Invalid stat"}</>;
  }
  return (
    <BaseASARollingPage
      renderControls={renderComponent}
      endpoint={(year, league) => `/api/asa/xg?year=${year}&league=${league}`}
      isStaticHeight={false}
      pageTitle={`Rolling ${
        titleMap[stat as ASA.ValidStats]
      } (%d game rolling)`}
      dataParser={dataParser}
      periodLength={periodLength}
      stat={stat as ASA.ValidStats}
    />
  );
}

function parseChartData(
  data: ASA.XgByGameApi["data"]["xg"],
  periodLength = 5,
  stat: ASA.ValidStats,
  homeAway: Options,
  result: ResultOptions = "all"
): ReturnType<Render.RollingParser> {
  return Object.keys(data)
    .sort()
    .map((team) => {
      const matches = data[team].map(transformXGMatchIntoASAMatch);
      return [
        team,
        ...matches.slice(0, matches.length - periodLength).map((_, idx) => {
          const resultSet = matches
            .sort((a, b) => {
              return new Date(a.date) > new Date(b.date) ? 1 : -1;
            })
            .filter((match) =>
              homeAway === "home"
                ? match.home
                : homeAway === "away"
                ? !match.home
                : true
            )
            .filter((match) =>
              result !== "all" ? result === match.result : true
            )
            .slice(idx, idx + periodLength)
            .filter((match) => match.result !== null);
          const results = resultSet.map((match) =>
            match.asa ? Number(statMap[stat](match.asa, match.home)) : -1
          );
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

function dataParser({
  periodLength,
  data,
  getBackgroundColor,
  isStaticHeight,
  stat = "xpoints",
  homeAway,
  result,
}: DataParserProps): Render.RenderReadyData {
  return parseChartData(data.xg, periodLength, stat, homeAway, result).map(
    ([team, ...stats]) => {
      return [
        team,
        ...stats.map((s, idx) => {
          return (
            <RollingBox
              key={idx}
              isStaticHeight={isStaticHeight}
              getBackgroundColor={getBackgroundColor}
              periodLength={periodLength}
              value={s.value}
              heightCalc={
                typeof statHeightCalc[stat] === "function"
                  ? statHeightCalc[stat]
                  : (value, periodLength) =>
                      `${
                        ((value || 0) / (periodLength * statHeightMap[stat])) *
                        100
                      }%`
              }
            />
          );
        }),
      ];
    }
  );
}
