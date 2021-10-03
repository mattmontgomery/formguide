import useSWR from "swr";
import { useRouter } from "next/router";

import styles from "../../../styles/Home.module.css";
import fetch from "unfetch";
import MatchGrid from "../../../components/MatchGrid";
import { Box, Divider, Typography } from "@mui/material";
import BasePage from "../../../components/BasePage";
import { useContext } from "react";
import YearContext from "../../../components/YearContext";
import { getArrayAverage } from "../../../utils/array";
import { differenceInDays } from "date-fns";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Chart(): React.ReactElement {
  const router = useRouter();
  const { period = 5 } = router.query;
  const periodLength: number =
    +period.toString() > 0 && +period.toString() < 34 ? +period.toString() : 5;
  const year = useContext(YearContext);
  const { data } = useSWR<{ data: Results.ParsedData }>(
    [`/api/form?year=${year}`, year],
    fetcher
  );
  return (
    <BasePage pageTitle={`Average days between games (${period} game rolling)`}>
      {data?.data?.teams ? (
        <MatchGrid
          data={data.data.teams}
          dataParser={(...args) => dataParser(periodLength, ...args)}
          showMatchdayHeader={false}
          gridClass={styles.chartWide}
          rowClass={styles.chartRow}
        />
      ) : null}
      <Divider />
      <Box sx={{ marginTop: 2 }}>
        <Typography variant="h6">Legend</Typography>
        <Box sx={{ backgroundColor: "success.main" }} p={1}>
          5.5-8 days between games
        </Box>
        <Box sx={{ backgroundColor: "warning.main" }} p={1}>
          More than 5.5–8 days between days
        </Box>
        <Box sx={{ backgroundColor: "error.main" }} p={1}>
          Less than 5.5 days between games
        </Box>
      </Box>
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
                  : pointValue > 8
                  ? "warning.main"
                  : pointValue < 5.5
                  ? "error.main"
                  : "success.main",
            }}
          >
            <Box className={styles.chartPointText} sx={{ fontWeight: "bold" }}>
              {pointValue?.toFixed(2)}
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
              .map((match, matchIdx) => {
                return teams[team][idx - 1]?.date
                  ? differenceInDays(
                      new Date(teams[team][idx + matchIdx].date),
                      new Date(teams[team][idx + matchIdx - 1].date)
                    )
                  : 0;
              });
            return results.length !== periodLength
              ? null
              : getArrayAverage(results);
          }),
      ];
    });
}
