import { useRouter } from "next/router";

import styles from "@/styles/Home.module.css";
import MatchGrid from "@/components/MatchGrid";
import { Box } from "@mui/material";
import BaseDataPage from "@/components/BaseDataPage";
import ColorKey from "@/components/ColorKey";

export default function Chart(): React.ReactElement {
  const router = useRouter();
  const { period = 5 } = router.query;
  const periodLength: number =
    +period.toString() > 0 && +period.toString() < 34 ? +period.toString() : 5;
  return (
    <BaseDataPage
      pageTitle={`Rolling GA (${period} game rolling)`}
      renderComponent={(data) =>
        data?.teams ? (
          <MatchGrid
            data={data.teams}
            dataParser={(...args) => dataParser(periodLength, ...args)}
            showMatchdayHeader={false}
            rowClass={styles.chartRow}
          />
        ) : (
          <></>
        )
      }
    >
      <ColorKey
        successText="Giving up less than 1 goal per game"
        warningText="Giving up less than 2 goals per game"
        errorText="Giving up more than 2 goals per game"
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
                    : pointValue < periodLength
                    ? "success.main"
                    : pointValue < periodLength * 2
                    ? "warning.main"
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
              .map((match) => match.goalsConceded || 0);
            return results.length !== periodLength
              ? null
              : results.reduce((prev, currentValue): number => {
                  return prev + currentValue;
                }, 0);
          }),
      ];
    });
}
