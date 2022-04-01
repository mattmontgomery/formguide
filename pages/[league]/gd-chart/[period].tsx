import useSWR from "swr";
import { useRouter } from "next/router";

import styles from "@/styles/Home.module.css";
import fetch from "unfetch";
import MatchGrid from "@/components/MatchGrid";
import { Box } from "@mui/system";
import BasePage from "@/components/BasePage";
import { useContext } from "react";
import YearContext from "@/components/YearContext";
import LeagueContext from "@/components/LeagueContext";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Chart(): React.ReactElement {
  const router = useRouter();
  const { period = 5 } = router.query;
  const periodLength: number =
    +period.toString() > 0 && +period.toString() < 34 ? +period.toString() : 5;
  const year = useContext(YearContext);
  const league = useContext(LeagueContext);
  const { data } = useSWR<{ data: Results.ParsedData }>(
    [`/api/form?year=${year}&league=${league}`, year, league],
    fetcher
  );
  return (
    <BasePage pageTitle={`Rolling GD (${period} game rolling)`}>
      {data?.data?.teams ? (
        <MatchGrid
          data={data.data.teams}
          dataParser={(...args) => dataParser(periodLength, ...args)}
          showMatchdayHeader={false}
          rowClass={styles.chartRow}
        />
      ) : null}
    </BasePage>
  );
}

function dataParser(
  periodLength: number,
  data: Results.ParsedData["teams"]
): Results.RenderReadyData {
  return parseChartData(data, periodLength).map(([team, ...points]) => {
    return [
      team,
      ...points.map((pointValue, idx) => {
        return (
          <Box
            key={idx}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:
                typeof pointValue !== "number"
                  ? "background.primary"
                  : pointValue === 0
                  ? "warning.main"
                  : pointValue > 0
                  ? "success.main"
                  : "error.main",
            }}
          >
            <Box className={styles.chartPointText} sx={{ fontWeight: "bold" }}>
              {pointValue}
            </Box>
          </Box>
        );
      }),
    ];
  });
}

function parseChartData(
  teams: Results.ParsedData["teams"],
  periodLength = 5
): [string, ...Array<number | null>][] {
  return Object.keys(teams)
    .sort()
    .map((team) => {
      return [
        team,
        ...teams[team]
          .slice(0, teams[team].length - periodLength)
          .map((_, idx) => {
            const results = teams[team]
              .sort((a, b) => {
                return new Date(a.date) > new Date(b.date) ? 1 : -1;
              })
              .slice(idx, idx + periodLength)
              .filter((match) => match.result !== null)
              .map(
                (match) => (match.goalsScored || 0) - (match.goalsConceded || 0)
              );
            return results.length !== periodLength
              ? null
              : results.reduce((prev, currentValue): number => {
                  return prev + currentValue;
                }, 0);
          }),
      ];
    });
}
