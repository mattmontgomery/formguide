import styles from "@/styles/Home.module.css";
import MatchCell from "@/components/MatchCell";
import getTeamPoints from "@/utils/getTeamPoints";
import BasePage from "@/components/BaseGridPage";
import { getArrayAverage, getArraySum } from "@/utils/array";

export default function PPGOutcomes(): React.ReactElement {
  return (
    <BasePage
      dataParser={dataParser}
      pageTitle="Projected Points based on home/away ppg"
      gridClass={styles.gridExtraWide}
    >
      Calculation: Match result for finished matches, summed with the PPG for
      home/away. Gets more accurate through the season.
    </BasePage>
  );
}
function dataParser(data: Results.ParsedData["teams"]): Render.RenderReadyData {
  const teamPoints = getTeamPoints(data);
  const teamCumulativeProjectedPoints: Record<string, number[]> = {};
  Object.keys(data).map((team) => [
    team,
    ...data[team]
      .sort((a, b) => {
        return new Date(a.date) > new Date(b.date) ? 1 : -1;
      })
      .map((match, idx) => {
        if (!teamCumulativeProjectedPoints[team]) {
          teamCumulativeProjectedPoints[team] = [];
        }
        teamCumulativeProjectedPoints[team][idx] = match.result
          ? getArraySum(
              teamPoints[team]
                .filter((_, arraySumIdx) => arraySumIdx <= idx)
                .map((p) => p.points)
            )
          : teamCumulativeProjectedPoints[team][idx - 1] +
            (match.home
              ? getArrayAverage(
                  teamPoints[team]
                    .filter((m) => m.date < new Date(match.date) && m.home)
                    .map((p) => p.points)
                )
              : getArrayAverage(
                  teamPoints[team]
                    .filter((m) => m.date < new Date(match.date) && !m.home)
                    .map((p) => p.points)
                ));
      }),
  ]);
  return Object.keys(data).map((team) => [
    team,
    ...data[team]
      .sort((a, b) => {
        return new Date(a.date) > new Date(b.date) ? 1 : -1;
      })
      .map((match, idx) => (
        <MatchCell
          match={match}
          key={idx}
          renderValue={() =>
            match && match.result
              ? teamCumulativeProjectedPoints[team][idx]
              : teamCumulativeProjectedPoints[team][idx].toFixed(2)
          }
        />
      )),
  ]);
}
