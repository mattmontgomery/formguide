import { useRouter } from "next/router";

import BaseASARollingPage from "@/components/BaseASARollingPage";
import RollingBox from "@/components/Rolling/Box";
import { transformXGMatchIntoASAMatch } from "@/utils/transform";

const VALID_STATS: ASA.ValidStats[] = [
  "xpoints",
  "for",
  "against",
  "difference",
];

const statMap: Record<
  ASA.ValidStats,
  (asa: ASA.XGWithGame, isHome: boolean) => number
> = {
  xpoints: (asa, isHome) => (isHome ? asa.home_xpoints : asa.away_xpoints),

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
};
const statHeightMap: Record<ASA.ValidStats, number> = {
  xpoints: 3,
  for: 4,
  against: 4,
  difference: 2,
};

export default function Chart(): React.ReactElement {
  const router = useRouter();
  const { period = 5, stat = "for" } = router.query;
  console.log(router.query);
  const periodLength: number =
    +period.toString() > 0 && +period.toString() < 34 ? +period.toString() : 5;
  if (
    typeof stat !== "string" ||
    !VALID_STATS.includes(String(stat) as ASA.ValidStats)
  ) {
    return <>{"Invalid stat"}</>;
  }
  return (
    <BaseASARollingPage<ASA.XgByGameApi["data"]>
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
  stat: ASA.ValidStats
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
}: {
  periodLength: number;
  data: ASA.XgByGameApi["data"];
  getBackgroundColor: Render.GetBackgroundColor;
  isStaticHeight: boolean;
  isWide: boolean;
  stat: ASA.ValidStats;
}): Render.RenderReadyData {
  return parseChartData(data.xg, periodLength, stat).map(([team, ...stats]) => {
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
            heightCalc={(value, periodLength) =>
              `${((value || 0) / (periodLength * statHeightMap[stat])) * 100}%`
            }
          />
        );
      }),
    ];
  });
}
