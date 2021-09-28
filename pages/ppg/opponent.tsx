import styles from "../../styles/Home.module.css";
import MatchCell from "../../components/MatchCell";
import getTeamPoints from "../../utils/getTeamPoints";
import BasePage from "../../components/BaseGridPage";

export default function PPGOpponent(): React.ReactElement {
  return (
    <BasePage
      dataParser={dataParser}
      pageTitle="Opponent PPG before given match"
      gridClass={styles.gridWide}
    />
  );
}
function dataParser(
  data: Results.ParsedData["teams"]
): Results.RenderReadyData {
  const teamPoints = getTeamPoints(data);
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
          renderValue={(match) => {
            const points = teamPoints[match.opponent]
              .filter(
                (opponentMatch) =>
                  opponentMatch.date < new Date(match.date) &&
                  opponentMatch.result !== null
              )
              .map((opponentPoints) => opponentPoints.points);
            return getArrayAverageFormatted(points);
          }}
        />
      )),
  ]);
}
function getArrayAverageFormatted(values: number[]): string {
  const average = getArrayAverage(values);
  return (Math.round(average * 100) / 100).toFixed(2);
}

function getArrayAverage(values: number[]): number {
  return values.length
    ? values.reduce((sum, curr) => sum + curr, 0) / values.length
    : 0;
}
