import { useRouter } from "next/router";

import styles from "@/styles/Home.module.css";
import MatchGrid from "@/components/MatchGrid";
import { Box } from "@mui/system";
import BaseDataPage from "@/components/BaseDataPage";

export default function Chart(): React.ReactElement {
  const router = useRouter();
  const { period = 5 } = router.query;
  const periodLength: number =
    +period.toString() > 0 && +period.toString() < 34 ? +period.toString() : 5;
  return (
    <BaseDataPage
      pageTitle={`Rolling GD (${period} game rolling)`}
      renderComponent={(data) => (
        <MatchGrid
          data={data.teams}
          dataParser={(...args) => dataParser(periodLength, ...args)}
          showMatchdayHeader={false}
          rowClass={styles.chartRow}
        />
      )}
    ></BaseDataPage>
  );
}

function dataParser(
  periodLength: number,
  data: Results.ParsedData["teams"]
): Render.RenderReadyData {
  return parseChartData(data, periodLength).map(([team, ...points]) => {
    return [
      team,
      ...points
        .filter((pointValue) => typeof pointValue === "number")
        .map((pointValue, idx) => {
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
              <Box
                className={styles.chartPointText}
                sx={{ fontWeight: "bold" }}
              >
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
