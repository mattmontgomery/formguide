import { useRouter } from "next/router";

import styles from "@/styles/Home.module.css";
import MatchGrid from "@/components/MatchGrid";
import { Box } from "@mui/material";
import { getArrayAverage } from "@/utils/array";
import { differenceInDays } from "date-fns";
import BaseDataPage from "@/components/BaseDataPage";
import ColorKey from "@/components/ColorKey";

export default function Chart(): React.ReactElement {
  const router = useRouter();
  const { period = 5 } = router.query;
  const periodLength: number =
    +period.toString() > 0 && +period.toString() < 34 ? +period.toString() : 5;
  return (
    <BaseDataPage
      pageTitle={`Average days between games (${period} game rolling)`}
      renderComponent={(data) => (
        <MatchGrid
          data={data.teams}
          dataParser={(...args) => dataParser(periodLength, ...args)}
          showMatchdayHeader={false}
          gridClass={styles.chartWide}
          rowClass={styles.chartRow}
        />
      )}
    >
      <ColorKey
        successText="5.5-8 days between games"
        warningText="More than 5.5–8 days between days"
        errorText="Less than 5.5 days between games"
      />
    </BaseDataPage>
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
                    : pointValue > 8
                    ? "warning.main"
                    : pointValue < 5.5
                    ? "error.main"
                    : "success.main",
              }}
            >
              <Box
                className={styles.chartPointText}
                sx={{ fontWeight: "bold" }}
              >
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
